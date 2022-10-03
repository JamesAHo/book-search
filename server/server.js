const express = require('express');
const path = require('path');
const db = require('./config/connection');
const {ApolloServer} = require("apollo-server-express")
const {typeDefs, resolvers} = require('./apollo')
const {auth} = require("./utils/auth")



// we no longer need routes folder because of graphql
// const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;
// setting up apollo server
const server = new ApolloServer({
  typeDefs, resolvers,
  context: auth,
});



app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// if we're in production, serve cient/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
// app.use(routes);
const startApolloServer = async(typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({app});
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Graphql is running on port 3001`)
     
    })
  })
    
}
startApolloServer(typeDefs, resolvers);

