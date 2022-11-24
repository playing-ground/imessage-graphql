// npm install @apollo/server express graphql cors body-parser
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import cors from "cors";
import * as dotenv from "dotenv";
import express, { json } from "express";
import http from "http";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";

async function main() {
  dotenv.config();
  const app = express();
  const httpServer = http.createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  };

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  app.use("/graphql", cors(corsOptions), json(), expressMiddleware(server));
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}

main().catch((err) => console.log(err));

// const app = express();
// const httpServer = http.createServer(app);
// const server = new ApolloServer<MyContext>({
//   typeDefs,
//   resolvers,
//   plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
// });
// await server.start();
// app.use(
//   "/graphql",
//   cors<cors.CorsRequest>(),
//   json(),
//   expressMiddleware(server, {
//     context: async ({ req }) => ({ token: req.headers.token }),
//   })
// );

// await new Promise<void>((resolve) =>
//   httpServer.listen({ port: 4000 }, resolve)
// );
// console.log(`🚀 Server ready at http://localhost:4000/graphql`);
