import React from "react";
import styled from "styled-components";
import cores from "./Cores";

const Card = styled.div`
  background: ${cores.backgroundBox};
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    border-color: ${cores.cor3};
  }
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color || cores.cor3};
  color: white;
  font-size: 24px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.span`
  font-size: 13px;
  color: ${cores.corTextoClaro};
  margin-bottom: 4px;
`;

const Value = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: ${cores.corTexto};
`;

const Indicator = styled.div`
  margin-left: auto;
  font-size: 11px;
  color: ${props => props.type === 'good' ? cores.corDisponivel : cores.corTextoClaro};
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
`;

function SubStatCard({ icon: Icon, title, value, color, indicator, indicatorType }) {
  return (
    <Card>
      <IconWrapper color={color}>
        {Icon && <Icon />}
      </IconWrapper>
      <Content>
        <Title>{title}</Title>
        <Value>{value}</Value>
      </Content>
      {indicator && <Indicator type={indicatorType}>{indicator}</Indicator>}
    </Card>
  );
}

export default SubStatCard;
