import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useShop } from "../contexts/GlobalContext";
import AppSideBarCart from "../components/AppSideBarCart";
import axios from "axios";
import ErrorMessage from "../components/ErrorMessage";

export default function AppSearch() {

    const { normalizedColor, normalizedName, addWishlist, isInWishlist, cartList, isVisibleCart } = useShop();

    const { genre, page, pages } = useParams();

    const [results, setResults] = useState([]);
    const [sortBy, setSortBy] = useState("default");
    const [sortedResults, setSortedResults] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    const { normalizedColor, normalizedName, addWishlist, isInWishlist, cartList, searchValue } = useShop();

    const applySort = (data, sort) => {
        const sorted = [...data];
        switch (sort) {
            case "price_asc": return sorted.sort((a, b) => a.price - b.price);
            case "price_desc": return sorted.sort((a, b) => b.price - a.price);
            case "name_asc": return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case "name_desc": return sorted.sort((a, b) => b.name.localeCompare(a.name));
            case "newest": return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case "on_sale": return sorted.filter(p => p.discount > 0);
            default: return sorted;
        }
    };

    useEffect(() => {
        const sortParam = sortBy !== "default" ? `&sort=${sortBy}` : "";

        if (pages) {
            axios.get(`http://localhost:3000/products/index/?page=${pages}`)
                .then((res) => {
                    const data = res.data.results;
                    setTotalPages(res.data.total_pages);
                    setResults(data);
                    setSortedResults(applySort(data, sortBy));
                })
                .catch((err) => console.error(err));
            return;
        }
        else if (genre === "discounted") {
            axios.get(`http://localhost:3000/products/discounted?page=${page}`)
                .then((res) => {
                    const data = res.data.results;
                    setTotalPages(res.data.total_pages);
                    setResults(data);
                    setSortedResults(applySort(data, sortBy));
                })

            return;
        } else if (genre == "uomo" || genre == "donna") {
            axios.get(`http://localhost:3000/products/genre/${genre}?page=${page}`)
                .then((res) => {
                    const data = res.data.results;
                    setTotalPages(res.data.total_pages);
                    setResults(data);
                    setSortedResults(applySort(data, sortBy));
                })
                .catch((err) => console.error("Errore:", err))
        }
        else {
            axios.get(`http://localhost:3000/products/${genre}?page=${page}`)
                .then((res) => {
                    const data = res.data.results;
                    setTotalPages(res.data.total_pages);
                    setResults(data);
                    setSortedResults(applySort(data, sortBy));
                })
                .catch((err) => console.error(err));
        }
    }, [genre, page, pages]);


    const filteredResults = sortedResults.filter((shoe) =>
        shoe.name.toLowerCase().includes(searchValue.toLowerCase())
    );


    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        {/* Select for the choice*/}
                        <div className="container-fluid px-3 py-2">
                            <div className="d-flex justify-content-end">
                                <select className="form-select form-select-sm border-0 border-bottom rounded-0 bg-transparent" style={{ width: "200px" }}
                                    onChange={(e) => {
                                        setSortBy(e.target.value);
                                        setSortedResults(applySort(results, e.target.value));
                                    }}
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
                            <div className="row g-0 row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
                                {
                                    filteredResults?.map((shoe) => (
                                        <div className="col position-relative gx-2" key={shoe.id}          >
                                            <div className="image-container">
                                                <Link to={`/products/${normalizedName(shoe.name)}/${normalizedColor(shoe.color)}`} >
                                                    <img className="w-100 d-flex align-items-center justify-content-center p-1" src={shoe.image?.main_image_url} alt={shoe.name} style={{ width: "18rem" }} />
                                                </Link>
                                            </div>

                                            <div className="card-body px-1">
                                                <div className="px-3 py-2">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <p className="mb-0 fw-semibold">
                                                            {shoe.name}
                                                        </p>
                                                        <button onClick={(e) => addWishlist(shoe)} className="btn btn-sm bg-transparent border-0 p-0"
                                                            style={{
                                                                fontSize: "1.5rem",
                                                                lineHeight: 1,
                                                                color: "#555",
                                                            }}
                                                        >
                                                            {isInWishlist(shoe.id) ? <i className="bi bi-suit-heart-fill"></i> : <i className="bi bi-suit-heart"></i>}
                                                        </button>
                                                    </div>
                                                    <p className="mb-0 text-muted">
                                                        {shoe.color}
                                                    </p>
                                                    {shoe.on_sale !== 0 ? (
                                                        <p className="price d-flex">
                                                            <span style={{ textDecoration: "line-through", color: "#777", marginRight: "0.5rem" }}>
                                                                {`${Math.ceil(shoe.price)}€`}
                                                            </span>
                                                            <span style={{ fontWeight: 600, }}>
                                                                {`${(shoe.price * (1 - shoe.on_sale / 100))}€`}
                                                            </span>
                                                            <span className="ms-auto" >
                                                                -{shoe.on_sale}%
                                                            </span>
                                                        </p>
                                                    ) : (
                                                        <p className="price">{Math.ceil(shoe.price)} €</p>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                    ))

                                }
                            </div>
                        </div>
                    </div>

                </div>
            </div >
            <div className="pagination-nav">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <div key={page}>
                        <Link className="page-link"
                            to={pages ? `/shoes/${page}` : genre === "discounted" ? `/shoes/discounted/${page}` : `/shoes/${genre}/${page}`}
                        >
                            Pagina {page}
                        </Link>
                        <span className="divider" />
                    </div>
                ))}
            </div>

        </>
    );
}