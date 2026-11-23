
import { useEffect, useState } from "react";
import "../styles/AdsSlider.css";

const ads = [
  {
    title: "Welcome to Clinics Hub",
    description:
      "Find the right clinic and doctor easily. Your healthcare journey starts here.",
    button: "Explore Clinics",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
  },
  {
    title: "Discover Featured Clinics",
    description:
      "Explore trusted clinics and find the medical services you need.",
    button: "Find a Clinic",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d",
  },
  {
    title: "Join Clinics Hub",
    description:
      "Grow your clinic's presence and connect with more patients.",
    button: "Learn More",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561",
  },
];

export default function AdsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const currentAd = ads[currentIndex];

  return (
    <section className="ads-slider">
      <div
        className="ads-slide"
        style={{ backgroundImage: `url(${currentAd.image})` }}
      >
        <div className="ads-overlay">
          <div className="ads-content">
            <h1>{currentAd.title}</h1>
            <p>{currentAd.description}</p>
            <button type="button">{currentAd.button}</button>
          </div>
        </div>
      </div>

      <button
        className="ads-arrow ads-prev"
        onClick={prevSlide}
        aria-label="Previous advertisement"
      >
        &#10094;
      </button>

      <button
        className="ads-arrow ads-next"
        onClick={nextSlide}
        aria-label="Next advertisement"
      >
        &#10095;
      </button>

      <div className="ads-dots">
        {ads.map((_, index) => (
          <button
            key={index}
            className={index === currentIndex ? "active" : ""}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to advertisement ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
