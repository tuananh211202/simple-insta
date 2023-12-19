import { Divider, Drawer, Input, Select } from "antd"
import { DrawnerProps } from "."
import styled from "styled-components";
import { useState } from "react";

const StyledDrawner = styled(Drawer)`
  /* background-color: #000 !important;
  color: #fff; */
  padding: 0px 10px;
  font-family: Poppins;
  .header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    height: 50px;
  }
  .ant-divider {
    padding: 0;
    margin: 0;
    /* background-color: #fff; */
  }
  .search-box {
    width: 100%;
    margin: 20px 0px;
  }
`;

const SearchDrawner = (props: DrawnerProps) => {
  const { isOpen, onClose } = props;
  const [type, setType] = useState('name');

  const handleChange = (value: string) => {
    setType(value);
  }

  const handleSearch = (value: string) => {
    console.log(value);
  }

  const selectBefore = (
    <Select defaultValue="name" onChange={handleChange}>
      <Select.Option value="name">Name</Select.Option>
      <Select.Option value="id">ID</Select.Option>
    </Select>
  );

  return (
    <StyledDrawner 
      open={isOpen} 
      onClose={onClose}
      closeIcon={false}
    >
      <div className="header">Search</div>
      <Divider />
      <div className="search-box">
        <Input.Search 
          addonBefore={selectBefore} 
          placeholder={`Input ${type}`}
          onSearch={handleSearch}
        />
      </div>
    </StyledDrawner>
  )
}

export default SearchDrawner;
