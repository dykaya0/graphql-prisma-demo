import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }

  type Mutation {
      # This mutation takes id and email parameters and responds with a User
      updateUserEmail(id: ID!, email: String!): User
  }

  type User {
      id: ID!
      name: String!
      email: String!
  }
`;
const books = [
    {
        title: 'The Sleeping',
        author: 'Kate Choping',
    },
    {
        title: 'City of Stone',
        author: 'Paul Rooster',
    },
];
const resolvers = {
    Query: {
        books: () => books,
    },
    Mutation: {
        updateUserEmail: async (_, args) => {
            const { id, email } = args;
            // Convert id to number if your Prisma model uses Int as id
            // const user = await prisma.user.update({
            //     where: { id: Number(id) },
            //     data: { email },
            // });
            //
            // return user;
            return { id, email };
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
console.log(`🚀  Server ready at: ${url}`);
