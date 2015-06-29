/**
 * Created by Ã÷Ñô on 2015/6/29.
 */
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        priority : {
            type: DataTypes.ENUM('consumer','dispatcher','auditor','admin'),
            default : 'consumer',
            allowNull: false
        }
    }, {
        underscored: true
    });
};