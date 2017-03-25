var express = require('express');
var router = express.Router();

var user = {personId:"100001",personName:"殷道彦", address:"钱烈县"}

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.user==null){
        req.session.user = user;
    }
    req.session.user = user;
    res.render('session/session', { user: req.session.user });
});

router.post('/', function(req, res) {
    if (req.session.user==null){
        req.session.user = user;
    }
    res.send(JSON.stringify(req.session.user));
    res.end();
});

module.exports = router;
