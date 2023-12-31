const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wo01dvu.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const collegesCollection = client.db('collegeBookr').collection('collegesData');

    app.get('/colleges', async(req, res) => {
      const cursor = collegesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/colleges/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const options = {
        projection: {name: 1, image: 1, events: 1, researchHistory: 1, sports: 1, admissionProcess: 1}
      };
      const result = await collegesCollection.findOne(query, options);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('College Bookr server is running')
})


app.listen(port, () => {
  console.log(`College Bookr server is running on port: ${port}`)
})