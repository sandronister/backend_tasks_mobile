const { authSecret } = require('../.env'),
	passport = require('passport'),
	passportJwt = require('passport-jwt'),
    { Strategy, ExtractJwt } = passportJwt;
    

module.exports = app =>{
    const params = {
        secretOrKey:authSecret, 
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params,(payload,done)=>{
        app.db('users')
            .where({id:payload.id})
            .first()
            .then(user=>{
                if(user){
                    done(null,{id:user.id,email:user.email})
                }else{
                    done(null,false)
                }
            })
            .catch(err => done(err,false))
    })

    passport.use(strategy)

    return {
        initialize: () =>passport.initialize(), 
        authenticate: () => passport.authenticate('jwt',{session:false})
    }
}
