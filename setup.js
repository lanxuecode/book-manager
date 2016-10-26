
/**
 * Module dependencies.
 */

var mysql = require('mysql')
  , config = require('./config')

/**
 * Initialize client.
 */

 delete config.database;
var db = mysql.createConnection(config);

/**
 * Create database.
 */

db.query('CREATE DATABASE IF NOT EXISTS `books`');
db.query('USE `books`');

/**
 * Create tables.
 */

db.query('DROP TABLE IF EXISTS book');
db.query('CREATE TABLE book (' +
  'id INT(11) AUTO_INCREMENT,' +
  'title VARCHAR(255),' +
  'description TEXT,' +
  'created DATETIME,' +
  'author VARCHAR(50),' +
  'path VARCHAR(100),' +
  'PRIMARY KEY (id))');

db.query('DROP TABLE IF EXISTS review');
db.query('CREATE TABLE review (' +
  'id INT(11) AUTO_INCREMENT,' +
  'item_id INT(11),' +
  'comment TEXT,' +
  'stars INT(1),' +
  'created DATETIME,' +
  'PRIMARY KEY (id))');

/**
 * Close client.
 */

db.end();
