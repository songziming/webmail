/**
 * Created by ���� on 2015/6/29.
 */

module.exports = {
    database: {
        name: 'webmail',
        username: 'root',
//        password: process.env.MYSQLPASS || 'alimengmengda',
        password: '',
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
        // imap: {
        //    host: 'imap.qq.com',
        //    port: 993
        // },
        // smtp: {
        //    host: 'smtp.qq.com',
        //    port: 465
        // },
        // auth: {
        //    username: 'Ziming Ltd.',
        //    mailaddr: 's.ziming@qq.com',
        //    password: 's19z26m13'
        // }
        
        imap: {
            host: 'mail.buaa.edu.cn',
            port: 993
        },
        smtp: {
            host: 'mail.buaa.edu.cn',
            port: 465
        },
        auth: {
            username: 'Ziming Ltd.',
            mailaddr: '12211010@buaa.edu.cn',
            password: 's19z26m13'
        },
        attachmentsDir: '/tmp'  // must ensure this dir exist!
    }
};
