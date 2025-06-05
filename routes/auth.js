import express from 'express';
import { createUser } from '../db/queries.js';
import passport from 'passport';

const router = express.Router();

router.get('/auth/status', (req, res) => {
    if(!req.user) {
        return res.status(401).send('Not authorized.');
    }

    console.log(req.user);

    res.send(`Currently logged in as ${req.user.lastname ? req.user.firstname + " " + req.user.lastname : req.user.firstname}.`);
});

router.get('/auth/login', (req, res) => {
    if(req.session.messages) {
        res.send(req.session.messages[req.session.messages.length - 1]);
    } else {
        console.log(req.session);
        res.send('Login Page! TODO');
    }
});

router.post('/auth/login', passport.authenticate('local', {
    // successRedirect: './status',
    // failureRedirect: './login',
    failureMessage: true
}), (req, res) => {
    console.log(req.user);
    res.send(`Welcome ${req.user.firstname}!`);
});

router.post('/auth/logout', (req, res) => {
    if(!req.user) return res.status(401).send('Not authenticated.');
    req.logout((err) => {
        if (err) return res.sendStatus(400);
        res.status(200).send('Logged out successfully.');
    });
});

router.post('/auth/register', createUser);

export default router;