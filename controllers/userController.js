const User = require('../models/User')

exports.login = (req, res) => {
    let user = new User(req.body)
    user.login().then((result) => {
        res.send(result)
    }).catch((e) => {
        res.send(e)
    })

}
exports.register = (req, res) => {
    let user = new User(req.body);
    user.register()
    if (user.errors.length) {
        res.send(user.errors)
    } else {
        res.send("congrats ,no error")
    }
}

exports.home = (req, res) => {
    res.render('home-guest')
}