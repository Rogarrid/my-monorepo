import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET!;
console.log("secretKey", secretKey);

export const signUp = async (name: string, email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
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

export const getUser = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const updateUser = async (id: number, name: string, email: string) => {
  return await prisma.user.update({
    where: { id },
    data: { name, email },
  });
};

export const deleteUser = async (id: number) => {
  return await prisma.user.delete({
    where: { id },
  });
};

export const signIn = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user.id, role: user.role }, secretKey, {
      expiresIn: "1h",
    });
    return { token };
  }
  throw new Error("Invalid email or password");
};
