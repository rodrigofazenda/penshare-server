'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Role.hasMany(models.PadAuthorization, {foreignKey: "roleId"})
        }
    };
    Role.init({
        id: {
            primaryKey: true,
            type: DataTypes.STRING,
            allowNull: false
        },
        read: {
            type: DataTypes.BOOLEAN
        },
        write: {
            type: DataTypes.BOOLEAN
        },
        delete: {
            type: DataTypes.BOOLEAN
        }
    }, {
        sequelize,
        modelName: 'pad_role',
    });
    return Role;
};