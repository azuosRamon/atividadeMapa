import styled from "styled-components";

const Box = styled.div`
    min-width: 350px;
    height: auto;
    padding: 5%;
    background-color: rgba(0,0,0,0.85);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    border-radius: 10px;
    text-align: center;
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
`;

export default Box;