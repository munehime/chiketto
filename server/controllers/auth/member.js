const db = require("../../models");

// Handle Errors
const handleError = (err) => {
	console.error(err.message, err.code);

	const errors = {};

	// Check Duplicate Error
	if (err.code === 11000) {
		Object.keys(err.keyPattern).map((key) => {
			errors[
				key
			] = `An member is already registered with this ${key} property`;
			return errors;
		});
	}

	// Validation Error
	if (err._message === "Member validation failed")
		Object.values(err.errors).map(({ properties }) => {
			errors[properties.path] = properties.message;
		});

	return errors;
};

module.exports.signUp = async (req, res) => {
	try {
		const member = new db.member({
			email: req.body.email,
			fullname: req.body.fullname,
			mssv: req.body.mssv,
			school: req.body.school,
			phoneNumber: req.body.phoneNumber,
		});

		await member.save();

		res.status(201).json({
			message: "Successfully signed up member",
			member_id: member._id,
			redirect: "/",
		});
	} catch (err) {
		const errors = handleError(err);
		return res.status(400).json({ errors });
	}
};
