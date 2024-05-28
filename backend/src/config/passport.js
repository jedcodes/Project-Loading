const GoogleAuth = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function(passport){
    passport.use(
        new GoogleAuth(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRETE,
                callbackURL: '/auth/google/callback'
            },
            async (accessToken, refreshToken, profile, cb) =>{
                const newUser = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    Image: profile.photos[0].value
                }

                try{
                    let user = await User.findOne( { googleId : profile.id} )
                    if(user){
                        cb(null, user)
                    } else{
                        user = await User.create(newUser)
                        cb(null, user)
                    }
                } catch (err){
                    console.error(err)

                }
            }
        )
    )

    passport.serializeUser((user, cb) => {
        cb(null, user.id)
      })
      
      passport.deserializeUser(async (id, cb) => {
        try {
          const user = await User.findById(id);
          cb(null, user);
        } catch (err) {
          cb(err);
        }
      });

}