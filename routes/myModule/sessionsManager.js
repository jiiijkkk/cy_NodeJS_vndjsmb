exports.setSession = function(req, name, value){
    req.session[name] = value;
}

exports.getSession = function(req, name) {
    return req.session[name];
}

exports.removeSession = function(req, name) {
    delete req.session[name];
}
