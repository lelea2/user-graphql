// NOTE: it seems to be OK to have schema file as one file?

const graphql = require('graphql');
// const users = require('./mock/user');
// const _ = require('lodash');
const axios = require('axios');
const SERVER_HOST = 'htpp://localhost:3000';

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({ // should put in closure, only execute after run
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType), // has many relationship
      resolve(parentValue, args) {
        // console.log(parentValue);
        return axios.get(`${SERVER_HOST}/companies/${parentValue.id}/users`).then((resp) => resp.data);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        // console.log(parentValue); // { id: '40', firstName: 'Samantha', age: 25, companyId: '1' }
        // console.log(args); // {}
        return axios.get(`${SERVER_HOST}/companies/${parentValue.companyId}`).then(resp => resp.data);
      }
    }
  })
});

// Define root query in graphQL
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) { // GraphQL function, go in DB to get data
        // return _.find(users, { id: args.id });
        return axios.get(`${SERVER_HOST}/users/${args.id}`).then(resp => resp.data);
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`${SERVER_HOST}/companies/${args.id}`).then(resp => resp.data);
      }
    }
  })
});

// Mutation
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) }, // Field is required
        age: { type: new GraphQLNonNull(GraphQLInt) }, // Field is required.
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age }) {
        // console.log(parentValue);
        return axios.post(`${SERVER_HOST}/users`, { firstName, age }).then(resp => resp.data);
      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, { id }) {
        return axios.delete(`${SERVER_HOST}/users/${id}`).then(resp => resp.data);
      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        companyId: { type: GraphQLString }
      },
      resolve(parentValue, { firstName, age, companyId, id }) {
        return axios.patch(`${SERVER_HOST}/users/${id}`, { firstName, age, companyId}).then(resp => resp.data); // patch only update data that is modified. Put update the whole input field
      }
    }
  })
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation
});
