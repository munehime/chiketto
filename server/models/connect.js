const fs = require("fs");
const db = require(".");
const membersJson = "data_import/members.json";
const rolesJson = "data_import/roles.json";

db.mongoose
	.connect(
		`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		},
	)
	.then(() => {
		console.log("Successfully connected to MongoDB.");
		initiate();
	})
	.catch((err) => console.error(err));

async function initiate() {
	try {
		// Init roles
		let count = await db.role.collection.estimatedDocumentCount();
		if (count === 0) {
			const rolesData = fs.readFileSync(rolesJson);
			const parsedRoles = JSON.parse(rolesData);

			await db.role.insertMany(parsedRoles);
		}
		// Init admin
		const role = await db.role.findOne({
			name: "admin",
		});

		count = await db.user.collection.estimatedDocumentCount();
		if (count === 0) {
			new db.user({
				username: "admin",
				password: "admin_Webdev_Hackathon_2021@",
				role: role._id,
			}).save((err, user) => {
				if (err) return console.error(err);

				console.log(`Added ${user.username} to users collection.`);
			});
		}

		// Check mode
		if (process.env.NODE_ENV !== "development") return;

		// Init members
		const membersData = fs.readFileSync(membersJson);
		const parsedMembers = JSON.parse(membersData);

		count = await db.member.collection.estimatedDocumentCount();
		if (count === 0) db.member.insertMany(parsedMembers);

		// Init team
		count = await db.team.collection.estimatedDocumentCount();
		if (count === 0) {
			const members = await db.member.find().limit(4);
			members.map(async member => {
				await db.member.findByIdAndUpdate(member._id, {
					hasTeam: true
				})
			})
			new db.team({
				emailLeader: "mario@google.com",
				password: "1234567890",
				teamName: "Mario Franchise",
				members: members.map((member) => {member._id}),
			}).save((err, team) => {
				if (err) return console.error(err);

				console.log(`Added ${team.teamName} to teams collection.`);
			});
		}
	} catch (err) {
		console.error(err);
	}
}
