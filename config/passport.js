const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const userSQL = require('./../helpers/Dao/users_SQL');
const uSQL = new userSQL();

module.exports = (passport) => {
    let user = '';
    passport.use(
        new LocalStrategy({ usernameField: 'username',passwordField:'userid' },
            async(username, userid, done) => {
                try {
                    let data = {'id':userid,'name':username};
                    let user = await uSQL.getUserByidandName(data);
                    if (user == '') {
                        return done(null, false, { message: 'No user exists' });
                    }else{
                        return done(null, user);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        console.log(`New User Session: ${user.name} `);
        //console.log(user);
        done(null, user.id);
    });

    passport.deserializeUser(async(id, done) => {
        try {
            let user = await uSQL.getUserById(id);
            await done(null, user);
        } catch (error) {
            throw err;
        }
    });
};