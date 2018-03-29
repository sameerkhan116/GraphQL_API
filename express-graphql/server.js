const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

// construct a schema using graphql schema language
const schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

class Message {
  constructor(id, { content, author }) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

let fakeDatabase = {};

const rootValue = {
  getMessage: ({ id }) => {
    if (!fakeDatabase[id]) {
      throw new Error(`no message with ${id} id exists`);
    }
    return new Message(id, fakeDatabase[id]);
  },
  createMessage: ({ input }) => {
    let id = require('crypto')
      .randomBytes(10)
      .toString('hex');
    fakeDatabase[id] = input;
    return new Message(id, input);
  },
  updateMessage: ({ id, input }) => {
    if (!fakeDatabase[id]) {
      throw new Error(`no message with ${id} exists`);
    }
    fakeDatabase[id] = input;
    return new Message(id, input);
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
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
