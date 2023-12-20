import { Avatar, Button, Col, Divider, Drawer, Input, Row, Select } from "antd"
import { DrawnerProps } from "."
import styled from "styled-components";
import { useState } from "react";
import { useMutation } from "react-query";
import { getListUser } from "../../midleware/api/user";
import { useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import InfiniteScroll from 'react-infinite-scroll-component';

type UserData = {
  avatar: string;
  email: string;
  name: string;
  userId: number;
}

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
    margin: 20px 0px 10px 0px;
  }
  .listUser {
    button {
      width: 100%;
      margin: 10px 0px;
      height: fit-content;
      padding: 10px 30px;
    }
  }
`;

const SearchDrawner = (props: DrawnerProps) => {
  const { isOpen, onClose } = props;
  const [type, setType] = useState('name');
  const [listUser, setListUser] = useState<UserData[]>([]);
  const navigate = useNavigate();

  const handleChange = (value: string) => {
    setType(value);
  }

  const handleSearch = (value: string) => {
    const filter = {
      id: type === 'id' ? value : '',
      name: type === 'name' ? value : ''
    };
    getListUserMutation.mutate(filter);
  }

  const getListUserMutation = useMutation(getListUser, {
    onSuccess: (data) => {
      setListUser(data);
    }
  })

  const selectBefore = (
    <Select defaultValue="name" onChange={handleChange} style={{ width: 80 }}>
      <Select.Option value="name">Name</Select.Option>
      <Select.Option value="id">ID</Select.Option>
    </Select>
  );

  const handleClick = (id: number) => {
    navigate(`/profile/${id}`);
  }

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
      <div className="listUser">
        {/* {listUser.map((userInfo: UserData) => (
          <Button type="text" key={userInfo.userId} onClick={() => handleClick(userInfo.userId)}>
            <Row>
              <Col>
                <Avatar size={64} icon={<UserOutlined />} src={userInfo.avatar.length ? userInfo.avatar : null} />
              </Col>
              <Col flex="auto" style={{ padding: "10px" }}>
                <Row style={{ height: "50%", alignItems: "center" }}>{userInfo.name}<b>#{userInfo.userId}</b></Row>
                <Row style={{ height: "50%", alignItems: "center" }}><i>{userInfo.email}</i></Row>
              </Col>
            </Row>
          </Button>
        ))} */} 
      </div>
    </StyledDrawner>
  )
}

export default SearchDrawner;
