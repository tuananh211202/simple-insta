import { useLocation } from "react-router-dom";
import { numberValidator } from "../../utils/validator/number-validator";
import Page404 from "../404";
import styled from "styled-components";
import { FriendRequestApi, ImageApi, UserApi } from "../../midleware/api"; 
import { useMutation, useQuery } from "react-query";
import { Avatar, Button, Col, Form, Input, Modal, Row, message } from "antd";
import { EditOutlined, SaveOutlined, UserOutlined, StopOutlined, PlusOutlined, MinusOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import LoadingPage from "../LoadingPage";
import { socket } from "../../routes/user-routes";
import { BASE_URL } from "../../midleware/api/constants";

// eslint-disable-next-line react-refresh/only-export-components
export enum Relation {
  none = 'None',
  friend = 'Friend',
  sender = 'Sender',
  receiver = 'Receiver',
}

const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  .header {
    width: 100%;
    height: 6vh;
    background: linear-gradient(to right, #00ff00, #ffefad);
    margin-bottom: 4vh;
    position: relative;
    .container {
      width: 90%;
      position: absolute;
      top: 1vh;
      left: 5%;
      height: 8vh;
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      padding: 0 20px;
      display: flex;
      align-items: center;
      .info {
        padding: 0px 20px;
        div {
          height: 50%;
          width: 100%;
          font-weight: 500;
          font-size: 18px;
        }
      }
    }
  }
  .contentContainer {
    position: absolute;
    top: 12vh;
    height: 88vh;
    width: 90%;
  }
  .infoBox {
    width: 100%;
    height: 200px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    .avatarContainer {
      span {
        border-radius: 6px 0px 0px 6px;
      }
      position: relative;
    }
    .formContainer {
      height: 100%;
      padding: 6px;
      .form {
        width: 100%;
        height: 100%;
        position: relative;
        .formController {
          position: absolute;
          bottom: 0;
          right: 0;
        }
      }
    }
  }
  .ant-form-item {
    margin-bottom: 5px;
  }
`;

const ProfilePage = () => {
  const location = useLocation();
  const userId = numberValidator(location.pathname.slice(9));
  const [onEdit, setOnEdit] = useState(false);
  const [form] = Form.useForm();
  const currentUser = JSON.parse(Cookies.get('user') ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [file, setfile] = useState<any>();

  const onChange = (file: any) => {
    const { files } = file.target;
    if (files && files.length !== 0) {
      setfile(files[0]);
    }
  };

  const { data: userData, refetch, isLoading } = useQuery(['userData', userId], () => UserApi.getUserById(userId));

  const { data: friendRequest, refetch: relationRefetch } = useQuery(['relation', userId], () => FriendRequestApi.getRelation(userId));

  const uploadImageMutation = useMutation(ImageApi.uploadImage, {
    onSuccess: (data) => {
      console.log(data);
      updateDataMutation.mutate({avatar: data.path});
    }
  });

  const updateDataMutation = useMutation(UserApi.updateUser, {
    onSuccess: () => {
      refetch();
    }
  });

  const onSave = () => {
    updateDataMutation.mutate(form.getFieldsValue());
    message.success('Update profile successfully!');
    setOnEdit(false);
  }

  const handleSendRequest = () => {
    socket.emit('sendUserId', userId);
    relationRefetch();
  }

  const handleOk = () => {
    const formData = new FormData();
    formData.append('image', file);
    uploadImageMutation.mutate(formData);
    setIsOpen(false);
  }

  useEffect(() => {
    if(onEdit) form.setFieldsValue(userData);
  }, [form, onEdit, userData]);

  useEffect(() => {
    socket.on('receiveUserId', (receivedId) => {
      console.log('Received Id from server:', receivedId);
    });

    return () => {
      socket.off('receiveUserId');
    };
  }, []);
  
  if(isLoading) return <LoadingPage />;

  if(!userData?.userId) return <Page404 />;

  const getRelationIcon = () => {
    if(friendRequest === Relation.none) return <PlusOutlined />;
    if(friendRequest === Relation.friend) return <MinusOutlined />;
    if(friendRequest === Relation.receiver) return <CheckOutlined />;
    if(friendRequest === Relation.sender) return <CloseOutlined />;
    return <></>;
  }

  return (
    <PageContainer>
      <div className="header">
        <Row className="container">
          <Col>
            <Avatar icon={<UserOutlined />} size={48} src={!userData.avatar.length ? undefined : `${BASE_URL}/image/${userData.avatar}`} />
          </Col>
          <Col flex="auto" className="info">
            <Row>{userData.name}</Row>
            <Row>{`ID: ${userData.userId}`}</Row>
          </Col>
        </Row>
      </div>
      <Row className="contentContainer">
        <Col span={17}>
          <Row className="infoBox">
            <Col className="avatarContainer">
              <Avatar shape="square" size={200} icon={<UserOutlined />} src={!userData.avatar.length ? undefined : `${BASE_URL}/image/${userData.avatar}`} />
              {currentUser.userId === userId && <Button icon={<EditOutlined />} style={{ position: 'absolute', bottom: 6, right: 6, backgroundColor: 'transparent', borderColor: 'transparent' }} onClick={() => setIsOpen(true)} />}
            </Col>
            <Col flex="auto" className="formContainer">
              <Form className="form" form={form}>
                <Form.Item name="name">
                  {onEdit ? <Input size="large" /> : <div style={{ fontSize: '16px', fontWeight: 500 }}>{userData.name}</div>}
                </Form.Item>
                <Form.Item name="id" label="ID">
                  {userData.userId}
                </Form.Item>
                <Form.Item name="email" label="Email">
                  {userData.email}
                </Form.Item>
                <Form.Item name="description" label="Description">
                  {onEdit ? <Input /> : userData.description}
                </Form.Item>
                <div className="formController">
                  {
                    currentUser.userId === userId ?
                    onEdit ? ( 
                      <>
                        <Button icon={<StopOutlined />} style={{ marginRight: '6px' }} onClick={() => setOnEdit(false)} />
                        <Button icon={<SaveOutlined />} onClick={onSave} />
                      </>
                    ) : <Button icon={<EditOutlined />} onClick={() => setOnEdit(true)} />
                    : <Button icon={getRelationIcon()} onClick={handleSendRequest} />
                  }
                </div>
              </Form>
            </Col>
          </Row>
        </Col>
        <Col span={6} offset={1}>d</Col>
      </Row>
      <Modal
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        onOk={handleOk}
        centered
      >
        <input type="file" onChange={onChange} />
      </Modal>
    </PageContainer>
  );
}

export default ProfilePage;