const { authJWT } = require("../../../middlewares");
const { teams } = require("../../../controllers/admin");

module.exports = (app) => {
	/**
	 * Display all  Team
	 * @method GET
	 * @param /
	 * @requires CTV
	 */

	app.get("/teams", [authJWT.requireAuth, authJWT.isCTV], teams.getTeams);

	/**
	 * Create a Team
	 * @method POST
	 * @param /
	 * @requires Admin
	 */

	app.post(
		"/teams/create",
		[authJWT.requireAuth, authJWT.isAdmin],
		teams.createTeam,
	);

	/**
	 * Display specific Team
	 * @method GET
	 * @param id
	 * @requires CTV
	 */

	app.get(
		"/teams/manage/:id",
		[authJWT.requireAuth, authJWT.isCTV],
		teams.viewTeam,
	);

	/**
	 * Manage Team info
	 * @method PUT
	 * @param id
	 * @requires CTV
	 */

	app.put(
		"/teams/manage/:id/",
		[authJWT.requireAuth, authJWT.isCTV],
		teams.manageTeam,
	);

	/**
	 * Delete a Team
	 * @method DELETE
	 * @param id
	 * @requires Admin
	 */

	app.delete(
		"/teams/manage/:id",
		[authJWT.requireAuth, authJWT.isAdmin],
		teams.deleteTeam,
	);
};
