const { GraphQLNonNull, GraphQLString } = require("graphql");
const { PeopleType } = require("../typeDef/typeDef");
const People = require("../models/people.models");

const addPeople = {
  type: PeopleType,
  args: {
    fullname: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve(parent, args) {
    const people = new People({
      fullname: args.fullname,
      email: args.email,
      password: args.password,
      username: args.username,
    });
    return people.save();
    // Client.create();
  },
};

module.exports = { addPeople };
