const {User} = require('./../models/users');

// Allows the route handlers to identify specific users from the tokens
let authenticate = async (req, res, next) => {
    let token = req.header('x-auth');
    let specificUser = await User.findByToken(token);
    if (!specificUser) {
        return res.status(401).send();
    }
    req.user = specificUser;
    req.token = token;
    next();
};

module.exports = authenticate;