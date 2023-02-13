import merge from "lodash.merge";
import { AuthResolvers } from "./auth";
import { CommentResolvers } from "./comment";
import { PostResolvers } from "./post";

export const resolvers = merge(AuthResolvers, PostResolvers, CommentResolvers);
