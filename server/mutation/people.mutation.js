const { GraphQLNonNull, GraphQLString } = require("graphql");
const { PeopleType } = require("../typeDef/typeDef");
const People = require("../models/people.models");
const { ApiResponse } = require("../utils/ApiResponse");

const generateAccessAndRefreshToken = async (peopleId) => {
  try {
    const people = await People.findById(peopleId);

    const accessToken = people.generateAccessToken();
    const refreshToken = people.generateRefreshToken();

    people.refreshToken = refreshToken;
    await people.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(
      "Something went wrong while generating refresh and access token."
    );
  }
};

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

const loginPeople = {
  type: PeopleType,
  args: {
    password: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    username: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args, context) => {
    const { email, password, username } = args;
    if (!(email || username)) {
      return new Error("username or email is required.");
    }

    const people = await People.findOne({ $or: [{ email }, { username }] });
    if (!people) {
      return new Error("People are not found");
    }

    const isPasswordCorrect = await people.comparePassword(password);

    if (!isPasswordCorrect) {
      return new Error("Invalid user credentials || password.");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      people._id
    );

    const loggedInUser = await People.findById(people._id).select(
      " -password -refreshToken"
    );
    const options = {
      httpOnly: false,
      sameSite: "none",
      secure: true,
    };
    // console.log(context);
    // context.res.cookie("accessToken", accessToken, options);
    // context.res.cookie("refreshToken", refreshToken, options);
    // console.log(people, accessToken, refreshToken);
    return loggedInUser;
  },
};

module.exports = { addPeople, loginPeople };
