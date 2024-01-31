import styled from "styled-components";

const StyledClienti = styled.div`
  background-color: grey;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  flex-direction: column;
  width: 60%;
  h3 {
    text-align: center;
  }
`;
export default function Clienti() {
  return (
    <StyledClienti>
      <h3>Clienti</h3>
    </StyledClienti>
  );
}
