var ueditor = require('ueditor');
var path = require('path');
var uefiles = require('./config').ueditor || '/uefiles';

module.exports = ueditor(path.join(__dirname, 'static'), function(req, res, next) {
    console.log(req.query.action);
    console.log(req.ueditor);
    switch (req.query.action) {
    case 'uploadimage':
        var img = req.ueditor;
        console.log(img.filename);
        console.log(img.encoding);
        console.log(img.mimetype);
        res.ue_up(uefiles);
        break;
    // case 'uploadfile':
    //     var f = req.ueditor;
    //     console.log(f.filename);
    //     console.log(f.encoding);
    //     console.log(f.mimetype);
    //     res.ue_up(uefiles+'/files');
    //     break;
    case 'listimage':
        res.ue_list(uefiles);
        break;
    // case 'listfile':
    //     res.ue_list(uefiles+'/files');
    //     break;
    default:
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/config.json');
        break;
    }
});
