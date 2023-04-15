

const userCollection = require('../db').collection('users')
const validator = require("validator")

let User = function (data) {
    this.data = data;
    this.errors = []
}

User.prototype.cleanUp = function () {
    if (typeof (this.data.username) != "string") {
        this.data.username = ""
    }
    if (typeof (this.data.email) != "string") {
        this.data.email = ""
    }
    if (typeof (this.data.password) != "string") {
        this.data.password = ""
    }

    //get rid of any bogus properties
    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

User.prototype.validate = function () {
    if (this.data.username == "") {
        this.errors.push("you must provide a username")
    }
    if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {
        this.errors.push("username can only contains letters and numbers ")
    }
    if (!validator.isEmail(this.data.email)) {
        this.errors.push("you must provide valid email")
    }
    if (this.data.password == "") {
        this.errors.push("you must provide a password")
    }
    if (this.data.password.length > 0 && this.data.password.length < 12) {
        this.errors.push("password must be 12 character")
    }
    if (this.data.password.length > 100) {
        this.errors.push("password cannot exceed 100 character")
    }
    if (this.data.username.length > 0 && this.data.username.length < 3) {
        this.errors.push("username must be 3 character")
    }
    if (this.data.username.length > 30) {
        this.errors.push("username cannot exceed 30 character")
    }
}

User.prototype.login = function () {
    return new Promise(async (resolve, reject) => {
        this.cleanUp()
        const attemptedUser = await userCollection.findOne({ username: this.data.username })
        console.log(attemptedUser);
        if (attemptedUser && attemptedUser.password == this.data.password) {
            resolve("congrats")
        } else {
            reject("Invalid username and password");
        }
    })
}
User.prototype.register = function () {
    //step 1: validate user data
    this.cleanUp()
    this.validate()

    //step 2: only if there are no validate errors

    //step 3: then save the user data into a database
    if (!this.errors.length) {
        userCollection.insertOne(this.data)
    }
};


module.exports = User