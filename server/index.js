require("dotenv").config();
const express = require("express");
const http = require("http");
const { createHandler } = require("graphql-http/lib/use/http");
const schema = require("./schema/schema");
const connectDB = require("./database/connectDB");
const cors = require("cors");

const port = process.env.PORT || 6000;
const app = express();

// connect to database
connectDB();

//cors policy
app.use(cors());

const handler = createHandler({ schema });

// Create a HTTP server using the listener on `/graphql`
const server = http.createServer((req, res) => {
  if (req.url.startsWith("/graphql")) {
    handler(req, res);
  } else {
    res.writeHead(404).end();
  }
});

server.listen(port);

console.log(`Listening to port ${port}`);

