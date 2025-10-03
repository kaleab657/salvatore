import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';
interface ImageCarouselProps {
  images: string[];
  className?: string;
}
const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  // Minimum swipe distance
  const minSwipeDistance = 50;
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };
  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };
  // Auto-advance slides
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, images.length]);
  if (!images || images.length === 0) {
    return <div className={`w-full h-64 bg-gray-200 flex items-center justify-center ${className}`}>
        <p className="text-gray-500">No images available</p>
      </div>;
  }
  return <div className={`relative w-full ${className}`}>
      <div className="relative h-72 overflow-hidden" ref={slideRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <div className="flex transition-transform duration-500 ease-out h-full" style={{
        transform: `translateX(-${currentIndex * 100}%)`
      }}>
          {images.map((image, index) => <img key={index} src={image} alt={`Product image ${index + 1}`} className="w-full h-full object-cover flex-shrink-0" />)}
        </div>
        {images.length > 1 && <>
            <button onClick={goToPrevious} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-1.5 shadow-md hover:bg-white/90 transition-colors">
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button onClick={goToNext} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-1.5 shadow-md hover:bg-white/90 transition-colors">
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </>}
      </div>
      {images.length > 1 && <div className="absolute bottom-4 left-0 right-0">
          <div className="flex justify-center space-x-2">
            {images.map((_, slideIndex) => <button key={slideIndex} onClick={() => goToSlide(slideIndex)} className={`w-2 h-2 rounded-full transition-colors ${currentIndex === slideIndex ? 'bg-white shadow-md' : 'bg-white/50'}`} aria-label={`Go to slide ${slideIndex + 1}`} />)}
          </div>
        </div>}
    </div>;
};
export default ImageCarousel;