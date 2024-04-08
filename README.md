# Customer Management GraphQL API

This GraphQL API server allows you to manage customer data efficiently using Express.js and MySQL. You can perform CRUD operations on customer records including adding, updating, retrieving, and deleting customer information.

## Query Examples

### Retrieve a List of Customers
query {
  customers {
    CustomerID
    FirstName
    LastName
  }
}
### Retrieve a Specific Customer by ID
query {
  customerByID(id: 1234) {
    CustomerID
    FirstName
    LastName
  }
}
### Add a New Customer
mutation {
  addCustomer(input: { CustomerID: 1233, FirstName: "John", LastName: "Doe" }) {
    CustomerID
    FirstName
    LastName
  }
}
### Update an Existing Customer
mutation {
  updateCustomer(input: { CustomerID: 1233, FirstName: "John2", LastName: "Smith" }) {
    CustomerID
    FirstName
    LastName
  }
}
### Delete a Customer
mutation {
  deleteCustomer(id: 123) {
    message
  }
}
