const { team } = require("../../../controllers/auth");

module.exports = (app) => {
	/**
	 * Team Signup
	 * @method POST
	 * @param /signup
	 */

	app.post("/team/signup", team.signUp);

	/**
	 * Team Signin
	 * @method POST
	 * @param /signin
	 */

	app.post("/team/signin", team.signIn);
};
