// This file allows us to seed our application with data
// simply run: `node seed.js` from the root of this project folder.

var db = require('./models');

var books_list = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/to_kill_a_mockingbird.jpg",
    releaseDate: "July 11, 1960"
  },
  {
    title: "The Great Gatsby",
    author: "F Scott Fitzgerald",
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/great_gatsby.jpg",
    releaseDate: "April 10, 1925"
  },
  {
    title: "Les Miserables",
    author: "Victor Hugo",
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/les_miserables.jpg",
    releaseDate: "Unknown 1862"
  },
  {
    title: "Around the World in 80 Days",
    author: "Jules Verne",
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/around_the_world_in_80_days.jpg",
    releaseDate: "January 30, 1873"
  },
  {
    title: "Lean In",
    author: "Sheryl Sandberg",
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/lean_in.jpg",
    releaseDate: "March 11, 2013"
  },
  {
    title: "The Four Hour Workweek",
    author: "Tim Ferriss",
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/four_hour_work_week.jpg",
    releaseDate: "April 1, 2007"
  },
  {
    title: "Of Mice and Men",
    author: "John Steinbeck",
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/of_mice_and_men.jpg",
    releaseDate: "Unknown 1937"
  },
  {
    title: "Romeo and Juliet",
    author: "William Shakespeare",
    image: "https://s3-us-west-2.amazonaws.com/sandboxapi/romeo_and_juliet.jpg",
    releaseDate: "Unknown 1597"
  },
	{
    title: "Dragonwings",
    author: "Lawrence Yep",
    image: "https://images-na.ssl-images-amazon.com/images/I/51Xaen2POmL.jpg",
    releaseDate: "January 23, 2001"
	},
  {
    title: "I\'m Judging You: The Do-Better Manual",
    author: "Luvvie Ajayi",
    image: "http://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1458043163i/29513537._UY200_.jpg",
    releaseDate: "January 23, 2001"
	},
  {
    title: "Why Not Me?",
    author: "Mindy Kaling",
    image: "https://images-na.ssl-images-amazon.com/images/I/41w9cuGRkWL._SX322_BO1,204,203,200_.jpg",
    releaseDate: "September 15, 2015"
	},
  {
    title: "Parable of the Sower",
    author: "Octavia E. Butler",
    image: "http://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1458043163i/29513537._UY200_.jpg",
    releaseDate: "January 1, 2000"
	},
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    image: "https://images-na.ssl-images-amazon.com/images/I/51Cj3fsiwdL._SY346_.jpg",
    releaseDate: "July 1, 2014"
	}

];

var authors_list  = [
  {
    name: "Harper Lee",
    alive: false
  },
  {
    name: "F Scott Fitzgerald",
    alive: false
  },
  {
    name: "Victor Hugo",
    alive: false
  },
  {
    name: "Jules Verne",
    alive: false
  },
  {
    name: "Sheryl Sandberg",
    alive: true
  },
  {
    name: "Tim Ferriss",
    alive: true
  },
  {
    name: "John Steinbeck",
    alive: false
  },
  {
    name: "William Shakespeare",
    alive: false
  },
	{
		name: "Lawrence Yep",
		alive: true
	},
	{
		name: "Luvvie Ajayi",
		alive: true
	},
  {
		name: "Aldous Huxley",
		alive: false
	},
 	{
		name: "Octavia E. Butler",
		alive: false
	},
	{
		name: "Mindy Kaling",
		alive: true
	}
];

db.Author.remove({}, function(err, authors) {
  console.log('removed all authors');
  db.Author.create(authors_list, function(err, authors){
    if (err) {
      console.log(err);
      return;
    }
    console.log('recreated all authors');
    console.log("created", authors.length, "authors");


    db.Book.remove({}, function(err, books){
      console.log('removed all books');
      books_list.forEach(function (bookData) {
        var book = new db.Book({
          title: bookData.title,
          image: bookData.image,
					author: bookData.author,
          releaseDate: bookData.releaseDate
        });
        db.Author.findOne({name: bookData.author}, function (err, foundAuthor) {
					console.log(book.title);

          console.log('found author ' + foundAuthor.name + ' for book ' + book.title);
          if (err) {
            console.log(err);
            return;
          }
          book.author = foundAuthor;
          book.save(function(err, savedBook){
            if (err) {
              return console.log(err);
            }
            console.log('saved ' + savedBook.title + ' by ' + foundAuthor.name);
          });
        });
      });
    });

  });
})



