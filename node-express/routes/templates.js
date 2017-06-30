var express = require("express");

router = express.Route();
/* GET home page. */
router.get('/templates', function (req, res, next) {
    res.writeHead(403, {"Content-type": "text/html"});
    res.send("No access to directory");
});

module.exports = router;