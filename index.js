/* eslint-disable no-unused-vars */
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
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
        const usersCollection = client.db('computerVillage').collection('users');
        const bookingCollection = client.db('computerVillage').collection('booking');

        app.put('/user/:email', async (req, res) => {
            const { email } = req.query;
            const user = req.body;
            const filter = {
                email,
            };
            const options = { upsert: true };

            const updateDoc = {
                $set: user,
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            console.log(result);

            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d',
            });
            res.send({ result, token });
        });

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/product/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            res.send(product);
        });

        app.get('/orders', async (req, res) => {
            console.log(req.query.email);
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email,
                };
            }
            const cursor = bookingCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log(booking);
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
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
