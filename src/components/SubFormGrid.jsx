import styled from "styled-components";

const FormGrid = styled.form`
display: grid;
grid-template-columns: 1fr 1fr 1fr;
grid-template-areas: 
"nome sobrenome telefone"
"nascimento cpf matricula"
"email email email"
"senhaAtual . ."
"senhaAtual senhaNova confirmarSenha"
". . botoes"

@media (min-width: 481px) and (max-width: 968px) {
    grid-template-columns: 1fr;
    grid-template-areas: 
        "nome" "sobrenome" "telefone"
        "nascimento" "cpf" "matricula"
        "email"
        "senhaAtual"
        "senhaAtual" "senhaNova" "confirmarSenha"
        "botoes"
}
`;