const models = require('../../models');
const mUser = models.User
const mMentor = models.Mentor
const mTimeSchedule = models.TimeSchedule
const mSchedule = models.ScheduleMentor
const mRateMentor = models.RateMentor
const mMentoring = models.Mentoring
const mArticle = models.Article
const tokenModels = models.Token
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const responApi = require('../apirespon');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { Sequelize,Op, fn, col } = require('sequelize');
const { use } = require('../../routes/all-access/auth');
const moment = require('moment-timezone');

exports.dashboard = async (req, res) => {
    const countActiveMentor = await mMentor.count({
      where: {
        status: 'Active'
      },
    });
  
    const revenue = await mMentoring.sum('fee', {
      where: {
        fee: {
          [Op.gt]: 0,
        },
        status: 'Finished',
      },
    });
  
    const user = await mUser.count();
  
    const dailyRevenuesQueryResult = await mMentoring.findAll({
      attributes: [
        [fn('DATE', col('createdAt')), 'date'], // Ambil tanggal dari createdAt
        [fn('SUM', col('fee')), 'totalFee'], // Hitung jumlah fee per hari
      ],
      where: {
        fee: {
          [Op.gt]: 0,
        },
        status: 'Finished',
      },
      group: [fn('DATE', col('createdAt'))], // Kelompokkan hasil berdasarkan tanggal
    });
  
    // Ubah hasil query menjadi format yang sesuai dengan yang diinginkan
    const dailyRevenues = dailyRevenuesQueryResult.map((item) => ({
      date: item.dataValues.date,
      totalFee: item.dataValues.totalFee,
    }));
  
    const customResponse = {
      countActiveMentor: countActiveMentor,
      revenue: revenue,
      user: user,
      dailyRevenues: dailyRevenues,
    };
  
    return responApi.v2respon200(req, res, customResponse);
};

exports.app = async (req, res) => {

    if(req.params.status == "All"){
        
        const order = await mMentoring.findAll({
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
        return responApi.v2respon200(req, res, order);
    }else{
        const order = await mMentoring.findAll({
            where:{
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
        })
        return responApi.v2respon200(req, res, order);
        
        }
    
  }

  exports.addMentor = async (req, res) => {

    const { email, password, name, specialist, about } = req.body;

    try{
        const hashedPassword = bcryptjs.hashSync(password, 10)

        mUser.count({
            where: { email: email },
        }).then(async count =>{
            if(count > 0){
                return responApi.v2respon400(req, res, "e-mail has been used");
            } else{
                orderCreate = await mUser.create({
                    email: email,
                    password: hashedPassword,
                    name: name,
                    isVerify: true,
                    role: "mentor",
                    verifyToken: ""
                })
         
               const orderGet = await mUser.findOne({
                     where: { id: orderCreate.id },
                     attributes: [ 'email', 'isVerify', 'role', 'id' ]
                })

                await mMentor.create({
                  idUser: orderGet.id,
                  role: "Mentor",
                  username: orderGet.name,
                  fee: 0,
                  incomeNow: 0,
                  specialist:specialist,
                  about:about,
                  status: "Active"
                })
         
                 return responApi.v2respon200(req, res, orderGet);
            }
        })
    } catch(error){
        return responApi.v2respon400(req, res, 'Internal Server Error');
    }
  }

  exports.addArticle = async (req, res) => {

    const { title, subtitle, bannerURL, content } = req.body;
  
    await mArticle.create({
      title: title,
      subtitle:subtitle,
      bannerURL:bannerURL,
      content:content,
      viewsCount: 0
    })

    return responApi.v2respon200(req, res, "OK");
  
  }
  exports.gethistory = async (req, res) => {


  
    const order = await mMentor.findAll({
      include:[
        {
            model: models.User,
            as: 'User',
            attributes: { exclude: ['password'] },
            include:[
              {
                  model: models.RekeningMentor,
                  as: 'RekeningMentor',
              }
            ],
        }
      ],
    })

    return responApi.v2respon200(req, res, order);
  
  }