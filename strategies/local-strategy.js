import passport from "passport";
import { Strategy } from "passport-local";
import { findUserByEmail, findUserById } from "../db/queries.js";

passport.serializeUser((user, done) => {
    //console.log(`Serializing user: ${user.email}`);
    done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
    //console.log(`Deserializing user with ID: ${id}`);
    try {
        const findUser = await findUserById(id);
        if(!findUser) throw new Error('User not found');
        done(null, findUser);
    } catch (error) {
        done(error, null);
    }
});

export default passport.use(
    new Strategy({usernameField: 'email'}, async (email, password, done) => {
        try {
            const findUser = await findUserByEmail(email);
            if(!findUser) throw new Error('User not found');

            console.log(findUser);
            
            //TODO hash password here
            if(findUser.password !== password) throw new Error('Invalid password');

            return done(null, findUser);
        } catch (error) {
            done(error, null);
        }
    } )
)