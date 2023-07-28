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

                    const todayDate = new Date().toISOString().split('T')[0];

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
        