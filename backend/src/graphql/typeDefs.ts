import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    profilePicture: String!
    createdAt: String!
  }

  type SubPostUser {
    _id: ID
    username: String
    email: String
    profilePicture: String
    createdAt: String
  }

  type LoginDetail {
    data: User!
    token: String!
  }

  type Comment {
    user: User
    text: String
    createdAt: String
  }

  type Post {
    user: User!
    _id: ID!
    title: String!
    image: String!
    createdAt: String!
    comments: [Comment]
  }

  type Message {
    message: String
  }

  type Query {
    getUsers(page: Int!): [User]
    getPosts(page: Int!): [Post]
  }

  type Mutation {
    register(email: String!, username: String!, password: String!): User!
    login(email: String!, password: String!): LoginDetail!

    createPost(title: String!, image: String!): Post!
    updatePost(title: String, image: String, postId: String!): Post!
    deletePost(postId: String!): Post!

    createComment(postId: String!, text: String!): Message
    updateComment(commentId: String!, text: String): Message
    deleteComment(commentId: String!, postId: String!): Message
  }
`;
