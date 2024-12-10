// PolaroidCarousel.js
import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import { Permanent_Marker } from "next/font/google";
import "swiper/css";
import "swiper/css/effect-fade";

const caveat = Permanent_Marker({
  subsets: ["latin"],
  weight: ["400"],
});

const DECORATIONS = {
  TAPE_LIGHT: {
    className:
      "w-[clamp(3rem,5vw,5rem)] h-[clamp(1.5rem,2.5vw,2.5rem)] bg-[#FFE4B5] opacity-30 rotate-3",
    style: { boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
  },
};

const PolaroidCarousel = forwardRef(({
  photos,
  onSlideChange,
  decorationType = "TAPE_LIGHT",
  slideInterval = 5000,
}, ref) => {
  const swiperRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    swiper: swiperRef.current?.swiper
  }));

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="relative 
        w-[clamp(400px,45vw,1000px)] 
        h-[clamp(500px,89vh,1200px)] 
        bg-white shadow-2xl flex flex-col
        transition-all duration-300 ease-in-out
        transform-gpu"
      >
        <div
          className={`absolute -top-[clamp(1rem,1.5vw,2rem)] left-1/2 transform -translate-x-1/2 
            transition-transform duration-300 ${DECORATIONS[decorationType].className}`}
          style={DECORATIONS[decorationType].style}
        />

        <div className="relative flex-1 p-[clamp(0.75rem,1.5vw,2rem)]">
          <div className="relative w-full h-full bg-black overflow-hidden">
          <Swiper
        ref={swiperRef}
        effect="fade"
        autoplay={{
          delay: slideInterval,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        modules={[Autoplay, EffectFade]}
        onSlideChange={onSlideChange}
        className="w-full h-full"
        loop={true}
        allowTouchMove={false}
        speed={1000}
        fadeEffect={{
          crossFade: true,
        }}
        observer={true}
        observeParents={true}
        watchSlidesProgress={true}
        updateOnImagesReady={true}
        loopAdditionalSlides={2}
        preventInteractionOnTransition={true}
        watchOverflow={true}
        key={photos.map(p => p.id).join(',')} // Fuerza reinicio cuando cambian las fotos
      >
        {photos.map((photo) => (
          <SwiperSlide 
            key={photo.id} 
            className="w-full h-full"
            virtualIndex={photo.id}
          >
            <div className="relative w-full h-full bg-black">
              <div className="absolute inset-0">
                <Image
                  src={photo.url || photo.image_url}
                  alt={photo.comment || "Selfie del evento"}
                  fill
                  priority={true}
                  className="object-cover"
                  sizes="(max-width: 76px) 90vw, (max-width: 1280px) 45vw, 55vw"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
          </div>
        </div>

        <div
          className="h-[7%] min-h-[clamp(50px,6vh,100px)] 
          bg-white px-[clamp(1rem,1.5vw,2.5rem)] flex items-center justify-center"
        >
          <div className="transform rotate-[-2deg] relative -mt-6 2xl:-mt-12">
            <div className="relative inline-block">
              <span
                className={`${caveat.className} text-[clamp(1.25rem,2vw,3.5rem)] text-gray-700 whitespace-nowrap`}
              >
                Real Meet 2024
              </span>
              <div className="absolute bottom-0 left-0 w-full">
                <div
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-black opacity-40"
                  style={{ transform: "translateY(1px)" }}
                />
                <div
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-black opacity-60"
                  style={{ transform: "translateY(2px)" }}
                />
                <div
                  className="absolute bottom-0 left-0 w-full h-[3px] bg-black opacity-80"
                  style={{ transform: "translateY(3px)" }}
                />
                <div
                  className="absolute bottom-0 left-0 w-full h-[4px] bg-black"
                  style={{ transform: "translateY(4px)" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 border-white pointer-events-none
          border-[clamp(8px,1vw,20px)]
          transition-all duration-300"
        />
        <div
          className="absolute inset-0 
          shadow-[0_0_clamp(20px,3vw,50px)_rgba(0,0,0,0.3)]
          pointer-events-none transition-all duration-300"
        />
      </div>
    </div>
  );
});

PolaroidCarousel.displayName = 'PolaroidCarousel';

export default PolaroidCarousel;