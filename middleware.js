// exports made as a function so other files can pass in configuraton data: i.e. db
// Middleware is run before the regular route handler
// making todo routes PRIVATE:

module.exports = function (db) {

	return {
		// our own method called before the route
		requireAuthentication: function (req, res, next) {
			var token = req.get('Auth'); // get header in POST /users/login token

			db.user.findByToken(token).then(function (user) {
				req.user = user;
				next(); // continue to call the private code
			}, function () {
				res.status(401).send();
			});
		}
	};

};
