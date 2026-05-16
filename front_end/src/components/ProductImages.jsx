import { useRef } from "react";
import { useDetail } from "../contexts/DetailContext";

export default function ProductImages() {
    const { product, mainImage, setMainImage, setIsFullscreen } = useDetail();

    const lensRef = useRef(null);
    const resultRef = useRef(null);
    const imgRef = useRef(null);

    const handleLeave = () => {
        if (lensRef.current) lensRef.current.style.display = "none";
        if (resultRef.current) resultRef.current.style.display = "none";
    };

    const handleZoom = (e) => {
        const img = imgRef.current;
        const lens = lensRef.current;
        const result = resultRef.current;

        if (!img) return;

        result.style.display = "block";

        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;

        const lensSize = 100;
        lens.style.left = `${x - lensSize / 2}px`;
        lens.style.top = `${y - lensSize / 2}px`;

        const zoomLevel = 2.5;
        const imgWidth = img.width * zoomLevel;
        const imgHeight = img.height * zoomLevel;

        const resultWidth = result.offsetWidth;
        const resultHeight = result.offsetHeight;

        const bgX = -(x * zoomLevel - resultWidth / 2);
        const bgY = -(y * zoomLevel - resultHeight);
        result.style.backgroundImage = `url(${mainImage})`;
        result.style.backgroundSize = `${imgWidth}px ${imgHeight}px`;
        result.style.backgroundPosition = `${bgX}px ${bgY}px`;
    };

    return (
        <div className="imagesWrapper">
            {/* THUMBNAILS */}
            <div className="thumbnailsColumn d-flex justify-content-center">
                {[
                    product.image.main_image_url,
                    product.image.top_view_url,
                    product.image.secondary_image_url,
                    product.image.model_image_url
                ]
                    .filter(img => img)
                    .map((img, i) => (
                        <img key={i} src={img} alt="thumb" className="thumbnailVertical"
                            style={{
                                border: mainImage === img ? "2px solid black" : "1px solid #ccc"
                            }}
                            onMouseEnter={() => setMainImage(img)}
                            onClick={() => setMainImage(img)}
                        />
                    ))}
            </div>

            {/* IMMAGINE PRINCIPALE */}
            <div className="mainImageWrapper d-flex align-self-center">
                <img ref={imgRef} src={mainImage} alt={product.name} className="mainImage"
                    onMouseMove={handleZoom}
                    onMouseLeave={handleLeave}
                    onClick={() => setIsFullscreen(true)}
                />
                <div className="zoomLens" ref={lensRef}></div>
                <div className="zoomResult" ref={resultRef}></div>
            </div>
        </div>
    );
}
