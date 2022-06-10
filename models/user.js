// 사용자 정보를 저장하는 모델
const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model { // User 모델을 만들고 모듈로 exports함(User 모델은 Sequelize.Model을 확장한 클래스)
    static init(sequelize) { // 테이블에 대한 설정 <-> static associate: 다른 모델과의 관계
        return super.init({ // super.init의 첫 번째 인수: 테이블에 대한 컬럼 설정
            email: { // 이메일
                type: Sequelize.STRING(40),
                allowNull: true, // null 허용 설정
                unique: true,
            },
            nick: { // 닉네임
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: { // 비밀번호
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            provider: { // 로그인 방식
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local', // 기본 값 local 로그인, sns으로 로그인 한 경우는 kakao 저장 
            },
            snsId: { // snsId
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, { // super.init의 두 번째 인수: 테이블 자체에 대한 설정(테이블 옵션)
            sequelize, // static init 메서드의 매개변수와 연결되는 옵션, db.sequelize 객체를 넣어야 함 -> 추후에 models/index.js에서 연결
            timestamps: true, // true: Sequelize가 자동으로 createdAt과 updatedAt, deletedAt 컬럼을 추가
            underscored: false, // true: create_at같이(스네이크 케이스), false: createdAt같이(캐멀 케이스) 
            modelName: 'User',
            tableName: 'users',
            paranoid: false, // 컬럼을 지워도 완전히 지워지지 않고 deletedAt이라는 컬럼이 생김(지운 시각이 기록됨)
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {  // 다른 모델과의 관계 <-> static init: 테이블에 대한 설정
        db.User.hasMany(db.Post); // user과 post는 1:N관계
        // User과 User는 N:M관계 (팔로잉 기능 - 팔로워, 팔로우)
        // 같은 테이블 간 N:M은 모델 이름과 컬럼 이름을 따로 정해야 함
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.User, {
            foreignKey: 'followingId', // user1에게 생기는 following
            as: 'Followers', // 생성된 Follow라는 테이블을 이름을 바꿔서 가져옴 - user.getFollowers, user.getFollowings 같은 관계 메소드 사용 가능
            // include 시에도 as에 넣은 값을 넣으면 관계 쿼리가 작동함
            through: 'Follow', // 생성할 테이블 이름 , 유저-테이블 -유저, 특정 유저의 팔로잉/팔로워 목록이 저장됨
        });
        db.User.belongsToMany(db.User, {
            foreignKey: 'followerId', // user2에게 생기는 follower
            as: 'Followings',
            through: 'Follow',
        });
    }
}