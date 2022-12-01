const apiResponse = require('../helpers/apiResponse');
const googleSheetService = require('../services/googleSheetService');
const loadedUsers = new Map();
var hash = require('object-hash');
// const { google } = require("googleapis");

class IndexController{
    async getUsers(req, res){
        res.append('Access-Control-Allow-Origin', ['*']);
        const {userName} = req.body;
        const response = new apiResponse();
        const rows = await googleSheetService.getTrackerSheetRows();
        response.users = [];

        for(let i = 0; i < rows.length; i++){
            if(rows[i]['CkzNDcDkzz4 Nkzw4 (fqllqw Lc Nkzw4)'] === userName){
                const user = googleSheetService.getUserInfo(rows[i]);
                user._id = hash(user);
                response.users.push(user);
                loadedUsers.set(user._id, rows[i]);
            }
        }

        if(!response.users.length) {
            response.errorMessage = 'Users not found';
            return res.status(204).json(response);
        }

        return res.json(response);
    }

    async updateUser(req, res){
        const response = new apiResponse();
        const {userInfo} = req.body;
        const row = loadedUsers.get(userInfo._id);

        if(!row)
            return res.status(400).json(response);

        row['Status'] = userInfo.status;

        if(userInfo.status === 'Assume Not Interested') {
            row['Status'] = 'Not Interested';
            row['Remarks'] = 'assuming NI';
        }

        if(userInfo.status === 'CBR1')
           row['Date Accepted on Linkedin'] = userInfo.activityDate;

        if(userInfo.status !== 'CBR1')
            row[googleSheetService.getRecruiterField(userInfo.status)] = userInfo.recruiter;

        row[googleSheetService.getActivityDateField(userInfo.status)] = userInfo.activityDate;

        row.save();

        return res.json(response)
    }
}

module.exports = new IndexController();