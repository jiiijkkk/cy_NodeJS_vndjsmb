var sessions=   require("sessions"),
    sessionHandler = new sessions();

exports.setSession = function(req, res){
    sessionHandler.httpRequest(req, res, function (err, session){
        if (err) {
            return res.end("session error");
        }
        console.log("[s] > %s", session.get("a"), req.url);
        console.log("aa");
        res.end(req.url);
    });
//    console.log(session);
}
