// for auditor only
exports.getMailsToCheck = function(req, res) {
    global.db.Promise.resolve().then(function() {
        // first check if current user is logged in
        var User = global.db.models.user;
        if (!req.session.user) {
            throw new global.myError.UnknownUser();
        }
        return User.findById(req.session.user.id);
    }).then(function(user) {
        // check if auditor
        if (user.privilege != 'auditor') {
            throw new global.myError.InvalidAccess();
        }
        // if so, find mails
        var Mail = global.db.models.outbox;
        return Mail.find({
            where: {
                auditorId: user.id,
                status: 'handled'
            }
        });
    }).then(function(mails){
        res.json({
            status : 1,
            msg : 'Success',
            'mails': mails
        });
    }).catch(global.myError.InvalidAccess, function(err) {
        res.json({
            status: 0,
            msg: err.message
        });
    }).catch(function(err) {
        console.log(err);
        res.json({
            status: 0,
            msg: err.message
        });
    });
};

exports.getMailsChecked = function(req, res) {
    global.db.Promise.resolve().then(function() {
        // first check if current user is logged in
        var User = global.db.models.user;
        if (!req.session.user) {
            throw new global.myError.UnknownUser();
        }
        return User.findById(req.session.user.id);
    }).then(function(user) {
        // check if auditor
        if (user.privilege != 'auditor') {
            throw new global.myError.InvalidAccess();
        }
        // if so, find mails
        var Mail = global.db.models.outbox;
        return Mail.find({
            where: {
                auditorId: user.id,
                status: ['audited', 'finished']
            }
        });
    }).then(function(mails){
        res.json({
            status : 1,
            msg : 'Success',
            'mails': mails
        });
    }).catch(global.myError.InvalidAccess, function(err) {
        res.json({
            status: 0,
            msg: err.message
        });
    }).catch(function(err) {
        console.log(err);
        res.json({
            status: 0,
            msg: err.message
        });
    });
};