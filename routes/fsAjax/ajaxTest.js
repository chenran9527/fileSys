var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    // res.send({title:"fileSys-Ajax-get-测试",content:{code:req.body.code, name:req.body.code}});
    res.send(JSON.stringify({title:"fileSys-Ajax-get-测试",content:{code:req.body.code, name:req.body.name}}));
    res.end();
});

router.post('/', function(req, res) {
    if (req.session.user!=null&&req.session.user.personId=="100001"){
        req.body.code;
        // res.send({title:"fileSys-Ajax-post-测试",content:{code:req.body.code, name:req.body.code}});
        res.send(JSON.stringify({title:"fileSys-Ajax-post-测试",content:{code:req.body.code, name:req.body.name}}));
        res.end();
    }
    else {
        req.body.code;
        // res.send({title:"fileSys-Ajax-post-测试",content:{code:req.body.code, name:req.body.code}});
        res.send("获取session失败");
        res.end();
    }
});

module.exports = router;
