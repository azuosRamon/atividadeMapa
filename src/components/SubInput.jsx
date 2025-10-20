import styled from "styled-components";
import cores from "./Cores";
import InputMask from "react-input-mask";


const EstiloInput = styled.input`
width: 100%;
height: 40px;
padding: 10px;
margin: 10px 0;
border: 1px solid #000;
border-radius: 3px;
font-size: 16px;
box-sizing: border-box;
color: ${(props) => props.$color || cores.corTextoClaro};
background-color: ${cores.backgroundInput};
display: flex;
&:hover{
    background-color: #222;
    transition: .5s;
}
&::placeholder{
    color: ${cores.corTexto};
}
&:focus{
    background-color: ${cores.corFocus};
    color: ${cores.corWhite};
    transition: .5s;
}

`;

const Input = ({ mask, value, onChange, ...rest }) => {
  if (mask) {
    // ✅ Passa as props diretamente para InputMask
    return (
      <InputMask mask={mask} value={value} onChange={onChange} {...rest}>
        {/* ❌ NÃO repassar props como disabled/value/onChange aqui */}
        {(inputProps) => <EstiloInput {...inputProps} />}
      </InputMask>
    );
  }

  // Se não tiver máscara, usa o input normal
  return <EstiloInput value={value} onChange={onChange} {...rest} />;
};


export default Input;