import { useEffect, useState } from "react"; // 👈 aggiungi useState
import { Link } from "react-router-dom";
import { useShop } from "../contexts/GlobalContext";
import AppSideBarCart from "../components/AppSideBarCart";
//normalize name and color for url params


export default function AppSearch() {
    const {
        genre,
        searchValue,
        shoes,
        filteredShoes,
        setFilteredShoes,
        setSearchValue,
        cartList,
        normalizedName,
        normalizedColor
    } = useShop();

    const [sortBy, setSortBy] = useState("default");

    useEffect(() => {
        /* useEffect for filtering by genre */
        let filtered = shoes
            .filter((s) =>
                s.genre.toLowerCase().includes(genre.toLowerCase())
            )
            .filter((s) =>
                s.name.toLowerCase().includes(searchValue.toLowerCase())
            );

        /* ordinary according to choice */
        if (sortBy === "price_asc") {
            filtered = [...filtered].sort((a, b) => a.price - b.price);
        } else if (sortBy === "price_desc") {
            filtered = [...filtered].sort((a, b) => b.price - a.price);
        } else if (sortBy === "name_asc") {
            filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "name_desc") {
            filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortBy === "newest") {
            filtered = [...filtered].sort((a, b) => b.id - a.id);
        }

        setFilteredShoes(filtered);
    }, [shoes, genre, searchValue, sortBy]);

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        {/* Select for the choice*/}
                        <div className="container-fluid px-3 py-2">
                            <div className="d-flex justify-content-end">
                                <select
                                    className="form-select form-select-sm border-0 border-bottom rounded-0 bg-transparent"
                                    style={{ width: "200px" }}
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="default">Ordina per</option>
                                    <option value="newest">Ultimi arrivi</option>
                                    <option value="price_asc">Prezzo: crescente</option>
                                    <option value="price_desc">Prezzo: decrescente</option>
                                    <option value="name_asc">Nome: A → Z</option>
                                    <option value="name_desc">Nome: Z → A</option>
                                </select>
                            </div>
                        </div>

                        {/* List Shoes */}
                        <div className="container-fluid px-0">
                            <div className="row g-0 row-cols-2 row-cols-md-4">
                                {filteredShoes.length > 0 ? (
                                    filteredShoes?.map((shoe) => (
                                        <div
                                            className="col position-relative gx-2"
                                            key={shoe.id}
                                        >
                                            <div className="image-container">
                                                <Link
                                                    to={`/products/${normalizedName(shoe.name)}/${normalizedColor(shoe.color)}`}
                                                >
                                                    <img
                                                        className="w-100 d-flex align-items-center justify-content-center p-1"
                                                        src={shoe.images.main_image_url}
                                                        alt={shoe.name}
                                                        style={{ width: "18rem" }}
                                                    />
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
                                                            style={{
                                                                fontSize: "1.5rem",
                                                                lineHeight: 1,
                                                                color: "#555",
                                                            }}
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
                                    ))
                                ) : (
                                    <div className="d-flex flex-column align-items-center justify-content-center text-center min-vh-100 w-100">
                                        <h4 className="fw-semibold mb-2">
                                            Nessuna scarpa trovata
                                        </h4>
                                        <p
                                            className="text-muted mb-4"
                                            style={{ maxWidth: "340px" }}
                                        >
                                            Nessun risultato per{" "}
                                            <span className="fw-semibold text-dark">
                                                "{searchValue}"
                                            </span>
                                            .<br />
                                            Prova con un termine diverso o sfoglia tutte le
                                            categorie.
                                        </p>
                                        <button
                                            className="btn btn-dark rounded-pill px-4"
                                            onClick={() => setSearchValue("")}
                                        >
                                            Mostra tutte le scarpe
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {

                        cartList.length != 0 && <AppSideBarCart />

                    }
                </div>
            </div>
        </>
    );
}