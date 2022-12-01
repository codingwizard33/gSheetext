const {GoogleSpreadsheet} = require('google-spreadsheet');
const creds = require('../unique-alloy-369011-aa9b6bfe819e.json');

let a = [
    //date
    'LI Msg 2 / Email 2 DATE',
    'DATE CONTACTED',
    'FF UP / Close Off Date',
    'LI Msg 1 Date',

    //recruiter
    'FF UP / Close Off POC',
    'LI Msg 2 / Email 2 OWNER',
    'CONTACTED BY',

    //info
    'Status',
    'Target Position',
];

class GoogleSheetService{
    constructor(){
        this.activityDateFieldFactory = {
            'Assume Not Interested': 'FF UP / Close Off Date',
            'CBR2': 'LI Msg 2 / Email 2 DATE',
            'Engaged': 'DATE CONTACTED',
            'Not Qualified': 'DATE CONTACTED',
            'Not Interested': 'DATE CONTACTED',
            'Contacted': 'DATE CONTACTED',
            'CBR1': 'LI Msg 1 Date',
        };

        this.recruiterFieldFactory = {
            'Assume Not Interested': 'FF UP / Close Off POC',
            'CBR2': 'LI Msg 2 / Email 2 OWNER',
            'Engaged': 'CONTACTED BY',
            'Not Qualified': 'CONTACTED BY',
            'Not Interested': 'CONTACTED BY',
            'Contacted': 'CONTACTED BY',

            'CBR1': '????????',
        };
    }

    async getTrackerSheetRows(){
        const doc = new GoogleSpreadsheet('15ca212CJ-VcmMx6KRyHdglWwxSaYzSSS2_e1VgUjGDQ');
        await doc.useServiceAccountAuth(creds);
        await doc.loadInfo();

        const sheet = doc.sheetsByTitle['Tracker']; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

        return await sheet.getRows();
    }

    getActivityDateField(status){
        return this.activityDateFieldFactory[status] ? this.activityDateFieldFactory[status]: ''
    }

    getRecruiterField(status){
        return this.recruiterFieldFactory[status] ? this.recruiterFieldFactory[status]: ''
    }

    getUserInfo(row){
        const activityDate = row[this.getActivityDateField(row['Status'])];
        const recruiter = row[this.getRecruiterField(row['Status'])];

        return {
            userName: row['CkzNDcDkzz4 Nkzw4 (fqllqw Lc Nkzw4)'],
            status: row['Status'],
            targetPosition: row['Target Position'],
            activityDate: activityDate ? activityDate: '',
            recruiter: recruiter ? recruiter: ''
        };
    }

    async findUser(username, password){
        let user = null;
        const doc = new GoogleSpreadsheet('15ca212CJ-VcmMx6KRyHdglWwxSaYzSSS2_e1VgUjGDQ');
        await doc.useServiceAccountAuth(creds);
        await doc.loadInfo();
        const sheet = doc.sheetsByTitle['App users']; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

        const rows =  await sheet.getRows();

        for(let i = 0; i < rows.length; i++){
            if(rows[i]['Email Login'] === username && rows[i]['Password'] === password){
                user =  {
                    name: rows[i]['Recruiter Name'],
                    username: rows[i]['Email Login']
                };

                break;
            }
        }

        return user;
    }
}

module.exports = new GoogleSheetService();