import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  return await prisma.user.create({
    data: { name, email, password },
  });
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
