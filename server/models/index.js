const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

module.exports = db = {
	mongoose,
	user: require("./schema/users.js"),
	role: require("./schema/roles.js"),
	team: require("./schema/teams.js"),
	member: require("./schema/members.js"),
	submission: require("./schema/submissions.js"),
};
