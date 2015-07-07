/* the publish function transmits data into the ether. Note that
we only need to define the returned data from the server within
this publish function and not anywhere else */
Meteor.publish('thePlayers', function(){
  var currentUserId = this.userId;
  return PlayersList.find({createdBy: currentUserId})
});

Meteor.methods({
  'insertPlayerData': function(playerNameVar, playerScoreVar){
    var currentUserId = Meteor.userId();
    PlayersList.insert({
      name: playerNameVar,
      score: parseInt(playerScoreVar),
      createdBy: currentUserId
    });
  },
  'removePlayerData': function(selectedPlayer, result){
    if(result){
      var currentUserId = Meteor.userId();
      PlayersList.remove({_id: selectedPlayer, createdBy: currentUserId});
    }
  },
  'modifyPlayerScore': function(selectedPlayer, scoreValue){
    /* update method takes an argument to tell which document (or player)
    we want to modify, and then second tells us what part of the document
    we want to change. The $set operator modifies the value of a field
    without deleting the original document; however, the $inc operator
    will increment the score value by 5 */
    var currentUserId = Meteor.userId();
    PlayersList.update( {_id: selectedPlayer, createdBy: currentUserId},
                        {$inc: {score: scoreValue} });
  }
});
