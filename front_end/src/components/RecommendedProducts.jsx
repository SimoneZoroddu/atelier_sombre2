import { Link } from "react-router-dom";
import { useDetail } from "../contexts/DetailContext";
import { useShop } from "../contexts/GlobalContext";

export default function RecommendedProducts() {
    const { recommended } = useDetail();
    const { normalizedName, normalizedColor } = useShop();

    if (recommended.length === 0) return null;

    return (
        <div className="recommendedSection">
            <h2>Prodotti consigliati</h2>

            <div className="recommendedRow">
                {recommended.map(item => (
                    <Link
                        key={item.id}
                        to={`/products/${normalizedName(item.name)}/${normalizedColor(item.color)}`}
                        className="recommendedItem"
                    >
                        <img
                            src={item.image.main_image_url}
                            alt={item.name}
                            className="recommendedImage"
                        />
                        <p className="recommendedName">{item.name}</p>
                        <p className="recommendedPrice">{item.price} €</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
