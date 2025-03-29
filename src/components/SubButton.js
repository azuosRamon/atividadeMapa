import styled from "styled-components";



const Button = styled.button`
margin-top: 10px;
width: 100%;
padding: 10px;
background-color:${(props) => props.$bgcolor || '#007bff'};
color: white;
border: none;
border-radius: 5px;
font-size: 16px;
cursor: pointer;

&:hover{
background-color:${(props) => props.$hovercolor || '#0056b3'};
}

@media (min-width: 481px) and (max-width: 968px) {
    height: fit-content;
}
`;
export default Button;