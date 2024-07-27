export interface AccountType {
  _id: string;

  rootAccount: string | AccountType;

  alias: string;
  password: string;
  type: 'root' | 'aim';

  isPasswordResetRequired: boolean;
  passwordResetToken?: string;

  createdAt: Date;
  updatedAt: Date;
}
