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
console.log(uri);
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});
app.get('/', (req, res) => {
    res.send('Server Running');
});

app.listen(Port, () => {
    console.log(`Server Running on Port ${Port}`);
});
