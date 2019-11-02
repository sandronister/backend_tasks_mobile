const {authSecret} = require('../.env'),
 jwt = require('jwt-simple'), 
 bcrypt = require('bcrypt-nodejs')


 module.exports = app =>{
     const signin = async(req,res)=>{
         if(!req.body.email || !req.body.password){
             return res.status(401).send({'message':'Dados incompletos'})
         }

         const user = await app.db('users')
                                .where({email:req.body.email})
                                .first()

        if(user){
            bcrypt.compare(req.body.password,user.password,(err,isMatch)=>{
                if(err||!isMatch){
                    return res.sendStatus(401)
                }

                const payload = {id:user.id}

                res.json({
                    name:user.name, 
                    email:user.email, 
                    token:jwt.encode(payload,authSecret)
                })
            })
        }

        if(!user){
            res.status(400).send({message:'E-mail ou password inválidos'})
        }
     }

     return {signin}
 }