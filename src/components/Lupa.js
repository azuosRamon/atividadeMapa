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
  background-size: ${props => props.zoom * 100}%;
  background-position: ${props => props.bgX}px ${props => props.bgY}px;
`;

const LupaCircular = ({ show, x, y, imageSrc, zoom, imageOffset }) => {
  if (!show || !imageOffset) return null;

  const lupaSize = 200;
  const offset = lupaSize / 2;

  // Posição do mouse relativa à imagem
  const relativeX = x - imageOffset.left;
  const relativeY = y - imageOffset.top;

  // Posição do fundo da lupa para centralizar o ponto ampliado
  const bgX = -relativeX * zoom + offset;
  const bgY = -relativeY * zoom + offset;

  return (
    <LupaContainer style={{ left: x - offset, top: y - offset }}>
      <ZoomedImage
        src={imageSrc}
        zoom={zoom}
        bgX={bgX}
        bgY={bgY}
      />
    </LupaContainer>
  );
};

export default LupaCircular;
