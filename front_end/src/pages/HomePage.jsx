import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { useShop } from "../contexts/GlobalContext"
import img from "../img/tods-hp-summerselection-01-hero-d-16-9.webp"

export default function HomePage() {
    const { setGenre } = useShop()

    const url = import.meta.env.VITE_API_ADDRESS + "index";

    const [shoes, setShoes] = useState([])

    useEffect(() => {

        axios.get(url)
            .then(datas =>
                setShoes(datas.data)
            )

    }, [])


    console.log("non funge nulla");


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

        // function for set the search page with NEW ARRIVALS and WOMAN if we dont have a path for the search
        setGenre("Donna")


    }

    function FilterUomo() {

        // function for set the search page with NEW ARRIVALS and WOMAN if we dont have a path for the search
        setGenre("Uomo")


    }

    return (
        <div>
            <img src={img} alt="tods-hp-summerselection" className="img-fluid w-100 px-3" />
            <div className="text-center fs-2 pt-4">Nuovi arrivi di Atelier Sombre</div>
            <div className="text-center">
                <Link to="/shoes" className="fs-5 text-black underline_hover">
                    Acquista ora
                </Link>
            </div>

            <div className="d-flex gap-4 m-4">
                <div className="text-center">
                    {
                        <div className="d-flex justify-content-start flex-wrap pt-2" key={newArrivalsWoman[0]?.ID}  >
                            <Link to="/shoes" onClick={filterSet}>
                                <img src={newArrivalsWoman[0]?.image.model_image_url} className="img-fluid" alt={newArrivalsWoman[0]?.name} style={{ width: "80rem" }} />
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
                                <img src={newArrivalsMan[0]?.image.model_image_url} className="img-fluid" alt={newArrivalsMan[0]?.name} style={{ width: "80rem" }} />
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









{/* <div className="mx-5 my-3">
            <img src={img} alt="tods-hp-summerselection" className="img-fluid w-100"/>
            <div className="container p-0">
                <div className="row row-cols-1 row-cols-md-2 g-4 pt-3">
                    <div className="col">
                        <h3 className="div text-center">
                            New Arrival Woman
                        </h3>
                        {
                        newArrivalsWoman.map(newArrival => (
                            <div className="d-flex justify-content-start flex-wrap pt-2" key={newArrival.ID}>
                                <img src={newArrival.image.model_image_url} className="img-fluid" alt={newArrival.name} /> 
                            </div>
                        ))
                        }
                    </div>
                    <div className="col">
                        <h3 className="div text-center">
                            New Arrival Man
                        </h3>
                        {
                        newArrivalsMan.map(shoe => (
                            <div className="d-flex justify-content-start flex-wrap pt-2" key={shoe.ID}>
                                <img src={shoe.image.model_image_url} className="img-fluid" alt={shoe.name} /> 
                            </div>
                        ))
                        }
                    </div>
                </div>
            </div>
        </div> */}