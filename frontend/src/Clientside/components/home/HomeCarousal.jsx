import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, HardHat, Factory, Settings } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

export const HomeCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [carouselItems, setCarouselItems] = useState([]);
  const videoRefs = useRef([]);

  // Fetch banners dynamically
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get("/api/banner/getBannersBySection?section=Home");
        console.log(response.data.banners);
        setCarouselItems(response.data.banners);
        videoRefs.current = new Array(response.data.banners.length).fill(null);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };
    fetchBanners();
  }, []);

  // Function to handle when video ends
  const handleVideoEnd = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      nextSlide();
    }
  };

  // Auto-advance interval effect
  useEffect(() => {
    if (carouselItems.length > 0) {
      const interval = setInterval(() => {
        const currentItem = carouselItems[activeSlide];
        const isCurrentSlideVideo = isVideoSlide(currentItem);

        if (!isCurrentSlideVideo && !isAnimating) {
          nextSlide();
        }
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [carouselItems, activeSlide, isAnimating]);

  // Function to check if the current slide is a video
  const isVideoSlide = (item) => {
    if (!item) return false;
    return (
      (item.video && item.video !== "") ||
      (item.photo &&
        Array.isArray(item.photo) &&
        item.photo.some((photo) => photo.endsWith(".mp4") || photo.endsWith(".mov")))
    );
  };

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveSlide((prev) => (prev + 1) % carouselItems.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  // Handle video playback when slides change
  useEffect(() => {
    const currentItem = carouselItems[activeSlide];
    if (isVideoSlide(currentItem) && videoRefs.current[activeSlide]) {
      videoRefs.current[activeSlide].currentTime = 0;
      videoRefs.current[activeSlide].play();
    }
  }, [activeSlide, carouselItems]);

  const staticIcons = [
    { icon: HardHat, label: "Safety First" },
    { icon: Factory, label: "Modern Facilities" },
    { icon: Settings, label: "Advanced Tech" },
  ];

  return (
    <div className="relative h-[50vh] lg:h-screen">
      <div className="relative h-full overflow-hidden">
        {carouselItems.map((item, index) => (
          <div
            key={item._id}
            className={`absolute w-full h-full transition-all duration-1000 
              ${index === activeSlide ? "opacity-100 translate-x-0" : 
                index < activeSlide ? "opacity-0 -translate-x-full" : "opacity-0 translate-x-full"}`}
          >
            {item.photo && item.photo.length > 0 ? (
              item.photo.map((media, photoIndex) => {
                const isVideo = media.endsWith(".mp4") || media.endsWith(".mov");
                return isVideo ? (
                  <video
                    key={photoIndex}
                    ref={(el) => {
                      if (videoRefs.current) {
                        videoRefs.current[index] = el;
                      }
                    }}
                    src={`${media}`}
                    alt={item.alt[photoIndex] || item.title}
                    className="w-screen h-[100vh] object-cover"
                    autoPlay
                    muted
                    playsInline
                    onEnded={() => handleVideoEnd(index)}
                  />
                ) : (
                  <img
                    key={photoIndex}
                    src={`/api/image/download/${media}`}
                    alt={item.alt[photoIndex] || item.title}
                    className="w-screen h-[100vh] object-cover"
                  />
                );
              })
            ) : item.video ? (
              <video
                key="default-video"
                ref={(el) => {
                  if (videoRefs.current) {
                    videoRefs.current[index] = el;
                  }
                }}
                src={`${item.video}`}
                className="w-screen h-[100vh] object-cover"
                autoPlay
                muted
                playsInline
                onEnded={() => handleVideoEnd(index)}
              />
            ) : (
              <img
                key="default-image"
                src="/path/to/default-image.jpg"
                className="w-screen h-[100vh] object-cover"
                alt="Default image"
              />
            )}

            <div className="absolute inset-0 bg-black bg-opacity-40">
              <div className="h-full md:ml-20 flex flex-col items-start justify-center lg:ml-24 max-w-7xl mx-auto px-8">
                <div className="relative sm:block hidden">
                  <div className="absolute -left-4 top-0 w-1 h-24 md:h-12 bg-white" />
                  <div className="absolute -left-4 top-0 w-24 md:w-12 h-1 bg-white" />
                </div>
                <div
                  className={`sm:space-y-7 mt-5 sm:mt-0 transition-all duration-700 
                    ${isAnimating ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"}`}
                >
                  <h1 className="text-white md:pt-2 xl:text-6xl lg:text-4xl text-lg font-bold">
                    {item.title}
                  </h1>
                  <p
                    className="text-white text-lg mb-8"
                    dangerouslySetInnerHTML={{ __html: item.details }}
                  ></p>
                  <Link to={"/about-us"}>
                    <button className="bg-[#128fc9] text-white lg:px-8 mt-5 lg:py-3 lg:text-lg text-sm px-4 py-2 rounded transition-colors">
                      LEARN MORE
                    </button>
                  </Link>
                </div>

                <div className="absolute bottom-16 right-8 hidden sm:flex gap-6 lg:gap-8">
                  {staticIcons.map((iconItem, i) => (
                    <div
                      key={i}
                      className={`flex flex-col items-center justify-center transition-all duration-700 delay-${
                        i * 200
                      } ${isAnimating ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"}`}
                    >
                      <div
                        className="bg-white w-14 h-14 lg:w-16 lg:h-16 flex justify-center items-center rounded-full mb-2"
                        aria-label={iconItem.label}
                      >
                        <iconItem.icon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <span className="text-white text-sm text-center">{iconItem.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => window.open("/api/image/view/ostech.pdf", "_blank")}
        className="hidden lg:flex fixed right-0 top-1/2 transform -translate-y-1/2 bg-[#128fc9] text-white px-3 py-6 mr-2 rounded-md hover:bg-[#0b2b59] transition-colors z-50"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        <span className="text-white text-lg font-medium">Catalogue</span>
      </button>

      <button
        onClick={prevSlide}
        className="absolute hidden sm:block left-4 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 hidden sm:block top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 
              ${index === activeSlide ? "bg-white w-8" : "bg-white/50"}`}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeCarousel;