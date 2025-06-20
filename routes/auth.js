import express from 'express';
import { createUser } from '../db/queries.js';
import passport from 'passport';

const router = express.Router();

router.get('/auth/status', (req, res) => {
    if(!req.user) {
        return res.status(401).send('Not authorized.');
    }
    
    res.send(`Currently logged in as ${req.user.firstname}${req.user.lastname ? " " + req.user.lastname : ""}.`);
});

router.post('/auth/login', passport.authenticate('local', {
    failureMessage: true
}), (req, res) => {
    // console.log(req.user);
    res.send(`Welcome ${req.user.firstname}${req.user.lastname ? " " + req.user.lastname : ""}!`);
});

router.post('/auth/logout', (req, res) => {
    if(!req.user) return res.status(401).send('Not authorized.');
    req.logout((err) => {
        if (err) return res.sendStatus(400);
        res.status(200).send('Logged out successfully.');
    });
});

router.post('/auth/register', createUser);

export default router;