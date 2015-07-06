/* We're creating a collection (similar to table in SQL)
named "players" inside our project's Mongo database.
We need to place the collection inside a variable
in order for us to manipulate it. NOTE how we did not
use the 'var' keyword; that's because we need to create
a global variable so we can use it throughout all of our project's
files */
PlayerList = new Mongo.Collection('players');

console.log("Hello world");

/* Here, we have this Template keyword, which
searches through the templates inside our
project, and this leaderboard keyword, which
is a reference to the “leaderboard” template.
The "helpers" keyword allows us to define multiple
helper functions inside a single block of code*/
if(Meteor.isClient) {
  Template.leaderboard.helpers({
    'player': function(){
      /* By using the curly braces, we're explicitly
      stating that we want to retrieve all of the data
      from the PlayerList collection. This is the default
      behavior, so just using .find() is technically the same;
      however, by passing through the curly braces, we can pass
      through a second argument */
      return PlayerList.find({}, {sort: {score: -1, name: 1} })
      /* by passing through a value of -1, we can sort in desc order */
    },
    'count': function(){
      return PlayerList.find().count()
    },
    'selectedClass': function(){
      var playerId = this._id;
      var selectedPlayer = Session.get('selectedPlayer');
      if(playerId == selectedPlayer){
        return "selected"
      }
    },
    'showSelectedPlayer': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      /* findOne function will only ever attempt to retrieve
      a single document unlike the find function which would
      look through the entire collection */
      return PlayerList.findOne(selectedPlayer)
    }
  });
  Template.leaderboard.events({
    'click .player': function(){
      /* this refers to the document of the player that
      has just been clicked. The _id part is the name of
      the field that contains the unique ID of the player.
      Essentially, Mongo creates an _id field for each
      document (the underscore holds not significance). */
      var playerId = this._id;
      /* In this session, we're passing through a name for
      the sessions and then we're passing through a value
      for the session (the data we're storing inside the session) */
      Session.set('selectedPlayer', playerId);
    },
    'click .increment': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      /* update method takes an argument to tell which document (or player)
      we want to modify, and then second tells us what part of the document
      we want to change. The $set operator modifies the value of a field
      without deleting the original document; however, the $inc operator
      will increment the score value by 5 */
      PlayerList.update(selectedPlayer, {$inc: {score: 5} });
    },
    'click. decrement': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayerList.update(selectedPlayer, {$inc: {score: -5} });
    }
  });
}

if(Meteor.isServer) {

}
