import { ObjWithId } from "common.interface";
import { getRepository } from "typeorm";
import { User } from "../entities/user.entity";
import { IUserListParams, IUserRecord } from "user.interface";

const list = async (params: IUserListParams) => {
  let userQuery = getRepository(User).createQueryBuilder("user");

  let isAdmin = params.isAdmin;
  let fullname = params.fullname;
  let username = params.username;
  let limit = params.limit;

  if (fullname) {
    userQuery.andWhere(`(LOWER(user.fullname) LIKE LOWER('%${fullname}%'))`);
  }

  if (isAdmin) {
    userQuery.andWhere("user.isAdmin = :isAdmin", { isAdmin });
  }

  if (username) {
    userQuery.andWhere("(LOWER(user.username) LIKE LOWER(%:username%))", {
      username,
    });
  }

  if (limit) {
    userQuery.limit(limit);
  }

  let listUser = await userQuery.getMany();

  return listUser;
};
const detail = async (params: ObjWithId) => {
  const { id } = params;
  const user = await getRepository(User).findOne(id);

  return user;
};

export default { detail, list };
