export interface UserDto {
  name: string;
  role: string;
  email: string;
}

export interface signUpDto extends UserDto {
  password: string;
}

export interface UpdateUserDto extends UserDto {
  password?: string;
}

export interface UserIdDto {
  id: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}
