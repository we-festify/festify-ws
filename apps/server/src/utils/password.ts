import bcrypt from 'bcryptjs';

export const generateRandomPassword = (length: number) => {
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|:<>?';
  let password = '';
  for (let i = 0; i < length; i++) {
    const at = Math.floor(Math.random() * charset.length);
    password += charset.charAt(at);
  }
  return password;
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(password, hashedPassword);
};
