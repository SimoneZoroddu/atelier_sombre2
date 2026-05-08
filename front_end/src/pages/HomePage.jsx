import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import hero_img from "../img/hero_space.jpg"
import { useShop } from "../contexts/GlobalContext"



export default function HomePage() {
    const { setGenre, setSearchValue } = useShop()

    const url = import.meta.env.VITE_API_ADDRESS + "index";

    const [shoes, setShoes] = useState([])

    useEffect(() => {

        axios.get(url)
            .then(datas =>
                setShoes(datas.data)
            )

    }, [])


    const today = new Date();

    const newArrivals = shoes.filter(shoe => {
        const shoe_created_at = new Date(shoe.created_at);
        const expiry = new Date(shoe_created_at);
        expiry.setMonth(expiry.getMonth() + 3);

        return today <= expiry;

    })


    const newArrivalsWoman = newArrivals.filter(shoe => shoe.genre == "Donna")
    const newArrivalsMan = newArrivals.filter(shoe => shoe.genre == "Uomo")

    function filterSet() {
        window.scrollTo({ top: 0 })
        // function for set the search page with NEW ARRIVALS and WOMAN if we dont have a path for the search
        setGenre("Donna")
        setSearchValue("")

    }

    function FilterUomo() {
        window.scrollTo({ top: 0 })
        // function for set the search page with NEW ARRIVALS and WOMAN if we dont have a path for the search
        setGenre("Uomo")
        setSearchValue("")

    }

    return (
        <div className="container-fluid">
            <img src={hero_img} alt="tods-hp-summerselection" className="img-fluid w-100" />
            <div className="text-center fs-2 pt-4">Nuovi arrivi di Atelier Sombre</div>
            <div className="text-center">
                <Link to="/shoes" className="fs-5 text-black underline_hover">
                    Acquista ora
                </Link>
            </div>

            <div className="d-flex gap-4">
                <div className="text-center">
                    {
                        <div className="d-flex justify-content-start flex-wrap pt-2" key={newArrivalsWoman[0]?.ID}  >
                            <Link to="/shoes" onClick={filterSet}>
                                <img src={newArrivalsWoman[0]?.image.model_image_url} className="img-fluid" alt={newArrivalsWoman[0]?.name} style={{ width: "120rem" }} />

                            </Link>
                        </div>
                    }
                    <Link to="/shoes" className="fs-5 text-black underline_hover" onClick={filterSet}>
                        New Arrivals Woman
                    </Link>
                </div>
                <div className="text-center">
                    {
                        <div className="d-flex justify-content-start flex-wrap pt-2" key={newArrivalsMan[0]?.ID}  >
                            <Link to="/shoes" onClick={FilterUomo}>
                                <img src={newArrivalsMan[0]?.image.model_image_url} className="img-fluid" alt={newArrivalsMan[0]?.name} style={{ width: "120rem" }} />
                            </Link>
                        </div>
                    }
                    <Link to="/shoes" className="fs-5 text-black underline_hover" onClick={FilterUomo}>
                        New Arrivals Man
                    </Link>
                </div>
            </div>
        </div >
    )
}