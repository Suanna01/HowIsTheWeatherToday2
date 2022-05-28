// 로그인 전략
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // passport-local 모듈의 전략 생성자를 가져옴
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
    passport.use(new LocalStrategy({ // LocalStrategy 생성자의 첫 번째 인수(객체): 전략에 관한 설정
        usernameField: 'email', // body-parser에 의해 req.body 내의 속성명(req.body.email)
        passwordField: 'password',
    }, async (email, password, done) => { // LocalStrategy 생성자의 두 번째 인수(함수): 실제 전략 수행
                                         // 첫 번째 인수에서 넣어주었던 email, password가 여기의 매개변수가 됨
                                        // done은 routes/auth.js의 passport.authenticate의 콜백 함수
        try {
            const exUser = await User.findOne({ where: { email }}); // db에 일치하는 Email이 있는지 확인
            if(exUser){ // db에 일치하는 User가 있는 경우
                const result = await bcrypt.compare(password, exUser.password); // bcrypt: 암호화 모듈, password: req(입력)의 매개변수, exUser.password: db에 저장되어 있는 password 
                if(result){ // 비밀번호까지 일치하는 경우
                    done(null, exUser); // routes/auth.js의 passport.authenticate('local', ~~) 에서 ~~부분에 들어가는 값이 done으로 반환됨
                } else { // 비밀번호 불일치
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.'});
                }
            } else{ // 
                done(null, false, { message: '가입되지 않은 회원입니다.'});
            }
        } catch(error){
            console.error(error);
            done(error);
        }
    }));
};