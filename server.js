var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var methodOverride = require('method-override');

app.set('view engine', 'ejs');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 8080;        // set our port



// CONNECT TO THE DATABASE AND START THE SERVER
// =============================================================================
/*
app.listen(port);
console.log('Magic happening on port ' + port);
*/
var db

var connectionString = 'mongodb://user1:pass@ds163020.mlab.com:63020/moviesdb';

mongoose.connect(connectionString, (err, database) => {
  
	if (err) return console.log(err)
	db = database
	app.listen(port, () => {
		console.log('Magic happening on port '+port+'...');
	})
})











// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router




// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});



// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});




//GET AND POST
router.route('/movies')

    .get(function(req, res) {
            res.render('dashboard.ejs')
        })
    .post(function(req, res) {        
        var movie = new Movie(req.body);
        // save the movie and check for errors
        movie.save(function(err) {
            if (err)
                res.send(err);

            console.log('Movie created!');
            res.redirect('/movies');
        });
        
    });
    

router.route('/movies/list')
    .get(function(req, res) {
        Movie.find(function(err, results) {
            if (err)
                res.send(err);

            res.render('list.ejs', {movies: results})
        })
    });    


// add
router.route('/movies/add')
    .get(function(req, res) {        
            console.log('redirected to editing page!');
            res.render('add.ejs');
        });
        
   
//delete
router.route('/delete/:id')
    .get(function(req, res) {
        Movie.findById( req.params.id, function ( err, movie ){
            movie.remove( function ( err, movie ){
                res.redirect( '/movies' );
            });
        });
    });




//edit
router.route('/movies/edit/:id')

    .get(function(req, res) {
        Movie.findById(req.params.id, function(err, result) {
            if (err)
                res.send(err);
            res.render('edit.ejs',{movie: result});
        });
    });

router.route('/edit/:id')   
    .post(function(req, res) {
        Movie.findById(req.params.id, function(err, movie) {
            if (err)
                res.send(err);

            for (prop in req.body) {
              movie[prop] = req.body[prop];
            }

            movie.save(function(err) {
                if (err)
                    res.send(err);
                
                console.log('Movie updated!');
                res.redirect( '/movies/list' );
            });

        });
    });

















/////////////////////////////////////////////////////////////////////////////////////////

/*


// PUT AND DELETE AND GET ONE
router.route('/movies/:id')

    .get(function(req, res) {
        Movie.findById(req.params.id, function(err, movie) {
            if (err)
                res.send(err);
            res.json(movie);
        });
    })
    .put(function(req, res) {
        Movie.findById(req.params.id, function(err, movie) {
            if (err)
                res.send(err);

            for (prop in req.body) {
		      movie[prop] = req.body[prop];
		    }

            // save the movie
            movie.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Movie updated!' });
            });

        });
    })
    .delete(function(req, res) {
        Movie.remove({
            _id: req.params.id
        }, function(err, movie) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });




*/











// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /
app.use('/', router);




