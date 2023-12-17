import { Button, Form, Typography } from "antd";
import { SignUpContainer } from "./style";
import CustomedInput from "../../components/Input";
import { validateEmail } from "../../utils/validator/email-validator";
import { validate8Character } from "../../utils/validator/password-validator";

const { Text } = Typography;

const SignUp = () => {
  const [form] = Form.useForm();

  const onFinish = () => {
    console.log(form.getFieldsValue());
  }

  return (
    <SignUpContainer>
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
            <CustomedInput 
              placeholder="ConfirmPassword" 
              type="password"
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_: any, value: any) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The new password that you entered do not match!'));
                  },
                }),
              ]} 
            />
            <CustomedInput 
              placeholder="Name" 
              type="text" 
              rules={[
                { required: true, message: 'Please input your name!' },
                { validator: validate8Character, message: 'Name needs at least 8 characters!' }
              ]}
            />
            <Form.Item>
              <Button htmlType="submit" className="loginBtn">
                SIGNUP
              </Button>
            </Form.Item>
          </Form>
        </div>
        
        <div className="textContainer">
          <Text>Welcome</Text>
        </div>

        <div className="navigateContainer">
          <ul>
            <li><Text>Forgot <a href="/forgotpassword">Password</a></Text></li>
            <li><Text>Already have an account? <a href="/signin">Sign in</a></Text></li>
          </ul>
        </div>

      </div>
    </SignUpContainer>
  );
}

export default SignUp;
