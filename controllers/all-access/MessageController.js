const models = require('../../models');
const responApi = require('../apirespon');
const massage = models.Message;
const listroom = models.ListRoom;
const ai = models.ResponseAi;
const { Op } = require('sequelize');
const tokenModels = models.Token
const jwt = require('jsonwebtoken')


exports.getListRoom = async(req, res) => {

  let token = req.body.token || req.query.token || req.headers["authorization"];
  // const {name} = req.body
  if (!token) {
      return res.status(403).json("A token is required for authentication");
  }
  token = token.replace("Bearer ", "");

  // try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    const tokendb = await tokenModels.findOne({ where: { token: token } });
    if (!tokendb) {
      return responApi.v2respon400(req, res, "Invalid Token");
    } 

  let messages = await listroom.findAll({
    where: { id_user: decoded.user.id},
    order: [
      ['updatedAt', 'DESC'], ],
    include:[
      {
          model: models.User,
          as: 'SecondUser',
          attributes: { exclude: ['password'] },
      },
      {
          model: models.Message,
          as: 'Message',
      },
     
  ],
  
  });
  return responApi.v2respon200(req, res, messages);
}


exports.getAll = async(req, res) => {
  
  // try {
    let messages = await massage.findAll({
      where: { roomID: req.params.roomID },
    });
    return responApi.v2respon200(req, res, messages);
  // } catch (err) {
  //   next(err);
  // }
};
// exports.getlistroom = async(req, res) => {
  
//   // try {
//     let messages = await listroom.findAll();
//     return responApi.v2respon200(req, res, messages);
//   // } catch (err) {
//   //   next(err);
//   // }
// };

exports.create = async(req, res) => {

  let token = req.body.token || req.query.token || req.headers["authorization"];
  // const {name} = req.body
  if (!token) {
      return res.status(403).json("A token is required for authentication");
  }
  token = token.replace("Bearer ", "");

  // try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const io = req.app.get('io');
    const { message, roomID, id_SecondUser } = req.body;

    const tokendb = await tokenModels.findOne({ where: { token: token } });
    if (!tokendb) {
      return responApi.v2respon400(req, res, "Invalid Token");
    } 



    const model = await massage.create({ 
      userId:decoded.user.id,
      roomID:roomID,
      message:message,
      type:'Text',
      status:'New'
    });
    
    var listroomUser = await listroom.findOne({
      where:{
        id_user:decoded.user.id,
        id_SecondUser:id_SecondUser
      }
    })


    
    var listroomSecUser = await listroom.findOne({
      where:{
        id_user:id_SecondUser,
        id_SecondUser:decoded.user.id
      }
    })

    // Update the listroom for the user
    if (listroomUser != null) {
      await listroom.update(
        { id_lastChat: model.id },
        {
          where: {
            id_user:decoded.user.id,
            id_SecondUser:id_SecondUser
          }
        }
      );
    } else {
      await listroom.create({
        id_user: decoded.user.id,
        id_SecondUser: id_SecondUser,
        id_lastChat: model.id,
      });
      
    }

    // Update the listroom for the second user
    if (listroomSecUser != null) {
      await listroom.update(
        { id_lastChat: model.id },
        {
          where: {
            id_user:id_SecondUser,
            id_SecondUser:decoded.user.id
          }
        }
      );
    } else {
      await listroom.create({
        id_user: id_SecondUser,
        id_SecondUser: decoded.user.id,
        id_lastChat: model.id,
      });
      
    }
    
    
   


    io.emit(`chat-${roomID}`,model );
    


    // io.to("32").emit('chat', {
    //   userId,
    //   roomID,
    //   message
    // });


    return responApi.v2respon200(req, res, "berhasil mengirim pesan");
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
