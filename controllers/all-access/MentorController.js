const models = require('../../models');
const mUser = models.User
const mMentor = models.Mentor
const mTimeSchedule = models.TimeSchedule
const mSchedule = models.ScheduleMentor
const mMentoring = models.Mentoring
const tokenModels = models.Token
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const responApi = require('../apirespon');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { use } = require('../../routes/all-access/auth');


exports.allMentor = async(req, res, next) => {
 
    try {

        mMentor.findAll({
            include:[
                {
                    model: models.User,
                    as: 'User',
                    attributes: { exclude: ['password'] },
                }
            ],
            attributes: { exclude: ['password'] },
          }).then((user) => {
            if (user) {
                return responApi.v2respon200(req, res, user);
            } else {
                return responApi.v2respon400(req, res, "Empty User");
            }
          })
          .catch((error) => {
            return responApi.v2respon400(req, res, "Failed to make a request");
          });

        
    } catch (error) {
        return responApi.v2respon400(req, res, 'Internal Server Error');
    }

}
exports.allMentorPaid = async(req, res, next) => {
 
    try {

        mMentor.findAll({
            where: {
                fee: {
                    [Op.gt]: 0, 
                  },
            },
            include:[
                {
                    model: models.User,
                    as: 'User',
                    attributes: { exclude: ['password'] },
                },
            ],
          }).then((user) => {
            if (user) {
                return responApi.v2respon200(req, res, user);
            } else {
                return responApi.v2respon400(req, res, "Empty User");
            }
          })
          .catch((error) => {
            return responApi.v2respon400(req, res, "Failed to make a request");
          });

        
    } catch (error) {
        return responApi.v2respon400(req, res, 'Internal Server Error');
    }

}
exports.allMentorFree= async(req, res, next) => {
 
    try {

        mMentor.findAll({
            where: {
                fee: {
                    [Op.lte]: 0,
                  },
            },
            include:[
                {
                    model: models.User,
                    as: 'User',
                    attributes: { exclude: ['password'] },
                },
            ],
          }).then((user) => {
            if (user) {
                return responApi.v2respon200(req, res, user);
            } else {
                return responApi.v2respon400(req, res, "Empty User");
            }
          })
          .catch((error) => {
            return responApi.v2respon400(req, res, "Failed to make a request");
          });

        
    } catch (error) {
        return responApi.v2respon400(req, res, 'Internal Server Error');
    }

}
exports.detailMentor= async(req, res, next) => {
 
    try {

        mMentor.findOne({
            where: {
                id: req.params.idMentor
            },
            include:[
                {
                    model: models.User,
                    as: 'User',
                    attributes: { exclude: ['password'] },
                },
                {
                    model: models.ScheduleMentor,
                    as: 'ScheduleMentor',
                },
            ],
          }).then((user) => {
            if (user) {
                return responApi.v2respon200(req, res, user);
            } else {
                return responApi.v2respon400(req, res, "Empty User");
            }
          })
          .catch((error) => {
            return responApi.v2respon400(req, res, "Failed to make a request");
          });

        
    } catch (error) {
        return responApi.v2respon400(req, res, 'Internal Server Error');
    }

}
exports.getTimeSchedule= async(req, res, next) => {
 
    try {

        mTimeSchedule.findAll({
            where: {
                id_schedule: req.params.idSchedule
            },
            
          }).then((user) => {
            if (user) {
                return responApi.v2respon200(req, res, user);
            } else {
                return responApi.v2respon400(req, res, "Empty Time");
            }
          })
          .catch((error) => {
            return responApi.v2respon400(req, res, "Failed to make a request");
          });

        
    } catch (error) {
        return responApi.v2respon400(req, res, 'Internal Server Error');
    }

}
exports.getbook= async(req, res, next) => {
 
    let token = req.body.token || req.query.token || req.headers["authorization"];
    // const {name} = req.body
    if (!token) {
        return res.status(403).json("A token is required for authentication");
    }
    token = token.replace("Bearer ", "");
 
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);

        const tokendb = await tokenModels.findOne({ where: { token: token } });
        if (!tokendb) {
          return responApi.v2respon400(req, res, "Invalid Token");
        } 

        mMentoring.findAll({
            where: {
                id_user: decoded.user.id,
                fee: {
                    [Op.lte]: 0,
                  },
            },
            include:[
                {
                    model: models.Mentor,
                    as: 'Mentor',
                    include:[
                        {
                            model: models.User,
                            as: 'User',
                            attributes: { exclude: ['password'] },
                        }
                    ],
                },
               
            ],
          }).then((user) => {
            if (user) {
                return responApi.v2respon200(req, res, user);
            } else {
                return responApi.v2respon400(req, res, "Empty Data");
            }
          })
          .catch((error) => {
            return responApi.v2respon400(req, res, "Failed to make a request");
          });

        
    } catch (error) {
        return responApi.v2respon400(req, res, 'Internal Server Error');
    }

}
exports.getbookall= async(req, res, next) => {
 
    try {
       
        mMentoring.findAll({
            include:[
                {
                    model: models.Mentor,
                    as: 'Mentor',
                    include:[
                        {
                            model: models.User,
                            as: 'User',
                            attributes: { exclude: ['password'] },
                        }
                    ],
                },
               
            ],
          }).then((user) => {
            if (user) {
                return responApi.v2respon200(req, res, user);
            } else {
                return responApi.v2respon400(req, res, "Empty Data");
            }
          })
          .catch((error) => {
            return responApi.v2respon400(req, res, "Failed to make a request");
          });

        
    } catch (error) {
        return responApi.v2respon400(req, res, 'Internal Server Error');
    }

}

const transporter = nodemailer.createTransport({
    service: 'Gmail', // layanan email yang digunakan
    auth: {
      user: process.env.EMAIL, // email Anda
      pass: process.env.PASSWORD // password email Anda
    }
  });
  
exports.createbook= async(req, res, next) => {
    const { id_mentor, fee, id_date_mentoring, id_time_mentoring } = req.body;

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

        const date_mentoring = await mSchedule.findOne({ where: { id: id_date_mentoring } });
        if (!date_mentoring) {
          return responApi.v2respon400(req, res, "Invalid Date");
        } 
        const time_mentoring = await mTimeSchedule.findOne({ where: { id: id_time_mentoring } });
        if (!time_mentoring) {
          return responApi.v2respon400(req, res, "Invalid Time");
        } 
        const user = await mUser.findOne({ where: { id: decoded.user.id } });
        if (!user) {
          return responApi.v2respon400(req, res, "Invalid User");
        } 

        const model = await mMentoring.create({ 
            id_user:decoded.user.id,
            id_mentor:id_mentor,
            fee:fee,
            date_mentoring:date_mentoring["date"],
            time_mentoring:time_mentoring["time"],
            notes: "wkwkw",
            status: "Finished"
          });

          $date_mntr =date_mentoring["date"];
          $time_mntr =time_mentoring["time"];

          await time_mentoring.destroy();

          let time_mentoring2 = await mTimeSchedule.findAll({ where: { id_schedule: date_mentoring["id"] } });
           if(time_mentoring2.length <= 0){
               await date_mentoring.destroy();
           }


          
        const sendMail = {
            from: process.env.EMAIL,
            to: user["email"],
            subject: "Hai, "+ user["name"]+ "Booking Berhasil dilakukan",
            html: `
            <p>Hai, Booking kamu udah berhasil, silahkan klik link dibawah untuk join meet pada ${$date_mntr},  pukul ${$time_mntr}:</p>
            <a href="#">Join Meet</a>
            `
        };
         await transporter.sendMail(sendMail, (error, info) => {
        if (error) {
            return responApi.v2respon200(req, res, "berhasil melakukan booking");
        } else {
            console.log(error)
            return responApi.v2respon200(req, res, "berhasil melakukan booking");
        }
      });
        
    // } catch (error) {
    //     return responApi.v2respon400(req, res, 'Internal Server Error');
    // }

}