var mailer = require('nodemailer');

var transporter = mailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    auth: {
        user: '398588697@qq.com',
        pass: 's19z26m13'
    }
});

var mailOptions = {
    'from': 'Song Ziming <398588697@qq.com>',
    'to': '12211010@buaa.edu.cn',
    'subject': 'Mail sent by node-mailer',
    'html': '<h1>Title Level One</h1><p>We only supply html content.</p>'
};

exports.sendMail = function() {
    transporter.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
};