import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();// Load environment variables from the .env file
import netflixTitleRoutes from "./routes/netflixTitleRoutes";
import { NetflixTitleModel} from "./models/NetflixTitle";
import { ActorModel } from "./models/Actor";
import { CountryModel } from "./models/Country";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/netflixTitles' // Get the MongoDB connection URL from environment variables
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });// Connect to the MongoDB database
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors
app.use(cors());// Enable CORS (Cross-Origin Resource Sharing)
app.use(express.json());// Parse incoming JSON data
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data

//-------Populating the database for the 3 collections from scratch--------------

const feedDatabase = async () =>{

  await NetflixTitleModel.deleteMany();
  await ActorModel.deleteMany();
  await CountryModel.deleteMany();

  netflixData.forEach((title)=>{
    new CountryModel({name: title.country}).save();
    const castList= title.cast.split(",");
    castList.forEach((actor)=>{
      new ActorModel({name:actor.trim()}).save()}
      )
    new NetflixTitleModel(title).save();
  })
}


//failed attempt to populate my Actor and Country collections for more exploration purposes
/*   netflixData.forEach((title)=>{
    const countryObject = new CountryModel({name: title.country}).save();
    const castList= title.cast.split(",");
    const castObject = [];
    castList.forEach((actor)=>{
      castObject.push(new ActorModel({name:actor.trim()}).save())}
      )
    new NetflixTitleModel(
      {
        show_id: title.show_id,
        title: title.title,
        country: title.country,
        director : title.director,
        date_added: title.date_added,
        release_year : title.release_year,
        rating: title.rating,
        duration: title.duration,
        listed_in: title.listed_in,
        description: title.description,
        type : title.type,
        cast : title.cast
      }
      ).save();
  }) */

if (process.env.RESET_DATABASE == 'true'){
  feedDatabase();
}
// Using the routes to handle API requests
app.use(netflixTitleRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
