import { Link } from "react-router-dom"
import { useShop } from "../contexts/GlobalContext"
import { useNavigate } from "react-router";


export default function AppSideBarSearch() {

    const { searchValue, setSearchValue, category, setGenre } = useShop()

    let navigate = useNavigate();

    return (
        <div className="offcanvas offcanvas-end" id="searchPanel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title">Ricerca</h5>
                <button className="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>

            <div className="offcanvas-body">
                <input className="form-control mb-3" type="search" placeholder="Che tipo di scarpa cerchi?" value={searchValue} onChange={(e) => { setSearchValue(e.target.value), setGenre("") }} onKeyDown={(e) => {
                    if (e.key === "Enter")
                        navigate("/shoes")
                }} />

                {
                    category?.map((item, index) => (
                        <div className=" ms-1 mb-2" data-bs-dismiss="offcanvas" key={index}>
                            <Link to="/shoes" className="text-black underline_hover " onClick={() => { setSearchValue(item), setGenre("") }} state={{ scrollPosition: window.scrollY }} >
                                {item}
                            </Link>
                        </div>
                    ))
                }
                <hr />

            </div>
        </div>
    )
}