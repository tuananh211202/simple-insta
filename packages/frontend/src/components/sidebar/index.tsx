import { Menu, MenuProps } from "antd";
import React, { useEffect, useState } from "react";
import { MenuUnfoldOutlined, MenuFoldOutlined, HomeOutlined, SearchOutlined, MessageOutlined, HeartOutlined, PlusSquareOutlined, ProfileOutlined, LogoutOutlined, HeartFilled } from "@ant-design/icons";
import { SideBarContainer } from "./style";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import PageDrawner from "../drawner";
import Cookies from 'js-cookie';
import { socket } from "../../routes/user-routes";
import { useMutation, useQuery } from "react-query";
import { NotiApi } from "../../midleware/api";

type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem,
  type?: 'group',
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const SideBar = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedKey, setSelectedKey] = useState('');
  const [isDrawnerOpen, setIsDrawnerOpen] = useState(false);
  const navigate = useNavigate();
  const { state, dispatch: authDispatch } = useAuth();
  const location = useLocation();
  const currentUser = JSON.parse(Cookies.get('user') ?? '');
  const [hasNoti, setHasNoti] = useState(false);

  const { data: unread } = useQuery(
   ['hasUnreadNoti', hasNoti],
   NotiApi.getUnreadNoti,
   { 
    onSuccess: (data) => {
      setHasNoti(data);
    }
   }
  );

  const readNotiMutation = useMutation(NotiApi.readNoti, {
    onSuccess: () => {
      setHasNoti(false);
    }
  })

  const items: MenuItem[] = [
    getItem('Collapse', 'collapse', collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />),
    getItem('Home', 'home', <HomeOutlined />),
    getItem('Search', 'search', <SearchOutlined />),
    getItem('Messages', 'messages', <MessageOutlined />),
    getItem('Notifications', 'notifications', hasNoti ? <HeartFilled /> : <HeartOutlined />),
    getItem('Create', 'create', <PlusSquareOutlined />),
    getItem('Profile', 'profile', <ProfileOutlined />),
    getItem('Logout', 'logout', <LogoutOutlined />)
  ];

  const onClick: MenuProps['onClick'] = (keys) => {
    switch (keys.key){
      case 'collapse': 
        setCollapsed(!collapsed);
        setSelectedKey(selectedKey);
        return;
      case 'home':
        setSelectedKey(keys.key); 
        navigate('/home');
        return;
      case 'profile':
        setSelectedKey(keys.key); 
        navigate(`/profile/${currentUser.userId}`);
        return;
      case 'search':
        setSelectedKey(keys.key);
        setIsDrawnerOpen(true);
        return;
      case 'notifications':
        readNotiMutation.mutate();
        setSelectedKey(keys.key);
        setIsDrawnerOpen(true);
        return;
      case 'messages':
        setSelectedKey(keys.key);
        setIsDrawnerOpen(true);
        return;
      case 'create':
        return;
      case 'logout':
        authDispatch({ type: 'LOGOUT' });
        navigate('signin');
        return;
      default:
        break;
    }
  }

  const onDrawnerClose = () => {
    setIsDrawnerOpen(false);
    setSelectedKey(location.pathname.split('/')[1]);
  }

  useEffect(() => {
    setSelectedKey(location.pathname.split('/')[1]);
  }, [location.pathname]);

  useEffect(() => {
    socket.on('receiveUserId', (receivedId) => {
      setHasNoti(true);
    });

    return () => {
      socket.off('receiveUserId');
    };
  }, []);

  return (
    <SideBarContainer>
      <Menu
        inlineCollapsed={collapsed}
        items={items}
        onClick={onClick}
        mode="inline"
        selectedKeys={[ selectedKey ]}
        theme="dark"
      />
      <PageDrawner isOpen={isDrawnerOpen} onClose={onDrawnerClose} drawnerType={selectedKey} />
    </SideBarContainer>
  )
}

export default SideBar;