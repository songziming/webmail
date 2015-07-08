/**
 * Created by Ã÷Ñô on 2015/6/29.
 */
exports.login = function(req, res, user) {
    req.session = {
        id : user.id,
        username : user.username,
        nickname : user.nickname
    };

};