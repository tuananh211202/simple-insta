export const validate8Character = (_: any, value: string | any[]) => {
  // Kiểm tra xem mật khẩu có ít nhất 8 ký tự không
  if (!value || value.length >= 8) {
    return Promise.resolve();
  }
  return Promise.reject('Password needs at least 8 characters!');
};