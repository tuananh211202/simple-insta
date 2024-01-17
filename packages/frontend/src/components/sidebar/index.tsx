import { Avatar, Input, Menu, MenuProps, Modal, Radio, RadioChangeEvent, Select, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { MenuUnfoldOutlined, MenuFoldOutlined, HomeOutlined, SearchOutlined, MessageOutlined, HeartOutlined, PlusSquareOutlined, ProfileOutlined, LogoutOutlined, HeartFilled, MessageFilled, FileImageOutlined } from "@ant-design/icons";
import { SideBarContainer } from "./style";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import PageDrawner from "../drawner";
import Cookies from 'js-cookie';
import { socket } from "../../routes/user-routes";
import { useMutation, useQuery } from "react-query";
import { ImageApi, NotiApi, PostApi } from "../../midleware/api";

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
  const [hasMessage, setHasMessage] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<any>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [mode, setMode] = useState('normal');
  const [description, setDescription] = useState('');

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
  });

  const uploadPostMutation = useMutation(PostApi.uploadPost);

  const uploadImageMutation = useMutation(ImageApi.uploadImage, {
    onSuccess: (data) => {
      console.log(data);
      uploadPostMutation.mutate({
        imageUrl: data.path,
        mode,
        description
      })
    }
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFile = event.target.files && event.target.files[0];
    if (uploadFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const image = new Image();
        image.src = reader.result as string;

        image.onload = () => {
          setPreviewUrl(reader.result as string);
          setFile(uploadFile);
        }
      }

      reader.readAsDataURL(uploadFile);
    } else setPreviewUrl('');
  };

  const handleCancel = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsOpen(false);
  }

  const handleOk = () => {
    if(!file || !description.length) message.error('Please fill out all fields completely!');
    else {
      const formData = new FormData();
      formData.append('image', file);
      uploadImageMutation.mutate(formData);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsOpen(false);
    }
  }

  const handleChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  }

  const items: MenuItem[] = [
    getItem('Collapse', 'collapse', collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />),
    getItem('Home', 'home', <HomeOutlined />),
    getItem('Search', 'search', <SearchOutlined />),
    getItem('Messages', 'messages', hasMessage ? <MessageFilled /> : <MessageOutlined />),
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
        setHasMessage(false);
        setSelectedKey(keys.key);
        setIsDrawnerOpen(true);
        return;
      case 'create':
        setIsOpen(true);
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

    socket.on('receiveMessage', (data) => {
      if(data.message === 'You have new messages!') {
        setHasMessage(true);
      }
    })

    return () => {
      socket.off('receiveUserId');
      socket.off('receiveMessage');
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
      <Modal
        open={isOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        centered
        closeIcon={false}
      >
        <div style={{ width: '100%', aspectRatio: 1, marginBottom: '20px', borderRadius: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {previewUrl.length 
            ? <Avatar src={previewUrl} shape="square" style={{ width: '100%', height: '100%' }} />
            : <FileImageOutlined style={{ fontSize: '50px' }} />
          }
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onChange} />
        <Radio.Group onChange={handleChange} value={mode} style={{ width: '100%', marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
          <Radio value='private'>Private</Radio>
          <Radio value='normal'>Normal</Radio>
          <Radio value='public'>Public</Radio>
        </Radio.Group>
        <Input.TextArea style={{ marginTop: '10px' }} value={description} onChange={handleInput} />
      </Modal>
    </SideBarContainer>
  )
}

export default SideBar;