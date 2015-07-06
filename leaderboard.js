/* We're creating a collection (similar to table in SQL)
named "players" inside our project's Mongo database.
We need to place the collection inside a variable
in order for us to manipulate it. NOTE how we did not
use the 'var' keyword; that's because we need to create
a global variable so we can use it throughout all of our project's
files */
PlayersList = new Mongo.Collection('players');

/* Here, we have this Template keyword, which
searches through the templates inside our
project, and this leaderboard keyword, which
is a reference to the “leaderboard” template.
The "helpers" keyword allows us to define multiple
helper functions inside a single block of code*/
if(Meteor.isClient) {
  /* opposite to the publish function is the subscribe function
  which we use to "catch" the data being transmitted from the
  publish function */
  Meteor.subscribe('thePlayers');
  Template.leaderboard.helpers({
    'player': function(){
      /* By using the curly braces, we're explicitly
      stating that we want to retrieve all of the data
      from the PlayersList collection. This is the default
      behavior, so just using .find() is technically the same;
      however, by passing through the curly braces, we can pass
      through a second argument */
      var currentUserId = Meteor.userId();
      return PlayersList.find({}, {sort: {score: -1, name: 1} })
      /* by passing through a value of -1, we can sort in desc order */
    },
    'count': function(){
      return PlayersList.find().count()
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
      return PlayersList.findOne(selectedPlayer)
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
      PlayersList.update(selectedPlayer, {$inc: {score: 5} });
    },
    'click. decrement': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      PlayersList.update(selectedPlayer, {$inc: {score: -5} });
    },
    'click .remove': function(){
      var selectedPlayer = Session.get('selectedPlayer');
      var result = confirm("Want to delete?");
      if(result){
        PlayersList.remove(selectedPlayer);
      }
    }
  });
  Template.addPlayerForm.events({
    'submit form': function(event, template){
      event.preventDefault();
      var playerNameVar = event.target.playerName.value;
      var playerScoreVar = event.target.playerScore.value;
      var currentUserId = Meteor.userId();
      PlayersList.insert({
        name: playerNameVar,
        score: playerScoreVar,
        createdBy: currentUserId
      })
      template.find('form').reset();
    }
  });
}

if(Meteor.isServer) {
  /* the publish function transmits data into the ether. Note that
  we only need to define the returned data from the server within
  this publish function and not anywhere else */
  Meteor.publish('thePlayers', function(){
    var currentUserId = this.userId;
    return PlayersList.find({createdBy: currentUserId})
  });
}
