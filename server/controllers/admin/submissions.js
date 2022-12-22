const db = require("../../models");

const getSubmissions = async (req, res) => {
	try {
		const submissions = await db.submission.find().sort({ updatedAt: -1 });
		return res.status(200).json({ submissions });
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};

const viewSubmission = async (req, res) => {
	const id = req.params.id;

	try {
		const submission = await db.submission.findById(id);
		return res.status(200).json({ submission });
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};

module.exports = {
	getSubmissions,
	viewSubmission,
};
