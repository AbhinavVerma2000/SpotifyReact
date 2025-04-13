import React, { useEffect, useRef } from 'react';
import ColorThief from 'color-thief-browser';

const BackgroundColorDiv = ({bgColor, setBgColor, imageUrl }) => {
  const divRef = useRef(null);

  useEffect(() => {
    const div = divRef.current;
    const colorThief = new ColorThief();
    
    // Wait for the image to load before extracting color
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // To handle CORS issues
    img.src = imageUrl;

    img.onload = () => {
      const dominantColor = colorThief.getColor(img);
      setBgColor(dominantColor);
    };
  }, [imageUrl, setBgColor]);

  return (
    <div ref={divRef}
          className="rounded thumbnail"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center"
          }}
        />
  );
};

export default BackgroundColorDiv;
