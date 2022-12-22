const db = require("../../models");

const addMembers = async (team, members, res) => {
	try {
		const temp = [];
		await Promise.all(
			members.map(async (member) => {
				const _member = await db.member.findOne({
					$or: [{ email: member.email }, { mssv: member.mssv }],
				});

				if (!_member) throw new Error("Member not found");

				if (team.members.includes(_member._id))
					throw new Error("Member is already in team!");

				await db.member.updateOne(
					{ _id: _member._id },
					{ hasTeam: true },
				);
				temp.push(_member._id);
			}),
		);

		team = await db.team.updateOne(
			{
				_id: team._id,
			},
			{
				$push: { members: temp },
			},
		);
	} catch (err) {
		throw err;
	}
};

const removeMembers = async (team, members, res) => {
	const temp = team.members;
	try {
		await Promise.all(
			members.map(async (member) => {
				const _member = await db.member.findOne({
					$or: [{ email: member.email }, { mssv: member.mssv }],
				});

				if (!_member) throw new Error("Member not found");

				if (!team.members.includes(_member._id))
					throw new Error("Member is not in team!");

				const index = team.members.indexOf(_member._id);
				await db.member.updateOne(
					{ _id: _member._id },
					{ hasTeam: false },
				);

				temp.splice(index, 1);
			}),
		);

		team = await db.team.updateOne(
			{
				_id: team._id,
			},
			{
				members: temp,
			},
		);
	} catch (err) {
		throw err;
	}
};

const editMembers = async (members, res) => {
	members.map(async (member) => {
		const _member = await db.member.findById(member._id);

		if (!_member)
			return res.status(404).json({ message: "Member not found" });

		if (member.newEmail && member.newEmail !== _member.email)
			_member.email = member.newEmail;

		if (member.newFullname && member.newFullname !== _member.fullname)
			_member.fullname = member.newFullname;

		if (member.newMssv && member.newMssv !== _member.mssv)
			_member.mssv = member.newMssv;

		if (member.newSchool && member.newSchool !== _member.school)
			_member.school = member.newSchool;

		if (
			member.newPhoneNumber &&
			member.newPhoneNumber !== _member.phoneNumber
		)
			_member.phoneNumber = member.newPhoneNumber;

		if (member.newHasBonus && member.newHasBonus !== _member.hasBonus)
			_member.hasBonus = member.newHasBonus;

		await _member.save();
	});
};

const getTeams = async (req, res) => {
	try {
		const teams = await db.team
			.find()
			.populate("submission")
			.populate("members")
			.sort("updatedAt");
		return res.status(200).json({ teams });
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};

const createTeam = async (req, res) => {
	try {
		const team = new db.team(req.body);
		const members = [];
		if (req.body.members) {
			req.body.members.map(async (member_data, i) => {
				const member = new db.member({
					email: i === 0 ? req.body.emailLeader : member_data.email,
					fullname: member_data.fullname,
					mssv: member_data.mssv,
					school: member_data.school,
					phoneNumber: member_data.phoneNumber,
					leader: req.body.emailLeader === member_data.email,
					hasTeam: true,
				});
				members.push(member).save();
			});

			team.members = members;
		}
		await team.save();

		return res.status(201).json({
			message: "Create team successfully",
			redirect: "/admin/teams",
		});
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};

const viewTeam = async (req, res) => {
	const id = req.params.id;

	try {
		const team = await db.team
			.findById(id)
			.populate("submission")
			.populate("members");

		return res.status(200).json({
			team,
		});
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};

const manageTeam = async (req, res) => {
	const id = req.params.id;

	const team = await db.team.findById(id);

	if (!team) return res.status(404).json({ message: "Team not found" });

	try {
		if (req.body.addMembers !== undefined && req.body.addMembers.length > 0)
			await addMembers(team, req.body.addMembers);

		if (
			req.body.removeMembers !== undefined &&
			req.body.removeMembers.length > 0
		)
			await removeMembers(team, req.body.removeMembers);

		if (
			req.body.editMembers !== undefined &&
			req.body.editMembers.length > 0
		)
			await editMembers(req.body.editMembers);

		if (
			req.body.teamName !== undefined &&
			req.body.teamName !== team.teamName
		)
			team.teamName = req.body.teamName;

		if (
			req.body.emailLeader !== undefined &&
			req.body.emailLeader !== team.emailLeader
		)
			team.emailLeader = req.body.emailLeader;

		if (req.body.paid !== undefined && req.body.paid !== team.paid)
			team.paid = req.body.paid;

		if (
			req.body.joinTraining !== undefined &&
			req.body.joinTraining !== team.joinTraining
		)
			team.joinTraining = req.body.joinTraining;

		if (
			req.body.hasBonus !== undefined &&
			req.body.hasBonus !== team.hasBonus
		)
			team.hasBonus = req.body.hasBonus;

		if (
			req.body.finalScore !== undefined &&
			Number(req.body.finalScore) !== Number(team.finalScore)
		)
			team.finalScore = Number(req.body.finalScore);

		if (
			req.body.sinhVien5Tot !== undefined &&
			req.body.sinhVien5Tot !== team.sinhVien5Tot
		)
			team.sinhVien5Tot = req.body.sinhVien5Tot;

		if (req.body.password) {
			team.password = req.body.password;
		}
    
		await team.save();
		return res.status(200).json({ team });
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};

const deleteTeam = async (req, res) => {
	const id = req.params.id;

	try {
		const team = await db.team.findByIdAndDelete(id);
		if (!team) return res.status(404).json({ message: "Team not found" });

		team.members.map(async (member) => {
			try {
				const _member = await db.member.findById(member);
				_member.hasTeam = false;
				_member.save();
			} catch (err) {
				return res.status(500).json({ message: err });
			}
		});

		// await db.team.findByIdAndDelete(id);
		res.status(200).json({
			message: "Delete team successfully",
			redirect: "/admin/teams",
		});
	} catch (err) {
		return res.status(500).json({ message: err });
	}
};

module.exports = {
	getTeams,
	viewTeam,
	createTeam,
	manageTeam,
	deleteTeam,
};
