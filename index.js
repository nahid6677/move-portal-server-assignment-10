const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xch7i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // await client.connect();
    const movieCollection = client.db("MovieDB").collection("movie");
    const favMovieCollection = client.db("FavoriteMovieDB").collection("movie");

    app.post("/movies", async (req, res) => {
      const movie = req.body;
      const result = await movieCollection.insertOne(movie);
      res.send(result)
    });
    app.post("/favorite", async (req, res) => {
      const favMovie = req.body;
      const result = await favMovieCollection.insertOne(favMovie);
      res.send(result)
    });
    app.get("/favorite", async (req, res) => {
      const favMovies = favMovieCollection.find();
      const result = await favMovies.toArray();
      res.send(result)
    });
    app.delete("/favorite/:id", async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await favMovieCollection.deleteOne(query);
      res.send(result)
    })
    app.get("/movies", async (req, res) => {
      const movies = movieCollection.find();
      const result = await movies.toArray();
      res.send(result)
    });
    app.get("/movies/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await movieCollection.findOne(query);
      res.send(result)
    });

    app.delete("/movies/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await movieCollection.deleteOne(query);
      res.send(result);
    })

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/", (req, res) => {
  res.send(`Move portal server is running on port: ${port}`)
})
app.listen(port, () => {
  console.log(`Move portal server is running on port: ${port}`)
})




