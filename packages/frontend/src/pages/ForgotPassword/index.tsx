import { Button, Form, Typography } from "antd";
import { SignInContainer } from "./style";
import CustomedInput from "../../components/Input";
import { validateEmail } from "../../utils/validator/email-validator";

const { Text } = Typography;

const ForgotPassword = () => {
  const [form] = Form.useForm();

  const onFinish = () => {
    console.log(form.getFieldsValue());
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
            <Form.Item>
              <Button htmlType="submit" className="loginBtn">
                RESET PASSWORD
              </Button>
            </Form.Item>
          </Form>
        </div>
        
        <div className="textContainer">
          <Text>Welcome</Text>
        </div>

        <div className="navigateContainer">
          <ul>
            <li><Text>Already have an account? <a href="/signin">Sign in</a></Text></li>
            <li><Text>Don’t have an account? <a href="/signup">Sign up</a></Text></li>
          </ul>
        </div>

      </div>
    </SignInContainer>
  );
}

export default ForgotPassword;
