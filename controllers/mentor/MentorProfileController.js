const models = require('../../models');
// const Mood = models.Mood
const { Op } = require('sequelize');
const responApi = require('../apirespon');
const tokenModels = models.Token
const jwt = require('jsonwebtoken')
const mUser = models.User


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
                        as: 'MentorProfile'
                    },
                ],  
                attributes: { exclude: ['password'] },
              }).then((user) => {
                if (user) {
                    return responApi.v2respon200(req, res, user);
                } else {
                    return responApi.v2respon400(req, res, "Empty User");
                }
              })
            //   .catch((error) => {
            //     return responApi.v2respon400(req, res, "Failed to make a request");
            //   });

}