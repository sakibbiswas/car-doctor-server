const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 4000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware
app.use(cors())
app.use(express.json())
console.log(process.env.db_users);


const uri = `mongodb+srv://${process.env.db_users}:${process.env.db_pass}@cluster0.yk6uldw.mongodb.net/?retryWrites=true&w=majority`;

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
        const database = client.db("car-doctor");
        const servicecolection = database.collection("sirvices")
        const bookingecolection = database.collection("bookings")

        // booking
        app.get('/bookings', async (req, res) => {
            console.log(req.query.email);
            let query = {}
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const cursor = bookingecolection.find(query);
            const result = await cursor.toArray()
            res.send(result)

        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log(booking);
            const result = await bookingecolection.insertOne(booking);
            res.send(result)
        })
        app.put('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const updatebooking = req.body
            console.log(updatebooking);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const booking = {
                $set: {
                    status: updatebooking.status

                },
            };
            const result = await bookingecolection.updateOne(filter, booking, options);
            res.send(result)

        })
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            console.log('please delete from database', id);
            const query = { _id: new ObjectId(id) };
            const result = await bookingecolection.deleteOne(query);
            res.send(result)
        })

        app.get('/sirvices', async (req, res) => {
            const cursor = servicecolection.find();
            const result = await cursor.toArray()
            res.send(result)

        })

        app.get('/sirvices/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = {
                projection: { title: 1, price: 1, service_id: 1, img: 1 },
            };
            const result = await servicecolection.findOne(query, options);
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
    res.send('car doctor is running')
})

app.listen(port, () => {
    console.log(` car API is running  on port : ${port}`)
})