const models = require('../../models');
const mUser = models.User
const mMentor = models.Mentor
const mTimeSchedule = models.TimeSchedule
const mSchedule = models.ScheduleMentor
const mRateMentor = models.RateMentor
const mMentoring = models.Mentoring
const mSallaryMentor = models.SallaryMentor
const mRekeningMentor = models.RekeningMentor
const tokenModels = models.Token
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const responApi = require('../apirespon');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { Sequelize,Op } = require('sequelize');
const { use } = require('../../routes/all-access/auth');
const moment = require('moment-timezone');


exports.getProfile = async(req, res) => {

    let token = req.body.token || req.query.token || req.headers["authorization"];

    if (!token) {
        return res.status(403).json("A token is required for authentication");
    }
    token = token.replace("Bearer ", "");

    const tokendb = await tokenModels.findOne({ where: { token: token } });
    if (!tokendb) {
        return responApi.v2respon400(req, res, "Invalid Token");
    } 

    const todayDate = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            mUser.findOne({
                where: {
                  id: decoded.user.id,
                },
                include:[
                    {
                        model: models.Mentor,
                        as: 'MentorProfile',
                        include:[
                            {
                                model: models.ScheduleMentor,
                                as: 'ScheduleMentor',
                                where:{
                                    date: {
                                        [Op.gte]: todayDate
                                    },
                                },
                               
                                required: false,
                            },
                        ],

                    },
                ],  
                attributes: { exclude: ['password'] },
              }).then((user) => {
                if (user) {
                    return responApi.v2respon200(req, res, user);
                } else {
                    return responApi.v2respon400(req, res, "Empty User");
                }
              })}
            //   .catch((error) => {
            //     return responApi.v2respon400(req, res, "Failed to make a request");
            //   });



exports.getbookAll= async(req, res, next) => {
 
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

                    const todayDate = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');

                    const mentordata = await mMentor.findOne({
                        where: {
                            idUser: decoded.user.id
                        }
                    })

                    console.log('Data : '+mentordata['id'])
            
                    mMentoring.findAll({
                        where: {
                            id_mentor: mentordata["id"],
                            date_mentoring: {
                                [Op.gte]: todayDate
                            },
                            status:'Pending'
                        },
                        include:[
                            {
                                model: models.User,
                                as: 'User',
                                attributes: { exclude: ['password'] },
                            },
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
                    //   .catch((error) => {
                    //     return responApi.v2respon400(req, res, "Failed to make a request");
                    //   });
            
                    
                // } catch (error) {
                //     return responApi.v2respon400(req, res, 'Internal Server Error');
                // }
            
}        
exports.getbookHistory= async(req, res, next) => {
 
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

                    const todayDate = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');

                    const mentordata = await mMentor.findOne({
                        where: {
                            idUser: decoded.user.id
                        }
                    })

            
                    mMentoring.findAll({
                        where: {
                            id_mentor: mentordata["id"],
                            [Op.or]: [
                                { status: 'Finished' },
                                { status: 'Cancelled' }, // Klausa WHERE lain yang ingin Anda gunakan
                              ],
                        },
                        include:[
                            {
                                model: models.User,
                                as: 'User',
                                attributes: { exclude: ['password'] },
                            },
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
                    //   .catch((error) => {
                    //     return responApi.v2respon400(req, res, "Failed to make a request");
                    //   });
            
                    
                // } catch (error) {
                //     return responApi.v2respon400(req, res, 'Internal Server Error');
                // }
            
}        
exports.getSchedule= async(req, res, next) => {
 
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

                    const todayDate = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');

                    const mentordata = await mMentor.findOne({
                        where: {
                            idUser: decoded.user.id
                        }
                    })

            
                    mSchedule.findAll({
                        where: {
                            id_mentor: mentordata["id"],
                            date: {
                                [Op.gte]: todayDate
                            },
                        },
                        include:[
                            {
                                model: models.TimeSchedule,
                                as: 'TimeSchedule',
                            },
                        ],
                        order: [
                            ['date', 'ASC']
                          ]
                      }).then((user) => {
                        if (user) {
                            return responApi.v2respon200(req, res, user);
                        } else {
                            return responApi.v2respon400(req, res, "Empty Data");
                        }
                      })
                    //   .catch((error) => {
                    //     return responApi.v2respon400(req, res, "Failed to make a request");
                    //   });
            
                    
                // } catch (error) {
                //     return responApi.v2respon400(req, res, 'Internal Server Error');
                // }
            
}        
exports.getbookToday= async(req, res, next) => {
 
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

                    const todayDate = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');

                    const mentordata = await mMentor.findOne({
                        where: {
                            idUser: decoded.user.id
                        }
                    })

                    console.log('Data : '+mentordata['id'])
            
                    mMentoring.findAll({
                        where: {
                            id_mentor: mentordata["id"],
                            date_mentoring: todayDate,
                            status:'Pending'
                        },
                        include:[
                            {
                                model: models.User,
                                as: 'User',
                                attributes: { exclude: ['password'] },
                            },
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
                    //   .catch((error) => {
                    //     return responApi.v2respon400(req, res, "Failed to make a request");
                    //   });
            
                    
                // } catch (error) {
                //     return responApi.v2respon400(req, res, 'Internal Server Error');
                // }
            
}        


exports.setfee= async(req, res, next) => {
    const { fee } = req.body;

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
        const user = await mUser.findOne({ where: { id: decoded.user.id } });
        if (!user) {
          return responApi.v2respon400(req, res, "Invalid User");
        } 

        const mentordata = await mMentor.findOne({
            where: {
                idUser: decoded.user.id
            }
        })

        await mMentor.update(
            { fee: fee },
            {
              where: {
                id:mentordata["id"],
              }
            })

        return responApi.v2respon200(req, res, "berhasil merubah fee");
       
      
        
    // } catch (error) {
    //     return responApi.v2respon400(req, res, 'Internal Server Error');
    // }

}
exports.addDateSch= async(req, res, next) => {
    const { date, time } = req.body;

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
        const user = await mUser.findOne({ where: { id: decoded.user.id } });
        if (!user) {
          return responApi.v2respon400(req, res, "Invalid User");
        } 

        const mentordata = await mMentor.findOne({
            where: {
                idUser: decoded.user.id
            }
        })

        const check = await mSchedule.findOne({
            where: {
                id_mentor: mentordata['id'],
                date: date
            }
        })

        if(!check){
            const order = await mSchedule.create({
                id_mentor: mentordata['id'],
                date: date
            })    

            await mTimeSchedule.create({
                id_schedule: order["id"],
                time: time
            })
        } else{
            await mTimeSchedule.create({
                id_schedule: check["id"],
                time: time
            })
        }

       
        

        return responApi.v2respon200(req, res, "berhasil menambah");
       
      
        
    // } catch (error) {
    //     return responApi.v2respon400(req, res, 'Internal Server Error');
    // }

}
      

exports.addTimeSch= async(req, res, next) => {
    const { id_schedule, time } = req.body;

    await mTimeSchedule.create({
        id_schedule: id_schedule,
        time: time
    })

    return responApi.v2respon200(req, res, "berhasil menambah");

}
exports.deleteTimesch= async(req, res, next) => {
    const { id_time } = req.params;

    const gettime = await mTimeSchedule.findOne({
        where: {
            id: id_time
        }
    })

    const getSch = await mTimeSchedule.findAll({
        where: {
            id_schedule: gettime["id_schedule"]
        }
    })

    await mTimeSchedule.destroy({
        where: {
            id: id_time,
          },
    })

    if(getSch.length <= 1){
      await  mSchedule.destroy({
            where: {
                id: gettime["id_schedule"],
              },
        })
    }

    return responApi.v2respon200(req, res, "berhasil menambah");

}
exports.earningbalance= async(req, res, next) => {
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
    

        const mentordata = await mMentor.findOne({
            where: {
                idUser: decoded.user.id
            }
        })

        const totalFee = await mMentoring.sum('fee', {
            where: {
              id_mentor: mentordata["id"],
              status: 'Finished',
            },
          });
        const totalrec = await mSallaryMentor.sum('total', {
            where: {
              id_user: decoded.user.id,
            },
          });
        const recdata = await mSallaryMentor.findAll( {
            where: {
              id_user: decoded.user.id,
            },
          });
        const rekening = await mRekeningMentor.findAll( {
            where: {
              id_user: decoded.user.id,
            },
          });


        const customResponse = {
            earningAll: totalFee,
            earningRec: totalrec,
            earningRecData: recdata,
            earningNow: mentordata["incomeNow"],
            rekening: rekening,
        }
        return responApi.v2respon200(req, res, customResponse);
        //   .catch((error) => {
        //     return responApi.v2respon400(req, res, "Failed to make a request");
        //   });

        
    // } catch (error) {
    //     return responApi.v2respon400(req, res, 'Internal Server Error');
    // }

}
exports.rate= async(req, res, next) => {
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

        const mentordata = await mMentor.findOne({
            where: {
                idUser: decoded.user.id
            },
            include:[
                {
                    model: models.User,
                    as: 'User',
                    attributes: { exclude: ['password'] },
                },
            ],
        })


        mRateMentor.findAll({
            where: {
                id_mentor: mentordata["id"],  
                
            },
            include:[
                {
                    model: models.User,
                    as: 'User',
                    attributes: { exclude: ['password'] },
                },
            ],
          }).then( async(user) => {
            if (user) {
                const rateData = await mRateMentor.findOne({
                    attributes: [
                        [Sequelize.fn('AVG', Sequelize.col('rate')), 'averageRate']
                      ],
                    where: {
                        id_mentor:  mentordata["id"],  
                      },
                })

                const averageRate = rateData.dataValues.averageRate !== null ? Number(rateData.dataValues.averageRate) : 0.0;
                const customResponse = {
                    review: user,
                    averageRate: parseFloat(averageRate.toFixed(1)),
                }
                return responApi.v2respon200(req, res, customResponse);
            } else {
                return responApi.v2respon400(req, res, "Empty Data");
            }
          })
        //   .catch((error) => {
        //     return responApi.v2respon400(req, res, "Failed to make a request");
        //   });

        
    // } catch (error) {
    //     return responApi.v2respon400(req, res, 'Internal Server Error');
    // }

}