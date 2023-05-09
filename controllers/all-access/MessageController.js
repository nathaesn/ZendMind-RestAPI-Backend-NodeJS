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
    const { message, roomID, user_id, to_userId } = req.body;
    const model = await massage.create({ 
      userId:user_id,
      to_userId:to_userId,
      roomID:roomID,
      message:message,
      type:'Text',
      status:'New'
    });
    return responApi.v2respon200(req, res, model);
  // } catch (err) {
  //   next(err);
  // }
};
