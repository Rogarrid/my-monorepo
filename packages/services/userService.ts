import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { LoginDto, UpdateUserDto, signUpDto } from "../api/dto/user.dto";

/*** TODO:
 * - Implement validations to strengthen user password requirements.
 *   At least: 8 characters in length, one capital letter, one lowercase letter,
 *   one number, and one special character (e.g. @, #, $, etc.).
 * - Save encrypted refreshToken in the database.
 */

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET!;

/**
 * Signs up a new user.
 * @param userData - The data for the new user.
 * @returns The newly created user and an access token.
 */
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

/**
 * Logs in an existing user.
 * @param loginData - The credentials for logging in.
 * @returns The logged-in user and a new access token.
 * @throws Error if the credentials are invalid.
 */
export const signIn = async (loginData: LoginDto) => {
  const user = await prisma.user.findUnique({
    where: { email: loginData.email },
  });
  if (user && (await bcrypt.compare(loginData.password, user.password))) {
    const newToken = jwt.sign({ id: user.id, role: user.role }, secretKey, {
      expiresIn: "1h",
    });
    return { user, accessToken: newToken };
  }

  throw new Error("Invalid email or password");
};

/**
 * Retrieves a user by ID.
 * @param id - The ID of the user.
 * @returns The user data.
 */
export const getUser = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

/**
 * Updates a user's information.
 * @param id - The ID of the user to update.
 * @param userData - The new data for the user.
 * @returns The updated user data.
 */
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

/**
 * Deletes a user by ID.
 * @param id - The ID of the user to delete.
 * @returns The deleted user data.
 */
export const deleteUser = async (id: number) => {
  return await prisma.user.delete({
    where: { id },
  });
};

/**
 * Refreshes the access token using a refresh token.
 * @param refreshToken - The refresh token to use for generating a new access token.
 * @returns The new access token and the original refresh token.
 * @throws Error if the user is not found.
 */
export const refreshTokenService = async (refreshToken: string) => {
  const user = await prisma.user.findUnique({
    where: { refreshToken },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const newAccessToken = jwt.sign({ id: user.id, role: user.role }, secretKey, {
    expiresIn: "2h",
  });

  return { newAccessToken, refreshToken };
};
