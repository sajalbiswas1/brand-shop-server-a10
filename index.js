const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port= process.env.PORT || 5000




//middleware
app.use(cors());
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2fbewnn.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();

        const productCollection = client.db("productsDb").collection("products");
        const userCardCollection = client.db("productsDb").collection("userCards")
        const specialCollection = client.db("productsDb").collection("special")


        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            console.log(query)
            const result = await productCollection.findOne(query)
            res.send(result)
        })


        app.get('/products/brand/:name', async (req, res) => {
            const name = req.params.name;
            const query = { brand:name }
            const cursor = productCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        

        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct)
            const result = await productCollection.insertOne(newProduct);
            res.send(result)
        })

        app.put('/products/:id', async(req,res)=>{
            const id = req.params.id;
            const user = req.body;
            console.log(id, user);

            const filter = {_id: new ObjectId(id)};
            const options = {upsert:true};
            const updateUser = {
                $set:{
                    name:user.name,
                    brand:user.brand, 
                    type:user.type, 
                    price:user.price, 
                    rating:user.rating, 
                    image:user.image,
                }
            }
            const result = await productCollection.updateOne(filter, updateUser, options);
            res.send(result);
        })
        //Special
        app.get('/special', async (req, res) => {
            const cursor = specialCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        //User Car section
        
        app.get('/userCard', async (req, res) => {
            const cursor = userCardCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/userCard/:email', async (req, res) => {
            const getEmail = req.params.email;
            const query = { email:getEmail }
            const cursor = userCardCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/userCard', async (req, res) => {
            const newUserCard = req.body;
            console.log(newUserCard)
            const result = await userCardCollection.insertOne(newUserCard);
            res.send(result)
        })

        app.delete('/userCard/remove/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCardCollection.deleteOne(query)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Brand Shop Server is running')
})

app.listen(port, () => {
    console.log(`Brand Shop server is running port: ${port}`)
})