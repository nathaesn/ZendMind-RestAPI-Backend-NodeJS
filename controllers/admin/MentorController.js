const models = require('../../models');
const mentorModel = models.Mentor


exports.create = async(req, res) => {
    const {idUser, usernameMentor, specialist, about } = req.body

    mentorModel.create({
        idUser: idUser,
        username: usernameMentor,
        specialist: specialist,
        about: about,
        fee: "5000",
        incomeNow: "0",
        status: "Active"
    })
    

    
}