import styled from "styled-components";

export const SignInContainer = styled.div`
  height: 95vh;
  display: flex;
  justify-content: center;
  .formContainer {
    height: 100%;
    min-width: 400px;
    display: flex;
    align-items: center;
    position: relative;
  }
  .loginBtn {
    width: 100%;
    color: #fff;
    background-color: #57b846;
    height: 50px;
    border-radius: 25px;
    margin: 25px 0px 0px 0px;
    font-weight: 600;
    font-size: 16px;
    &:hover {
      background-color: #333;
    }
  }
  .fieldContainer {
    width: 100%;
  }

  .textContainer {
    position: absolute;
    width: 100%;
    top: 20px;
    display: flex;
    justify-content: center;
    & span {
      font-size: 50px;
      font-weight: 600;
    }
  }

  .navigateContainer {
    position: absolute;
    width: 100%;
    bottom: 0;
    margin: 10px 0px 0px 0px;
    & li {
      & span {
        font-size: 18px;
        color: #999;
        & a {
          color: #57b846;
          &:hover {
            color: #333;
          }
        }
      }
      &::marker {
        color: #57b846;
      }
    }
  }
`;