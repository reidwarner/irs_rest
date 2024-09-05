import express from 'express';
import * as model from './model.mjs';
import 'dotenv/config';
import cors from 'cors';
import { corsOptions } from './config/corsOptions.mjs';

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
await model.connect(true);

app.post('/locations', async (req, res) => {

    //Parse the body from the request
    const lat = req.body.lat;
    const long = req.body.long;

    // Create exercise document and send response
    res.status(201).send(await model.createLocation(lat, long));
})

app.get('/locations', async (req, res) => {
    // Find all documents in the model
    res.status(200).send(await model.findLocations());
})

app.post('/blog', async (req, res) => {
    //Parse the body from the request
    const location_id = req.body.location_id;
    const user = req.body.user;
    const date = req.body.date;
    const time = req.body.time;
    const text = req.body.text;

    // Create exercise document and send response
    const newpost = await model.createBlogPost(location_id, user, date, time, text);
    res.status(201).send(newpost);
})

app.get('/blog/:id', async (req, res) => {
    //Parse the body from the request
    const location_id = req.params.id;
    // Find all documents in the model
    const blog_posts = await model.findBlogPosts(location_id);
    if (blog_posts.length > 0){
        res.status(200).send(blog_posts);
    } else{
        res.status(404).send({Error: "Not found"});
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}...`);
});
