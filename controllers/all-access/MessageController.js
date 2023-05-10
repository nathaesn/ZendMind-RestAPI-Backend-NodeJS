const models = require('../../models');
const responApi = require('../apirespon');
const massage = models.Message;


exports.getAll = async(req, res) => {
  
  // try {
    let messages = await massage.findAll();
    return responApi.v2respon200(req, res, messages);
  // } catch (err) {
  //   next(err);
  // }
};

exports.create = async(req, res) => {
  // try {
    const io = req.app.get('io');
    const { message, roomID, userId, to_userId } = req.body;


    



    const model = await massage.create({ 
      userId:userId,
      to_userId:to_userId,
      roomID:roomID,
      message:message,
      type:'Text',
      status:'New'
    });


    io.emit('chat',model );
    


    // io.to("32").emit('chat', {
    //   userId,
    //   roomID,
    //   message
    // });


    return responApi.v2respon200(req, res, model);
  // } catch (err) {
  //   next(err);
  // }
};
