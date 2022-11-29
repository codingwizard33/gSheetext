const tokenService = require('../services/tokenService');
const googleSheetService = require('../services/googleSheetService');
const apiResponse = require('../helpers/apiResponse');
const UserDto = require('../dtos/userDto');

const COOKIE_REFRESH_TOKEN_MAX_AGE = 30*24*60*60*1000;

class UserController{
    async login(req, res){
        const response = new apiResponse();
        const {username, password} = req.body;
        const user = await googleSheetService.findUser(username, password);

        if(!user){
            response.errorMessage = 'email or password is wrong';
            return res.status(400).json(response);
        }

        response.user = new UserDto(user);
        response.tokens = await tokenService.generateTokens({...response.user});
        res.cookie('refreshToken', response.tokens.refreshToken, {maxAge: COOKIE_REFRESH_TOKEN_MAX_AGE, httpOnly: true});

        return res.json(response);
    }

    async connect(req, res){
        const response = new apiResponse();
        const {refreshToken} = req.cookies;

        if(!refreshToken)
            return res.status(401).json(response);

        const user = tokenService.validateRefreshToken(refreshToken);
        response.user = new UserDto(user);

        if(!response.user)
            return res.status(401).json(response);

        response.tokens = await tokenService.generateTokens({...response.user});
        res.cookie('refreshToken', response.tokens.refreshToken, {maxAge: COOKIE_REFRESH_TOKEN_MAX_AGE, httpOnly: true});

        return res.json(response);

    }

    async logout(req, res){
        const response = new apiResponse();
        res.clearCookie('refreshToken');
        return res.json(response);
    }
}

module.exports = new UserController();