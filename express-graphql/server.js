const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const PORT = 4000;
// construct a schema using graphql schema language (using different data types)
const schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollDice(numDice: Int!, numSides: Int): [Int] 
  }
`);

// the root provides a resolver function for each API endpoint
const rootValue = {
  quoteOfTheDay: () =>
    Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within',
  random: () => Math.random(),
  rollDice: function({ numDice, numSides }) {
    let output = [];
    for (let i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  }
};

// setup express server with schema, rootvalue.
// if you want graphiql, set it as true
const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true
  })
);

// start the server at port 4000
app.listen(PORT);
console.log(`Running a GraphQL API server at localhost:${PORT}/graphql`);
