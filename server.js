// server.js
// SERVER-SIDE JAVASCRIPT


/////////////////////////////
//  SETUP and CONFIGURATION
/////////////////////////////

//require express in our app
var express = require('express'),
	app = express();
  bodyParser = require('body-parser');
	mongoose = require('mongoose');

// serve static files in public
app.use(express.static('public'));

// body parser config to accept our datatypes
app.use(bodyParser.urlencoded({ extended: true }));

var db = require('./models');

////////////////////
//  DATA
///////////////////


// var newBookUUID = 18;

////////////////////
//  ROUTES
///////////////////


// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('views/index.html' , { root : __dirname});
});

// get all books
app.get('/api/books', function (req, res) {
    // send all books as JSON response
    db.Book.find()
      // populate fills in the author id with all the author data
      .populate('author')
      .exec(function(err, books){
        if (err) {
					status(500).send(err);
					return;
				}
        res.json(books);
      });
});

// create new book
app.post('/api/books', function (req, res) {
    // create new book with form data (`req.body`)
    var newBook = new db.Book({
      title: req.body.title,
      image: req.body.image,
      releaseDate: req.body.releaseDate,
    });


   db.Author.find({name: req.body.author}, function(err, author){
      // if the author exists then add author to a book
			if (author.length !== 0) {
      	newBook.author = author;
				newBook.save(function(err,book){
        	if (err) {return console.log("error:" + err);}
						console.log("new book:" + book.title);
						res.json(book);
					})
			} else {   //create a new book. add a new author to the database
				var newAuthor = new db.Author({   //add new author to DB
					name: req.body.author,
					alive: true,
				});
				newAuthor.save(function(err, author){  //save new author
        	console.log("new author:" + author);
					newBook.author = author;

      // add newBook to database
     			newBook.save(function(err, book){  //save the book with the author attribute
        		if (err) {
          		return console.log("create error: " + err);
        		}
        		console.log("created ", book.title);
        		res.json(book);    // send the book to the view
      		});
				});
			}
   });

});

app.get('/api/books/:id', function (req, res) {
  // find one book by its id
  db.Book.findById(req.params.id)
    // populate the author
    .populate('author')
    .exec(function(err, book){
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.json(book);
    });

});
/*
app.put("/api/books/:_id", function bicycleUpdate(req, res){
  var bookId = req.params._id;
  var bookData = req.body; // security concern to handoff without checking what it is

  // http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
  db.Book.findOneAndUpdate(
		// populate the author
    .populate('author')
		.exec({_id: bookId}, bookData, {new: true}, function(err, updatedBook){
      if (err) {
			 res.status(500).send(err);
			 return;
			}
      res.send(updatedBook);
    });
});
*/
/*
app.update('/api/books/:id', function(req,res){
// get book id from url params (`req.params`)
  var bookId = req.params.id;
  // find the index of the book we want to remove
	db.Book.findOne({_id: bookId}, function(err, foundBook) {
  	if (err) {
    	return console.log("error:" + err);
		} else {
      //update the book attributes
			foundBook.title = req.body.title;
			foundBook.author = req.body.author;
			foundBook.image = req.body.image;
			foundBook.releaseDate = req.body.releaseDate;
			//save updated book attributes in db
		 	foundBook.save(function(err, savedBook) {
      if (err) {
				return console.log("error:" + err);
			} else {
      	res.json(savedBook);
			}

			});

		}
	});

});

*/

/* DELETE BOOK */
app.delete('/api/books/:id', function destroy(req, res) {
  // get books id from url params (`req.params`)
  var bookId = req.params.id;
  // find book in db by id and remove
  db.Book.findOneAndRemove({ _id: bookId }, function (err, deletedBook) {
    res.json(deletedBook);
  });
});

/* SERVER */

// listen to port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Book app listening at http://localhost:3000/');
})
