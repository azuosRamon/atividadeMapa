import React from "react";
import Header from "./components/Header";
import Usuario_logado from "./components/pages/Usuario_logado";
import Footer from "./components/Footer";
import styled from "styled-components";

const DivGrid2 = styled.div`
  max-width: 960px;
  margin: 20px auto;
  display: grid;
  grid-template-columns: 3fr 10fr;
  gap: 10px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    }
`;

const Section = styled.section`
    @media (max-width: 768px) {
    display: none;
    }
`;
const Aside = styled.aside`
    @media (max-width: 768px) {
        padding: 10px;
    }
`;


const LayoutLogado = ({ usuarioDados, children }) => (
  <div className="corpo">
    <Header />
    <DivGrid2>
      <Section>
        <Usuario_logado />
      </Section>
      <Aside>{children}</Aside>
    </DivGrid2>
    <Footer />
  </div>
);

export default LayoutLogado;