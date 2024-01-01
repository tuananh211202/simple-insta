import { Menu, MenuProps } from "antd";
import React, { useEffect, useState } from "react";
import { MenuUnfoldOutlined, MenuFoldOutlined, HomeOutlined, SearchOutlined, MessageOutlined, HeartOutlined, PlusSquareOutlined, ProfileOutlined, LogoutOutlined } from "@ant-design/icons";
import { SideBarContainer } from "./style";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import PageDrawner from "../drawner";
import Cookies from 'js-cookie';

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

  const items: MenuItem[] = [
    getItem('Collapse', 'collapse', collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />),
    getItem('Home', 'home', <HomeOutlined />),
    getItem('Search', 'search', <SearchOutlined />),
    getItem('Messages', 'messages', <MessageOutlined />),
    getItem('Notifications', 'notifications', <HeartOutlined />),
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
      case 'profile':
        setSelectedKey(keys.key); 
        navigate(`/profile/${currentUser.userId}`);
        return;
      case 'search':
      case 'notifications':
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