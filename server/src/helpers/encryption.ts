import bcrypt from "bcrypt";

export const encryption = {
  hash: async (password: string) => {
    const salt = 10;

    return await bcrypt.hash(password, salt);
  },
  compare: async (password: string, hashed: string) => {
    return await bcrypt.compare(password, hashed);
  },
};
