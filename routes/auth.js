// 회원가입, 로그인, 로그아웃 라우터
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

// 회원가입 라우터, /auth/join
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body; // body-parser 덕분에 views/join.html의 form에 있는 name="email, nick, password" 들을 req.body로 가져올 수 있음
    try {
        const exUser = await User.findOne({ where: {email}});  // User db에 같은 email이 있는지 확인  
        if(exUser){ // 이미 User가 존재하면
            return res.redirect('/join?error=exist'); // 주소 뒤에 에러를 쿼리스트링으로 표시
        }
        // User이 존재하지 않으면(회원가입 가능)
        const hash = await bcrypt.hash(password, 12); // bcrypt 모듈을 이용해 비밀번호 암호화 - crypto 모듈의 pbkdf2 메서드를 이용해 암호화도 가능
                                                     // 두번째 인수(추천- 12~31): pbkdf2의 반복횟수와 유사, 숫자가 커질수록 비밀번호를 알아내기 어렵지만 암호화 시간도 오래걸림 
        await User.create({ // db에 user 생성
            email,
            nick,
            password: hash,
        });
        return res.redirect('/'); // routes/page.js의 get "/"로 이동
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// 로컬 로그인 라우터, /auth/login
router.post('/login', isNotLoggedIn, (req, res, next) =>{ // 콜백 함수 실행
    passport.authenticate('local', (authError, user, info) => { // passport.authenticate('local') 미들웨어가 로컬로그인 전략(passport/localStrategy.js) 수행
                                                                // 미들웨어인데 라우터 미들웨어 안에 들어있음 - 미들웨어에 사용자 정의 기능을 추가하고 싶은 경우
        if(authError){ // 로그인 전략(동작)이 실패한 경우 - authError 에 값이 존재
            console.error(authError);
            return next(authError); // app.js의 에러관련 함수로 이동
        }
        if(!user){  // 2번째 매개변수 값(user)이 존재하지 않는 경우 - db에 계정이 X
            return res.redirect(`/?loginError=${info.message}`);
        }
        // 2번째 매개변수 값(user)이 존재하는 경우 - passport가 req 객체에 login, logout 메서드를 추가함
        // console.log(1);

        return req.login(user, (loginError) => { // req.login은 passport.serializeUser를 호출 - req.login에 제공하는 user 객체가 serializeUser로 넘어가게 됨
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            // console.log(3);  
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙힘
});


//로그아웃 라우터, /auth/logout
router.get('/logout', isLoggedIn, (req, res) => {
    req.session.destroy(function(err){
        if(err) throw err;
        res.redirect('/');
    });
});

// 회원 탈퇴 라우터, /auth/delUser
router.post('/delUser', isLoggedIn, async (req, res, next) => {
    try {
        const userid =  req.user.id;
        if(!req.user.id)return res.json({status:'false'});
        await User.destroy({
            where:{
                id: userid,
            }
        });
        return res.redirect('/');
    }
    catch (error){
        console.error(error);
        next(error);
    }
});

// 카카오 로그인 라우터, /auth/kakao
router.get('/kakao', passport.authenticate('kakao')); // 카카오 api가 get으로 되어있어서 무조건 get으로 받아옴
                                                      // passport가 알아서 kakao 로그인 창으로 redirect 함
// 카카오 로그인 후 성공 여부 결과를 받음                                                      
router.get('/kakao/callback', passport.authenticate('kakao', { // 카카오 로그인 전략을 다시 수행함
                                                              // 로컬 로그인과 다른 점: passport.authenticate 메서드에 콜백 함수를 제공하지 않음
                                                              // 로그인 성공 시 내부적으로 req.login을 호출함 (내가 직접 호출할 필요X)
    failureRedirect: '/', // failureRedirect 속성: 콜백 함수 대신 로그인에 실패했을 때 어디로 이동할지를 적음
}), (req, res) => { // 성공 시 어디로 이동할지 적는 미들웨어
    res.redirect('/'); 
});

router.post('/modifyUser', isLoggedIn, async (req, res, next) => {
    try {
        const userid =  req.user.id;
        const { usernick }= req.body;
       
        if(!req.user.id)return res.json({status:'false'});
        await User.update({
            nick: usernick
        },
        {
            where:{
                id: userid,
            }
        });
        return res.redirect('/');
    }
    catch (error){
        console.error(error);
        next(error);
    }
});

module.exports = router;