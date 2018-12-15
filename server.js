const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const exphbs = require('express-handlebars');
const hbs = require("handlebars");

// Our scraping tools

const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

const PORT = process.env.PORT || 3000;
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapeIt";
mongoose.connect(MONGODB_URI);


// Initialize Express
const app = express();

// middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// handlebars 

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

hbs.registerHelper('each_upto', function (ary, max, options) {
  if (!ary || ary.length == 0)
    return options.inverse(this);

  let result = [];
  for (let i = 0; i < max && i < ary.length; ++i)
    result.push(options.fn(ary[i]));
  return result.join('');
});
// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scrapeIt", { useNewUrlParser: true });

// Routes
app.get("/", function (req, res) {
  db.Article
    .find({ saved: false })
    .then(function (dbArticle) {
      let hbsObject = {
        articles: dbArticle
      };
      res.render("index", hbsObject);
    })
    .catch(function (err) {
      res.json(err);
    });
});


// A GET route for scraping 
app.get("/scrape", function (req, res) {

  axios.get("https://www.npr.org/sections/animals/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    let $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function (i, element) {

      let result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      result.saved = false;

      // Create a new Article 
      db.Article.create(result)
        .then(function (dbArticle) {

          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {

  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, update status to "saved"
app.post("/save/:id", function (req, res) {
  db.Article
    .update({ _id: req.params.id }, { $set: { saved: true } })
    .then(function (dbArticle) {
      res.json("dbArticle");
    })
    .catch(function (err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, update status to "unsaved"
app.post("/unsave/:id", function (req, res) {
  db.Article
    .update({ _id: req.params.id }, { $set: { saved: false } })
    .then(function (dbArticle) {
      res.json("dbArticle");
    })
    .catch(function (err) {
      res.json(err);
    });
});

//Route to send Articles to handlebars and populate with saved articles
app.get("/saved", function (req, res) {
  db.Article
    .find({ saved: true })
    .then(function (dbArticles) {
      var hbsObject = {
        articles: dbArticles
      };
      res.render("saved", hbsObject);
    })
    .catch(function (err) {
      res.json(err);
    });
});


//get route to retrieve all notes for a particlular article
app.get('/getNotes/:id', function (req, res) {
  db.Article
    .findOne({ _id: req.params.id })
    .populate('note')
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

//post route to create a new note in the database
app.post('/createNote/:id', function (req, res) {
  db.Note
    .create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });//saving reference to note in corresponding article
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});



// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});