const { getRanking } = require("../../../controllers/home/ranking");

module.exports = (app) => {
	app.get("/ranking", getRanking);
};
