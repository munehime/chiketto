const jwt = require("jsonwebtoken");

const db = require("../../models");

const maxAge = 10 * 24 * 60 * 60; // 10 Days

// Handle Errors
const handleError = (err) => {
	console.error(err.message, err.code);

	const errors = {};

	// Check Incorrect Email
	if (err.message === "Incorrect email") {
		errors.email = "Email not found";
		return errors;
	}

	// Check Incorrect Password
	if (err.message === "Incorrect password") {
		errors.password = "Wrong password";
		return errors;
	}

	// Check Duplicate Error
	if (err.code === 11000) {
		Object.keys(err.keyPattern).map((key) => {
			errors[
				key
			] = `An team is already registered with this ${key} property`;
			return errors;
		});
	}

	// Validation Error
	if (err._message === "Team validation failed")
		Object.values(err.errors).map(({ properties }) => {
			errors[properties.path] = properties.message;
		});

	return errors;
};

const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

const signUp = async (req, res) => {
	try {
		const team = new db.team(req.body);

		const members = [];
		if (req.body.members) {
			await Promise.all(
				req.body.members.map(async (member_data, i) => {
					const member = new db.member({
						email:
							i === 0 ? req.body.emailLeader : member_data.email,
						fullname: member_data.fullname,
						mssv: member_data.mssv,
						school: member_data.school,
						phoneNumber: member_data.phoneNumber,
						leader: req.body.emailLeader === member_data.email,
					}).save();
					members.push(member);
				}),
			);

			team.members = members;
		}

		await team.save();

		const token = createToken(team._id);
		res.status(201).json({
			message: "Team was created successfully",
			team: team._id,
			token,
			token_type: "Bearer",
			expires_in: maxAge,
		});
	} catch (err) {
		const errors = handleError(err);
		return res.status(400).json({ errors });
	}
};

const signIn = async (req, res) => {
	try {
		const team = await db.team.login(
			req.body.emailLeader,
			req.body.password,
		);
		const token = createToken(team._id);
		res.status(200).json({
			team: team._id,
			teamName: team.teamName,
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
	signUp,
	signIn,
};
