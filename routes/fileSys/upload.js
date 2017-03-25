var express = require('express');
var fs = require('fs');
var path = require("path");
var multiparty = require('multiparty');
var http = require('http');
var util = require('util');
var router = express.Router();

//上传文件目录
var uploadPath = "d:/fileSys";

var fileProperty = [{name: "test",path: "/perpic/test_pic"},
    {name: "info",path: "/perpic/info_pic"},
    {name: "product",path: "/perpic/product_pic"},
    {name: "attendance",path: "/perpic/sign_pic"},
    {name: "operationLog",path: "/perpic/operation_log"},
    {name: "mission",path: "/perpic/mission_pic"},
    {name: "customer_work_order",path: "/perpic/customer_work_order_pic"},
    {name: "shop_task",path: "/perpic/shop_task"},
    {name: "role",path: "/perpic/role"}
];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('fileSys/upload', { title: 'fileUpload...' });
});

router.post('/', function(req, res) {
    /**传入文件前台标示*/
    // var id = req.getParameter("id");
    var id = req.query.id;
    /**imei号*/
    var imei = req.query.imei;

    /**文件类型
     * 1：信息采集，
     * 2：产品目录，
     * 3：考勤签到/退，
     * 4：客户端日志，
     * 5：临时拜访和任务，
     * 6：任务主动反馈，
     * 7：客户服务，
     * 8：巡店宝，
     * 9：岗位图标
     **/
    var fileType = req.query.fileType;

    /**回调地址*/
    var callBackUrl=req.query.callBackUrl;

    /**回调函数名称*/
    var callBackMethod = req.query.callBackMethod;
    /**0:客户端上传，1：平台上传*/
    var uploadType = req.query.uploadType;

    var msg = "";
    if(parseInt(fileType,10) > fileProperty.length-1||parseInt(fileType,10)<1){
        msg = uploadFile.getReturnInfo(false,"上传文件失败：文件类型错误。");
        res.contentType('json');//返回的数据类型
        res.send(msg);
        res.end();
        return;
    }
    /**文件相对路径*/
    var fileRelativelyPath = fileProperty[parseInt(fileType,10)].path;
    /**文件绝对路径*/
    var fileAbsolutelyPath = uploadPath+fileRelativelyPath;
    if(!uploadFile.mkdirsSync(fileAbsolutelyPath,'0777')){
        msg = uploadFile.getReturnInfo(false,"创建文件夹失败。");
        res.contentType('json');//返回的数据类型
        res.send(msg);
        res.end();
        return ;
    }

    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: fileAbsolutelyPath});
    //上传完成后处理
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);

        if(err){
            console.log('parse error: ' + err);
        } else {
            console.log('parse files: ' + filesTmp);
            var inputFile = files.file0[0];
            var uploadedPath = inputFile.path;
            var suffix = inputFile.originalFilename.substr(inputFile.originalFilename.indexOf(".")+1,3);//后缀名
            var fileObj = {};
            var dstPath =  uploadFile.getFileInfo(fileAbsolutelyPath);
            fileObj.id = id;
            fileObj.fileSystemPath = dstPath;
            fileObj.fileName = inputFile.originalFilename;
            fileObj.aliasFileName = id+"_"+(new Date()).getTime()+"_"+ (Math.floor(Math.random () * 900) + 100)+"."+suffix;
            fileObj.fileSize = inputFile.size;
            if(!uploadFile.mkdirsSync(dstPath,'0777')){
                msg = uploadFile.getReturnInfo(false,"创建文件夹失败。");
                res.contentType('json');//返回的数据类型
                res.send(msg);
                res.end();
                return ;
            }
            dstPath =  dstPath +"/"+ fileObj.aliasFileName;

            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function(err) {
                if (err){
                    msg = uploadFile.getReturnInfo(false,"上传文件失败");
                }
                else {
                    msg = uploadFile.getReturnInfo(true,null,fileObj);
                }
                // res.writeHead(200, {'content-type': 'application/json;charset=utf-8'});
                // res.write("");
                res.contentType('json');//返回的数据类型
                res.send(msg);
                res.end();
            });
        }

    });

});

var uploadFile = {
    getFileInfo : function (filePath){
        var currentDate = new Date();
        var year = currentDate.getFullYear();
        var month = currentDate.getMonth()+1;
        var day = currentDate.getDate();
        var time = currentDate.getTime();
        return filePath + "/" + year + "/" + month + "/" + day;
    },
    getReturnInfo : function (flag, msg, fileObj){
        var info ;
        if(flag){
            info = "{ \n"
                +" \"response\":  \n"
                +" { \n"
                +"   \"code\": \"1\", \n"
                +"   \"fileInfo\": \"["
                +"      "+  JSON.stringify(fileObj)
                +"      ]\" \n"
                +" } \n"
                +"} \n";
        }
        else {
            info = "{ \n"
                +" \"response\":  \n"
                +" { \n"
                +"   \"code\": \"2\", \n"
                +"   \"msg\": \""+msg+"\" \n"
                +" } \n"
                +"} \n";
        }
        return info;
    },
    mkdirsSync : function(dirpath, mode) {
        if (!fs.existsSync(dirpath)) {
            var pathtmp;
            var pathArr = dirpath.split("/");
            for(var i = 0; i < pathArr.length; i++) {
                var dirname = pathArr[i];
                if (pathtmp) {
                    pathtmp = path.join(pathtmp+"/", dirname);
                }
                else {
                    pathtmp = dirname;
                }
                if (!fs.existsSync(pathtmp)) {
                    fs.mkdirSync(pathtmp, mode)
                }
            }
        }
        return true;
    }
};


module.exports = router;
