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

const getMembers = async (req, res) => {
	try {
		const members = await db.member.find().sort({ createdAt: -1 });
		return res.status(200).json({ members });
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};

const createMember = async (req, res) => {
	try {
		new db.member(req.body).save();

		return res.status(201).json({
			message: "Create member successfully",
			redirect: "/admin/members",
		});
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};

const viewMember = async (req, res) => {
	const id = req.params.id;

	try {
		const member = await db.member.findById(id);
		return res.status(200).json({ member });
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};

const manageMember = async (req, res) => {
	const id = req.params.id;

	try {
		const member = await db.member.findById(id);

		if (req.body.newEmail && req.body.newEmail !== member.email)
			member.email = req.body.newEmail;

		if (req.body.newFullname && req.body.newFullname !== member.fullname)
			member.fullname = req.body.newFullname;

		if (req.body.newMssv && req.body.newMssv !== member.mssv)
			member.mssv = req.body.newMssv;

		if (req.body.newSchool && req.body.newSchool !== member.school)
			member.school = req.body.newSchool;

		if (
			req.body.newPhoneNumber &&
			req.body.newPhoneNumber !== member.phoneNumber
		)
			member.phoneNumber = req.body.newPhoneNumber;

		await member.save();
		return res.status(200).json({ member });
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};

const deleteMember = async (req, res) => {
	const id = req.params.id;

	try {
		await db.member.findByIdAndDelete(id);
		res.status(200).json({
			message: "Delete member successfully",
			redirect: "/admin/members",
		});
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};

module.exports = {
	getMembers,
	viewMember,
	createMember,
	manageMember,
	deleteMember,
};
