import { Schema, InferSchemaType, model, Types } from "mongoose";

const commentSchema = new Schema(
  {
    text: { type: String, required: true },
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    postId: {
      type: Types.ObjectId,
      ref: "post",
    },
  },
  {
    timestamps: true,
  }
);

// InferSchemaType will determine the type
export type Comment = InferSchemaType<typeof commentSchema>;

export const CommentModel = model("comment", commentSchema);
