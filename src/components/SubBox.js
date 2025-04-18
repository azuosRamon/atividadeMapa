import styled from "styled-components";
import cores from "./Cores";

const Box = styled.div`
    min-width: 350px;
    height: auto;
    padding: 40px;
    background-color: ${cores.backgroundBox};
    box-shadow: 0 4px 8px ${cores.boxShadow};
    border-radius: 5px;
    text-align: center;
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    
    @media (max-width: 768px) {
        padding: 5%;
        min-width: 0px;
    }
`;

export default Box;