const router = require("express").Router();

require("./ranking/index.js")(router);
require("./team/index.js")(router);

module.exports = router;
