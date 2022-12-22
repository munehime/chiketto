const { auth } = require("../../../controllers/admin");

module.exports = (app) => {
	/**
	 * Admin Sign In
	 * @method POST
	 * @param /
	 * @requires Admin
	 */

	app.post("/auth/signin", auth.signIn);
};
