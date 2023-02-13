import { IResolvers } from "@graphql-tools/utils";
import { AuthenticationError } from "apollo-server-core";
import { CommentModel } from "../../../models/comment";
import { PostModel } from "../../../models/post";
import {
  CreateCommentValidator,
  DeleteCommentValidator,
  UpdateCommentValidator,
} from "../../../utils/validator/commentValidator";

export const CommentResolvers: IResolvers = {
  Mutation: {
    createComment: async (_root: undefined, args, context): Promise<any> => {
      try {
        if (!context.userId) {
          throw new AuthenticationError("User must be logged in");
        }

        await CreateCommentValidator.validateAsync(args);

        const { postId, text } = args;
        const findPost = await PostModel.findOne({
          _id: postId,
        });

        if (!findPost) {
          throw new Error(`Post ${postId} does not exist`);
        }

        const comment: any = await CommentModel.create({
          text,
          postId,
          user: context.userId,
        });

        const updatePostComment = await PostModel.findOneAndUpdate(
          {
            _id: postId,
          },
          {
            $push: { comments: comment._doc._id },
          },
          {
            new: true,
          }
        );

        return { message: "Comment created successfully" };

      } catch (error: any) {
        throw new Error(error.message);
      }
    },

    updateComment: async (_root: undefined, args, context): Promise<any> => {
      try {
        if (!context.userId) {
          throw new AuthenticationError("User must be logged in");
        }

        await UpdateCommentValidator.validateAsync(args);

        const { commentId, text } = args;
        const findComment = await CommentModel.findOne({
          _id: commentId,
          user: context.userId,
        });

        if (!findComment) {
          throw new Error(
            `Comment ${commentId} does not exist or does not belong to logged in user`
          );
        }

        const findCommentAndUpdate = await CommentModel.findOneAndUpdate(
          {
            _id: commentId,
          },
          {
            $set: { text },
          },
          {
            new: true,
          }
        );

        return { message: "Comment updated successfully" };

      } catch (error: any) {
        throw new Error(error.message);
      }
    },

    deleteComment: async (_root: undefined, args, context): Promise<any> => {
      try {
        if (!context.userId) {
          throw new AuthenticationError("User must be logged in");
        }

        await DeleteCommentValidator.validateAsync(args);

        const { commentId, postId } = args;

        const verifyComment = await CommentModel.findOne({
          _id: commentId,
          postId,
          user: context.userId,
        });

        if (!verifyComment) {
          throw new Error(`Comment ${commentId} not found`);
        }

        const findPostAndUpdate = await PostModel.findOneAndUpdate(
          {
            _id: postId,
          },
          {
            $pull: {
              comments: { $in: [commentId] },
            },
          },
          {
            new: true,
          }
        );
        await CommentModel.deleteOne({ _id: commentId });

        return { message: "Comment deleted successfully" };

      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
};
