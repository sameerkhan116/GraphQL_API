const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const PORT = 4000;
// construct a schema using graphql schema language
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// the root provides a resolver function for each API endpoint
const root = {
  hello: () => {
    return 'Hello world!';
  }
};

// setup express server with schema, rootvalue.
// if you want graphiql, set it as true
const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

// start the server at port 4000
app.listen(PORT);
console.log(`Running a GraphQL API server at localhost:${PORT}/graphql`);
