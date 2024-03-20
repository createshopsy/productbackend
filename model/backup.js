// }
// // const { Client } = require('@elastic/elasticsearch');
// // const client = new Client({ node:'http://localhost:4545' });

// // const elasticsearch = async (req, res) => {
// //   try {
// //     const { q } = req.query;
// //     console.log(req.query);

//     // const response = await client.search({
//     //   index: "search",
//     //   body: {
//     //     query: {
//     //       match: {
//     //         title: {
//     //           query: q
//     //         }
//     //       }
//     //     }
//     //   }
//     // });

// //     res.json(response.body.hits.hits);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };
// const express = require('express');
// const { Client } = require('@elastic/elasticsearch');
// const app = express();
// const client = new Client({ node: 'http://localhost:9200' });

// app.get('/search', async (req, res) => {
//   try {
//     const { q } = req.query;
//     console.log(req.query);

//     const response = await client.search({
//       index: 'products',
//       body: {
//         query: {
//           match: { title: q }
//         }
//       }
//     });

//     console.log(response);
//     res.json(response.hits.hits);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });
// const elasticsearch = require('elasticsearch');

// const client = new elasticsearch.Client({
//   // Elasticsearch client configuration
// });

// const searchProductsByTitle = async (req, res) => {
//   try {
//     const { q } = req.query;
//     console.log(req.query);
    
//     const response = await client.search({
//       index: 'products_index',
//       body: {
//         query: {
//           match: { title: q }
//         }
//       }
//     });

//     console.log(response);
//     res.json(response.hits.hits);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };







// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// const { Client } = require('@elastic/elasticsearch');
// const client = new Client({ node: 'http://localhost:9200' }); // Update with your Elasticsearch server URL// Inside your product creation/update logic
// await client.index({
//   index: 'products',
//   body: {
//     title: 'Product Title',
//     // Add other product details here
//   }
// });// Inside your product creation/update logic
// await client.index({
//     index: 'products',
//     body: {
//       title: 'Product Title',
//       // Add other product details here
//     }
//   });
// const { body } = await client.search({
//     index: 'products',
//     body: {
//       query: {
//         match: { title: 'Search Keyword' } // Update with the title you want to search for
//       }
//     }
//   });
  
//   const products = body.hits.hits.map(hit => hit._source);
//   res.status(200).json({ message: 'success', products });
// const { Client } = require("@elastic/elasticsearch");
// const client = new Client({ node: "http://localhost:9200" });

// // Define the product schema mapping
// const productMapping = {
//   properties: {
//     title: { type: "text" },
//     description: { type: "text" },
//     price: { type: "float" },
//     in_stock: { type: "boolean" },
//     category: { type: "keyword" },
//   }
// };

// // Create an index for products with the defined mapping
// async function createProductIndex() {
//   await client.indices.create({
//     index: "products",
//     body: {
//       mappings: {
//         properties: productMapping
//       }
//     }
//   });
//   console.log("Product index created with mapping");
// }

// // Index sample product data
// async function indexSampleProducts() {
//   const products = [
//     { title: "Product 1", description: "Description 1", price: 19.99, in_stock: true, category: "Electronics" },
//     { title: "Product 2", description: "Description 2", price: 29.99, in_stock: false, category: "Clothing" }
//   ];

//   const body = products.flatMap(doc => [{ index: { _index: "products" } }, doc]);
//   const { body: bulkResponse } = await client.bulk({ refresh: true, body });
//   console.log("Sample products indexed:", bulkResponse);
// }

// // Search for products based on a keyword
// async function searchProducts(keyword) {
//   const { body } = await client.search({
//     index: "products",
//     body: {
//       query: {
//         match: { title: keyword }
//       }
//     }
//   });

//   const products = body.hits.hits.map(hit => hit._source);
//   console.log("Products found:", products);
// }

// // Execute functions to create index, index sample products, and search for products
// createProductIndex().then(() => {
//   indexSampleProducts().then(() => {
//     searchProducts("Product 1");
//   });
// });
// Define a route for product search
// app.get('/api/products/search', async (req, res) => {
    // try {
    //   const { body } = await client.search({
    //     index: "products",
    //     body: {
    //       query: {
    //         match: { title: req.query.keyword }, 
    //       },
    //     },
    //   });
  
    //   const products = body.hits.hits.map((hit) => hit._source);
    //   res.status(200).json({ message: "success", products });
    // } catch (error) {
    //   res.status(500).json({ message: "error", error: error.message });
    // }
// //   });
// const { body } = await client.search({
//     index: "products",
//     body: {
//       query: {
//         match: { title: "Product Title" }, // Update "Product Title" with your search keyword
//       },
//     },
//   });
// const { Client } = require("@elastic/elasticsearch");
// const port = 9200; // Assuming port is defined somewhere in your code
// const client = new Client({ node: `http://localhost:${port}` });

// // Export the client object for use in other modules
// module.exports = client;

// console.log(client, "Connected to Elasticsearch");




// const { Client } = require("@elastic/elasticsearch");
// const elasticClient = require("./path/to/your/elasticsearch/client"); // Import the Elasticsearch client

// const searchElastic = async (keyword) => {
//   try {
//     const { body } = await elasticClient.search({
//       index: "products",
//       body: {
//         query: {
//           match: { title: keyword }
//         }
//       }
//     });

//     const products = body.hits.hits.map(hit => hit._source);
//     return products;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Elasticsearch search error");
//   }
// };
// const getallproducts = async (req, res) => {
//     const { page = 1, limit = 6, keyword } = req.query;
//     const limitset = Number(limit);
  
//     try {
//       let product;
//       if (keyword) {
//         product = await searchElastic(keyword); // Search in Elasticsearch if keyword is provided
//       } else {
//         product = await products.find().limit(limitset); // Default MongoDB query
//       }
  
//       const currentPage = page;
//       res.status(200).json({ message: "success", product, currentPage });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   };



// server

// // app.js

// const express = require("express");
// const app = express();
// const port = process.env.PORT || 6867;

// // Middleware
// app.use(express.json());

// // Define a route for searching
// app.get('/api/search', async (req, res) => {
//   const { keyword } = req.query;

//   // Perform search logic here
//   // You can use Elasticsearch or any other search engine to retrieve results based on the keyword

//   // For demonstration purposes, sending back a sample response with the keyword
//   res.status(200).json({ message: "Search results", keyword });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// http://localhost:6867/api/search?


// esClient.search({
//   index: 'products',
//   type: 'products',
//   body: {
//     query: {
//       multi_match: {
//         query: 'server js',
//         fields: ['title', 'description']
//       }
//     }
//   }
// }).then(function(response) {
//   const  hits = response.hits.hits;
//   console.log(hits,"hitsd")
// }).catch(function (error) {
//   console.trace(error.message);
// });
// import React, { useState, useEffect, useRef } from 'react';
// import { io } from 'socket.io-client';
// import axios from 'axios';
// import Peer from 'simple-peer';
// import Webcam from 'react-webcam';
// import { Button } from '@material-ui/core';
// import VideoCallIcon from '@material-ui/icons/VideoCall';

// const Showchat = () => {
//   // Existing code...

//   const handleVideoCall = () => {
//     setShowWebcam(!showWebcam);
//     callUser(selectedUserId);
//   };

//   return (
//     <div>
//       {/* Existing code... */}
//       {showWebcam && <Webcam height={300} width={300} videoConstraints={videoConstraints} />}
//       <Button onClick={handleVideoCall}>
//         {showWebcam ? 'End Call' : 'Start Video Call'}
//       </Button>
//     </div>
//   );
// };

// export default Showchat;