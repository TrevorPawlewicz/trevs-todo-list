var bcrypt = require('bcrypt');
var _ = require('underscore');

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
		salt: { // puts random characters onto plain texted BEFORE its hashed
			type: DataTypes.STRING
		},
		password_hash: { //
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL, // = will not be stored in database
			allowNull: false,
			validate: {
				// [min, max]
				len: [6, 100]
			},
			set: function (value) {  // function known to Sequelize
				var salt = bcrypt.genSaltSync(10);
				//       // function that takes our pass and salt
				var hashedPassword = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value); // VIRTUAL
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword);
			}
		}
	}, {
		hooks: {
			// runs before validatetion
			beforeValidate: function (user, options) {
				// user.email
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		},
		instanceMethods: {
			toPublicJSON: function () {
				var json = this.toJSON();
				// only return public properties:
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			}
		}
	});
};
//------------------------------------------------------------------------------
// more validation examples:
// http://docs.sequelizejs.com/en/latest/docs/models-definition/
