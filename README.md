### How to run

```
npm i

PORT=4000 npm start

## run json-server
json-server --watch db.json

```

#### json-server
```
http://localhost:3000/users
http://localhost:3000/users/40
http://localhost:3000/companies/1
http://localhost:3000/companies/1/users
```

#### Query

```
{
  user(id: "40") {
    firstName,
    company {
      id,
      name,
      description
    }
  }
}

// Not common (could be used in FE)
fragment companyDetails on Company {
  id
  name
  description
}

{
  apple: company(id: "1") {
    ...companyDetails
  }
  google: company(id: "1") {
    ...companyDetails
  }
}

// Mutation
mutation {
  addUser(firstName: "Test", age: 27) {
    id
    firstName
    age
  }
}


```

- Bidirectional reference
- Circular reference

- Lokka: simple, basic queries, mutation. Some simple caching
- Appolo Client
- Relay: performance for mobile. 
