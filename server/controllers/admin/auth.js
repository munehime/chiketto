const jwt = require("jsonwebtoken");

const db = require("../../models");

const maxAge = 70 * 24 * 60 * 60; // 10 Days

// Handle Errors
const handleError = (err) => {
	console.error(err.message, err.code);

	const errors = {};

	// Check Incorrect Username
	if (err.message === "Incorrect username") {
		errors.username = "Username not found";
		return errors;
	}

	// Check Incorrect Password
	if (err.message === "Incorrect password") {
		errors.password = "Wrong password";
		return errors;
	}

	return errors;
};

const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

const signIn = async (req, res) => {
	try {
		const user = await db.user.login(req.body.username, req.body.password);
		const token = createToken(user._id);
		res.status(200).json({
			user: user._id,
			token,
			token_type: "Bearer",
			expires_in: maxAge,
		});
	} catch (err) {
		const errors = handleError(err);
		return res.status(400).json({ errors });
	}
};

module.exports = {
	signIn,
};
