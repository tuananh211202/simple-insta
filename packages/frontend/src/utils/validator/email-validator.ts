export const validateEmail = (_: any, value: string) => {
  // Sử dụng regex để kiểm tra định dạng email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value || emailRegex.test(value)) {
    return Promise.resolve();
  }
  return Promise.reject('Invalid email!');
};