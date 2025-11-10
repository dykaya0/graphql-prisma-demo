import { ApolloServer } from '@apollo/server';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { expressMiddleware } from '@as-integrations/express5';
import express from 'express';
import cors from 'cors';
import { GraphQLScalarType, Kind } from 'graphql';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  scalar Date

  type Notification {
    id: ID!
    title: String!
    text: String!
    createdAt: Date!
    updatedAt: Date!
  }

  type User {
      id: ID!
      email: String!
      username: String!
      biography: String
      createdAt: Date!
      updatedAt: Date!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each
  type Query {
    getAllNotifications: [Notification]
    getNotification(id: ID!): Notification

    getAllUsers: [User]
    getUser(id: ID!): User
  }

  type Mutation {
      addNotification(title: String!,text: String!): Notification
      deleteNotification(id: ID!): Notification

      addUser(email: String!, username: String!, biography: String!): User
      updateUser(id: ID!,email: String!, username: String!, biography: String!): User
      deleteUser(id: ID!): User
  }

`;


const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
        if (value instanceof Date) {
            return value.getTime(); // Convert outgoing Date to integer for JSON
        }
        throw Error('GraphQL Date Scalar serializer expected a `Date` object');
    },
    parseValue(value) {
        if (typeof value === 'number') {
            return new Date(value); // Convert incoming integer to Date
        }
        throw new Error('GraphQL Date Scalar parser expected a `number`');
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            // Convert hard-coded AST string to integer and then to Date
            return new Date(parseInt(ast.value, 10));
        }
        // Invalid hard-coded value (not an integer)
        return null;
    },
});

const prisma = new PrismaClient()
interface UserArgs {
    id: Number;
    email: string;
    username: string;
    biography: string;
    createdAt: Date;
    updatedAt: Date;
}
interface NotificationArgs {
    title: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}

// Resolvers define how to fetch the types defined in your schema.
const resolvers = {
    Date: dateScalar,

    Query: {
        getAllNotifications: async () => { return prisma.notification.findMany() },
        getNotification: async (_: unknown, args: { id: string }) => {
            const { id } = args
            return prisma.notification.findUnique({
                where: {
                    id: Number(id),
                }
            })
        },

        getAllUsers: async () => { return prisma.user.findMany() },
        getUser: async (_: unknown, args: { id: string }) => {
            const { id } = args
            return prisma.user.findUnique({
                where: {
                    id: Number(id),
                }
            })
        },
    },
    Mutation: {
        addNotification: async (
            _: unknown,
            args: NotificationArgs
        ) => {
            const { title, text } = args;

            const notification = await prisma.notification.create({
                data: { title, text },
            });

            return notification;
        },
        deleteNotification: async (
            _: unknown,
            args: { id: Number }
        ) => {
            const { id } = args;

            // Convert id to number if your Prisma model uses Int as id
            const notification = await prisma.notification.delete({
                where: { id: Number(id) },
            });

            return notification;
        },

        addUser: async (
            _: unknown,
            args: UserArgs
        ) => {
            const { email, username, biography } = args;

            // Convert id to number if your Prisma model uses Int as id
            const user = await prisma.user.create({
                data: { email, username, biography },
            });

            return user;
        },
        updateUser: async (
            _: unknown,
            args: UserArgs
        ) => {
            const { id, email, username, biography } = args;

            // Convert id to number if your Prisma model uses Int as id
            const user = await prisma.user.update({
                where: { id: Number(id) },
                data: { email, username, biography },
            });

            return user;
        },
        deleteUser: async (
            _: unknown,
            args: { id: Number }
        ) => {
            const { id } = args;

            // Convert id to number if your Prisma model uses Int as id
            const user = await prisma.user.delete({
                where: { id: Number(id) },
            });

            return user;
        },
    },

};

// Create the schema, which will be used separately by ApolloServer and the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });
// Create an Express app and HTTP server; we will attach both the WebSocket server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);

const server = new ApolloServer({
    schema,
});
await server.start();

app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server),
);

const PORT = 4000;
httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/graphql`);
});

