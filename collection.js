/* We're creating a collection (similar to table in SQL)
named "players" inside our project's Mongo database.
We need to place the collection inside a variable
in order for us to manipulate it. NOTE how we did not
use the 'var' keyword; that's because we need to create
a global variable so we can use it throughout all of our project's
files */
PlayersList = new Mongo.Collection('players');


