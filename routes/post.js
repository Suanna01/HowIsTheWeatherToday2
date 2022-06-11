const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//const { Post, Hashtag, User } = require('../models');
const { Post, Hashtag, User, Comment } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /post/img 라우터, 이미지 하나를 업로드 받은 후 이미지의 저장 경로를 클라이언트로 응답 받음
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => { // 이미지 하나를 업로드 받음
    console.log(req.file);
    res.json({ url: `/img/${req.file.filename}` }); // 이미지의 저장 경로를 클라이언트로 응답
    // static 미들웨어가 /img 경로의 정적 파일을 제공하므로 클라이언트에서 업로드한 이미지에 접근 가능
});

const upload2 = multer();

// POST /post 라우터, 게시글 업로드 처리
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {// upload2.none(): 데이터 형식이 multipart지만 이미지 데이터가 들어있지 않으므로 none 메서드 사용(이미지 주소가 온 것이고 데이터는 이미 POST /post/img 라우터에 저장됨)
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url, // req.body.url: 이미지 주소가 저장되어있는 곳
            UserId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]+/g); // /#[%\s#]: 해시태그 정규표현식

        if (hashtags) { // 위의 식으로 추출된 해시태그가 존재하면
            const result = await Promise.all(  // 아래에서 map으로 여러 개의 해시태그가 나오기 때문에 Promise.all 사용
                hashtags.map((tag, idx) => {
                    return Hashtag.findOrCreate({ // sequelize 메소드(데이터베이스에 해시태그가 존재하면 가져오고, 존재하지 않으면 생성 후 가져옴), Hashtag 생성 
                        // 결과값으로 [모델, 생성 여부] 반환
                        where: { title: tag.slice(1).toLowerCase() }, // 해시태그에서 #을 떼고 소문자로 바꿈 
                    })
                }),
            );
            console.log(result);
            await post.addHashtags(result.map(r => r[0])); // result.map(r => r[0]): 모델만 추출함, post.addHashtags(): 해시태그 모델들을 게시글과 연결
        }
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST /post/postOneRemove 라우터, 게시글 업로드 처리
router.post('/postOneRemove', async (req, res, next) => {
    // , isLoggedIn
    try {
        const { twituserid, twitid, userid } = req.body;
        if (!twitid) return res.json({ status: 'false' });
        if (twituserid == userid) {
            await Post.destroy({
                where: {
                    id: twitid,
                }
            });
            return res.json({ status: 'true' });
        }
        else {
            return res.json({ status: 'not equal user' });
        }
    } catch (err) {
        console.error(err);
    }

});

router.post('/like', async(req, res, next) => {
    try {
        const post = await Post.findOne({where: {id: req.params.id}});
        await post.addLikers(req.user.id);
        //const like = twit && twit.Liker.map(l => l.id).includes(user.id);
        res.send('OK');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/like', async (req, res, next) => {
    try {
        const post = await Post.findOne({where: {id: req.params.id}});
        await post.Likers(req.user.id);
        //const like = twit && twit.Liker.map(l => l.id).includes(user.id);
        res.send('OK');
    } catch (error) {
        console.error(error);
        next(error);
    }
});



module.exports = router;