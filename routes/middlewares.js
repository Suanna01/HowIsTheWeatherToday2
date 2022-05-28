// 로그인 확인 관련 미들웨어 생성

// 로그인이 된 상태를 확인하는 미들웨어
exports.isLoggedIn = (req, res, next) => {
    // 로그인이면 허용
    if(req.isAuthenticated()){ // req.isAuthenticated(): 로그인 중이면 true, 아니면 false
        next(); // 다음 미들웨어로 넘겨줌
    } else { // 로그인이 아니면 비허용
        res.status(403).send('로그인 필요');
    }
};

// 로그인이 되지 않은 상태를 확인하는 미들웨어
exports.isNotLoggedIn = (req, res, next) => {
    // 로그인이 아니면 허용
    if(!req.isAuthenticated()){
        next(); // 다음 미들웨어로 넘겨줌
    } else{ // 로그인이면 허용
        const message = encodeURIComponent('로그인한 컴포넌트입니다.');
        res.redirect(`/?error=${message}`); // 에러 페이지로 바로 이동시킴
    }
};