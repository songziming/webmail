/**
 * Created by ���� on 2015/6/29.
 */
var path = require('path');
module.exports = {
    database: {
        name: 'webmail',
        username: 'root',
        password: process.env.MYSQLPASS || '',
        config: {
            host: 'localhost',
            dialect: 'mysql',
            port: 3306,
            timezone: '+08:00',
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
            logging : null
        }
    },
    mail: {
        'qq': {
            imap: {
               host: 'imap.qq.com',
               port: 993
            },
            smtp: {
               host: 'smtp.qq.com',
               port: 465
            }
        },
        'buaa': {
            imap: {
                host: 'mail.buaa.edu.cn',
                port: 993
            },
            smtp: {
                host: 'mail.buaa.edu.cn',
                port: 465
            }
        },
        '163': {
            imap: {
                host: 'imap.163.com',
                port: 993
            },
            smtp: {
                host: 'smtp.163.com',
                port: 465
            }
        },
        auth: {
            username: 'Ziming Ltd.',
            mailaddr: '12211010@buaa.edu.cn',
            password: '?????????'
        },
        service: 'buaa',    // 'service' field indicates witch mail server we use
        attachmentsDir: path.join(__dirname,'static/attachments')  // must ensure this dir exist!
    },
    ueditor: '/uefiles'     // we have to prepend this with a slash!
};
