import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
    publisher: String
    releaseDate: String
    pageCount: String
    volume: String
  }

  type User {
      id: ID!
      name: String!
      email: String!
      books: [Book]
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getAllBooks: [Book]
    getBook: [Book]
    getAllUsers: [User]
    getUser(id: ID!): User
  }

  type Mutation {
      # This mutation takes id and email parameters and responds with a User
      addBook(title: String!, author: String!, publisher: String, releaseDate: String, pageCount: String, volume: String): Book
      addUser(id: ID!, email: String!): User
      updateUser(id: ID!, email: String!): User
      updateBook(title: String!, author: String!, publisher: String, releaseDate: String, pageCount: String, volume: String): Book
      deleteUser(id: ID!): User
  }

`;


// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.

const prisma = new PrismaClient()
interface UserArgs {
    id: string;
    email: string;
}
interface BookArgs {
    title: string;
    author: string;
    publisher: string
    releaseDate: string
    pageCount: string
    volume: string
}
const resolvers = {
    Query: {
        getAllBooks: async () => { return prisma.book.findMany() },
        getBook: async (_: unknown, args: { id: string }) => {
            const { id } = args
            return prisma.book.findUnique({
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
        addBook: async (
            _: unknown,
            args: BookArgs
        ) => {
            const { title, author, publisher, releaseDate, pageCount, volume } = args;

            // Convert id to number if your Prisma model uses Int as id
            const user = await prisma.book.create({
                data: { title, author, publisher, releaseDate, pageCount, volume },
            });

            return user;
        },
        updateBook: async (
            _: unknown,
            args: BookArgs
        ) => {
            const { title, author, publisher, releaseDate, pageCount, volume } = args;

            // Convert id to number if your Prisma model uses Int as id
            const user = await prisma.book.update({
                where: { title: title },
                data: { author, publisher, releaseDate, pageCount, volume },
            });
            return user;
        },
        updateUser: async (
            _: unknown,
            args: UserArgs
        ) => {
            const { id, email } = args;

            // Convert id to number if your Prisma model uses Int as id
            const user = await prisma.user.update({
                where: { id: Number(id) },
                data: { email },
            });

            return user;
        },
        addUser: async (
            _: unknown,
            args: UserArgs
        ) => {
            const { id, email } = args;

            // Convert id to number if your Prisma model uses Int as id
            const user = await prisma.user.create({
                data: { id: Number(id), email },
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

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(typeDefs);
console.log(`🚀  Server ready at: ${url}`);
