const { authJWT } = require("../../../middlewares");
const { team } = require("../../../controllers");

module.exports = (app) => {
	app.get("/team/", authJWT.checkTeam, team.viewTeam);

	app.get("/team/submit", authJWT.checkTeam, team.submit.submitGet);

	app.post("/team/submit", authJWT.checkTeam, team.submit.submitPost);
};
