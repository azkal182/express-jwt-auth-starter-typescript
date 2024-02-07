import { omit } from "lodash";
import { prismaClient } from "../application/database";
import { excludedFields } from "./auth-service";

const findUserByUsername = async (username: string) => {
  const user = await prismaClient.user.findUnique({
    where: {
      username,
    },
  });

  return user;
};

const findUserById = async (id: string) => {
  const user = await prismaClient.user.findUnique({
    where: {
      id,
    },
  });

  return user;
};

const getAllUser = async () => {
  const user = await prismaClient.user.findMany();
  const result: any = [];
  user.forEach((user) => {
    result.push(omit(user, excludedFields));
  });
  return result;
};

export default {
  findUserByUsername,
  findUserById,
  getAllUser,
};
