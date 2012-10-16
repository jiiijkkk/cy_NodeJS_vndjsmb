exports.getCookie = function (req, res, name){
    var Keygrip = require("keygrip");
    var Cookies = require("cookies");
    keys = new Keygrip;
    var cookies = new Cookies (req, res, keys);
    return cookies.get(name);
}

exports.setCookie = function (req, res, name, value){
    var Keygrip = require("keygrip");
    var Cookies = require("cookies");
    keys = new Keygrip;
    var cookies = new Cookies (req, res, keys);
    cookies.set(name, value);
}