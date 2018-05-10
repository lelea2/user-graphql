const server = require('express');
const expressGraphQL = require('express-graphql');
const PORT = process.env.PORT || 4000;
const schema = require('./schema/schema');

const app = server();

app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));


app.listen(PORT, () => {
  console.log(`Listening to ${PORT}...`);
});
