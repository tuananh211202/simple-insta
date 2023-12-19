import { Button, Result } from "antd";
import { useAuth } from "../../context/auth-context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Page404 = () => {
  const { state: authState } = useAuth();
  const [path, setPath] = useState('');
  const [text, setText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if(authState.isLogin) {
      setPath('/home');
      setText('Home');
    } else {
      setPath('/signin');
      setText('To Sign In');
    }
  }, [authState.isLogin]);

  return (
    <Result
      status='404'
      title='404'
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button type="primary" onClick={() => navigate(path)}>Back {text}</Button>}
      style={{ width: '100%', height: '100vh', marginTop: '100px'}}
    />
  );
};

export default Page404;