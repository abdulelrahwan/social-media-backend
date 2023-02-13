import "dotenv/config";

import { ApolloServer } from "apollo-server-express";
import express, { Application } from "express";
import { connectDatabase } from "./database";
import { resolvers, typeDefs } from "./graphql";
import { userAuthMiddleware } from "./middleware";

const PORT = 5000;

const mount = async (app: Application) => {
  try {
    const db = await connectDatabase();

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: userAuthMiddleware,
    });
    await server.start();
    server.applyMiddleware({ app, path: "/api/v1/graphql" });

    db.once("open", () => {
      app.listen(PORT, () => {
        console.log(`Server running on ${PORT}!`);
      });
    });
  } catch (error: any) {
    throw new Error(error.message)
  }
};

mount(express());
