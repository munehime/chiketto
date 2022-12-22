const { member } = require("../../../controllers/auth");

module.exports = (app) => {
	/**
	 * Member Signup
	 * @method POST
	 * @param /signup
	 */

	app.post("/member/signup", member.signUp);
};
