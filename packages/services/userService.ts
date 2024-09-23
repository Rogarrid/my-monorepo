import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { LoginDto, UpdateUserDto, signUpDto } from "../api/dto/user.dto";
import { getErrorMessage } from "../utils/errors";
import { FastifyReply } from "fastify";

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET!;
console.log("secretKey", secretKey);

export const signUp = async (userData: signUpDto) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await prisma.user.create({
    data: { ...userData, password: hashedPassword },
  });

  const accessToken = jwt.sign({ id: user.id, role: user.role }, secretKey, {
    expiresIn: "2h",
  });

  const refreshToken = uuidv4();

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return {
    user: updatedUser,
    accessToken: accessToken,
  };
};

export const signIn = async (loginData: LoginDto, token?: string) => {
  if (token) {
    try {
      jwt.verify(token, secretKey);
      return { message: "User already authenticated", token };
    } catch (err) {
      throw new Error("Invalid or expired token");
    }
  }

  const user = await prisma.user.findUnique({
    where: { email: loginData.email },
  });
  if (user && (await bcrypt.compare(loginData.password, user.password))) {
    const newToken = jwt.sign({ id: user.id, role: user.role }, secretKey, {
      expiresIn: "1h",
    });
    return { token: newToken };
  }

  throw new Error("Invalid email or password");
};

export const getUser = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const updateUser = async (id: number, userData: UpdateUserDto) => {
  const data: any = { ...userData };

  if (userData.password) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    data.password = hashedPassword;
  }

  return await prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id: number) => {
  return await prisma.user.delete({
    where: { id },
  });
};
