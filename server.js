
/**
 * Module dependencies.
 */

var express = require('express')
  , mysql = require('mysql')
  , config = require('./config')
  , path = require('path');

/**
 * Create app.
 */

var db = mysql.createConnection(config);
app = express.createServer();

/**
 * Middleware.
 */

app.use(express.bodyParser());

/**
 * Configure app.
 */

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Main route
 */

app.get('/', function (req, res, next) {
  db.query('SELECT id, title, author,path FROM book', function (err, results) {
    res.render('layout.ejs', { items: results });
  });
});

/**
 * Item creation route.
 */

app.post('/create', function (req, res, next) {
  var img = req.files.image;
  var name = img.name;
  var path = join(dirname, img.name);
  fs.rename(img.path, path, function(err) {
	  if(err) return next(err);
      db.query('INSERT INTO item SET title = ?, author = ?, path = ?, description = ?',
     [req.body.title, req.body.author,path,req.body.description], function (err, info) {
       if (err) return next(err);
       console.log(' - item created with id %s', info.insertId);
       res.redirect('/');
	 });
  });
});

/**
 * Item route.
 */

app.get('/item/:id', function (req, res, next) {
  function getItem (fn) {
    db.query('SELECT id, title, description FROM item WHERE id = ? LIMIT 1',
    [req.params.id], function (err, results) {
      if (err) return next(err);
      var item = results[0];
      if (!item) return res.send(404);
      fn({ id: item[0], title: item[1], description: item[2] });
    });
  }

  function getReviews (item_id, fn) {
    db.query('SELECT text, stars FROM review WHERE item_id = ?',
    [item_id], function (err, results) {
      if (err) return next(err);
      fn(results.map(function (res) {
        return { text: res[0], stars: res[1] };
      }));
    });
  }

  getItem(function (item) {
    getReviews(item.id, function (reviews) {
      res.render('item', { item: item, reviews: reviews });
    });
  });
});

/**
 * Item review creation route.
 */

app.post('/item/:id/review', function (req, res, next) {
  db.query('INSERT INTO review SET item_id = ?, stars = ?, text = ?',
  [req.params.id, req.body.stars, req.body.text], function (err, info) {
    if (err) return next(err);
    console.log(' - review created with id %s', info.insertId);
    res.redirect('/item/' + req.params.id);
  });
});

/**
 * Connect to MySQL
 */



/**
 * Listen.
 */

app.listen(3000, function () {
  console.log(' - listening on http://*:3000');
});
