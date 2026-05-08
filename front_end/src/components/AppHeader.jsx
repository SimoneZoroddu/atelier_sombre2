import { Link } from "react-router-dom"
import { useShop } from "../contexts/GlobalContext"

export default function AppHeader() {
    const { searchValue, setSearchValue, category } = useShop()


    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Navbar</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="#">Features</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="#">Pricing</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="#">Cart</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>


            {/* navbar */}
            <nav className="navbar navbar-dark bg-dark px-3">
                <span className="navbar-brand"></span>
                <button className="btn btn-outline-light" data-bs-toggle="offcanvas" data-bs-target="#searchPanel"> 🔍 Search </button>
            </nav>

            {/* sidebar */}
            <div className="offcanvas offcanvas-end" id="searchPanel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title">Search shoes</h5>
                    <button className="btn-close" data-bs-dismiss="offcanvas"></button>
                </div>

                <div className="offcanvas-body">
                    <input className="form-control mb-3" type="search" placeholder="What are you looking for?" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                    {
                        category?.map((item, index) => (
                            <div className="p-1" data-bs-dismiss="offcanvas" key={index} onClick={() => setSearchValue(item)} style={{ cursor: "pointer" }} >
                                {item}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>

    )
}