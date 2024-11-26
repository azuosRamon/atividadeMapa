import React, { useState } from "react";
import styled from "styled-components";
import Container from "./SubContainer";
import Box from "./SubBox";
import Input from "./SubInput";
import Button from "./SubButton";
import ParagrafoInformacao from "./SubParagrafo";
import SpamSublinhado from "./SubSpam"


const Title = styled.h2`
margin: 0 0 20px;
color: white;
`;

function Recuperar_senha(){
    const [matricula, confMatricula] = useState();
    const enviarEmail = (event)=>{
        event.preventDefault();
        if (matricula > 0){
          return  alert("Link para recuperar senha enviado no email cadastrado!");
        } 
        alert("Preencha com a matricula!");
    }
    return(
        <Container>
            <Box>
                <Title>Recuperar senha</Title>
                <form onSubmit={enviarEmail}>
                    <Input 
                        type="number" 
                        value={matricula}
                        onChange={(e) => confMatricula(e.target.value)}
                        placeholder="Matrícula" 
                        required/>
                    <Button type="submit">Recuperar</Button>
                </form>
                <ParagrafoInformacao>Ainda não tem uma conta?</ParagrafoInformacao>
                <ParagrafoInformacao>Envie um email para:<SpamSublinhado>email@mail.com.br</SpamSublinhado></ParagrafoInformacao>
            </Box>
        </Container>
    )
}


export default Recuperar_senha;