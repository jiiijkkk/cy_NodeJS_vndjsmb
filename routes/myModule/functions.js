var cookie_config = require('../../config/cookies')
  , cookiesManager = require('./cookiesManager')
  , moment = require('moment');

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

exports.setMessageFormFromPost = function(req, res){
    cookiesManager.setCookie(req, res, cookie_config.messageForm.account, req.body.account);
    cookiesManager.setCookie(req, res, cookie_config.messageForm.nickname, req.body.nickname);
    cookiesManager.setCookie(req, res, cookie_config.messageForm.mobile, req.body.mobile);
}

exports.setMessagePageInfoFromPost = function(req, res, pageinfo){
    cookiesManager.setCookie(req, res, cookie_config.messagePageInfo.pageSize, pageinfo.size);
    cookiesManager.setCookie(req, res, cookie_config.messagePageInfo.pageNum, pageinfo.num);
}

exports.getMessageFormAndPageInfoFromCookies = function(req, res){
    var account=    cookiesManager.getCookie(req, res, cookie_config.messageForm.account);
    var nickname=   cookiesManager.getCookie(req, res, cookie_config.messageForm.nickname);
    var mobile=     cookiesManager.getCookie(req, res, cookie_config.messageForm.mobile);
    var pagesize=   cookiesManager.getCookie(req, res, cookie_config.messagePageInfo.pageSize);
    var pagenum=    cookiesManager.getCookie(req, res, cookie_config.messagePageInfo.pageNum);
    if(!account)    account=    "";
    if(!nickname)   nickname=   "";
    if(!mobile)     mobile=     "";
    if(!pagesize)   pagesize=   cookie_config.defaultMessagePageSize;
    if(!pagenum)    pagenum=    1;
    return {
        "account":  account,
        "nickname": nickname,
        "mobile":   mobile,
        "pagesize": pagesize,
        "pagenum":  pagenum
    };
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
    return moment(new Date()).format("YYYY/MM/DD HH:mm:ss");
}