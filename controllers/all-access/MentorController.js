const models = require('../../models');
const mUser = models.User
const mMentor = models.Mentor
const mTimeSchedule = models.TimeSchedule
const mSchedule = models.ScheduleMentor
const mMentoring = models.Mentoring
const mRateMentor = models.RateMentor
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
const firebaseAdmin = require('firebase-admin');
const mTokenDevice = models.TokenDevice;
const mNotif = models.Notification;


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
 
    // try {
        
        const todayDate = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');

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
            ],
          }).then(async (user) => {
            if (user) {
                const rateData = await mRateMentor.findOne({
                    attributes: [
                        [Sequelize.fn('AVG', Sequelize.col('rate')), 'averageRate']
                      ],
                    where: {
                        id_mentor: req.params.idMentor,   
                      },
                })
        
                const rateCount = await mRateMentor.count({
                    where: {
                      id_mentor: req.params.idMentor,
                    },
                  });

                const patientCounts = await mMentoring.count({ 
                    where: {
                      id_mentor: req.params.idMentor,
                      status:"Finished"
                    },
                  });

                  const averageRate = rateData.dataValues.averageRate !== null ? Number(rateData.dataValues.averageRate) : 0.0;


                const customResponse = {
                    mentorData: user,
                    patientCount: patientCounts,
                    ratingCount: rateCount,
                    averageRate: parseFloat(averageRate.toFixed(1)),
                }
                return responApi.v2respon200(req, res, customResponse);
            } else {
                return responApi.v2respon400(req, res, "Empty User");
            }
          })
        //   .catch((error) => {
        //     return responApi.v2respon400(req, res, "Failed to make a request");
        //   });

        
    // } catch (error) {
    //     return responApi.v2respon400(req, res, 'Internal Server Error');
    // }

}

exports.getDateSchedule= async(req, res, next) => {
 
    // try {
        const todayDate = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');
        const monthYear = req.params.monthYear;

        const [year, month] = monthYear.split('-');

        const startDate = `${year}-${month}-01`;
        const date = new Date(year, month, 0);
        const endDate = `${year}-${month}-${date.getDate()}`;

        

        mSchedule.findAll({
            where:{
                id_mentor: req.params.idMentor,
                
                date: {
                    [Op.gte]: todayDate,
                    [Op.gte]: startDate,
                    [Op.lt]: endDate,
                  },
            },
            order: [['date', 'ASC']],
           
            
          }).then((user) => {
            if (user) {
                return responApi.v2respon200(req, res, user);
            } else {
                return responApi.v2respon400(req, res, "Empty Time");
            }
          })
        //   .catch((error) => {
        //     return responApi.v2respon400(req, res, "Failed to make a request");
        //   });

        
    // } catch () {
    //     return responApi.v2respon400(req, res, 'Internal Server Error');
    // }

}

exports.getTimeSchedule= async(req, res, next) => {
 
    try {

        mTimeSchedule.findAll({
            where: {
                id_schedule: req.params.idSchedule
            },
            order: [['time', 'ASC']],
            
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

        if(req.params.status == "Free"){

            mMentoring.findAll({
                where: {
                    id_user: decoded.user.id,
                    idTrx:"",
                    status:"Finished"
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
        } else{
            mMentoring.findAll({
                where: {
                    id_user: decoded.user.id,
                    // idTrx:"",
                    idTrx: {
                        [Op.not]: "",
                    },
                    status:"Finished"
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
        }


        
    } catch (error) {
        return responApi.v2respon400(req, res, 'Internal Server Error');
    }

}

exports.getbookOngoing= async(req, res, next) => {
 
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

     

        mMentoring.findAll({
            where: {
                id_user: decoded.user.id,
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
exports.getbookOntrx= async(req, res, next) => {
 
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

     
        if(req.params.status == "WaitingP"){
            mMentoring.findAll({
                where: {
                    id_user: decoded.user.id,
                    date_mentoring: {
                        [Op.gte]: todayDate
                    },
                    status:req.params.status
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
        } else if(req.params.status == "finishP"){
            mMentoring.findAll({
                where: {
                    id_user: decoded.user.id,
                    date_mentoring: {
                        [Op.gte]: todayDate
                    },
                    status: {
                        [Op.in]: ['Pending', 'Finished', 'Cancelled']
                      },
                    idTRx: {
                        [Op.not]: ''
                      },
                    urlTrx: {
                        [Op.not]: ''
                      }
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
        } else{
            mMentoring.findAll({
                where: {
                    id_user: decoded.user.id,
                    status:req.params.status
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
        }

      
        //   .catch((error) => {
        //     return responApi.v2respon400(req, res, "Failed to make a request");
        //   });

        
    // } catch (error) {
    //     return responApi.v2respon400(req, res, 'Internal Server Error');
    // }

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

        const mentor = await mMentor.findOne({ where: { id: id_mentor } });
        if (!mentor) {
          return responApi.v2respon400(req, res, "Invalid Mentor");
        } 
        const mentorUser = await mUser.findOne({ where: { id: mentor.id } });
        if (!mentorUser) {
          return responApi.v2respon400(req, res, "Invalid Mentor");
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

        var date_mntr =date_mentoring["date"];
        var time_mntr =time_mentoring["time"];


        const sendMailOptions = {
            from: process.env.EMAIL,
            to:user["email"],
            subject: "Hai, "+ user["name"]+ "Booking Berhasil dilakukan",
            html: `
            <p>Hai, Booking kamu udah berhasil, silahkan buka pada aplikasi zendmind untuk join meet pada ${date_mntr},  pukul ${time_mntr}</p>
            `
            // <a href="#">Join Meet</a>
        };
        const sendMailMentorOptions = {
            from: process.env.EMAIL,
            to: mentorUser["email"],
            subject: "Hai, "+ mentor["name"]+ ", "+user["name"]+" Melakukan booking mentoring",
            html: `
            <p>Hai,${mentor["name"]} telah membooking kamu untuk mentoring, silahkan buka pada aplikasi zendmind untuk join meet pada ${date_mntr},  pukul ${time_mntr}</p>
            `
        };

        if(mentor['fee'] <= 0){

            const model = await mMentoring.create({ 
                id_user:decoded.user.id,
                id_mentor:id_mentor,
                fee:fee,
                date_mentoring:date_mentoring["date"],
                time_mentoring:time_mentoring["time"],
                notes: "",
                urlTrx:"",
                idTRx:"",
                status: "Pending"
              });


              const tanggalAkhir2 = new Date(date_mentoring["date"]);
            tanggalAkhir2.setDate(tanggalAkhir2.getDate() + 7);

            // Format tanggal akhir jika diperlukan
            const tahun2 = tanggalAkhir2.getFullYear();
            const bulan2 = String(tanggalAkhir2.getMonth() + 1).padStart(2, '0');
            const tanggal2 = String(tanggalAkhir2.getDate()).padStart(2, '0');

            const tanggalHasil2 = `${tahun2}-${bulan2}-${tanggal2}`;

            const model2 = await mMentoring.create({ 
                id_user:decoded.user.id,
                id_mentor:id_mentor,
                fee:fee,
                date_mentoring:tanggalHasil2,
                time_mentoring:time_mentoring["time"],
                notes: "",
                urlTrx:"",
                idTRx:"",
                status: "Pending"
              });

              const tanggalAkhir3 = new Date(date_mentoring["date"]);
              tanggalAkhir3.setDate(tanggalAkhir3.getDate() + 14);
  
              // Format tanggal akhir jika diperlukan
              const tahun3 = tanggalAkhir3.getFullYear();
              const bulan3 = String(tanggalAkhir3.getMonth() + 1).padStart(2, '0');
              const tanggal3 = String(tanggalAkhir3.getDate()).padStart(2, '0');
  
              const tanggalHasil3 = `${tahun3}-${bulan3}-${tanggal3}`;

            const model3 = await mMentoring.create({ 
                id_user:decoded.user.id,
                id_mentor:id_mentor,
                fee:fee,
                date_mentoring:tanggalHasil3,
                time_mentoring:time_mentoring["time"],
                notes: "",
                urlTrx:"",
                idTRx:"",
                status: "Pending"
              });
              
              
              await destroyTimeMentoring(date_mentoring, time_mentoring);


              sendEmailNotif(sendMailOptions.to, sendMailOptions.subject, sendMailOptions.html);
               
              sendEmailNotif(sendMailMentorOptions.to, sendMailMentorOptions.subject, sendMailMentorOptions.html);

            const datamentor = await mMentor.findOne({ where: { id: id_mentor } });
            const datausermentor = await mUser.findOne({ where: { id: datamentor.idUser} });

            const deviceUser = await mTokenDevice.findAll({
                where:{
                id_user:datausermentor.id,
                }
            }) 
        
            for(var iLoop = 0; iLoop < deviceUser.length; iLoop++){
        
                console.log("push" + iLoop)
                console.log(deviceUser[iLoop].token)
                const messageNotif = {
                notification: {
                    title:  "Zendmind - Seseorang Telah membooking kamu",
                    body: `Seseorang telah membooking anda untuk meet pada ${date_mntr},  pukul ${time_mntr} `,
                },
                token: deviceUser[iLoop].token,
                };
                
                await firebaseAdmin.messaging().send(messageNotif)
                
            }
        
        
            await mNotif.create({
                idUser: datausermentor.id,
                tittle: "Zendmind - Seseorang Telah membooking kamu",
                message: `Seseorang telah membooking anda untuk meet pada ${date_mntr},  pukul ${time_mntr} `,
                isRead: false
            })
            
            
            return responApi.v2respon200(req, res, {
                type:"Free",
                data:"Berhasil melakukan Booking",
            });
        } else{
            await createPaymentMentoringXendit(req,res,decoded.user, fee, mentor,date_mentoring,time_mentoring,sendMailOptions,sendMailMentorOptions);

        }


          

          


          
        

       

        
        
    // } catch (error) {
    //     return responApi.v2respon400(req, res, 'Internal Server Error');
    // }

}



const Xendit = require('xendit-node');
const { decode } = require('punycode');
const { time } = require('console');
const x = new Xendit({
    secretKey: 'xnd_development_LN0LUl417TLHOFNzxn0ujWQjhrpxZ7i2mV592pPvlWMehfROezgZnxUPjlNbq',
});

const { Invoice } = x;
const invoiceSpecificOptions = {};
const i = new Invoice(invoiceSpecificOptions);

exports.xendit= async(req, res, next) => {

    const xenditSignature = req.get('X-CALLBACK-SIGNATURE'); // Header tanda tangan callback dari Xendit
    // const payload = req.body; // Data JSON yang dikirimkan oleh Xendit

    // Lakukan verifikasi tanda tangan callback disini (implementasikan sesuai dokumentasi Xendit)
    // ...

    // Proses data callback berdasarkan status pembayaran
    const paymentStatus = req.body.status;
    const paymentId = req.body.external_id;

    console.log(req.body.status);

    
    if (paymentStatus === 'PAID') {
        const datamentoring = await mMentoring.findOne({ where: { idTRx: paymentId } });
        await mMentoring.update({ status: 'Pending' }, { where: { idTRx: paymentId } });
        

        if(datamentoring){
            const tanggalAkhir2 = new Date(datamentoring.date_mentoring);
            tanggalAkhir2.setDate(tanggalAkhir2.getDate() + 7);

            // Format tanggal akhir jika diperlukan
            const tahun2 = tanggalAkhir2.getFullYear();
            const bulan2 = String(tanggalAkhir2.getMonth() + 1).padStart(2, '0');
            const tanggal2 = String(tanggalAkhir2.getDate()).padStart(2, '0');

            const tanggalHasil2 = `${tahun2}-${bulan2}-${tanggal2}`;

            const model2 = await mMentoring.create({ 
                id_user:datamentoring.id_user,
                id_mentor:datamentoring.id_mentor,
                fee:datamentoring.fee,
                date_mentoring:tanggalHasil2,
                time_mentoring:datamentoring.time_mentoring,
                notes: "",
                urlTrx:"",
                idTRx:"",
                status: "Pending"
              });


              const tanggalAkhir3 = new Date(datamentoring.date_mentoring);
              tanggalAkhir3.setDate(tanggalAkhir3.getDate() + 14);
  
              // Format tanggal akhir jika diperlukan
              const tahun3 = tanggalAkhir3.getFullYear();
              const bulan3 = String(tanggalAkhir3.getMonth() + 1).padStart(2, '0');
              const tanggal3 = String(tanggalAkhir3.getDate()).padStart(2, '0');
  
              const tanggalHasil3 = `${tahun3}-${bulan3}-${tanggal3}`;

            const model3 = await mMentoring.create({ 
                id_user:datamentoring.id_user,
                id_mentor:datamentoring.id_mentor,
                fee:datamentoring.fee,
                date_mentoring:tanggalHasil3,
                time_mentoring:datamentoring.time_mentoring,
                notes: "",
                urlTrx:"",
                idTRx:"",
                status: "Pending"
              });




            console.log(datamentoring)
            const datauser = await mUser.findOne({ where: { id: datamentoring.id_user } });


        
        
            const datamentor = await mMentor.findOne({ where: { id: datamentoring.id_mentor } });
            const datamentorUser = await mUser.findOne({ where: { id: datamentor.idUser } });
            
            

            const date_mentoring = await mSchedule.findOne({ where: { 
                id_mentor: datamentor.id,
                date: datamentoring.date_mentoring
            } });
        
           

            
        //   await sendEmailNotif(sendMailOptions.to, sendMailOptions.subject, sendMailOptions.html);
  
        //   await sendEmailNotif(sendMailMentorOptions.to, sendMailMentorOptions.subject, sendMailMentorOptions.html);
            

            console.log('Pembayaran berhasil');
            if(date_mentoring){
                const time_mentoring = await mTimeSchedule.findOne({ where: { id_schedule: date_mentoring.id, time: datamentoring.time_mentoring } });
                if(time_mentoring){

                    await destroyTimeMentoring(date_mentoring, time_mentoring);

                    
                        const deviceUser = await mTokenDevice.findAll({
                            where:{
                            id_user:datauser.id,
                            }
                        }) 
                    
                        const deviceMentor = await mTokenDevice.findAll({
                            where:{
                            id_user:datamentorUser.id,
                            }
                        }) 


                        console.log("id"+datamentorUser.id)

                        
                        await mNotif.create({
                            idUser: datamentorUser.id,
                            tittle: "Zendmind - Kamu telah menerima book",
                            message: `Seseorang telah melakukan booking kepada kamu`,
                            isRead: false
                        })


                        console.log(datauser.id)

                        await mNotif.create({
                            idUser: datauser.id,
                            tittle: "Zendmind - Pembayaran berhasil",
                            message: `Pembayaran sebesar ${req.body.paid_amount} telah berhasil`,
                            isRead: false
                        })
                        
            
        
        
        
                        for(var iLoopU = 0; iLoopU < deviceUser.length; iLoopU++){
                    
                            console.log("push" + iLoopU)
                            console.log(deviceUser[iLoopU].token)
                            const messageNotif = {
                            notification: {
                                title: "Zendmind - Pembayaran berhasil",
                                body: `Pembayaran sebesar ${req.body.paid_amount} telah berhasil`,
                            },
                            token: deviceUser[iLoopU].token,
                            };
                            
                            await firebaseAdmin.messaging().send(messageNotif)
                            
                        }

                        
                    
                        for(var iLoop = 0; iLoop < deviceMentor.length; iLoop++){
                    
                            console.log("push mentor" + iLoop)
                            console.log(deviceMentor[iLoop].token)
                            const messageNotif = {
                            notification: {
                                title: "Zendmind - Kamu telah menerima book",
                                body: `Seseorang telah melakukan booking kepada kamu`,
                            },
                            token: deviceMentor[iLoop].token,
                            };
                            
                            await firebaseAdmin.messaging().send(messageNotif)
                            
                        }


                }else{
                    console.log("TELAH DIPAKAI")
                }
            }else{
                console.log("TELAH DIPAKAI")
            }


            
        
        }
        
  
    } else if (paymentStatus === 'PENDING') {
        // Lakukan tindakan yang sesuai jika pembayaran tertunda
        await mMentoring.update({ status: 'WaitingP' }, { where: { idTRx: paymentId } });
        console.log('Pembayaran tertunda');
    } else if (paymentStatus === 'FAILED') {
        // Lakukan tindakan yang sesuai jika pembayaran gagal
        await mMentoring.update({ status: 'PFailed' }, { where: { idTRx: paymentId } });
        console.log('Pembayaran gagal');
    }
    console.log('WOIII');
    res.status(200).send('Callback received successfully');
}


const createPaymentMentoringXendit = async (req,res, userdecoded,fee, mentor,date_mentoring,time_mentoring,sendMailOptions,sendMailMentorOptions) => {
    try {

        const currentTime = new Date();
        const gmt7Offset = 7 * 60 * 60 * 1000;
        const currentTimestampGMT7 = new Date(currentTime.getTime() + gmt7Offset).toISOString();
        const uniqueString = 'PAYMENT_';
        const idPayment = uniqueString+userdecoded.id+'-At'+currentTimestampGMT7


      const createPaymentResponse = await i.createInvoice({
        externalID: idPayment,
        amount: fee,
        payerEmail: userdecoded.email,
        description: 'Pembayaran Mentoring',
        // successRedirectUrl: 'https://7f91-43-252-106-218.ngrok-free.app/xendit',
        // success_redirect_url: "https://7f91-43-252-106-218.ngrok-free.app/xendit",
        // failureRedirectUrl: 'https://7f91-43-252-106-218.ngrok-free.app/xendit',
      });
  
      const paymentUrl = createPaymentResponse.invoice_url;

      if(paymentUrl != null){

        const model = await mMentoring.create({ 
            id_user:userdecoded.id,
            id_mentor:mentor['id'],
            fee:fee,
            date_mentoring:date_mentoring["date"],
            time_mentoring:time_mentoring["time"],
            notes: "",
            urlTrx:paymentUrl,
            idTRx:idPayment,
            status: "WaitingP"
          });

        //   await destroyTimeMentoring(date_mentoring, time_mentoring);          
          

        //   await sendEmailNotif(sendMailOptions.to, sendMailOptions.subject, sendMailOptions.html);
  
        //   await sendEmailNotif(sendMailMentorOptions.to, sendMailMentorOptions.subject, sendMailMentorOptions.html);


        return responApi.v2respon200(req, res, {
            type:"Paid",
            data:paymentUrl,
        });
      }else{
        res.status(500).json({ error: 'Terjadi kesalahan saat membuat pembayaran' });
      }
    } catch (error) {
      console.log(error);
      return responApi.v2respon400(req, res, 'Internal Server Error');
    }
  };


  const destroyTimeMentoring = async (date_mentoring, time_mentoring) => {
    // try {
      await time_mentoring.destroy();
  
      const time_mentoringcheck = await mTimeSchedule.findAll({ where: { id_schedule: date_mentoring["id"] } });
  
      if (time_mentoringcheck.length <= 0) {
        await date_mentoring.destroy();
      }
  
    //   if (next) {
    //     next();
    //   }
    // } catch (error) {
    //   console.log(error);
    //   return responApi.v2respon400(req, res, 'Internal Server Error');
    // }
  };
  

function sendEmailNotif(to, subject, html) {
    const mailOptions = {
      from: process.env.EMAIL,
      to,
      subject,
      html,
    };
  
    return transporter.sendMail(mailOptions);
}


exports.cancelBook= async(req, res, next) => {
    

        await mMentoring.update(
            { status: 'Cancelled' },
            {
              where: {
                id: req.params.idBook,
              }
            })

        return responApi.v2respon200(req, res, "berhasil merubah fee");
       
      
        
    // } catch (error) {
    //     return responApi.v2respon400(req, res, 'Internal Server Error');
    // }

}
exports.finishBook= async(req, res, next) => {
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


        await mMentoring.update(
            { status: 'Finished' },
            {
              where: {
                id: req.params.idBook,
              }
            })


            if(req.body.rate != 0){
                await mRateMentor.create({
                    id_user:decoded.user.id,
                    id_mentor: req.body.id_mentor,
                    message: req.body.review,
                    rate: req.body.rate,

                })
            }


        const mentoringData = await mMentoring.findOne({
            where:{
                id: req.params.idBook,
            }
        })

        
        const mentorData = await mMentor.findOne({
            where:{
                id: mentoringData.id_mentor
            }
        })

        const incomeNow = mentorData.incomeNow + mentoringData.fee


        await mMentor.update(
            { incomeNow: incomeNow },
            {
              where: {
                id: mentoringData.id_mentor
              }
            }
        )


            
        return responApi.v2respon200(req, res, "berhasil merubah fee");
       
      
        
    // } catch (error) {
    //     return responApi.v2respon400(req, res, 'Internal Server Error');
    // }

}
exports.cancelBooktrx= async(req, res, next) => {
    

        await mMentoring.update(
            { status: 'PCancelled' },
            {
              where: {
                id: req.params.idBook,
              }
            })

        return responApi.v2respon200(req, res, "berhasil merubah fee");
       
      
        
    // } catch (error) {
    //     return responApi.v2respon400(req, res, 'Internal Server Error');
    // }

}
exports.reschedule= async(req, res, next) => {
    
    const { id_mentoring, new_date, new_time } = req.body;
       
    const dataMentoring =await  mMentoring.findOne({
        where: {
            id: id_mentoring
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
    })

    console.log("LOG"+dataMentoring.User.email)

    const sendMail = {
        from: process.env.EMAIL,
        to: dataMentoring.User.email,
        subject: 'Permintaan Reschedule Mentoring',
        html: `
        <p>permintaan untuk merubah jadwal mentoring pada ${dataMentoring.date_mentoring} pada jam ${dataMentoring.time_mentoring} menjadi ${new_date} pada jam ${new_time} :</p>\n
        <a href="${process.env.APP_URL}mentoring/reschedule/approved/${id_mentoring}/${new_date}/${new_time}">Terima</a>\n
        <a href="${process.env.APP_URL}mentoring/reschedule/notapproved/${id_mentoring}/${new_date}/${new_time}">Jangan Terima</a>
        `
    };
     await transporter.sendMail(sendMail, (error, info) => {
        if (error) {
            return responApi.v2respon200(req, res, "Failed to send reschedule verification");
        } else {
            return responApi.v2respon200(req, res, "Successfully to send reschedule verification");
        }
    });

       
      
        
    // } catch (error) {
    //     return responApi.v2respon400(req, res, 'Internal Server Error');
    // }

}


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



exports.createPayment = async (req, res, next) => {
    const { amount, successUrl, failureUrl } = req.body;

    try {
        const createPaymentResponse = await i.createInvoice({
            externalID: '88753', // Unique ID for the payment (you may want to generate this dynamically)
            amount: 20000,
            payerEmail: 'qilaadikara@gmail.com',
            description: 'Pembayaran Barang',
            successRedirectUrl: 'https://apizendmind.igniteteam.id/',
            // failureRedirectUrl: failureUrl,
        });

        const paymentUrl = createPaymentResponse.invoice_url;

        res.status(200).json({ paymentUrl });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Terjadi kesalahan saat membuat pembayaran' });
    }
};