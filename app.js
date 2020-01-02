const express = require('express');
const ejs = require('ejs');
const ExifImage = require('exif');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './imagestore/upload',
    filename: function(req, file, cb){
        cb(null,file.fieldname + '_' + Date.now() +
        path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file,  cb){
        checkFileType(file, cb);
      }
    }).single('myImage');
    function checkFileType(file, cb){
      const filetypes = /jpeg|jpg|png/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
     
      if(mimetype && extname){
        return cb(null,true);
      } else {
        cb('Upload file not image!');
      }
    }
    

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('./imagestore'));

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res)=> {
    upload(req, res, (err) => {
        if(err){
            res.render('index', {
                msg:err });
        } else {
            if(req.file == undefined){
                res.render('index', {
                    msg: 'No File!'
                });
            }else {
                res.render('fileupload',{
                    msg: 'Image loaded',
                    text1: req.text1,
                    text2: req.text2,
                    file: `upload/${req.file.filename}`
                });
            }
        }
    });
});

 /*
try {
    new ExifImage({ image : `upload/${req.file.filename}` }, function (error, exifData) {
        if (error)
            console.log('Error: '+error.message);
        else
            console.log(exifData); // Do something with your data!
    });
} catch (error) {
    console.log('Error: ' + error.message);
} */


app.listen(process.env.PORT || 8099);
