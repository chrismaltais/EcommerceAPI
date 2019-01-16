const {User} = require('./../models/users');

async function login (email, password) {
    let foundUser = await User.findByCredentials(email, password);
    if (!foundUser) {
        return null;
    }
    let token = await foundUser.generateAuthToken();
    return token;
}

module.exports = {
    login
}