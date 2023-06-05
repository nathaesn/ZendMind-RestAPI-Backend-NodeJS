const models = require('../../models');
const mUser = models.User
const tokenModels = models.Token
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const responApi = require('../apirespon');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
    service: 'Gmail', // layanan email yang digunakan
    auth: {
      user: process.env.EMAIL, // email Anda
      pass: process.env.PASSWORD // password email Anda
    }
  });

  const saveBase64Image = (base64String, imagePath) => {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
  
    fs.writeFileSync(imagePath, imageBuffer);
  };


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
                    name: name,
                    verifyToken: ""
                })
         
                orderGet = await mUser.findOne({
                     where: { id: orderCreate.id },
                     attributes: [ 'email', 'isVerify', 'role', 'id' ]
                })
         
                 return responApi.v2respon200(req, res, orderGet);
            }
        })
    } catch(error){
        return responApi.v2respon400(req, res, 'Internal Server Error');
    }
}

exports.login = async(req, res) => {
    const { email, password } = req.body;

    try{
        var order = await mUser.findOne({ 
            where: { email: email },
        });

        if(order){
            const orderPassword = bcryptjs.compareSync(password, order.password)

            if(orderPassword){
                const user = await mUser.findOne({ 
                    where: { email: email },
                    attributes: [ 'email', 'isVerify', 'role', 'id' ]
                });

                if(user.isVerify == "true"){
                    const token = jwt.sign(
                        { user }, process.env.TOKEN_KEY,
                    );
    
                    user.setDataValue('token', token)
    
                    var response= {user}
    
                    await tokenModels.create(
                        {
                            token: token,
                        }
                    )
    
                    return responApi.v2respon200(req, res, response);
                } else{
                    return responApi.v2respon400(req, res, 'Verify email');
                }
            } else{
                return responApi.v2respon400(req, res, 'Password Not Match');
            }


        } else{
            return responApi.v2respon400(req, res, 'Email Not Found');
        }
    }catch(error){
        return responApi.v2respon400(req, res, 'Internal Server Error');
    }
}

exports.tokenUser= async(req, res) =>{
    let token = req.body.token || req.query.token || req.headers["authorization"];

    if (!token) {

        return res.status(403).json("A token is required for authentication");
    }
    token = token.replace("Bearer ", "");
    try {
        const tokendb = await models.Token.findOne({ where: { token: token } });
        if (!tokendb) {
            return responApi.v2respon400(req, res, "Invalid Token");
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);

        res.locals.decodedUser = decoded;


        console.log(decoded)
        return responApi.v2respon200(req, res, decoded.user);
    } catch (err) {
        return responApi.v2respon400(req, res, 'Internal Server Error');
    }
}

exports.sendVerifyEmail = async(req, res) => {
    const { email } = req.body;
        try{
            const token = jwt.sign({ email }, process.env.TOKEN_KEY, { expiresIn: '1h' });

        var order = await mUser.update(
            {
                verifyToken: token
            },
            {
                where: { email: email}
            }
        );

        const sendMail = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Verifikasi Email',
            html: `
            <p>Silakan klik tautan di bawah ini untuk memverifikasi email Anda:</p>
            <a href="${process.env.APP_URL_API}auth/verify-email/${token}">Verifikasi Email</a>
            `
        };
         await transporter.sendMail(sendMail, (error, info) => {
        if (error) {
            return responApi.v2respon200(req, res, "Failed to send email verification");
        } else {
            return responApi.v2respon200(req, res, "Successfully to send email verification");
        }
      });

    }catch (err) {
        return responApi.v2respon400(req, res, 'Internal Server Error');
    }
}

exports.verifyEmail = async(req, res) => {
    const { token } = req.params;

    try {
      // Verifikasi token JWT
      const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
  
      // Lakukan proses verifikasi email di sini
      await mUser.update(
            {
                verifyToken: "",
                isVerify: "true"
            },
            {
                where: { email: decodedToken.email}
            }
        );

        io.emit(`verify-${decodedToken.email}`, 'refresh' );

      res.send("Email telah berhasil diverifikasi");
    } catch (error) {
      res.send('Token tidak valid atau telah kadaluarsa.');
    }
  
}


exports.forgotPassword = async(req, res) => {}

exports.changeMails = async(req, res) => {}


exports.uploadImg = async (req, res) => {
    const { img, imgNamed } = req.body;

    const timestamp = Date.now();


    // const base64Image = img.split(';base64,').pop();
    // const imageBuffer = Buffer.from(base64Image, 'base64');
    // const imagePath = process.env.APP_URL + `Assets/${timestamp+imgNamed}.png`;

    const imagePath = path.resolve(`public/img/users`, `${timestamp+imgNamed}.png`);
    const imageUrl = process.env.APP_URL+`img/users/${timestamp+imgNamed}.png`;


    saveBase64Image(img, imagePath);

    return responApi.v2respon200(req, res, imageUrl);
}

exports.uploadImgProfile = async(req, res) => {
    const { img, imgNamed } = req.body;
   
    let token = req.body.token || req.query.token || req.headers["authorization"];

    if (!token) {
        return res.status(403).json("A token is required for authentication");
    }
    token = token.replace("Bearer ", "");

    // try {
        const tokendb = await tokenModels.findOne({ where: { token: token } });
        if (!tokendb) {
            return responApi.v2respon400(req, res, "Invalid Token");
        } else{
            const timestamp = Date.now();

            const imagePath = path.resolve(`public/img/users-profile`, `${timestamp+imgNamed}.png`);
            const imageUrl = `img/users-profile/${timestamp+imgNamed}.png`;
    
    
            saveBase64Image(img, imagePath);
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            var order = await mUser.update(
                {
                    imgProfileURL: imageUrl
                },
                {
                    where: { id: decoded.user.id}
                }
                );
    
            return responApi.v2respon200(req, res, "Sucessfully to update profile");
        }
        
        
    // } catch (error) {
    //     return responApi.v2respon400(req, res, 'Internal Server Error');
    // }
    

}

exports.isVerifyPermission = async(req, res, next) => {
    let token = req.body.token || req.query.token || req.headers["authorization"];

    if (!token) {

        return res.status(403).json("A token is required for authentication");
    }
    token = token.replace("Bearer ", "");
    try {
        const tokendb = await tokenModels.findOne({ where: { token: token } });
        if (!tokendb) {
            return responApi.v2respon400(req, res, "Invalid Token");
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        if (decoded.user.isVerify != "true") {
            return responApi.v2respon200(req, res, "Please Verify Your Email");
        }

        res.locals.decodedUser = decoded;
    } catch (err) {
        return responApi.v2respon400(req, res, 'Internal Server Error');
    }
    
    // return next();
    return responApi.v2respon400(req, res, 'Internal Server JAKLdjlkj');
}

exports.adminPermission = async (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers["authorization"];

    if (!token) {

        return res.status(403).json("A token is required for authentication");
    }
    token = token.replace("Bearer ", "");
    try {
        const tokendb = await tokenModels.findOne({ where: { token: token } });
        if (!tokendb) {
            return responApi.v2respon400(req, res, "Invalid Token");
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        if (decoded.user.isVerify != "true") {
            return responApi.v2respon200(req, res, "Please Verify Your Email");
        }
        if (decoded.user.role != "admin") {
            return responApi.v2respon200(req, res, "You dont have a access");
        }

        res.locals.decodedUser = decoded;
    } catch (err) {
        return responApi.v2respon400(req, res, 'Internal Server Error');
    }

    return next();
}

exports.logOut = async(req, res, next) => {
    let token = req.body.token || req.query.token || req.headers["authorization"];
    if (!token) {
        return res.status(403).json("A token is required for authentication");
    }
    token = token.replace("Bearer ", "");
    try {

        const tokendb = await tokenModels.findOne({ where: { token: token } });
        if (!tokendb) {
            return responApi.v2respon400(req, res, "Invalid Token");
        } else{
            tokenModels.destroy({
                where: {
                  token: token,
                },
              }).then((rowsDeleted) => {
                return responApi.v2respon200(req, res, "Succesfully to logout");
              })
              .catch((error) => {
                return responApi.v2respon400(req, res, "Failed to make a request");
              });
        }

        
    } catch (error) {
        return responApi.v2respon400(req, res, 'Internal Server Error');
    }

}
exports.getUser = async(req, res, next) => {
    let token = req.body.token || req.query.token || req.headers["authorization"];
    if (!token) {
        return res.status(403).json("A token is required for authentication");
    }
    token = token.replace("Bearer ", "");
    try {

        const tokendb = await tokenModels.findOne({ where: { token: token } });
        if (!tokendb) {
            return responApi.v2respon400(req, res, "Invalid Token");
        } else{
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            mUser.findOne({
                where: {
                  id: decoded.user.id,
                },
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
        }

        
    } catch (error) {
        return responApi.v2respon400(req, res, 'Internal Server Error');
    }

}
exports.updateUserDisplay = async(req, res, next) => {
    let token = req.body.token || req.query.token || req.headers["authorization"];
    const {name} = req.body
    if (!token) {
        return res.status(403).json("A token is required for authentication");
    }
    token = token.replace("Bearer ", "");
    try {

        const tokendb = await tokenModels.findOne({ where: { token: token } });
        if (!tokendb) {
            return responApi.v2respon400(req, res, "Invalid Token");
        } else{
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            mUser.update(
                {
                    name: name
                }, 
                {
                where: {
                  id: decoded.user.id,
                }})

                return responApi.v2respon200(req, res, "Update Sucsessfully");
        }

        
    } catch (error) {
        return responApi.v2respon400(req, res, 'Internal Server Error');
    }

}

exports.verifyemailCheck = async(req, res) => {
    const {email} = req.params

    const user = await mUser.findOne({ 
        where: { email: email },
        attributes: [ 'isVerify' ]
    });

    if(user.isVerify == "true"){
        return responApi.v2respon200(req, res, "Active Email");
    } else{
        return responApi.v2respon400(req, res, 'Email Not Verify');
    }

}