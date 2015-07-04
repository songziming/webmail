/**
 * Created by ���� on 2015/6/29.
 */

module.exports = {
    database: {
        name: 'webmail',
        username: 'root',
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
            }
        }
    }
};
