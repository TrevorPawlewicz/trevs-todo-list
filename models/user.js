var bcrypt = require('bcrypt');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function (sequelize, DataTypes) {
	var user = sequelize.define('user', {
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
		classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject) {
					if (typeof body.email !== 'string' || typeof body.password !== 'string') {
						return reject();
					}

					user.findOne({
						where: {
							email: body.email
						}
					}).then(function(user) {
						if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
							return reject();
						}
						resolve(user);
					}, function(e) {
						reject();
					});
				});
			},
			findByToken: function(token) { // ----------------------#7----------------------------------------------
				return new Promise(function(resolve, reject) {
					try {
						var decodedJWT = jwt.verify(token, 'qwerty098');
						var bytes = cryptojs.AES.decrypt(decodedJWT.token, 'abc123!@#!');
						var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

						user.findById(tokenData.id).then(function (user) {
							if (user) {
								resolve(user);
							} else {
								reject();
							}
						}, function (e) {
							reject();
						});
					} catch (e) {
						reject();
					}
				});
			}
		},
		instanceMethods: {
			toPublicJSON: function () {
				var json = this.toJSON();
				// only return public properties:
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			},
			generateToken: function (type) {
				if (!_.isString(type)) {
					return undefined;
				}

				try {	// AES.encrypt only knows how to encrypt a STRING
					var stringData = JSON.stringify({id: this.get('id'), type: type});
					var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@#!').toString();
					var token = jwt.sign({ // json web token
						token: encryptedData
					}, 'qwerty098');

					return token;

				} catch (e) {
					console.error(e);
					return undefined;
				}
			}
		}
	});

	return user;
};
//------------------------------------------------------------------------------
// more validation examples:
// http://docs.sequelizejs.com/en/latest/docs/models-definition/
