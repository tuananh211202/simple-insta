import styled from "styled-components";

export const SideBarContainer = styled.div`
  ul {
    height: 100vh;
    padding: 10px 0px;
    position: relative;

    li {
      margin: 10px 0px;
      &:last-child { 
        position: absolute !important;
        bottom: 0;
      }
    }
  }
`;