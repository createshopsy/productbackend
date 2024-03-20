// const mongoose = require("mongoose");

// const BlogSchema = new mongoose.Schema({
//   title: { type: String, es_indexed: true },
//   blog_text: { type: String, es_indexed: true },
//   author_name: { type: String, es_indexed: true },
//   sequence_num: Number,
//   category: { type: String, es_indexed: true },
//   created_at: { type: Date, default: Date.now },
//   modified_at: { type: Date, default: Date.now },
//   is_verified: { type: Boolean, es_indexed: true },
// });

// BlogSchema.plugin(mongoosastic);
// const Blog = mongoose.model("Blog", BlogSchema, "blogs");

// const stream = Blog.synchronize();
// stream.on("error", function (err) {
//   console.log("Error while synchronizing" + err);
// });
// blog.save(function (err) {
//   if (err) throw err;

//   blog.on("es-indexed", function (err, res) {
//     if (err) throw err
//   });
// });

// const  collections = ['blogs'];
// const types = ['blog'];
// const fields = ["blog_text³", "title"]
// const filter = {
//   "is_verified": true
// };
// const sort = "_score";
// Blog.search({
//     bool: {
//       must: [{
//         multi_match: {
//           query: searchString,
//           type: "phrase",
//           fields: fields,
//         },
//       }],
//       should: [{
//         multi_match: {
//           query: searchString,
//           fields: fields,
//           operator: "and",
//           boost: 10,
//           minimum_should_match: "100%"
//         },
//       }],
//       filter: [{
//         term: filter
//       }]
//      }
//    }, {
//      index: collections,
//      type: types,
//      from: from,
//      size: 10,
//      track_scores: true,
//      sort: sort
//     },
//     function (err, results) {
//       if (err) {
//          console.log("Error in searchController: ", err);
//        } else {
//          res.json({result: results.hits.hits})
//        }
//      });