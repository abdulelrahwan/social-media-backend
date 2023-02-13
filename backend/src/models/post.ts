import { Schema, InferSchemaType, model, Types } from "mongoose";

const postSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: { type: String, required: true },
    image: { type: String, required: true },
    comments: [
      {
        type: Types.ObjectId,
        ref: "comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// InferSchemaType will determine the type
export type Post = InferSchemaType<typeof postSchema>;

export const PostModel = model("post", postSchema);
