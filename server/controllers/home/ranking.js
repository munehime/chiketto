const db = require("../../models");

module.exports.getRanking = async (req, res) => {
	try {
		const teams = await db.team.find().sort({ finalScore: -1 });

		return res.status(200).json({ teams });
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};
