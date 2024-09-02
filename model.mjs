import mongoose from 'mongoose';
import 'dotenv/config';

const IRS_DB_NAME = "IRS";
const LOCATION_COLLECTION = "locations";
const LOCATION_CLASS = 'location';
const BLOG_POST_COLLECTION = "blog_posts";
const BLOG_POST_CLASS = "blog_post";

let connection = undefined;
let Location = undefined;
let BlogPost = undefined;

/**
 * This function does the following
 * 1. Connects to the MongoDB server
 * 2. Drop EXERCISE_COLLECTION if asked to
 * 3. Creates a model class for the exercise schema
 * @param {Boolean} dropCollection If true, drop EXERCISE_COLLECTION
 */
async function connect(dropCollection){
    try{
        connection = await createConnection();
        console.log("Successfully connected to MongoDB using Mongoose!");
        if(dropCollection){
            await connection.db.dropCollection(LOCATION_COLLECTION);
            await connection.db.dropCollection(BLOG_POST_COLLECTION);
        }
        Location = createLocationModel();
        BlogPost = createBlogPostModel();
    } catch(err){
        console.log(err)
        throw Error(`Could not connect to MongoDB ${err.message}`);
    }
}

/**
 * Connect to the MongoDB server for the connect string in .env file
 * @returns A connection to the server
 */
async function createConnection(){
    await mongoose.connect(process.env.MONGODB_CONNECT_STRING,
        {dbname: IRS_DB_NAME});
    return mongoose.connection;
}

/**
 * Define a schema for the location collection, compile a model and return the model
 * @returns A model object for the locationSchema
 */
function createLocationModel(){
    // Define the schema
    const locationSchema = mongoose.Schema({
        lat: {type: Number, required: true},
        long: {type: Number, required: true},
    }
    );
    // Compile the model class from the schema after a schema is defined
    return mongoose.model(LOCATION_CLASS, locationSchema);
}

/**
 * Define a schema for the blog_post collection, compile a model and return the model
 * @returns A model object for the blogPostSchema
 */
function createBlogPostModel(){
    // Define the schema
    const blogPostSchema = mongoose.Schema({
        location_id: {type: String, required: true},
        user: {type: String, required: true},
        date: {type: String, required: true},
        time: {type: String, required: true},
        text: {type: String, required: true},
    }
    );
    // Compile the model class from the schema after a schema is defined
    return mongoose.model(BLOG_POST_CLASS, blogPostSchema);
}

/**
 * Creates a location object and saves it to the database.
 * @returns a json object of the created document
 */
async function createLocation(lat, long){
    const location = new Location({lat: lat, long: long});
    return location.save();
}

/**
 * Creates a blogPost object and saves it to the database.
 * @returns a json object of the created document
 */
async function createBlogPost(location_id, user, date, time, text){
    const blog_post = new BlogPost(
        {
            location_id: location_id,
            user: user,
            date: date,
            time: time,
            text: text,
        });
    return blog_post.save();
}

/**
 * Finds all documents in the model
 * @returns a json array document objects
 */
async function findLocations(){
    const query = Location.find({});
    return query.exec();
}

/**
 * Finds all documents in the model
 * @returns a json array document objects
 */
async function findBlogPosts(location_id){
    const query = BlogPost.find({location_id: location_id})
    return query.exec();
}

export { connect , createLocation, findLocations, createBlogPost, findBlogPosts };