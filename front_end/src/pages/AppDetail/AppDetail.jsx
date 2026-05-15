import AppSideBarCart from "../../components/AppSideBarCart"
import ErrorMessage from "../../components/ErrorMessage";
import Loader from "../../components/Loader";
import { DetailProvider, useDetail } from "../../contexts/DetailContext";
import ProductImages from "../../components/ProductImages";
import ProductInfo from "../../components/ProductInfo";
import RecommendedProducts from "../../components/RecommendedProducts";
import ProductShipping from "../../components/ProductShipping";
import FullscreenImageOverlay from "../../components/FullscreenImageOverlay";

import "./AppDetail.css";

function DetailPageContent() {
    const {
        product,
        loading,
        error,
        cartList,
        location,
        handleBack
    } = useDetail();

    if (error) {
        return <ErrorMessage message={error} />;
    }
    if (loading) {
        return <Loader />;
    }
    if (!product) return <ErrorMessage message={error} />;

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        {/* Back button */}
                        <button
                            onClick={handleBack}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                paddingLeft: "3rem",
                                marginTop: "1rem",
                            }}
                        >
                            <i className="bi bi-arrow-left"></i>
                        </button>
                        <div className="product-page">
                            <ProductImages />
                            <ProductInfo />
                        </div>
                            <RecommendedProducts />
                            <ProductShipping />
                        <FullscreenImageOverlay />
                    </div>
                    {
                        cartList.length !== 0 &&
                        location.pathname !== "/cart" &&
                        <AppSideBarCart />
                    }
                </div>
            </div>
        </>
    );
}

export default function DetailPage() {
    return (
        <DetailProvider>
            <DetailPageContent />
        </DetailProvider>
    );
}
