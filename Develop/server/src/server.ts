import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import path from "node:path";
import { typeDefs, resolvers } from "./schemas/index.js";
import db from "./config/connection.js";
import { contextMiddleware } from "./services/auth.js";

const PORT = process.env.PORT || 3001;
const app = express();

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const startApolloServer = async () => {
  try {
    console.log(":hourglass_flowing_sand: Connecting to the database...");
    await db;
    console.log(":white_check_mark: Database connected!");
    await server.start();
    console.log(":white_check_mark: Apollo Server started!");
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: async ({ req }) => {
          const { authorization = "" } = req.headers;
          return contextMiddleware({ req: { ...req, headers: { ...req.headers, authorization } } });
        },
      })
    );
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === "production") {
      console.log(":open_file_folder: Serving client in production mode");
      app.use(express.static(path.join(__dirname, "../../client/dist")));
      console.log(path.join(__dirname, "../../client/dist"));
      app.get("*", (_req, res) => {
        res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
      });
    }
    app.listen(PORT, () => {
      console.log(`:rocket: API server running on port ${PORT}!`);
      console.log(`:satellite_antenna: GraphQL available at http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error(":x: Error starting server:", error);
  }
};
startApolloServer();