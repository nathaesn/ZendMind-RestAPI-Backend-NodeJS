const models = require('../../models');
const responApi = require('../apirespon');
const massage = models.Message;
const listroom = models.ListRoom;
const mUser = models.User;
const mTokenDevice = models.TokenDevice;
const mNotif = models.Notification;
const ai = models.ResponseAi;
const { Op } = require('sequelize');
const tokenModels = models.Token
const jwt = require('jsonwebtoken')
const firebaseadmin = require('firebase-admin');


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


    await db.runTransaction(async (transaction) => {
      await transaction.set(
        documentReference,
        {
          'idFirstUser': decoded.user.id,
          'idSecondUser': id_SecondUser,
          'timestamp': Date.now().toString(),
          'date': new Date().toString(),
          'content': message,
        })})

    // const model = await massage.create({ 
    //   userId:decoded.user.id,
    //   roomID:roomID,
    //   message:message,
    //   type:'Text',
    //   status:'New'
    // });
    
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
    // if (listroomUser != null) {
    //   await listroom.update(
    //     { id_lastChat: model.id },
    //     {
    //       where: {
    //         id_user:decoded.user.id,
    //         id_SecondUser:id_SecondUser
    //       }
    //     }
    //   );
    // } else {
    //   await listroom.create({
    //     id_user: decoded.user.id,
    //     id_SecondUser: id_SecondUser,
    //     id_lastChat: model.id,
    //   });
      
    // }

    // // Update the listroom for the second user
    // if (listroomSecUser != null) {
    //   await listroom.update(
    //     { id_lastChat: model.id },
    //     {
    //       where: {
    //         id_user:id_SecondUser,
    //         id_SecondUser:decoded.user.id
    //       }
    //     }
    //   );
    // } else {
    //   await listroom.create({
    //     id_user: id_SecondUser,
    //     id_SecondUser: decoded.user.id,
    //     id_lastChat: model.id,
    //   });
      
    // }
    
    
   


    io.emit(`chat-${roomID}`,"model" );
    io.emit(`room-${id_SecondUser}`,"model" );

    const userDetail = await mUser.findOne({
      where:{
        id:decoded.user.id,
      }
    }) 

    const deviceSecondUser = await mTokenDevice.findAll({
      where:{
        id_user:id_SecondUser,
      }
    }) 

    for(var iLoop = 0; iLoop < deviceSecondUser.length; iLoop++){

      console.log("push" + iLoop)
      console.log(deviceSecondUser[iLoop].token)
      const messageNotif = {
        notification: {
          title: "Zendmind - "+ userDetail.name,
          body: message,
        },
        token: deviceSecondUser[iLoop].token,
      };
      
      await firebaseadmin.messaging().send(messageNotif)
      
    }


    await mNotif.create({
      idUser: id_SecondUser,
      tittle: "Chat - "+ userDetail.name,
      message: message,
      isRead: false
    })
    


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


const axios = require('axios');


const apiKey = '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';

// Teema yang ingin Anda filter
const theme = ' mental health';

// Teks yang ingin Anda gunakan sebagai prompt

exports.createAi = async(req, res) => {
  // try {
    // const { message } = req.body;
    const prompt = "Berikan saya informasi tentang kesehatan mental."

    axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
    prompt: `${prompt}`,
    max_tokens: 100, // Sesuaikan dengan jumlah token yang Anda inginkan
    }, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        const completion = response.data.choices[0].text;
        console.log(completion);
        return responApi.v2respon200(req, res, completion);
      })
      .catch(error => {
      return responApi.v2respon400(req, res, error);
        console.error('Terjadi kesalahan:', error);
    });


    

  // } catch (err) {
  //   next(err);
  // }
};