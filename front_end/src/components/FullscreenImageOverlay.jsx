import { useDetail } from "../contexts/DetailContext";

export default function FullscreenImageOverlay() {
    const {
        product,
        isFullscreen, setIsFullscreen,
        currentIndex, setCurrentIndex,
        setMainImage
    } = useDetail();

    if (!isFullscreen) return null;

    const images = [
        product.image.main_image_url,
        product.image.top_view_url,
        product.image.secondary_image_url,
        product.image.model_image_url
    ].filter(img => img);

    return (
        <div className="fullscreenOverlay" onClick={() => setIsFullscreen(false)}>
            <button
                className="arrow left"
                onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                    );
                    setMainImage(images[currentIndex === 0 ? images.length - 1 : currentIndex - 1]);
                }}
            >
                ‹
            </button>

            <img
                src={images[currentIndex]}
                alt="fullscreen"
                className="fullscreenImage"
                onClick={(e) => e.stopPropagation()}
            />

            <button
                className="arrow right"
                onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex((prev) =>
                        prev === images.length - 1 ? 0 : prev + 1
                    );
                    setMainImage(images[currentIndex === images.length - 1 ? 0 : currentIndex + 1]);
                }}
            >
                ›
            </button>
        </div>
    );
}
