import * as bcrypt from "bcryptjs";

export const authServiceFactory = () => {
  const validate = async (password: any, dbPassword: any) => {
    return await bcrypt.compare(password, dbPassword);
  };

  return { validate };
};
