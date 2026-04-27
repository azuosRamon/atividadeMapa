import React, { useState } from 'react';
import styled from 'styled-components';
import Button from './SubButton';
import cores from './Cores';
import Input from './SubInput';

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  padding: 16px;
  background-color: ${cores.backgroundColapse};
`;

const CardBox = styled.div`
  background-color: ${cores.backgroundBox};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CardContent = styled.div`
  margin-bottom: 16px;
`;

const FieldRow = styled.div`
  margin-bottom: 8px;
  font-size: 14px;
  color: ${cores.corTexto};
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 4px;
  display: flex;
  flex-direction: column;

  &:last-child {
      border-bottom: none;
  }
`;

const FieldLabel = styled.span`
  font-weight: bold;
  color: ${cores.corTextoClaro};
  font-size: 12px;
  text-transform: uppercase;
`;

const FieldValue = styled.span`
  margin-top: 2px;
  word-break: break-word;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`;

function SubCardsConsulta({ dados, listaColunas, setObjeto, setOperacao, onAction }) {
  const [busca, setBusca] = useState("");

  if (!dados || dados.length === 0) {
    return <div style={{ padding: '16px', color: '#fff' }}>Nenhum dado cadastrado encontrado.</div>;
  }

  // Filtrar dados da busca
  const dadosFiltrados = dados.filter(item => 
      listaColunas.some(coluna => String(item[coluna] || "").toLowerCase().includes(busca.toLowerCase()))
  );

  // Ocultar IDs visuais
  const colunasFiltradas = listaColunas.filter(coluna => !coluna.toLowerCase().endsWith('id'));

  const handleEdit = (item) => {
    setObjeto({ ...item });
    setOperacao("2");
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onAction) onAction();
  };

  const handleDelete = (item) => {
    setObjeto({ ...item });
    setOperacao("3");
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onAction) onAction();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 16px 0 16px' }}>
         <Input 
            placeholder="Pesquisar..." 
            value={busca} 
            onChange={(e) => setBusca(e.target.value)} 
         />
      </div>
      <CardsContainer>
        {dadosFiltrados.map((item, index) => (
          <CardBox key={index}>
            <CardContent>
              {colunasFiltradas.map((coluna) => (
              <FieldRow key={coluna}>
                <FieldLabel>{coluna}</FieldLabel>
                <FieldValue>{item[coluna] !== null && item[coluna] !== undefined && item[coluna] !== "" ? String(item[coluna]) : "-"}</FieldValue>
              </FieldRow>
            ))}
          </CardContent>
          <ButtonRow>
            <Button 
                onClick={(e) => { e.preventDefault(); handleEdit(item); }} 
                $bgcolor={cores.corEditar} 
                style={{ flex: 1 }}
                type="button"
            >
              Editar
            </Button>
            <Button 
                onClick={(e) => { e.preventDefault(); handleDelete(item); }} 
                $bgcolor={cores.corDeletar} 
                style={{ flex: 1 }}
                type="button"
            >
              Excluir
            </Button>
          </ButtonRow>
          </CardBox>
        ))}
      </CardsContainer>
    </div>
  );
}

export default SubCardsConsulta;
