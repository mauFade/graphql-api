require("dotenv").config();

import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import ormConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";

const main = async () => {
  const orm = await MikroORM.init(ormConfig);

  await orm.getMigrator().up();

  const app = express();
  const PORT = 4000;

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.info(`App started at port: ${PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});
