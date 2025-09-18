import React, { useRef, useState } from "react";

const LupaImagem = ({ src, zoom = 2, lupaSize = 150 }) => {
  const containerRef = useRef(null);
  const [showLupa, setShowLupa] = useState(false);
  const [lupaStyle, setLupaStyle] = useState({});

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (
      x < 0 ||
      y < 0 ||
      x > rect.width ||
      y > rect.height
    ) {
      setShowLupa(false);
      return;
    }

    setShowLupa(true);

    const bgX = (x / rect.width) * 100;
    const bgY = (y / rect.height) * 100;

    setLupaStyle({
      display: "block",
      position: "absolute",
      left: `${x - lupaSize / 2}px`,
      top: `${y - lupaSize / 2}px`,
      width: `${lupaSize}px`,
      height: `${lupaSize}px`,
      borderRadius: "50%",
      border: "2px solid #000",
      backgroundImage: `url(${src})`,
      backgroundSize: `${rect.width * zoom}px ${rect.height * zoom}px`,
      backgroundPosition: `${bgX}% ${bgY}%`,
      pointerEvents: "none",
      zIndex: 10,
    });
  };

  const handleMouseLeave = () => {
    setShowLupa(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ position: "relative", width: "fit-content" }}
    >
      <img src={src} alt="Imagem" style={{ display: "block", maxWidth: "100%" }} />
      {showLupa && <div style={lupaStyle}></div>}
    </div>
  );
};

export default LupaImagem;
