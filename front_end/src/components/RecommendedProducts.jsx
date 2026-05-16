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
                        <p className="recommendedName">{item.name}</p>
                        <p className="recommendedPrice">{item.price} €</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
