const models = require('../../models');
const mUser = models.User
const tokenModels = models.Token
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const responApi = require('../apirespon');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail', // layanan email yang digunakan
    auth: {
      user: process.env.EMAIL, // email Anda
      pass: process.env.PASSWORD // password email Anda
    }
  });


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
        return responApi.v2respon400(req, res, 'Error');
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
        return responApi.v2respon400(req, res, 'Error');
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
            return res.status(401).json("Invalid Token");
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);

        res.locals.decodedUser = decoded;


        console.log(decoded)
        return responApi.v2respon200(req, res, decoded.user);
    } catch (err) {
        return res.status(401).json("Invalid Token");
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
        return res.status(401).json("Invalid Token");
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

      res.send("Email telah berhasil diverifikasi");
    } catch (error) {
      res.send('Token tidak valid atau telah kadaluarsa.');
    }
  
}


exports.forgotPassword = async(req, res) => {

}

exports.changeMails = async(req, res) => {}

exports.changeDisplay = async(req, res) => {}