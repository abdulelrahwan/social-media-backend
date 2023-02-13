import { IResolvers } from "@graphql-tools/utils";
import { AuthenticationError } from "apollo-server-core";
import { PostModel } from "../../../models/post";
import { paginationValidator } from "../../../utils/validator/authValidator";
import {
  CreatePostValidator,
  DeletePostValidator,
  UpdatePostValidator,
} from "../../../utils/validator/postValidator";

export const PostResolvers: IResolvers = {
  Query: {
    getPosts: async (_root: undefined, args): Promise<any[]> => {
      try {
        await paginationValidator.validateAsync(args);

        const { page } = args;
        const posts = await PostModel.find({})
          .populate({ path: "comments", populate: "user" })
          .populate({ path: "user" })
          .sort({ title: 1 })
          .skip(page != 1 ? (page - 1) * 10 : 0)
          .limit(10)
        return posts;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },

  Mutation: {
    createPost: async (_root: undefined, args, context): Promise<any> => {
      try {
        if (!context.userId) {
          throw new AuthenticationError("User must be logged in");
        }
        await CreatePostValidator.validateAsync(args);

        const createdPost: any = await PostModel.create({
          user: context.userId,
          ...args,
        });
        const findPost = await PostModel.findOne({
          _id: createdPost._doc._id,
        }).populate("user");

        return findPost;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    updatePost: async (_root: undefined, args, context): Promise<any> => {
      try {
        if (!context.userId) {
          throw new AuthenticationError("User must be logged in");
        }
        await UpdatePostValidator.validateAsync(args);

        const { postId } = args;
        const findPost = await PostModel.findOne({
          _id: postId,
        });
        if (!findPost) {
          throw new Error(`No post found with postId ${postId}`);
        }

        const findPostAndUpdate = await PostModel.findOneAndUpdate(
          {
            _id: postId,
          },
          {
            ...args,
          },
          {
            new: true,
          }
        ).populate("user");
        return findPostAndUpdate;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    deletePost: async (_root: undefined, args, context): Promise<any> => {
      try {
        if (!context.userId) {
          throw new AuthenticationError("User must be logged in");
        }

        await DeletePostValidator.validateAsync(args);

        const { postId } = args;
        const findPost = await PostModel.findOne({
          _id: postId,
          user: context.userId,
        });
        if (!findPost) {
          throw new Error(
            `Post ${postId} does not exist does not belong to logged in user`
          );
        }
        const findPostAndUpdate = await PostModel.findOneAndDelete({
          _id: postId,
        }).populate("user");

        return findPostAndUpdate;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
};
