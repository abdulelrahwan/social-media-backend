import { IResolvers } from "@graphql-tools/utils";
import { AuthenticationError } from "apollo-server-core";
import { compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../../../models/user";
import {
  LoginValidator,
  paginationValidator,
  RegisterValidator
} from "../../../utils/validator/authValidator";

const secret = `${process.env.JWT_SECRET}`;

export const AuthResolvers: IResolvers = {
  Query: {
    getUsers: async (_root: undefined, args): Promise<any[]> => {
      try {
        await paginationValidator.validateAsync(args);

        const { page } = args;
  
        return await UserModel.find({})
          .sort({ _id: -1 })
          .skip(page != 1 ? (page - 1) * 10 : 0)
          .limit(10);

      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },

  Mutation: {
    register: async (_root: undefined, args, context): Promise<any> => {
      try {
        await RegisterValidator.validateAsync(args);

        const { email } = args;
        const findUser = await UserModel.findOne({
          email: email.toLowerCase(),
        });
        
        if (findUser) {
          throw new AuthenticationError("User already exist with this email");
        }

        let newUser = await UserModel.create({ ...args });
        return newUser;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    login: async (_root: undefined, args, context): Promise<any> => {
      try {
        await LoginValidator.validateAsync(args);

        const { email, password } = args;
        const findUser: any = await UserModel.findOne({
          email: email.toLowerCase(),
        });
        
        if (!findUser) {
          throw new Error(`User with email: ${email} not found`);
        }

        const comparePassword = compareSync(password, findUser.password);
        if (!comparePassword) {
          throw new Error("Invalid email or password");
        }

        const token = jwt.sign({ _id: findUser._id }, secret, {
          expiresIn: "7d",
        });

        return {
          data: { ...findUser._doc },
          token,
        };
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
};
