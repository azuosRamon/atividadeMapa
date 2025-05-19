import React from "react";
import styled from "styled-components";

const LupaContainer = styled.div`
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  border: 2px solid white;
  width: 200px;
  height: 200px;
  overflow: hidden;
  z-index: 100;
`;

const ZoomedImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: ${props => props.zoom * 500}%;
  background-position: ${props => props.bgX}px ${props => props.bgY}px;
`;

const LupaCircular = ({ show, x, y, imageSrc, zoom }) => {
  if (!show) return null;

  const offset = 100; // metade do tamanho da lupa (200px)

  return (
    <LupaContainer style={{ left: x, top: y}}>
      <ZoomedImage
        src={imageSrc}
        zoom={zoom}
        bgX={-x * zoom}
        bgY={-y * zoom}
      />
    </LupaContainer>
  );
};

export default LupaCircular;
