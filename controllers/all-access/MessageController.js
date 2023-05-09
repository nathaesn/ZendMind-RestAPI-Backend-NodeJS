// File: messagesController.js

const models = require('../../models');
const Message = models.Message;

exports.getAll = async function(req, res, next) {
  // try {
    const messages = await Message.findAll();
    res.json({ messages });
  // } catch (err) {
  //   next(err);
  // }
};

exports.create = async function(req, res, next) {
  try {
    const { message, roomID, user_id, to_userId } = req.body;
    const model = await 
    Message.create({ 
      user_id:user_id,
      to_userId:to_userId,
      roomID:roomID,
      message:message,
      type:'Text',
      status:'New'
    });
    res.json(model.toJSON());
  } catch (err) {
    next(err);
  }
};
