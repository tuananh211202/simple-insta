import { Button, Divider, Drawer, Input } from "antd"
import { DrawnerProps } from "."
import styled from "styled-components";
import { MessageOutlined, ProfileFilled, ProfileOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";

const StyledDrawner = styled(Drawer)`
  /* background-color: #000 !important;
  color: #fff; */
  font-family: Poppins;
  position: relative;
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
  .navBar {
    position: absolute;
    bottom: 0;
    width: 100%;
    button {
      width: 50%;
      height: 60px;
      border-radius: 0;
    }
  }
  .contentContainer {
    background-color: black;
  }
`;

const MessagesDrawner = (props: DrawnerProps) => {
  const { isOpen, onClose } = props;
  const [choosen, setChoosen] = useState('friends');

  return (
    <StyledDrawner 
      open={isOpen} 
      onClose={onClose}
      closeIcon={false}
    >
      <div className="header">Messages</div>
      <Divider />
      <div className="contentContainer" style={{ height: 'calc(100vh - 110px)' }}>s</div>
      <div className="navBar">
        <Button 
          icon={<UserOutlined />}
          type={choosen === "friends" ? "primary" : "default"}
          onClick={() => setChoosen('friends')}
          size="large"
        >
          Friends
        </Button>
        <Button 
          icon={<MessageOutlined />}
          type={choosen === "messages" ? "primary" : "default"}
          onClick={() => setChoosen('messages')}
          size="large"
        >
          Messages
        </Button>
      </div>
    </StyledDrawner>
  )
}

export default MessagesDrawner;
