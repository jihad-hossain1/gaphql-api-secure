const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
} = require("graphql");

const PeopleType = new GraphQLObjectType({
  name: "People",
  fields: () => ({
    id: { type: GraphQLID },
    fullname: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = { PeopleType };
