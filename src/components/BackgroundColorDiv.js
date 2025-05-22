import React, { useEffect, useRef } from "react";
import ColorThief from "color-thief-browser";

const BackgroundColorDiv = ({ bgColor, setBgColor, imageUrl }) => {
  const divRef = useRef(null);

  useEffect(() => {
    const div = divRef.current;
    const colorThief = new ColorThief();

    // Wait for the image to load before extracting color
    const img = new Image();
    img.crossOrigin = "Anonymous"; // To handle CORS issues
    img.src = encodeURI(imageUrl);

    img.onload = () => {
      const dominantColor = colorThief.getColor(img);
      setBgColor(dominantColor);
    };
  }, [imageUrl, setBgColor]);

  return (
    <div
      ref={divRef}
      className="rounded thumbnail"
      style={{
        background: `url(${encodeURI(imageUrl)})`,
        backgroundRepeat: "no-repeat",
        // backgroundPosition: "center",
      }}
    >
      {/* <img src={encodeURI(imageUrl)} style={{height:"100%", width:"100%"}} alt="" /> */}
    </div>
  );
};

export default BackgroundColorDiv;
