'use client';

import type { FC } from 'react';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageCarouselProps {
  images: { url: string; hint: string }[];
  altText: string;
  autoplay?: boolean;
  autoplayInterval?: number;
}

const ImageCarousel: FC<ImageCarouselProps> = ({ images, altText, autoplay = true, autoplayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images.length]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images.length]);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    if (!autoplay || images.length <= 1) return;
    const intervalId = setInterval(goToNext, autoplayInterval);
    return () => clearInterval(intervalId);
  }, [goToNext, autoplay, autoplayInterval, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video w-full bg-muted flex items-center justify-center rounded-t-lg">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }
  
  // Ensure currentIndex is valid if images array changes
  useEffect(() => {
    if (currentIndex >= images.length && images.length > 0) {
      setCurrentIndex(images.length - 1);
    } else if (images.length === 0) {
      setCurrentIndex(0);
    }
  }, [images, currentIndex]);


  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-t-lg group">
      <div
        className="flex transition-transform ease-in-out duration-500 h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">
            <Image
              src={image.url}
              alt={`${altText} - Image ${index + 1}`}
              data-ai-hint={image.hint}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={index === 0} 
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={goToNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, slideIndex) => (
              <button
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                aria-label={`Go to image ${slideIndex + 1}`}
                className={cn(
                  'h-2 w-2 rounded-full transition-colors duration-300',
                  currentIndex === slideIndex ? 'bg-primary' : 'bg-white/50 hover:bg-white/80'
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
