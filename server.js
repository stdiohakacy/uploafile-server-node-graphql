const { ApolloServer, gql } = require("apollo-server");
const { createWriteStream } = require("fs");

const typeDefs = gql`
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
  type Query {
    uploads: [File]
  }
  type Mutation {
    uploadFile(file: Upload!): File!
  }
`;
// In uploadFile, the return type could be any message or anything, // which you want to send back.
const resolvers = {
  Mutation: {
    async uploadFile(parent, { file }) {
      const buffers = [];
      const { createReadStream, filename, mimetype } = await file;
      const readStream = createReadStream();

      readStream.on("data", (chunk) => {
        buffers.push(chunk);
        // console.log(chunk);
      });

      readStream.on("open", () => {
        console.log("Stream opened...");
      });

      readStream.on("end", () => {
        console.log(buffers);
        console.log("Stream Closed...");
      });
      return { filename: "", mimetype: "", encoding: "" };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
