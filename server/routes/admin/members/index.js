const { authJWT } = require("../../../middlewares");
const { members } = require("../../../controllers/admin");

module.exports = (app) => {
	/**
	 * Display all Members
	 * @method GET
	 * @param /
	 * @requires Admin
	 */

	app.get(
		"/members",
		[authJWT.requireAuth, authJWT.isAdmin],
		members.getMembers,
	);

	/**
	 * Create an Member
	 * @method POST
	 * @param /
	 * @requires Admin
	 */

	app.post(
		"/members/create",
		[authJWT.requireAuth, authJWT.isAdmin],
		members.createMember,
	);

	/**
	 * View Member info
	 * @method GET
	 * @param id
	 * @requires Admin
	 */

	app.get(
		"/members/manage/:id",
		[authJWT.requireAuth, authJWT.isAdmin],
		members.viewMember,
	);

	/**
	 * Edit Member info
	 * @method PUT
	 * @param id
	 * @requires Admin
	 */

	app.put(
		"/members/manage/:id",
		[authJWT.requireAuth, authJWT.isAdmin],
		members.manageMember,
	);

	/**
	 * Delete a Member
	 * @method DELETE
	 * @param id
	 * @requires Admin
	 */

	app.delete(
		"/members/manage/:id",
		[authJWT.requireAuth, authJWT.isAdmin],
		members.deleteMember,
	);
};
