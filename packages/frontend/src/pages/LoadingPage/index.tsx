import { LoadingOutlined } from "@ant-design/icons"
import { Spin } from "antd"

const LoadingPage = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: '50%' }} spin />} />;
    </div>
  )
}

export default LoadingPage;