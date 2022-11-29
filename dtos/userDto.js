module.exports = class UserDto{
    constructor(model){
        this.username = model.username;
        this.name = model.name;
    };
};