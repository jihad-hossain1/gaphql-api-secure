const { GraphQLSchema, GraphQLObjectType } = require("graphql");
const { getAllPeople } = require("../query/people.query");
const { addPeople, loginPeople } = require("../mutation/people.mutation");

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
    loginPeople,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});
