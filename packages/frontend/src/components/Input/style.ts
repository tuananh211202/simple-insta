import { createGlobalStyle } from "styled-components";

export const InputGlobalStyles = createGlobalStyle`

  input {
    border-width: 0px 0px 2px 0px;
    padding: 10px 0px;
    outline: none;
    width: 100%;
    border-color: #e0e0e0;
    font-family: 'Poppins';
    font-size: 18px;
    font-weight: 500;
    transition: border-bottom 1s ease;
  }
  
  input:focus {
    outline: none;
    border-width: 0px 0px 2px 0px;
    border-color: #57b846;
  }

  .ant-form-item-label {
    margin: 0px;
    padding: 0px !important;
    font-size: 16px;
    font-weight: 500;
    label {
      color: #555 !important;
    }
  }

`;
