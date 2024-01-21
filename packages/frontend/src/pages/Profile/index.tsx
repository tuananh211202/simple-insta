import { useLocation } from "react-router-dom";
import { numberValidator } from "../../utils/validator/number-validator";
import Page404 from "../404";
import styled from "styled-components";
import { FriendRequestApi, ImageApi, PostApi, UserApi } from "../../midleware/api"; 
import { useMutation, useQuery } from "react-query";
import { Avatar, Button, Col, Form, Input, Modal, Row, message } from "antd";
import { EditOutlined, SaveOutlined, UserOutlined, StopOutlined, PlusOutlined, MinusOutlined, CheckOutlined, CloseOutlined, FileImageOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import LoadingPage from "../LoadingPage";
import { socket } from "../../routes/user-routes";
import { BASE_URL } from "../../midleware/api/constants";
import { useModal } from "../../context/modal-context";

// eslint-disable-next-line react-refresh/only-export-components
export enum Relation {
  none = 'None',
  friend = 'Friend',
  sender = 'Sender',
  receiver = 'Receiver',
}

type PostType = {
  postId: number;
  create_at: string;
  imageUrl: string;
  description: string;
  mode: string;
  comment: {commentId: number}[];
  reacts: {reactId: number}[];
};

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
  .friendsContainer {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    border-radius: 6px;
    height: fit-content;
    max-height: 50vh;
  }
  .ant-form-item {
    margin-bottom: 5px;
  }
  .postsContainer {
    padding: 10px;
    height: 100%;
    overflow-y: auto;
  }
  .postContainer {
    width: 90%;
    margin: 5px 5%;
    border-radius: 5px;
  }
  .postContainer:hover {
    cursor: pointer;
    border: solid;
    border-color: #2977ff;
    border-width: 2px;
    width: calc(90% - 4px);
  }
`;

const ProfilePage = () => {
  const location = useLocation();
  const userId = numberValidator(location.pathname.slice(9));
  const [onEdit, setOnEdit] = useState(false);
  const [form] = Form.useForm();
  const currentUser = JSON.parse(Cookies.get('user') ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<any>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [posts, setPosts] = useState<PostType[]>([]);
  const { dispatch } = useModal();

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

  const { data: userData, refetch, isLoading } = useQuery(['userData', userId], () => UserApi.getUserById(userId));

  const { data: friendRequest, refetch: relationRefetch } = useQuery(
    ['relation', userId], 
    () => FriendRequestApi.getRelation(userId),
  );

  const getIcon = (rel: Relation) => {
    if(rel === Relation.friend) return <MinusOutlined />;
    if(rel === Relation.receiver) return <CheckOutlined />;
    if(rel === Relation.sender) return <CloseOutlined />;
    return <PlusOutlined />;
  }

  const actionRequestMutation = useMutation(FriendRequestApi.actionRequest, {
    onSuccess: () => {
      relationRefetch();
    }
  });

  const uploadImageMutation = useMutation(ImageApi.uploadImage, {
    onSuccess: (data) => {
      updateDataMutation.mutate({avatar: data.path});
      message.success('Update avatar successfully!');
    }
  });

  const updateDataMutation = useMutation(UserApi.updateUser, {
    onSuccess: () => {
      refetch();
    }
  });

  const getListMutation = useMutation(PostApi.getList, {
    onSuccess: (data, variables) => {
      if(variables.page === 1) setPosts([...data]);
      else setPosts([
        ...posts,
        ...data,
      ]);
    }
  })

  const onSave = () => {
    updateDataMutation.mutate(form.getFieldsValue());
    message.success('Update profile successfully!');
    setOnEdit(false);
  }

  const handleSendRequest = () => {
    actionRequestMutation.mutate({ userId, current: friendRequest });
    socket.emit('sendUserId', userId);
  }

  const handleCancel = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsOpen(false);
  }

  const handleOk = () => {
    const formData = new FormData();
    formData.append('image', file);
    uploadImageMutation.mutate(formData);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsOpen(false);
  }

  useEffect(() => {
    if(onEdit) form.setFieldsValue(userData);
  }, [form, onEdit, userData]);

  useEffect(() => {
    getListMutation.mutate({ page: 1, pageSize: 20, userId });
  }, [userId]);
  
  if(isLoading) return <LoadingPage />;

  if(!userData?.userId) return <Page404 />;

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
        <Col span={24}>
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
                    : <Button onClick={handleSendRequest} icon={getIcon(friendRequest)} />
                  }
                </div>
              </Form>
            </Col>
          </Row>
          <Row
            style={{
              width: '100%',
              height: 'calc(88vh - 200px)',
            }}
          >
            <Col span={8} className="postsContainer">
              {posts.filter((_post, index) => index % 3 === 0).map(post => (
                  <img 
                    src={!post.imageUrl.length ? undefined : `${BASE_URL}/image/${post.imageUrl}`} 
                    className="postContainer"
                    onClick={() => dispatch({ type: 'OPEN_POST_MODAL', payload: { postId: post.postId } })}
                  />
                )
              )}
            </Col>
            <Col span={8} className="postsContainer">
              {posts.filter((_post, index) => index % 3 === 1).map(post => (
                  <img 
                    src={!post.imageUrl.length ? undefined : `${BASE_URL}/image/${post.imageUrl}`} 
                    className="postContainer"
                    onClick={() => dispatch({ type: 'OPEN_POST_MODAL', payload: { postId: post.postId } })}
                  />
                )
              )}
            </Col>
            <Col span={8} className="postsContainer">
              {posts.filter((_post, index) => index % 3 === 2).map(post => (
                  <img 
                    src={!post.imageUrl.length ? undefined : `${BASE_URL}/image/${post.imageUrl}`} 
                    className="postContainer"
                    onClick={() => dispatch({ type: 'OPEN_POST_MODAL', payload: { postId: post.postId } })}
                  />
                )
              )}
            </Col>
          </Row>
        </Col>
      </Row>
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
      </Modal>
    </PageContainer>
  );
}

export default ProfilePage;