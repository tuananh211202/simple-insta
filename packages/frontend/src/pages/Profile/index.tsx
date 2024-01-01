import { useLocation } from "react-router-dom";
import { numberValidator } from "../../utils/validator/number-validator";
import Page404 from "../404";
import styled from "styled-components";
import { UserApi } from "../../midleware/api"; 
import { useMutation, useQuery } from "react-query";
import { Avatar, Button, Col, Form, Input, Row } from "antd";
import { EditOutlined, SaveOutlined, UserOutlined, StopOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

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

  const { data: userData, refetch } = useQuery(['userData', userId], () => UserApi.getUserById(userId));

  const updateDataMutation = useMutation(UserApi.updateUser, {
    onSuccess: () => {
      refetch();
    }
  })

  const onSave = () => {
    updateDataMutation.mutate(form.getFieldsValue());
    setOnEdit(false);
  }

  useEffect(() => {
    if(onEdit) form.setFieldsValue(userData);
  }, [onEdit]);
  
  if(!userData?.userId) return <Page404 />;

  return (
    <PageContainer>
      <div className="header">
        <Row className="container">
          <Col>
            <Avatar icon={<UserOutlined />} size={48} src={!userData.avatar.lenght ? undefined : userData.avatar} />
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
              <Avatar shape="square" size={200} icon={<UserOutlined />} src={!userData.avatar.lenght ? undefined : userData.avatar} />
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
                    onEdit ? ( 
                      <>
                        <Button icon={<StopOutlined />} style={{ marginRight: '6px' }} onClick={() => setOnEdit(false)} />
                        <Button icon={<SaveOutlined />} onClick={onSave} />
                      </>
                    ) : <Button icon={<EditOutlined />} onClick={() => setOnEdit(true)} />
                  }
                </div>
              </Form>
            </Col>
          </Row>
        </Col>
        <Col span={6} offset={1}>d</Col>
      </Row>
    </PageContainer>
  );
}

export default ProfilePage;