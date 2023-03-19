import jwt from "jsonwebtoken";

export const authenticateJWT = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (authHeader) {
		const token = authHeader.split(" ")[1];

		jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
			if (err) {
				return res.sendStatus(403).json({ error: err.message });
			}

			req.user = user;
			next();
		});
	} else {
		res.sendStatus(401);
	}
};
