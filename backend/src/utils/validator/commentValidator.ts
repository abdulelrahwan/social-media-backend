import Joi from "joi";

// createComment Api validator
export const CreateCommentValidator = Joi.object({
  postId: Joi.string().required(),
  text: Joi.string().required(),
});
// updateComment Api validator
export const UpdateCommentValidator = Joi.object({
  commentId: Joi.string().required(),
  text: Joi.string(),
});

// deleteComment Api validator
export const DeleteCommentValidator = Joi.object({
  commentId: Joi.string().required(),
  postId: Joi.string().required(),
});
