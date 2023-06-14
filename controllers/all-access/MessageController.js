const models = require('../../models');
const responApi = require('../apirespon');
const massage = models.Message;
const ai = models.ResponseAi;
const { Op } = require('sequelize');

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


    io.emit(`chat-${roomID}`,model );
    


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
exports.createAi = async(req, res) => {
  // try {
    const { message } = req.body;

    const responseData = await ai.findOne({
      where: {
        key: {
          [Op.like]: `%${message}%`,
        },
      },
    });
    let response = "MKSD LU APAAN SI, GW CUMA AI JANGAN TANYA YANG GA JELAS YA!!!"
    if(responseData != null){

      const randomIndex = Math.floor(Math.random() * responseData['response'].length);
      response = responseData['response'][randomIndex];
    }

  

    return responApi.v2respon200(req, res, response);

    

  // } catch (err) {
  //   next(err);
  // }
};
