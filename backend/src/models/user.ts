import { Schema, InferSchemaType, model } from "mongoose";
import { hashSync } from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: {
      type: String,
      default: "https://www.w3schools.com/howto/img_avatar.png",
    },
  },
  {
    timestamps: true,
  }
);

// InferSchemaType will determine the type
export type User = InferSchemaType<typeof userSchema>;


// Before creating a password, store the pass as a hashed string in db
userSchema.pre("save", function (): void {
  this.password = hashSync(this.password, 10);
});

export const UserModel = model("user", userSchema);
