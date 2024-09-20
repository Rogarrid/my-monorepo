export interface UserDto {
  name: string;
  email: string;
}

export interface CreateUserDto extends UserDto {
  password: string;
}

export interface UpdateUserDto extends UserDto {
  password?: string;
}

export interface UserIdDto {
  id: string;
}
