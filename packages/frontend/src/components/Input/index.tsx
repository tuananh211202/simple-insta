import { Form } from 'antd';
import { ChangeEvent, useState } from 'react';
import { InputGlobalStyles } from './style';

type CustomedInputProps = {
  placeholder: string;
  type: string;
  rules?: object[];
}

const CustomedInput = (props: CustomedInputProps) => {
  const { placeholder, type, rules } = props;
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(''); 
 
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }

  const handleFocus = () => {
    setIsFocus(true);
  }

  const handleBlur = () => {
    setIsFocus(inputValue.length > 0);
  }

  return (
    <>
      <InputGlobalStyles />
      <Form.Item label={isFocus ? placeholder : ' '} name={placeholder.toLowerCase()} rules={rules}>
        <input 
          placeholder={isFocus ? '' : placeholder} 
          onFocus={handleFocus} 
          value={inputValue} 
          onChange={handleChange} 
          onBlur={handleBlur} 
          type={type}
        />
      </Form.Item>
    </>
  );
}

export default CustomedInput;
