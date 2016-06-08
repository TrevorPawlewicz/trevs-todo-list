module.exports = function (sequelize, DataTypes) {
	return sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				// [min, max]
				len: [6, 100]
			}
		}
	});
};
//------------------------------------------------------------------------------
// more validation examples:
// http://docs.sequelizejs.com/en/latest/docs/models-definition/
