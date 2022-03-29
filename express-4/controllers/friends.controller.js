const model = require('../models/friends.model');

function postFriend(req, res) {
  const name = req.body.name;

  if(name) {
    const newFriend = {
      name,
      id: model.length
    }
  
    model.push(newFriend);
  
    res.json(newFriend);
  } else {
    res.status(400).json({
      error: 'Missing name property'
    })
  }
}

function getFriends(req, res) {
  res.json(model);
}

function getFriendsById(req, res) {
  const friendId = Number(req.params.id);
  const friend = model.find(friend => friend.id === friendId);
  
  if(friendId >= 0 && friend) {
    res.json(friend);
  } else {
    res.status(404).json({
      error: "friend not found"
    });
  }
}

module.exports = {
  getFriends,
  getFriendsById,
  postFriend
}