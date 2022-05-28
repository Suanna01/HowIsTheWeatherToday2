// 카카오 로그인 전략
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy; // passport-kakao 모듈로부터 Strategy 생성자를 불러와 전략 구현

const User = require('../models/user');

module.exports = () => {
    passport.use(new KakaoStrategy({  
        clientID: process.env.KAKAO_ID, // clientID: 전략 구현을 위해 카카오에서 발급해주는 id, 노출 방지로 .env 파일에서 관리함
        callbackURL: '/auth/kakao/callback', // callbackURL: 카카오로부터 인증 결과를 받을 라우터 주소
    }, async (accessToken, refreshToken, profile, done) => { // profile은 user 정보가 들어있음
        console.log('kakao profile', profile);
        try { 
            const exUser = await User.findOne({
                where: {snsId: profile.id, provider: 'kakao'}, // snsId: 카카오 아이디와 같은 지?, provider: 카카오에서 로그인했는지?
            }); // 기존에 카카오를 통해 회원가입한 사용자가 있는지 조회
            if(exUser){ // 이미 User로 존재하는 경우(회원가입이 이미 되어있는 경우)
                done(null, exUser); // 사용자 정보와 함께 done함수 호출
            } else { // user가 존재하지 않는 경우 - 회원가입 진행
                const newUser = await User.create({ // db에 새로운 user 추가
                    email: profile._json && profile._json.kakao_account_email, // 객체가 있는지 체크해야 서버에서 오류가 나지 않기때문에 profile._json으로 확인을 먼저 해줌
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser); // 새로운 유저와 함께 done 실행
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};