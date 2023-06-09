const bcrypt = require('bcryptjs')

const userCollection = require('../db').db().collection('users')
const validator = require("validator")
const md5 = require('md5')

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
    return new Promise(async (resolve, reject) => {
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
        if (this.data.password.length > 0 && this.data.password.length < 8) {
            this.errors.push("password must be 8 character")
        }
        if (this.data.password.length > 50) {
            this.errors.push("password cannot exceed 50 character")
        }
        if (this.data.username.length > 0 && this.data.username.length < 3) {
            this.errors.push("username must be 3 character")
        }
        if (this.data.username.length > 30) {
            this.errors.push("username cannot exceed 30 character")
        }

        //only if username is valid then check to see if its already taken
        if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
            let usernameExists = await userCollection.findOne({ username: this.data.username })
            if (usernameExists) {
                this.errors.push("That username is already taken.")
            }
        }

        if (validator.isEmail(this.data.email)) {
            let emailExists = await userCollection.findOne({ email: this.data.email })
            if (emailExists) {
                this.errors.push("This email is already being used.")
            }
        }
        resolve()
    })
}

User.prototype.login = function () {
    return new Promise(async (resolve, reject) => {
        this.cleanUp()
        const attemptedUser = await userCollection.findOne({ username: this.data.username })
        // console.log(attemptedUser);
        if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
            this.data = attemptedUser
            this.getAvatar()
            resolve("congrats")
        } else {
            reject("Invalid username and password");
        }
    })
}
User.prototype.register = function () {
    return new Promise(async (resolve, reject) => {
        //step 1: validate user data
        this.cleanUp()
        await this.validate()

        //step 2: only if there are no validate errors

        //step 3: then save the user data into a database
        if (!this.errors.length) {
            //hash user password
            let salt = bcrypt.genSaltSync(10)
            this.data.password = bcrypt.hashSync(this.data.password, salt)
            await userCollection.insertOne(this.data)
            this.getAvatar()
            resolve()
        } else {
            reject(this.errors)
        }
    })
}

User.prototype.getAvatar = function(){
    this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`
}


module.exports = User