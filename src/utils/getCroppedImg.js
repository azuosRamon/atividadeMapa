// cropImage.js
/**
 * Função para criar o arquivo (Blob/File) da imagem cortada usando Canvas.
 * @param {HTMLImageElement} image - Elemento <img> carregado.
 * @param {Object} crop - Objeto de corte {x, y, width, height}.
 * @param {number} rotation - Rotação em graus.
 * @returns {Promise<File>} O arquivo (File) da imagem cortada.
 */
export const getCroppedImageFile = (image, crop, rotation = 0) => {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Ajuste do tamanho do canvas para acomodar a rotação
  const safeArea = Math.max(image.naturalWidth, image.naturalHeight) * 2;
  const newCanvasWidth = safeArea;
  const newCanvasHeight = safeArea;

  // Seta o tamanho do canvas
  canvas.width = newCanvasWidth;
  canvas.height = newCanvasHeight;
  const ctx = canvas.getContext("2d");

  ctx.translate(newCanvasWidth / 2, newCanvasHeight / 2);
  ctx.rotate(rotation * Math.PI / 180);
  ctx.translate(-newCanvasWidth / 2, -newCanvasHeight / 2);

  // Desenha a imagem centralizada no canvas (para o zoom/crop funcionar corretamente)
  ctx.drawImage(
    image,
    newCanvasWidth / 2 - image.naturalWidth / 2,
    newCanvasHeight / 2 - image.naturalHeight / 2
  );

  // Calcula a área cortada
  const croppedAreaX = crop.x * scaleX;
  const croppedAreaY = crop.y * scaleY;
  const croppedAreaWidth = crop.width * scaleX;
  const croppedAreaHeight = crop.height * scaleY;

  // Pega a imagem cortada do canvas
  const data = ctx.getImageData(
    croppedAreaX + (newCanvasWidth / 2 - image.naturalWidth / 2),
    croppedAreaY + (newCanvasHeight / 2 - image.naturalHeight / 2),
    croppedAreaWidth,
    croppedAreaHeight
  );

  // Cria um novo canvas apenas com o recorte final
  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = croppedAreaWidth;
  finalCanvas.height = croppedAreaHeight;
  const finalCtx = finalCanvas.getContext("2d");

  finalCtx.putImageData(data, 0, 0);

  // Retorna a promessa com o File
  return new Promise((resolve) => {
    finalCanvas.toBlob((blob) => {
      if (!blob) {
        console.error("Falha ao criar blob.");
        return;
      }
      // O nome do arquivo será atribuído no upload
      resolve(new File([blob], "cropped_image.png", { type: "image/png" }));
    }, 'image/png');
  });
};