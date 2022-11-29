const tokenService = require('../services/tokenService');
const apiResponse = require('../helpers/apiResponse');

module.exports = function (req, res, next){
    try {
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader)
            return res.json(new apiResponse(401));

        const accessToken = authorizationHeader.split(' ')[1];
        if(!accessToken)
            return res.json(new apiResponse(401));

        const userData = tokenService.validateAccessToken(accessToken);
        if(!userData)
            return res.json(new apiResponse(401));

        req.user = userData;
        next();
    }catch (e) {
        return res.json(new apiResponse(401));
    }
};