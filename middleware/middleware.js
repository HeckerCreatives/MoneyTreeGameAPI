const Users = require("../models/Users")
const Staffusers = require("../models/Staffusers")
const fs = require('fs');
const path = require("path");
const publicKey = fs.readFileSync(path.resolve(__dirname, "../keys/public-key.pem"), 'utf-8');
const jsonwebtokenPromisified = require('jsonwebtoken-promisified');

const verifyJWT = async (token) => {
    try {
        const decoded = await jsonwebtokenPromisified.verify(token, publicKey, { algorithms: ['RS256'] });
        return decoded;
    } catch (error) {
        console.error('Invalid token:', error.message);
        throw new Error('Invalid token');
    }
};

exports.protectplayer = async (req, res, next) => {
    const token = req.headers.authorization

    if (!token){
        return res.json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
    }

    try{
        if (!token.startsWith("Bearer")){
            return res.json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
        }

        const headerpart = token.split(' ')[1]

        const decodedToken = await verifyJWT(headerpart);

        if (decodedToken.auth != "player"){
            return res.json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
        }

        const user = await Users.findOne({username: decodedToken.username})
        .then(data => data)

        if (!user){
            res.clearCookie('sessionToken', { path: '/' })
            return res.json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
        }

        if (user.status != "active"){
            res.clearCookie('sessionToken', { path: '/' })
            return res.json({ message: 'failed', data: `Your account had been ${user.status}! Please contact support for more details.` });
        }


        if (decodedToken.gametoken != user.gametoken){
            res.clearCookie('sessionToken', { path: '/' })
            return res.json({ message: 'duallogin', data: `Your account had been opened on another device! You will now be logged out.` });
        }

        req.user = decodedToken;
        next();
    }
    catch(ex){
        return res.json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
    }
}

exports.protectsuperadmin = async (req, res, next) => {
    const token = req.headers.cookie?.split('; ').find(row => row.startsWith('sessionToken='))?.split('=')[1]

    if (!token){
        return res.json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
    }

    try{
        const decodedToken = await verifyJWT(token);

        if (decodedToken.auth != "superadmin" && decodedToken.auth != "admin"){
            return res.json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
        }

        const user = await Staffusers.findOne({username: decodedToken.username})
        .then(data => data)

        if (!user){
            res.clearCookie('sessionToken', { path: '/' })
            return res.json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
        }

        if (user.status != "active"){
            res.clearCookie('sessionToken', { path: '/' })
            return res.json({ message: 'failed', data: `Your account had been ${user.status}! Please contact support for more details.` });
        }

        if (decodedToken.token != user.webtoken){
            res.clearCookie('sessionToken', { path: '/' })
            return res.json({ message: 'duallogin', data: `Your account had been opened on another device! You will now be logged out.` });
        }

        req.user = decodedToken;
        next();
    }
    catch(ex){
        return res.json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
    }
}

exports.protectadmin = async (req, res, next) => {
    const token = req.headers.cookie?.split('; ').find(row => row.startsWith('sessionToken='))?.split('=')[1]

    if (!token){
        return res.json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
    }

    try{
        const decodedToken = await verifyJWT(token);

        if (decodedToken.auth != "admin"){
            return res.json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
        }

        const user = await Staffusers.findOne({username: decodedToken.username})
        .then(data => data)

        if (!user){
            res.clearCookie('sessionToken', { path: '/' })
            return res.json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
        }

        if (user.status != "active"){
            res.clearCookie('sessionToken', { path: '/' })
            return res.json({ message: 'failed', data: `Your account had been ${user.status}! Please contact support for more details.` });
        }

        // if (decodedToken.token != user.webtoken){
        //     res.clearCookie('sessionToken', { path: '/' })
        //     return res.json({ message: 'duallogin', data: `Your account had been opened on another device! You will now be logged out.` });
        // }

        req.user = decodedToken;
        next();
    }
    catch(ex){
        return res.json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
    }
}

exports.protectusers = async (req, res, next) => {
    const token = req.headers.cookie?.split('; ').find(row => row.startsWith('sessionToken='))?.split('=')[1]

    if (!token){
        return res.json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
    }

    try{
        const decodedToken = await verifyJWT(token);

        let user = await Staffusers.findOne({username: decodedToken.username})
        .then(data => data)

        if (!user){

            user = await Users.findOne({username: decodedToken.username})
            .then(data => data)

            if (!user){
                res.clearCookie('sessionToken', { path: '/' })
                return res.json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
            }
        }

        if (user.status != "active"){
            res.clearCookie('sessionToken', { path: '/' })
            return res.json({ message: 'failed', data: `Your account had been ${user.status}! Please contact support for more details.` });
        }

        if (decodedToken.token != user.webtoken){
            res.clearCookie('sessionToken', { path: '/' })
            return res.json({ message: 'duallogin', data: `Your account had been opened on another device! You will now be logged out.` });
        }

        req.user = decodedToken;
        next();
    }
    catch(ex){
        return res.json({ message: 'Unauthorized', data: "You are not authorized to view this page. Please login the right account to view the page." });
    }
}


exports.captureIpAddress = async (req, res, next) => {
    req.body.ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    next();
  };
  