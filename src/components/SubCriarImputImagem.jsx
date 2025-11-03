// Adicione as importações:
import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import Cropper from "react-easy-crop";

import { getCroppedImageFile } from "../utils/getCroppedImg"; // Assumindo que você salvou a função acima
// Você também precisará de um componente de modal, vamos usar Box e useState para simular:
import Modal from './SubModal'; // Se você tiver um modal dedicado

    import Box from "./SubBox";
    import Input from "./SubInput";
    import Label from "./SubLabel";
    import Button from "./SubButton";
    import GridArea from "./SubGridArea";
    import cores from "./Cores"
import styled from "styled-components";
import Title from "./SubTitleH2";
import BussolaCarregando from "./BussolaLoading";
import { CiSquarePlus, CiSquareMinus  } from "react-icons/ci";
import { RiDragMove2Fill } from "react-icons/ri";
import SubParagrafo from "./SubParagrafo";
import { FiCameraOff } from "react-icons/fi";

async function confirmarUpload(funcaoCancelar, funcaoConfirmar) {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <Modal aberto={modalAberto} onFechar={() => setModalAberto(false)}>
      <div>
        <Title>Confirmar nova Imagem</Title>
        <P>Os contornos das salas terão que ser redefinidos manualmente de acordo com a nova imagem</P>
        <Button onClick={() => {funcaoConfirmar; setModalAberto(false)}} >Cancelar</Button>
        <Button onClick={() => {funcaoCancelar;setModalAberto(false)}} type="submit">Confirmar</Button>
      </div>
    </Modal>
  )
}



// Estilização básica para o modal de crop - Você deve ajustar ao seu sistema de estilo
  const CropModalStyle = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

  `;

const BotaoZoom = styled.span`
      font-size: 3rem;
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #333;
    color: white;
    border-radius: 5px;
    cursor: pointer;
`

const DivZoom = styled.div`
    display: flex;
    align-content: center;
    align-items: center;
    flex-direction: row;
    gap: 10px;
    margin-bottom: 20px;
    `

export default function CriarInputImagemCrop({ nomeCampo, campo, setFuncao, objeto}) {
  const [preview, setPreview] = useState(objeto?.[nomeCampo] || "");
  const [carregando, setCarregando] = useState(false);
  
  // Estados para o Cropper
  const [imageSrc, setImageSrc] = useState(null); // URL da imagem para o crop
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false); // Estado para o Modal


  // Função auxiliar para extrair o path (coloque esta função no mesmo arquivo ou importe-a)
const extractPathFromUrl = (publicUrl, bucketName = "imagens") => {
    if (!publicUrl) return null;
    try {
        // Assume a URL do Supabase: .../storage/v1/object/public/[bucketName]/[path]
        const urlPart = `/public/${bucketName}/`;
        const pathIndex = publicUrl.indexOf(urlPart);
        
        if (pathIndex > -1) {
            // Retorna tudo após o '/public/[bucketName]/'
            return publicUrl.substring(pathIndex + urlPart.length);
        }
        return null;
    } catch (e) {
        console.error("Erro ao extrair path da URL:", e);
        return null;
    }
};

  // 1. Lida com a seleção do arquivo
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result); // Define a imagem para o Cropper
      setShowCropModal(true); // Abre o modal de crop
    });
    reader.readAsDataURL(file);
    // Limpa o input para que o mesmo arquivo possa ser selecionado novamente
    e.target.value = null; 
  };
  
  // 2. Chamado quando o corte é movido/ajustado
  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };
  const handleCancelCrop = () => {
    setImageSrc(null);
    setShowCropModal(false);
  }
  // 3. Lida com o upload do corte (Atualizada para Deletar a Antiga)
const handleCropAndUpload = async () => {
    if (!croppedAreaPixels || !imageSrc) return;

    setCarregando(true);
    setShowCropModal(false); 
    const imageElement = new Image();
    imageElement.src = imageSrc;

    imageElement.onload = async () => {
        
        const oldImageUrl = preview; // Pega a URL da imagem atual (antiga)
        let newPublicUrl = null;
        
        try {
            // ----------------------------------------------------
            // 1. GERA O NOVO ARQUIVO CORTADO (PNG)
            // ----------------------------------------------------
            const croppedFile = await getCroppedImageFile(
                imageElement,
                croppedAreaPixels
            );

            const baseFileName = "cropped_image";
            const fileExtension = '.png';
            const fileName = `${Date.now()}-${baseFileName}${fileExtension}`;

            // ----------------------------------------------------
            // 2. FAZ O UPLOAD DA NOVA IMAGEM
            // ----------------------------------------------------
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("imagens")
                .upload(`uploads/${objeto.empresa_id}/${fileName}`, croppedFile, {
                    contentType: 'image/png',
                });

            if (uploadError) throw uploadError;

            // Pega a URL pública do novo arquivo
            const { data: urlData } = supabase.storage
                .from("imagens")
                .getPublicUrl(uploadData.path);
            
            newPublicUrl = urlData.publicUrl; // Armazena a nova URL para uso
            
            // 3. NÃO DELETA AGORA — guarda para deletar só após o "Salvar"
            if (oldImageUrl) {
              setFuncao(
                { target: { name: `_${nomeCampo}_anterior`, value: oldImageUrl } },
                `_${nomeCampo}_anterior`
              );
            }


            // ----------------------------------------------------
            // 4. ATUALIZA O ESTADO DO FORMULÁRIO COM A NOVA URL
            // ----------------------------------------------------
            setFuncao(
                { target: { name: nomeCampo, value: newPublicUrl } },
                nomeCampo
            );
            setPreview(newPublicUrl);
            setImageSrc(null); 


        } catch (err) {
            console.error("Erro no processo de upload/deleção:", err.message);
            alert("Erro no processo de imagem. Consulte o console.");
        } finally {
            setCarregando(false);
        }
    };
};

  const VerificarImagem = () => {
    const [erroImagem, setErroImagem] = useState(false);
  
    if (!preview || erroImagem) {
      return <FiCameraOff style={cameraOff} />;
    }
  
    return (
      <img
            src={preview}
            alt="Pré-visualização"
            onError={() => setErroImagem(true)} // 👈 fallback automático
            style={{
              width: "50%",
              height: "50%",
              objectFit: "cover",
              borderRadius: "5px",
              border: "3px solid #888",
            }} />
    );
  };

  

  const cropContainerStyle = {
    position: 'relative',
    width: '90%',
    maxWidth: '500px',
    height: '400px',
    backgroundColor: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };
  const iconePan = {
    position: 'absolute',
    fontSize: '8rem',
    color: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10,
  };

  return (
    <GridArea $area={campo.nome}>
      <Label htmlFor={campo.nome}>
        {campo.texto || campo.nome}:
      </Label>
      <Input
        type="file"
        id={campo.nome}
        name={campo.nome}
        accept="image/*"
        onChange={handleFileSelect} // Agora chama handleFileSelect
      />
      <BussolaCarregando aberto={carregando} onFechar={() => setCarregando(false)}>Enviando Imagem</BussolaCarregando>

      {preview && (
        <div style={{ marginTop: "8px", display: "flex", justifyContent: "center" }}>
          <VerificarImagem />
        </div>
      )}
      
      {/* --- Modal/Box de Recorte (Crop) --- */}
      {imageSrc && (
         <Modal aberto={showCropModal} onFechar={() => setShowCropModal(false)} >
          <CropModalStyle>
            {/* Input de zoom, se quiser */}
            <Title>Zoom: {(zoom*300/3).toFixed(0)}%</Title>
            <div style={{display: 'flex'}}>
            <BotaoZoom onClick={(e)=>{setZoom(zoom - 0.1)}} ><CiSquareMinus /></BotaoZoom>
            { <input 
              type="range"
              value={zoom}
              min={0.5}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => {
                setZoom(e.target.value);
              }}
              style={{ width: '200px'}}
              /> }
              <BotaoZoom onClick={(e)=>{setZoom(zoom + 0.1)}} ><CiSquarePlus /></BotaoZoom>
              </div>
            <div style={cropContainerStyle}>
              <RiDragMove2Fill className="dot-3" style={iconePan} />
              <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1} 
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
                    // *** ADIÇÃO CRÍTICA AQUI ***
                    restrictPosition={false} 
                    // *** Opcional: autoCropArea para iniciar maior ***
                    // autoCropArea={1} // Tenta iniciar a área de crop o maior possível
              />
            </div>
          <div style={{ padding: '16px', display: 'flex', gap: '10px', width: '50%' }}>
            <Button onClick={handleCancelCrop} $bgcolor={cores.backgroundBotaoSemFoco}>
              Cancelar
            </Button>
            <Button onClick={handleCropAndUpload} $bgcolor={cores.corAdicionar}>
              Recortar e Enviar
            </Button>
          </div>
          </CropModalStyle>
        </Modal>
      )}
      {/* --- Fim do Modal/Box de Recorte --- */}
    </GridArea>
  );
}

const cameraOff={
    width: '60%',
    height: 'fit-content',
    margin: 'auto',
    color: 'gray',
    maxWidth: '150px',
    };