import { Avatar, Button, Divider, Drawer, Input, List } from "antd"
import { DrawnerProps } from "."
import styled from "styled-components";
import { MessageOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { FriendRequestApi } from "../../midleware/api";
import { socket } from "../../routes/user-routes";

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
    margin-top: 16px;
    position: absolute;
    bottom: 0;
    width: 100%;
    button {
      width: 50%;
      height: 60px;
      border-radius: 0;
    }
  }
`;

const MessagesDrawner = (props: DrawnerProps) => {
  const { isOpen, onClose } = props;
  const [choosen, setChoosen] = useState('friends');
  const [filter, setFilter] = useState('');
  const [actives, setActives] = useState<number[]>();

  const { data: listFriend } = useQuery(['getListFriend'], FriendRequestApi.getListFriend);

  const handleClick = (userId: number) => {
    console.log(userId);
  }

  useEffect(() => {
    socket.emit('getOnline');
    
    socket.on('listOnline', (data) => {
      setActives(data);
    })

    return () => {
      socket.off('listOnline');
    };
  },[])

  return (
    <StyledDrawner 
      open={isOpen} 
      onClose={onClose}
      closeIcon={false}
    >
      <div className="header">Messages</div>
      <Divider />
      <div className="contentContainer" style={{ height: 'calc(100vh - 126px)' }}>
        {choosen === "friends" && 
          <>
            <div style={{ padding: '16px' }}>
              <Input.Search placeholder="Input name" onSearch={(value) => setFilter(value)} />
            </div>
            <div style={{ padding: '0 16px', height: 'calc(100% - 64px)', overflow: 'auto' }}>
              <List 
                dataSource={(listFriend ?? []).filter((friend: { name: string, userId: number, avatar: string }) => friend.name.includes(filter))}
                renderItem={(friend: { name: string, userId: number, avatar: string }) => (
                  <List.Item key={friend.userId}>
                    <List.Item.Meta 
                      avatar={<Avatar src={friend.avatar} size={48} icon={<UserOutlined />} />}
                      title={<a onClick={() => handleClick(friend.userId)}>{friend.name}{` #${friend.userId}`}</a>}
                      description={actives?.includes(friend.userId) ? 'online' : 'offline'}
                    />
                  </List.Item>
                )}
              />
            </div>
          </>
        }
      </div>
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
