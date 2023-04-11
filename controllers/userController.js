exports.login = function(){

}
exports.register = function(req,res){
    res.send("thanks for registering")
}

exports.home = function(req,res){
    res.render('home-guest')
}