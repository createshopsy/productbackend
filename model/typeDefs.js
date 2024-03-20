const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Upload
  type userdata {
    username: String!
    firstname: String!
    lastname: String!
    email: String!
    role: String!
    password: String!
    image: String!
  }
  type userwithid {
    _id: ID!
    username: String!
    firstname: String!
    lastname: String!
    role: String!
    email: String!
    password: String!
  }
  
  type singleproduct {
    _id: ID!
     title: String!
    description: String!
    stock: Int!
    price: Int!
    image: [String]!

  }

  type getallproducts {
    title: String!
    description: String!
    stock: Int!
    price: Int!
    image: [String]!
  }

  type postproduct {
    title: String!
    description: String!
    stock: Int
    price: Int
    image: [String]!
  }

  type AuthPayload {
    token: String
    user: userwithid
  }

  type registerInput {
    username: String!
    firstname: String!
    lastname: String!
    password: String!
    email: String!
    image: String!
  }


  type createcart{
    _id:ID!
    userId:ID!
  }

  type Query {
    getallusers: [userdata]
    findUserById(_id: ID): userwithid
    allproducts(page: Int, limit: Int): [getallproducts]
    getsingleproductswithid(_id: ID!): singleproduct
  }

  type Mutation {
    saveproduct(
      title: String!
      description: String!
      stock: Int
      price: Int
      image: Upload!
    ): postproduct!

    login(email: String!, password: String!): AuthPayload
    signup(
      username: String!
      firstname: String!
      lastname: String!
      password: String!
      email: String!
      image: Upload!
    ): userdata

    createusercart(_id:ID): createcart
    addToCart(productId: ID!, quantity: Int!): postproduct
      
  }
`;

module.exports = typeDefs;
