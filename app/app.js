import express from "express";
import cors from "cors";
import { connectDb } from "./models/index.js";
import { config } from "dotenv";

import gql from "graphql-tag";
import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { expressMiddleware } from '@apollo/server/express4';
import resolvers from "./resolvers.js";
import { readFileSync } from "fs";

import { getUserId } from "./utils.js";
import { nextTick } from "process";


config();

const app = express();

const port = process.env.PORT || 3000;

// Middleware

function tokenCheck (req, res, next) {
  const token = req.headers['authorization'];
  console.log(token);
  
  next();
}

app.use(tokenCheck);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const typeDefs = gql(
  readFileSync("schema.graphql", {
    encoding: "utf-8",
  })
);

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers
  }),
  context: ({ req }) => {
    return {
      ...req,
      userId:
        req && req.headers.authorization
          ? getUserId(req)
          : null
    }
  }
});

await server.start();

// Routes

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.use(
  '/graphql',
  // cors(),
  // express.json(),
  expressMiddleware(server),
);

connectDb().then(() => {
  console.log("Connected to MongoDB.");

  app.listen(port, () => {
    console.log(`App listening on port ${port}.`);
  });
}).catch((err) => {
  console.error("Error connecting to MongoDB", err);
});
