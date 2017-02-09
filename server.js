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


var newBookUUID = 18;

////////////////////
//  ROUTES
///////////////////


// define a root route: localhost:3000/
app.get('/', function (req, res) {
  res.sendFile('views/index.html' , { root : __dirname});
});

app.get('/api/books', function (req, res) {
  // send all books as JSON response
  db.Book.find({},function(err, books){
    if (err) {
      return console.log("index error: " + err);
    }
    res.json(books);

  });
});


// get one book
app.get('/api/books/:id', function show(req, res) {
  // find one book by its id
	var bookId = req.params.id;

	db.Book.findOne({_id: bookId}, function(err,foundBook){
  	if (err) {
    	return console.log("show error:" + err);
		} else {
			res.json(foundBook);
		}
	})
});

 /* express
  console.log('books show', req.params);
  for(var i=0; i < books.length; i++) {
    if (books[i]._id === req.params.id) {
      res.json(books[i]);
      break; // we found the right book, we can stop searching
    }
  }
  */
/*
// create new book
app.post('/api/books', function (req, res) {
  // create new book with form data (`req.body`)
  console.log('books create', req.body);
  var newBook = req.body;
  newBook._id = newBookUUID++;
  books.push(newBook);
  res.json(newBook);
});
*/

/* CREATE NEW BOOK */
app.post('/api/books', function create(req, res) {
  // create new book with form data (`req.body`)
  var newBook = new db.Book(req.body);

  // save new book in db
  newBook.save(function(err, savedBook) {
    if (err) {
      return console.log("error:" + err);
    } else {
      res.json(savedBook);
    }
  });
});

/* UPDATE BOOK */
app.put('/api/books/:id', function(req,res){
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

/*
  var updateBookIndex = books.findIndex(function(element, index) {
    return (element._id === parseInt(req.params.id)); //params are strings
  });
  console.log('updating book with index', deleteBookIndex);
  var bookToUpdate = books[deleteBookIndex];
  books.splice(updateBookIndex, 1, req.params);
  res.json(req.params);
});
  */

/*
/* delete book
app.delete('/api/books/:id', function (req, res) {
  // get book id from url params (`req.params`)
  console.log('books delete', req.params);
  var bookId = req.params.id;
  // find the index of the book we want to remove
  var deleteBookIndex = books.findIndex(function(element, index) {
    return (element._id === parseInt(req.params.id)); //params are strings
  });
  console.log('deleting book with index', deleteBookIndex);
  var bookToDelete = books[deleteBookIndex];
  books.splice(deleteBookIndex, 1);
  res.json(bookToDelete);
});
*/

/* DELETE BOOK */
app.delete('/api/books/:id', function destroy(req, res) {
  // get books id from url params (`req.params`)
  var bookId = req.params.id;
  // find book in db by id and remove
  db.Book.findOneAndRemove({ _id: bookId }, function (err, deletedBook) {
    if (err) {
      return console.log("error:" + err);
			//res.status(500).json({ error: err.message });
    } else {
      res.json(deletedBook);
    }
  });
});


/* SERVER */

// listen to port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Book app listening at http://localhost:3000/');
})
