// const { Client } = require("@elastic/elasticsearch");
// const esClient = new Client({
//   node: "https://localhost:9200",

//   auth:{
//     username:"test",
//     password:"nehamishra@123"
//   }
// });
// console.log(esClient, "client");
// async function createTitle() {
//   const { response } = await esClient.indices.create({
//     index: "title",
//     id: "1",
//     body: {
//       title: "this is a test for elastic search",
//     },
//   });
// }
// createTitle().catch(console.log);
// const { Client } = require('@elastic/elasticsearch');

// const elasticClient = new Client({
//   node: 'http://localhost:9200',
// });
// // Inside your product creation route or function
// const newProduct = new products({
//   title: 'Product Title',
//   description: 'Product Description',

// });

// await newProduct.save();

// await elasticClient.index({
//   index: 'products_index',
//   body: {
//     title: newProduct.title,
//     description: newProduct.description,

//   },
// });

// const searchProducts = async (req, res) => {
//   const { query } = req.query;

//   try {
//     const { body } = await elasticClient.search({
//       index: 'products_index',
//       body: {
//         query: {
//           match: {
//             title: query,
//           },
//         },
//       },
//     });

//     const products = body.hits.hits.map(hit => hit._source);

//     res.status(200).json({ message: 'success', products });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// app.get('/api/products/search', searchProducts);

// async function searchProducts(query) {
//     try {
//         const { body } = await client.search({
//             index: 'products',
//             body: {
//                 query: {
//                     match: {
//                         name: query // Assuming the product name is stored in the "name" field
//                     }
//                 }
//             }
//         });
//         return body.hits.hits.map(hit => hit._source); // Extracting the source (document) from search hits
//     } catch (error) {
//         console.error("Error searching for products:", error);
//         return []; // Return an empty array if an error occurs
//     }
// }
//  const express = require('express');
// const app = express();

// app.get('/search', async (req, res) => {
//     const query = req.query.q; // Assuming the search query is passed as a query parameter named "q"
//     if (!query) {
//         return res.status(400).json({ error: "Query parameter 'q' is required." });
//     }

//     const products = await searchProducts(query);
//     res.json(products);
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(Server is running on port ${PORT});
// });
// const elasticsearch = async (req, res) => {
//     const { title } = req.query; // Assuming the title is passed as a query parameter

//     try {
//       const { body } = await client.search({
//         index: 'products', // Assuming the index name is 'products'
//         body: {
//           query: {
//             match: {
//               title: title // Assuming the title field in Elasticsearch documents is named 'title'
//             }
//           }
//         }
//       });

//       const products = body.hits.hits.map(hit => hit._source); // Extracting source (document) from search hits
//       res.status(200).json({ message: "success", products });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   };
// const { Client } = require('@elastic/elasticsearch');
//   const client = new Client({ node: 'http://localhost:9200' }); // Replace with your Elasticsearch server URL
//  const { Client } = require('@elastic/elasticsearch');
// const client = new Client({ node: 'http://localhost:9200' });

// const saveToElasticsearch = async (data) => {
//   const body = data.flatMap(doc => [{ index: { _index: 'products', _id: doc._id } }, doc]);

//   try {
//     await client.bulk({ refresh: true, body });
//     console.log('Data saved to Elasticsearch successfully.');
//   } catch (error) {
//     console.error('Error saving data to Elasticsearch:', error);
//     throw error;
//   }
// };
// [8:50 am, 18/03/2024] Nehu❤: const products = require("../schema/Product");

// const getproducts = async () => {
//   try {
//     return await products.find();
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

// const saveToElasticsearch = async (data) => {
//   const body = data.flatMap(doc => [{ index: { _index: 'products', _id: doc._id } }, doc]);

//   try {
//     await client.bulk({ refresh: true, body });
//     console.log('Data saved to Elasticsearch successfully.');
//   } catch (error) {
//     console.error('Error saving data to Elasticsearch:', error);
//     throw error;
//   }
// };

// // Invoke functions
// (async () => {
//   try {
//     const allProducts = await getproducts();
//     await saveToElasticsearch(allProducts);
//   } catch (error) {
//     console.error('Error:', error);
//   }
// })();
