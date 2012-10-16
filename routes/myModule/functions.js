var cookie_config = require('../../config/cookies.json');
var cookiesManager = require('./cookiesManager.js');
var moment = require('moment');

exports.getThemeFromPost = function(req, res){
    cookiesManager.setCookie(req, res, cookie_config.theme, req.body.theme);
}

exports.getThemeFromCookies = function(req, res){
    var theme = cookiesManager.getCookie(req, res, cookie_config.theme);
    if(!theme){
        theme = "Default";
        cookiesManager.setCookie(req, res, cookie_config.theme, theme);
    }
    return theme;
}

exports.getClientIP = function (req){
    var ipAddress;
    // Amazon EC2 / Heroku workaround to get real client IP
    var forwardedIpsStr = req.header('x-forwarded-for'); 
    if (forwardedIpsStr) {
        // 'x-forwarded-for' header may return multiple IP addresses in
        // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
        // the first one
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        // Ensure getting client IP address still works in
        // development environment
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
};

exports.getNow = function (){
    return moment(new Date()).format("YYYY/MM/DD hh:mm:ss");
}