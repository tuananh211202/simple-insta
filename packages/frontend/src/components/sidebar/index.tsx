import { Menu, MenuProps } from "antd";
import React, { useState } from "react";
import { MenuUnfoldOutlined, MenuFoldOutlined, HomeOutlined, SearchOutlined, MessageOutlined, HeartOutlined, PlusSquareOutlined, ProfileOutlined, LogoutOutlined } from "@ant-design/icons";
import { SideBarContainer } from "./style";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

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
  const [selectedKey, setSelectedKey] = useState('1');
  const navigate = useNavigate();
  const { dispatch: authDispatch } = useAuth();

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
      case 'messages':
      case 'profile':
        setSelectedKey(keys.key); 
        navigate(keys.key);
        return;
      case 'search':
      case 'notifications':
        return;
      case 'create':
        return;
      case 'logout':
        authDispatch({ type: 'LOGOUT' });
        navigate('signin');
        return;
      default:
        break;
    };
  }

  return (
    <SideBarContainer>
      <Menu
        inlineCollapsed={collapsed}
        items={items}
        onClick={onClick}
        mode="inline"
        selectedKeys={[ selectedKey ]}
      />
    </SideBarContainer>
  )
}

export default SideBar;