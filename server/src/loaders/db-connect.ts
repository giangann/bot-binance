import { createConnection } from "typeorm";

export const connectDatabase = async () => {
  const connection = await createConnection();
  await connection.runMigrations();
};
