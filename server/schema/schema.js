const { GraphQLSchema, GraphQLObjectType } = require("graphql");
const { getAllPeople } = require("../query/people.query");
const { addPeople } = require("../mutation/people.mutation");

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    getAllPeople,
  },
});
const RootMutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    addPeople,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
