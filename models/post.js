const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            content: {
                type: Sequelize.STRING(140),
                allowNull: false,
            },
            img: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {
        db.Post.hasMany(db.Comment);
        db.Post.belongsTo(db.User); // 1(User):N(Post) 관계, 게시글의 작성자를 알 수 있게 됨 - post.getUser, post.addUser 같은 관계 메서드가 생김
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' }); // N(Post):M(Hashtag) 관계, PostHashtag 테이블(중간 모델) 생성
        // PostHashtag에는 postId, hashtagId라는 foreignKey가 생성됨, 
        // as는 따로 지정하지 않았으므로 post.getHashtags, post.addHashtags, hashtags.getPosts 같은 기본 이름의 관계 메서드들이 생성됨
        
        db.User.belongsToMany(db.Post, {foreignKey: 'userId', as: { singular: 'Lke', plural: 'Lkes'}, through: 'Like'});
        db.Post.belongsToMany(db.User, {through: 'Like', as: 'Liker'}); 
    }
};