const { Schema, model } = require("mongoose");
const { isAlphanumeric } = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: [true, "Please enter an username"],
			lowercase: true,
			unique: true,
			validate: [isAlphanumeric, "Please enter a valid username"],
		},
		password: {
			type: String,
			required: [true, "Please enter a password"],
			minlength: [8, "Minimum password length is 8 characters"],
		},
		fullname: {
			type: String,
		},
		email: {
			type: String,
			unique: true,
		},
		phoneNumber: {
			type: String,
		},
		avatarUrl: {
			type: String,
		},
		roles: {
			type: [String],
		},
		tickets: {
			type: [Schema.Types.ObjectId],
			ref: "Role",
		},
	},
);

// Crypt password before saving
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	const salt = await bcrypt.genSalt(15);
	this.password = bcrypt.hashSync(this.password, salt);
	next();
});

// Login
userSchema.statics.login = async function (username, password) {
	const user = await this.findOne({ username });
	if (!user) throw Error("Incorrect username");

	const auth = bcrypt.compareSync(password, user.password);
	if (!auth) throw Error("Incorrect password");

	return user;
};

module.exports = User = model("User", userSchema);
