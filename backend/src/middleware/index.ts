import { AuthenticationError } from "apollo-server-core";
import jwt from "jsonwebtoken";

const secret = `${process.env.JWT_SECRET}`;

export const userAuthMiddleware = ({ req }: any) => {
  try {

    // Get the token in header
    const token = req.headers.token;

    const data: any = jwt.verify(token, secret);
    req.userId = data._id;

    return req;
  } catch {

    const noTokenRequiredOperations: String[] = ["IntrospectionQuery", "Login", "Register"]

    // Introspection login, and register don't need user to be logged in
    if(!noTokenRequiredOperations.includes(req.body.operationName)) {
      throw new AuthenticationError("Invalid token");
    }
  }
};
