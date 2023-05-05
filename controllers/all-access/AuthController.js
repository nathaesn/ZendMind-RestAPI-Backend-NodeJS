const models = require('../../models');
const mUser = models.User
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const responApi = require('../apirespon');


exports.register = async(req, res) => {
    const { email, password, name } = req.body;

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
                    name: name
                })
         
                orderGet = await mUser.findOne({
                     where: { id: orderCreate.id },
                     attributes: [ 'email', 'isVerify', 'role', 'id' ]
                })
         
                 return responApi.v2respon200(req, res, orderGet);
            }
        })
    } catch(error){
        return responApi.v2respon400(req, res, 'Error');
    }
}

exports.login = async(req, res) => {
    const { email, password } = req.body;

    // try{
        var order = await mUser.findOne({ 
            where: { email: email },
        });

        if(order){
            const orderPassword = bcryptjs.compareSync(password, order.password)

            if(orderPassword){
                const orderData = await mUser.findOne({ 
                    where: { email: email },
                    attributes: [ 'email', 'isVerify', 'role', 'id' ]
                });

                return responApi.v2respon200(req, res, orderData);
            } else{
                return responApi.v2respon400(req, res, 'Password Not Match');
            }


        } else{
            return responApi.v2respon400(req, res, 'Email Not Found');
        }
    // }catch(error){
    //     return responApi.v2respon400(req, res, 'Error');
    // }
}
