import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useShop } from "../contexts/GlobalContext"

export default function AppSearch() {
    const { genre, searchValue, category, setCategory, shoes, filteredShoes, setFilteredShoes } = useShop()

    const url = import.meta.env.VITE_API_ADDRESS + "index";


    /* useEffect for filtering by genre */
    useEffect(() => {
        const filtered = shoes
            .filter(s =>
                s.genre.toLowerCase().includes(genre.toLowerCase())
            )
            .filter(s =>
                s.name.toLowerCase().includes(searchValue.toLowerCase())
            );

        setFilteredShoes(filtered);
    }, [shoes, genre, searchValue]);

    return (
        <>


            {/* list shoes */}
            <div className="container-fluid px-0">
                <div className="row g-0 row-cols-2 row-cols-md-4">

                    {
                        (filteredShoes.length > 0)
                            ?
                            filteredShoes?.map((shoe) => (
                                <div className="col position-relative" key={shoe.id}>

                                    <div className="image-container">
                                        <Link to={`/products/${shoe.name}/${shoe.color}`}>
                                            <img className="w-100 d-flex align-items-center justify-content-center p-1" src={shoe.image.main_image_url} alt={shoe.name} style={{ width: "18rem" }} />
                                        </Link>
                                    </div>

                                    <div className="card-body px-1">
                                        <div className="px-3 py-2">

                                            <div className="d-flex justify-content-between align-items-start">

                                                <p className="mb-0 fw-semibold">
                                                    {shoe.name}
                                                </p>

                                                <button
                                                    className="btn btn-sm bg-transparent border-0 p-0"
                                                    style={{ fontSize: "1.5rem", lineHeight: 1, color: "#555" }}>
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
                            ))
                            :
                            <div className="d-flex flex-column align-items-center justify-content-center text-center min-vh-100 w-100" >
                                <h4 className="fw-semibold mb-2">Nessuna scarpa trovata</h4>
                                <p className="text-muted mb-4" style={{ maxWidth: "340px" }}>
                                    Nessun risultato per <span className="fw-semibold text-dark">"{searchValue}"</span>.
                                    <br />Prova con un termine diverso o sfoglia tutte le categorie.
                                </p>
                                <button className="btn btn-dark rounded-pill px-4" onClick={() => setSearchValue("")}>
                                    Mostra tutte le scarpe
                                </button>
                            </div>
                    }


                </div>
            </div>
        </>
    );
}