/* eslint-disable no-unused-vars */
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const Port = process.env.Port || 5000;
const app = express();

app.use(express.json());
app.use(cors());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rqwof3p.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        const productCollection = client.db('computerVillage').collection('products');

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
    } finally {
        // await client.close();
    }
}
run().catch((error) => console.error(error.message));

app.get('/', (req, res) => {
    res.send('Server Running');
});

app.listen(Port, () => {
    console.log(`Server Running on Port ${Port}`);
});
