import styled from "styled-components";

const Select = styled.select`
margin: 10px 0;
border: 1px solid #000;
width: 100%;
height: 40px;
padding: 10px;
color: white;
border-radius: 5px;
font-size: 16px;
cursor: pointer;
background-color: #333;
&:hover{
    background-color: #222;
    transition: .5s;
}

`;

export default Select;