'use strict';

const AWS = require('aws-sdk');
const { ApolloServer, gql } = require("apollo-server-lambda");
const uuid = require("uuid");
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const promisify = callback => new Promise((resolve, reject) => {
  callback((error, result) => {
    if (error) {
        reject(error)
    } else {
        resolve(result)
    }
  })
})

const getExperiment = id => promisify(callback =>
    dynamoDb.get({
        TableName: process.env.DYNAMODB_TABLE,
        Key: { id },
    }, callback))
    .then(result => {
        if (!result.Item) {
            return id
        }
        return result.Item
    })

// add method for updates
const putExperiment = (experiment) => promisify(callback =>
  dynamoDb.put({
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      isEnabled: experiment.isEnabled
    }
  }, callback)).then(() => experiment)
//return experiment because couldn't get inserted item from dynamodb. Id field wont work.

const typeDefs = gql`
    type Experiment {
      id: String
      isEnabled: Boolean
    }

    input ExperimentInput {
      isEnabled: Boolean
    }

    type Query {
      getExperiment(id: String!): Experiment
    }
  
    type Mutation {
      putExperiment(experiment: ExperimentInput): Experiment
    }
`;

const resolvers = {
    Query: {
      getExperiment: (_, { id }) => getExperiment(id),
    },
    Mutation: {
      putExperiment: (_, { experiment }) => putExperiment(experiment),
    }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

exports.graphql = server.createHandler();