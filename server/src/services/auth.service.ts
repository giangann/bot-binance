import { getRepository } from "typeorm";
import { User } from "../entities/user.entity";
import { IUserRecord } from "user.interface";

interface IAuth extends Pick<IUserRecord, "username" | "password"> {}

const login = async (params: IAuth) => {
  const { username, password } = params;

  const user = await getRepository(User).findOne({ username: username });
  console.log(
    user,
    password,
    user.password,
    user.password === password,
    user.password == password
  );
  return user;
};

const register = async (params: IAuth) => {
  const newUser = new User();
  newUser.username = params.username;
  newUser.password = params.password;

  const createdUser = await getRepository(User).save(newUser);

  return createdUser;
};

export default { login, register };
