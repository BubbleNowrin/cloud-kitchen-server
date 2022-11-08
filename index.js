const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ng69xjx.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        const foodCollection = client.db('foodaholic').collection('foodData');
        const reviewsCollection = client.db('foodaholic').collection('reviews');

        app.get('/foods', async (req, res) => {
            const query = {};
            const cursor = foodCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/foods/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = foodCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/food', async (req, res) => {
            const query = {};
            const cursor = foodCollection.find(query);
            const food = await cursor.limit(3).toArray();
            res.send(food);
        })

        app.get('/reviews', async (req, res) => {
            const email = req.query.email;
            console.log(email);
            let query = {};
            if (req.query.email) {
                query = {
                    email: email
                }
            }
            const cursor = reviewsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { serviceId: id };
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.post('/reviews/:id', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        })

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            }

            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
        })


    }
    finally {

    }

}
run().catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('foodaholic server running');
})

app.listen(port, () => {
    console.log(`Running server on ${port}`);
})