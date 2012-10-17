

exports.setSession = function(req, res){
    console.log(req);
    console.log(req.sessionID);
    req.session.test = req.param('test');
//    console.log(session);
}
