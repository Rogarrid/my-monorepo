import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import {
  signUp,
  signIn,
  getUser,
  updateUser,
  deleteUser,
  refreshTokenService,
} from "../../services/userService";
const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET || "test_secret";

describe("User Service", () => {
  let userId: number;

  const generateUniqueEmail = () => `test_${Date.now()}@example.com`;

  beforeEach(async () => {
    const userData = {
      name: "Test User",
      email: generateUniqueEmail(),
      password: "password123",
      role: "user",
    };
    const response = await signUp(userData);
    userId = response.user.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  test("signUp should create a new user", async () => {
    const userData = {
      name: "Another User",
      email: generateUniqueEmail(),
      password: "password123",
      role: "user",
    };
    const response = await signUp(userData);
    expect(response.user.email).toBe(userData.email);
    expect(
      await bcrypt.compare(userData.password, response.user.password)
    ).toBe(true);
  });

  test("signIn should authenticate a user", async () => {
    const userData = {
      name: "Test User",
      email: generateUniqueEmail(),
      password: "password123",
      role: "user",
    };
    await signUp(userData);
    const response = await signIn({
      email: userData.email,
      password: userData.password,
    });
    expect(response.user.email).toBe(userData.email);
    expect(response.token).toBeDefined();
  });

  test("getUser should return user by id", async () => {
    const user = await getUser(userId);
    expect(user).not.toBeNull();
    if (user) {
      expect(user.email).toMatch(/test_\d+@example.com/);
    }
  });

  test("updateUser should update user data", async () => {
    const updatedData = {
      name: "Updated User",
      email: `updated_${Date.now()}@example.com`,
      role: "user",
      password: "newpassword123",
    };
    const updatedUser = await updateUser(userId, updatedData);

    expect(updatedUser.email).toBe(updatedData.email);
    expect(await bcrypt.compare("newpassword123", updatedUser.password)).toBe(
      true
    );
  });

  test("refreshTokenService should return a new access token", async () => {
    const refreshToken = "some-refresh-token";
    await prisma.user.update({ where: { id: userId }, data: { refreshToken } });

    const response = await refreshTokenService(refreshToken);
    expect(response.newAccessToken).toBeDefined();
  });

  test("deleteUser should remove the user", async () => {
    await deleteUser(userId);
    const user = await getUser(userId);
    expect(user).toBeNull();
  });
});
