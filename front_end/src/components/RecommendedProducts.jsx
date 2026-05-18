import { Link } from "react-router-dom";
import { useDetail } from "../contexts/DetailContext";

export default function RecommendedProducts() {
    const { recommended, normalizedName, normalizedColor } = useDetail();

    if (recommended.length === 0) return null;


    return (
        <div className="recommendedSection">
            <h2>Prodotti consigliati</h2>

            <div className="recommendedRow">
                {recommended.map(item => (
                    <Link key={item.id} className="recommendedItem" to={`/products/${normalizedName(item.name)}/${normalizedColor(item.color)}`}   >
                        <img src={item.image.main_image_url} alt={item.name} className="recommendedImage" />
                        <div className="recommendedName">{item.name}</div>
                        {item.on_sale !== 0 ? (
                            <p >
                                <span style={{ textDecoration: "line-through", color: "#777", marginRight: "0.5rem" }}>
                                    {`${Math.ceil(item.price)}€`}
                                </span>
                                <span style={{ fontWeight: 600 }}>
                                    {`${Math.ceil(Number((item.price * (1 - item.on_sale / 100))))}€`}
                                </span>
                            </p>
                        ) : (
                            <p style={{ fontWeight: 600 }}>{`${Math.ceil(item.price)}€`}</p>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
