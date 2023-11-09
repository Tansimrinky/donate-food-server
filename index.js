const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fsmcn5d.mongodb.net/?retryWrites=true&w=majority`;

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


    const foodCollection = client.db("foodDB").collection("foods")
    const requestedFoodCollection = client.db("reqDB").collection("requested")
    const deliveredCollection = client.db("delDB").collection("delivered")

     app.put('/foods/:id', async(req, res) => {
      const id = req.params.id;
     const filter = { _id: new ObjectId(id)}
     const options = { upsert: true}
     const updatedFood = req.body;
     const food = {
      $set : {
        foodName: updatedFood.foodName, 
         foodImg: updatedFood.foodImg,
          foodQuantity: updatedFood.foodQuantity,
           Location: updatedFood.Location,
            ExDate: updatedFood.ExDate,
             Info: updatedFood.Info,
              donatorName: updatedFood.donatorName,
              donatorEmail: updatedFood.donatorEmail,
              DonatorImage: updatedFood.DonatorImage,
      }
     }
     const result = await foodCollection.updateOne(filter, food, options)
     res.send(result)
    })

    // app.get('/foods/:id', async(req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: new ObjectId(id)}
    //   const result = await foodCollection.findOne(query)
    //   res.send(result)
    // })
    
    app.post("/foods", async(req, res) => {
      const newFood = req.body;
      console.log(newFood)
      const result = await foodCollection.insertOne(newFood);
      res.send(result)
    })

    app.post("/reqfood", async(req, res) => {
      const reqFood = req.body;
      console.log(reqFood)
      const result = await requestedFoodCollection.insertOne(reqFood)
      res.send(result)
    })

    app.get("/reqfood" , async (req, res) => {
      const cursor = requestedFoodCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/foods', async (req, res) => {
      const cursor = foodCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get('/foods/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)}
      const result = await foodCollection.findOne(query)
      res.send(result)
    })

    app.delete('/foods/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await foodCollection.deleteOne(query);
    
        if (result.deletedCount > 0) {
          res.status(200).json({ success: true, message: 'Food deleted successfully.' });
        } else {
          res.status(404).json({ success: false, message: 'Food not found or already deleted.' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
      }
    });

    app.delete('/reqfood/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const result = await requestedFoodCollection.deleteOne(query);
      res.send(result)
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
    res.send('food donate is running')
})


app.listen(port, () => {
    console.log(`food donate is running on port ${port}`)
})