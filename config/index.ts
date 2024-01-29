type ProcessEnv = {
  DB_NAME?: string;
  DB_USERNAME?: string;
  DB_PASSWORD?: string;
  HOST?: string;
  PORT?: string;
  DIALECT?: string;
  SESSION_SECRET?: string;
};

const {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  HOST,
  PORT,
  DIALECT,
  SESSION_SECRET,
} = process?.env as ProcessEnv;

export const config = {
  dbCredential: {
    name: DB_NAME,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    host: HOST,
    port: PORT,
    dialect: DIALECT,
    session: SESSION_SECRET as string,
  },
};
