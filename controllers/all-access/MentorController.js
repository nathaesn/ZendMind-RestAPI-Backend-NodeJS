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
const { Sequelize,Op } = require('sequelize');
const { use } = require('../../routes/all-access/auth');
const moment = require('moment-timezone');


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
                }
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

        $date_mntr =date_mentoring["date"];
        $time_mntr =time_mentoring["time"];


        const sendMailOptions = {
            from: process.env.EMAIL,
            to:user["email"],
            subject: "Hai, "+ user["name"]+ "Booking Berhasil dilakukan",
            html: `
            <p>Hai, Booking kamu udah berhasil, silahkan buka pada aplikasi zendmind untuk join meet pada ${$date_mntr},  pukul ${$time_mntr}</p>
            `
            // <a href="#">Join Meet</a>
        };
        const sendMailMentorOptions = {
            from: process.env.EMAIL,
            to: mentor["email"],
            subject: "Hai, "+ mentor["name"]+ ", "+user["name"]+"Melakukan booking mentoring",
            html: `
            <p>Hai,${mentor["name"]} telah membooking kamu untuk mentoring, silahkan buka pada aplikasi zendmind untuk join meet pada ${$date_mntr},  pukul ${$time_mntr}</p>
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
              
              
              await destroyTimeMentoring(date_mentoring, time_mentoring);


            //   sendEmailNotif(sendMailOptions.to, sendMailOptions.subject, sendMailOptions.html);
               
            //   sendEmailNotif(sendMailMentorOptions.to, sendMailMentorOptions.subject, sendMailMentorOptions.html);
            
            
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
const x = new Xendit({
    secretKey: 'xnd_development_LN0LUl417TLHOFNzxn0ujWQjhrpxZ7i2mV592pPvlWMehfROezgZnxUPjlNbq',
});

const { Invoice } = x;
const invoiceSpecificOptions = {};
const i = new Invoice(invoiceSpecificOptions);

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
        // successRedirectUrl: 'successUrl',
        // failureRedirectUrl: 'failureUrl',
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

          
          await destroyTimeMentoring(date_mentoring, time_mentoring);

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
    

        await mMentoring.update(
            { status: 'Finished' },
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