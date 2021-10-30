const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express()
const port = 5000;


// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tsora.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        // post api data create kore database e raka 
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log("get hitted service", service)
            const result = await servicesCollection.insertOne(service);
            console.log(result)
            res.json(result);

        })


        // data get kora  sobgulu services get kora
        // get api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // single service dekanu
        //data get kore dekanu find use kore id dore 

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log("hitted the service", id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        // kunu single item ke id dore delte kora
        // delete api 
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("hitting the website");
})

app.listen(port, () => {
    console.log("get started the website");
})