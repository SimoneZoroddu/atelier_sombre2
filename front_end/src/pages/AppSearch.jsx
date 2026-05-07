import { useEffect, useState } from "react";
import axios from "axios";

export default function AppSearch() {

    const url = import.meta.env.VITE_API_ADDRESS + "index";
    const [shoes, setShoes] = useState([]);

    useEffect(() => {
        axios.get(url)
            .then(datas => {
                setShoes(datas.data);
            });
    }, []);
    console.log(shoes);

    return (
        <>
            {/* sidebar whit icon*/}
            <nav className="navbar navbar-dark bg-dark px-3">
                <span className="navbar-brand"></span>

                {/* button open search */}
                <button className="btn btn-outline-light" data-bs-toggle="offcanvas" data-bs-target="#searchPanel" >🔍 Search </button>
            </nav>

            {/* sidebar */}
            <div
                className="offcanvas offcanvas-end"
                id="searchPanel"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Search shoes</h5>
                    <button
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                    ></button>
                </div>

                <div className="offcanvas-body">
                    <input className="form-control mb-3" type="search" placeholder="What are you looking for?" />
                    <button className="btn btn-dark w-100">Search</button>
                </div>
            </div>

            {/* list shoes*/}
            <div className="container-fluid px-0">
                <div className="row g-0 row-cols-2 row-cols-md-4">
                    {shoes.map((shoe) => (
                        <div className="col position-relative" key={shoe.id} >
                            <div className="image-container">
                                <img className="w-100 d-flex align-items-center justify-content-center p-1 " src={shoe.image.main_image_url} alt={shoe.name} style={{ width: "18rem" }} />
                            </div>

                            <div className="card-body px-1">
                                <div className="px-3 py-2">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <p className="mb-0 fw-semibold">
                                            {shoe.name}
                                        </p>
                                        <button
                                            className="btn btn-sm bg-transparent border-0 p-0"
                                            style={{ fontSize: "1.5rem", lineHeight: 1, color: "#555" }}
                                            title="Add to wishlist"
                                        >
                                            ♡
                                        </button>
                                    </div>
                                    <p className="mb-0 text-muted">
                                        {shoe.color}
                                    </p>
                                    <p className="mb-0 mt-1">
                                        €{shoe.price}
                                    </p>
                                </div>

                            </div>

                        </div>
                    ))}

                </div>
            </div >

        </>
    );
}