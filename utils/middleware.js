export const checkAuthorised = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    
    res.status(401).send('Not authorized.');
}

export const getLoggedInUser = (req, res) => {
    res.status(200).send(req.user);
}