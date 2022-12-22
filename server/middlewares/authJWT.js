const jwt = require("jsonwebtoken");
const db = require("../models/");

const requireAuth = (req, res, next) => {
	const bearerHeader = req.headers.authorization;
	if (!bearerHeader) {
		return res.status(401).redirect("/");
	}

	const bearerToken = bearerHeader.split(" ")[1];
	jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decodedToken) => {
		if (err) {
			console.error(err.message);
			return res.status(401).redirect("/");
		}
	});

	return next();
};

const checkUser = (req, res, next) => {
	const bearerHeader = req.headers.authorization;
	if (!bearerHeader) {
		req.user = null;
		return next();
	}

	const bearerToken = bearerHeader.split(" ")[1];
	jwt.verify(
		bearerToken,
		process.env.JWT_SECRET,
		async (err, decodedToken) => {
			if (err) {
				console.error(err.message);
				return (res.locals.user = null);
			}

			const user = await db.user.findById(decodedToken.id);
			res.user = user;
		},
	);

	return next();
};

const checkTeam = (req, res, next) => {
	const bearerHeader = req.headers.authorization;
	if (!bearerHeader) {
		req.team = null;
		return next();
	}

	const bearerToken = bearerHeader.split(" ")[1];
	jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decodedToken) => {
		if (err) {
			console.error(err.message);
			return (req.team = null);
		}

		req.team = decodedToken.id;
	});

	return next();
};

const isCTV = (req, res, next) => {
	const bearerHeader = req.headers.authorization;
	if (!bearerHeader) {
		return next();
	}

	const bearerToken = bearerHeader.split(" ")[1];
	jwt.verify(
		bearerToken,
		process.env.JWT_SECRET,
		async (err, decodedToken) => {
			if (err) {
				console.error(err.message);
				return res.redirect("/auth/signin");
			}

			const user = await db.user.findById(decodedToken.id);
			if (!user)
				return res.status(404).json({ message: "User not found" });
			const role = await db.role.findById(user.role);
			if (!role)
				return res.status(404).json({ message: "Role not found" });

			if (role.name !== "ctv" && role.name !== "admin")
				return res.redirect("/admin/teams");
		},
	);

	return next();
};

const isAdmin = (req, res, next) => {
	const bearerHeader = req.headers.authorization;
	if (!bearerHeader) {
		return next();
	}

	const bearerToken = bearerHeader.split(" ")[1];
	jwt.verify(
		bearerToken,
		process.env.JWT_SECRET,
		async (err, decodedToken) => {
			if (err) {
				console.error(err.message);
				return res.redirect("/auth/signin");
			}

			const user = await db.user.findById(decodedToken.id);
			if (!user)
				return res.status(404).json({ message: "User not found" });
			const role = await db.role.findById(user.role);
			if (!role)
				return res.status(404).json({ message: "Role not found" });

			if (role.name !== "admin") return res.redirect("/admin/teams");
		},
	);

	return next();
};

module.exports = { requireAuth, checkUser, checkTeam, isCTV, isAdmin };
