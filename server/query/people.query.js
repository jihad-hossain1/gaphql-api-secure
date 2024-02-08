const { GraphQLObjectType, GraphQLList } = require("graphql");
const { PeopleType } = require("../typeDef/typeDef");
const People = require("../models/people.models");

const getAllPeople = {
  type: new GraphQLList(PeopleType),
  resolve: async (parent, args) => {
    return await People.find();
  },
};

module.exports = { getAllPeople };
