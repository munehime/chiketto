const router = require("express").Router();

require("./auth/index.js")(router);
require("./members/index.js")(router);
require("./teams/index.js")(router);
require("./submissions/index.js")(router);

module.exports = router;
