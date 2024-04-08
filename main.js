const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const dotenv = require("dotenv");
const mysql = require("mysql");

const app = express();
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

const pool = mysql.createPool(dbConfig);

const root = {
  customers: () => {
    return new Promise((resolve, reject) => {
      pool.query("SELECT * FROM Customers", (err, results) => {
        if (err) {
          console.error("Error getting customer data:", err);
          reject({ error: "Error getting customer data" });
        } else {
          console.log("Data retrieval successful");
          resolve(results);
        }
      });
    });
  },
  customerByID: ({ id }) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM Customers WHERE CustomerID = ?",
        [id],
        (err, results) => {
          if (err) {
            console.error("Error getting customer data by ID:", err);
            reject({ error: "Error getting customer data by ID" });
          } else {
            console.log("Data retrieval by ID successful");
            resolve(results[0]);
          }
        }
      );
    });
  },
  addCustomer: ({ input }) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "INSERT INTO `Customers`(`CustomerID`, `FirstName`, `LastName`) VALUES (?,?,?)",
        [input.CustomerID, input.FirstName, input.LastName],
        (err, results) => {
          if (err) {
            console.error("Error inserting customer:", err);
            reject({ error: "Error inserting customer" });
          } else {
            console.log("Insert successful");
            resolve(input);
          }
        }
      );
    });
  },
  updateCustomer: ({ input }) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "UPDATE Customers SET FirstName = ?, LastName = ? WHERE CustomerID = ?",
        [input.FirstName, input.LastName, input.CustomerID],
        (err, results) => {
          if (err) {
            console.error("Error updating customer:", err);
            reject({ error: "Error updating customer" });
          } else {
            console.log("Update successful");
            resolve(input);
          }
        }
      );
    });
  },
  deleteCustomer: ({ id }) => {
    return new Promise((resolve, reject) => {
      pool.query(
        "DELETE FROM Customers WHERE CustomerID = ?",
        [id],
        (err, results) => {
          if (err) {
            console.error("Error deleting customer:", err);
            reject({ error: "Error deleting customer" });
          } else {
            console.log("Delete successful");
            resolve({ message: "Customer deleted successfully" });
          }
        }
      );
    });
  },
};

const schema = buildSchema(`
  type Customer {
    CustomerID: Int
    FirstName: String
    LastName: String
  }
  
  input CustomerInput {
    CustomerID: Int!
    FirstName: String!
    LastName: String!
  }
  
  type Query {
    customers: [Customer]
    customerByID(id: Int!): Customer
  }

  type Mutation {
    addCustomer(input: CustomerInput): Customer
    updateCustomer(input: CustomerInput): Customer
    deleteCustomer(id: Int!): Message
  }

  type Message {
    message: String
  }
`);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
