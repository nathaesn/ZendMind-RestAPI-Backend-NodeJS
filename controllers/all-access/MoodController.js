const models = require('../../models');
const Mood = models.Mood
const { Op } = require('sequelize');
const mood = require('../../models/mood');
const responApi = require('../apirespon');
const tokenModels = models.Token
const jwt = require('jsonwebtoken')

module.exports = {
    async create(req, res) {

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

      const { month, year, mood , day} = req.body;
      const startDate = `${year}-${month}-01`;
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      const endDate = `${year}-${month}-${lastDayOfMonth}`;

      Mood.count({ 
        order: [['createdAt', 'ASC']],
        where: {
          idUser: decoded.user.id,
          monthYear:`${year}-${month}-${day}`,
        },
      
      }).then(async count =>{
        if(count >0){
          return responApi.v2respon200(req, res, "Kamu telah melakukan trackmood hari ini");
        } else{
          if (!['happy', 'normal', 'sad', 'angry'].includes(mood)) {
            return res.status(400).json({ error: 'Mood tidak valid' });
          }
      
          await Mood.create({ 
            idUser: decoded.user.id,
            monthYear:`${year}-${month}-${day}`,
            mood: mood
           });
      
           return responApi.v2respon200(req, res, "Berhasil Memilih");
        }
      })
    },
  
    async index(req, res) {

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
        


      const { month, year } = req.body;
      const startDate = `${year}-${month}-01`;
      const lastDayOfMonth = new Date(year, month, 0).getDate();
      const endDate = `${year}-${month}-${lastDayOfMonth}`;

      const moods = await Mood.findAll({ 
        order: [['createdAt', 'ASC']],
        where: {
          idUser: decoded.user.id,
          monthYear: {
            [Op.between]: [startDate, endDate],
          },
        },
      
      });
      const happyCount = await Mood.count({ 
       
        where: {
          idUser: decoded.user.id,
          monthYear: {
            [Op.between]: [startDate, endDate],
          },
          mood: 'happy'
        },
      });
      const normalCount = await Mood.count({ 
        
        where: {
          idUser: decoded.user.id,
          monthYear: {
            [Op.between]: [startDate, endDate],
          },
          mood: 'normal'
        },
      });
      const sadCount = await Mood.count({ 
       
        where: {
          idUser: decoded.user.id,
          monthYear: {
            [Op.between]: [startDate, endDate],
          },
          mood: 'sad'
        },
      });
      const angryCount = await Mood.count({ 
        where: {
          idUser: decoded.user.id,
          monthYear: {
            [Op.between]: [startDate, endDate],
          },
          mood: 'angry'
        },
      });

      const customResponse = {
        happyCount: happyCount,
        normalCount: normalCount,
        sadCount: sadCount,
        angryCount: angryCount,
        moodData: moods,
      };
      

      return responApi.v2respon200(req, res, customResponse);
    }
  };
