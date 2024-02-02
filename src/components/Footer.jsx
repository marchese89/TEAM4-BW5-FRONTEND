import React from "react";
import styled from "styled-components";

const StyledFooter = styled.footer`
  background-color: #03999e7d;
  color: white;
  padding-top: 10px;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
`;

export default function Footer() {
  return (
    <StyledFooter>
      <p>&copy; 2024 Epic-Enirgy Service. Tutti i diritti riservati.</p>
    </StyledFooter>
  );
}
