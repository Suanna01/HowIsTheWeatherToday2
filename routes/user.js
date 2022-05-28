const express = require('express');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');
const db = require('../models/index');
const router = express.Router();

// POST /user/:id/follow 라우터
router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await  User.findOne({ where: { id: req.user.id }}); // 팔로우 할 사용자(post 작성자)를 db에서 user id로 조회 

        if(user) {
            await user.addFollowing(parseInt(req.params.id, 10)); // :id 부분: req.params.id임( : = params, id = id), sequelize에서 추가한 addFollowing 메서드로 현재 로그인한 사용자와의 관계 지정, 10: 10진수
                                                                  // 팔로잉 관계가 생겼으므로 req.user에도 팔로워와 팔로잉 목록을 저장 -> 앞으로 사용자 정보를 불러올 때 팔로워, 팔로잉 목록 같이 불러옴 
                                                                  // req.user를 바꾸려면 passport/index.js의 deserializeUser를 바꿔야 함
            res.send('success');
        } else {
            res.status(404).send('no user');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/unfollow', isLoggedIn, async (req, res, next) => {
    const { followingId } = req.body;
    const Follow = db.sequelize.models.Follow;
    try {
        if(!followingId)return res.json({status:'false'});
        await Follow.destroy({
            where:{
                followingId: followingId,
                followerId: req.user.id,
            }
        });
        return res.json({status:'true'});
    }
    catch (error){
        console.error(error);
        next(error);
    }
});

module.exports = router;