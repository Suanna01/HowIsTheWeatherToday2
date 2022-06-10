const express = require('express');
const path = require('path');
const fs = require('fs');

const { Comment, Post } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();



// POST /comment 라우터, 댓글 업로드 처리
router.post('/:postId', isLoggedIn, async (req, res, next) => {
    try { // 팔로우 할 사용자(post 작성자)를 db에서 user id로 조회 
        const postId = req.params.postId;
        const comment = await Comment.create({
            content: req.body.content,
            UserId: req.user.id,
            PostId: postId,
        });


        res.redirect('/');

    } catch (error) {
        next(error);
    }
});




// POST /post/postOneRemove 라우터, 댓글 업로드 처리
router.post('/:postId/commentOneRemove', async (req, res, next) => {
    // , isLoggedIn
    try {
        const { cmntuserid, cmntid, userid } = req.body;
        if (!cmntid) return res.json({ status: 'false' });
        if (cmntuserid == userid) {
            await Comment.destroy({
                where: {
                    id: cmntid,
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





module.exports = router;