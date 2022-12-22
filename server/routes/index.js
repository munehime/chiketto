module.exports = (app) => {
	/**
	 * /*
	 * @method *
	 */

	app.use("/", require("./home"));

	/**
	 * /auth/
	 * @method *
	 */

	app.use("/auth", require("./auth"));

	/**
	 * /admin/*
	 * @method *
	 */

	app.use("/admin", require("./admin"));
};
