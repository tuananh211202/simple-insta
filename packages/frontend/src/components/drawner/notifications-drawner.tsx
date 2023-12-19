import { Divider, Drawer, Input } from "antd"
import { DrawnerProps } from "."
import styled from "styled-components";

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

const NotificationsDrawner = (props: DrawnerProps) => {
  const { isOpen, onClose } = props;

  return (
    <StyledDrawner 
      open={isOpen} 
      onClose={onClose}
      closeIcon={false}
    >
      <div className="header">Notifications</div>
      <Divider />
      <div className="search-box">
        <Input.Search placeholder="Input name/id" />
      </div>
    </StyledDrawner>
  )
}

export default NotificationsDrawner;
