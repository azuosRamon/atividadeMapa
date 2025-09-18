import styled from "styled-components";
import cores from "./Cores";

const Label = styled.label`
    display: block;
    text-transform: uppercase;
    font-size: 12px;
    margin-bottom: 5px;
    font-weight: bold;
    color: ${cores.corTextoClaro};
    text-align: left;
`;
export default Label;