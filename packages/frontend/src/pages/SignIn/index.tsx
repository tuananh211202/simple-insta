import { Button, Form, Typography } from "antd";
import { SignInContainer } from "./style";
import CustomedInput from "../../components/Input";
import { validateEmail } from "../../utils/validator/email-validator";
import { validate8Character } from "../../utils/validator/password-validator";
import { useMutation, useQueryClient } from "react-query";
import { AuthApi } from "../../midleware/api";
import { useState } from "react";
import Cookies from 'js-cookie';

const { Text } = Typography;

const SignIn = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const [errorMessage, setErrorMessage] = useState<string>();

  const mutateLogin = useMutation(AuthApi.signIn, {
    onSuccess: (data) => {
      Cookies.set('accessToken', data.access_token);
      Cookies.set('user', JSON.stringify(data.user));
      queryClient.invalidateQueries('user');
    },
    onError: (error) => {
      if(error.response.status === 401){
        setErrorMessage('Wrong email or password!');
      }
    }
  });

  const onFinish = () => {
    const loginData = form.getFieldsValue();
    mutateLogin.mutate(loginData);
  }

  return (
    <SignInContainer>
      <div className="formContainer">
        
        <div className="fieldContainer">
          <Form layout="vertical" className="form" form={form} onFinish={onFinish}>
            <CustomedInput 
              placeholder="Email" 
              type="text" 
              rules={[
                { required: true, message: 'Please input your email!' },
                { validator: validateEmail, message: 'Invalid email!' }
              ]}
            />
            <CustomedInput 
              placeholder="Password" 
              type="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { validator: validate8Character, message: 'Password needs at least 8 characters!' }
              ]} 
            />
            <Form.Item>
              <Button htmlType="submit" className="loginBtn">
                LOGIN
              </Button>
            </Form.Item>
          </Form>
        </div>
        
        <div className="textContainer">
          <Text>Welcome</Text>
          {
            errorMessage &&
            <div className="errorContainer">
              <Text>{errorMessage}</Text>
            </div>
          }
        </div>

        <div className="navigateContainer">
          <ul>
            <li><Text>Forgot <a href="/forgotpassword">Password</a></Text></li>
            <li><Text>Don’t have an account? <a href="/signup">Sign up</a></Text></li>
          </ul>
        </div>

      </div>
    </SignInContainer>
  );
}

export default SignIn;
