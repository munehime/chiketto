const router = require("express").Router();

require("./member/index.js")(router);
require("./team/index.js")(router);

module.exports = router;
