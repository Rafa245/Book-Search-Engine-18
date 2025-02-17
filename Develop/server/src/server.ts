import express, { Application } from "express";
import path from "node:path";
import { ApolloServer } from "apollo-server-express";
import db from "./config/connection.js";
import { typeDefs, resolvers } from "./schemas"; // Import GraphQL schema & resolvers
import { authMiddleware } from "./services/auth.js"; // Import authentication middleware

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON & URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve client-side production build
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
  });
}

const startApolloServer = async () => {
  // Initialize Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware, // Pass user authentication context
  });

  try {
    // Start Apollo Server before applying middleware
    await server.start();
    server.applyMiddleware({ app: app as any });

    // Start Express server after DB connection
    db.once("open", () => {
      app.listen(PORT, () => {
        console.log(`🌍 Now listening on http://localhost:${PORT}`);
        console.log(`🚀 GraphQL available at http://localhost:${PORT}${server.graphqlPath}`);
      });
    });
  } catch (error) {
    console.error("Error starting Apollo Server:", error);
  }
};

// Start Apollo Server & Express
startApolloServer();