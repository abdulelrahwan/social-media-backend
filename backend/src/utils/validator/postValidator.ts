import Joi from "joi";

// createPost Api validator
export const CreatePostValidator = Joi.object({
  title: Joi.string().required(),
  image: Joi.string().required(),
});
// updatePost Api validator
export const UpdatePostValidator = Joi.object({
  postId: Joi.string().required(),
  title: Joi.string(),
  image: Joi.string(),
});
// deletePost Api validator
export const DeletePostValidator = Joi.object({
  postId: Joi.string().required(),
});
