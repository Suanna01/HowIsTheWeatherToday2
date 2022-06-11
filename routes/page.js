// app.js에서 기본 router로 설정한 page.js
const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); // 구조분해할당으로 middlewares의 두 미들웨어를 가져옴
const { Post, Comment, User, Hashtag } = require('../models');

const router = express.Router();

// 모든 요청마다 실행
router.use((req, res, next) => {
  // res.locals.user = null;  // res.locals는 변수를 모든 템플릿 엔진에서 공통으로 사용, 즉 user는 전역 변수로 이해하면 됨(아래도 동일)
  res.locals.user = req.user; // 요청으로 온 유저를 넌적스에 연결
  res.locals.followerCount = req.user ? req.user.Followers.length : 0; // 유저가 있는 경우 팔로워 수를 저장
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : []; // 팔로워 아이디 리스트를 넣는 이유 -> 팔로워 아이디 리스트에 게시글 작성자의 아이디가 존재하지 않으면 팔로우 버튼을 보여주기 위함
  res.locals.likerIdList = req.post ? req.post.Liker.map(l => l.id) : [];
  next();
});

// http://127.0.0.1:8001/hashtag 에 get요청이 왔을 때
router.get('/hashtag', async (req, res, next) => {
  const query = req.query.hashtag; // router.get은 req.body를 쓰지 않고 req.query로 값 전달
  if (!query) { // query가 없는 경우(해시태그가 없는 경우)
    return res.redirect('/'); // 메인페이지로 돌려보냄
  }
  // query가 있는 경우(해시태그가 있는 경우)
  try {
    const hashtag = await Hashtag.findOne({
      where: { title: query }
    }); // 해당 query 값이 Hashtag 테이블에 있는지 검색  
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] }); // 있으면 해당 해시태그를 가진 모든 게시글을 가져옴
    }
    return res.render('main', {
      title: `${query}|sns`,
      twits: posts, // 조회 후 views/main.html 페이지를 렌더링하면서 전체 게시글 대신 조회된 게시글만 twits에 넣어 렌더링 함 
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// http://127.0.0.1:8001/profile 에 get요청이 왔을 때
router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", { title: "내 정보 - sns" });
});

// http://127.0.0.1:8001/join 에 get요청이 왔을 때
router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join", { title: "회원가입 - sns" });
});

// http://127.0.0.1:8001/ 에 get요청이 왔을 때
router.get('/', async (req, res, next) => {
  try {
    //게시글 조회
    const posts = await Post.findAll({// db에서 게시글을 조회

      include: [{
        model: User,
        attributes: ["id", "nick"], // id와 닉네임을 join해서 제공
      }, {
        model: User,
        attributes: ['id', 'nick'],
        as: 'Liker',
      }],
      order: [["createdAt", "DESC"]], // 게시글의 순서를 최신순으로 정렬
    });
    console.log(posts);
    //댓글 조회
    const comments = await Comment.findAll({ // db에서 게시글을 조회 
      include: {
        model: User,
        attributes: ["id", "nick"], // id와 닉네임을 join해서 제공
      },
      order: [["createdAt", "DESC"]], // 게시글의 순서를 최신순으로 정렬

    });
    res.render("main", {
      title: "sns",
      twits: posts,
      cmnts: comments// 조회 후 views/main.html 페이지를 렌더링할 때 전체 게시글을 twits 변수로 저장
    });

  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;