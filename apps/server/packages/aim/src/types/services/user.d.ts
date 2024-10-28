export interface CreateUserDTO {
  alias: string;
  password: string;
}

export interface UpdateUserDTO {
  alias?: string;
  password?: string;
}
