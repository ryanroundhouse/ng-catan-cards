var express = require('express');
var router = express.Router();
var api = require('../api/api');

router.post('/sendEmail', function(req, res, next) {
  const emailInfo = req.body;
  api.sendEmail(emailInfo);
  return res.status(200);
});

module.exports = router;
