const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env]; // config/config.json에서 필요한 데이터베이스 설정을 불러옴(배열 값을 불러왔는데, 지금은 개발용 - development)
const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
); // new Sequelize를 통해 MySQL 연결 객체 생성

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;

// 각 객체 실행
User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);

// 관계 연결
User.associate(db);
Post.associate(db);
Hashtag.associate(db);

module.exports = db;