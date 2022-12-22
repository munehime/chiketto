const { authJWT } = require("../../../middlewares");
const { submissions } = require("../../../controllers/admin");

module.exports = (app) => {
	/**
	 * Display all Submissions
	 * @method GET
	 * @param /
	 * @requires Admin
	 */

	app.get(
		"/submissions",
		[authJWT.requireAuth, authJWT.isAdmin],
		submissions.getSubmissions,
	);

	/**
	 * View a Submission
	 * @method GET
	 * @param /
	 * @requires Admin
	 */

	app.get(
		"/submissions/:id",
		[authJWT.requireAuth, authJWT.isAdmin],
		submissions.viewSubmission,
	);
};
