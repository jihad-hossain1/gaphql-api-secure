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
  resolve: async (parent, args) => {
    try {
      // if some one try to unfilled to people are not give permit create people account
      const { fullname, password, email, username } = args;
      if (
        [username, email, fullname, password].some(
          (field) => field?.trim() === ""
        )
      ) {
        return new Error("all field are required");
      }
      // if already people email/username exist
      const alreadyUser = await People.findOne({
        $or: [{ username }, { email }],
      });
      console.log(alreadyUser);
      if (alreadyUser) {
        return new Error(
          "username or email already exist . try another username or email address"
        );
      }

      const people = new People({
        fullname: args.fullname,
        email: args.email,
        password: args.password,
        username: args.username,
      });
      return people.save();
    } catch (error) {
      return new Error(error);
    }
  },
};

module.exports = { addPeople };
