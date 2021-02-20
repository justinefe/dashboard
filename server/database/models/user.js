import helpers from "../../helpers";
import { hashPassword } from "../../helpers/passwordHash";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      userName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      bio: DataTypes.STRING,
      facebook_id: DataTypes.STRING,
      twitter_id: DataTypes.STRING,
      google_id: DataTypes.STRING,
      gender: DataTypes.STRING,
      image_url: DataTypes.STRING,
      emailNotify: DataTypes.BOOLEAN,
      inAppNotify: DataTypes.BOOLEAN,
      emailVerification: DataTypes.STRING,
      activated: DataTypes.BOOLEAN,
      resetPasswordVerification: DataTypes.STRING,
      expiredAt: DataTypes.DATE,
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          user.password = await hashPassword(user.password);
        },
      },
    }
  );
  User.associate = function (models) {
    // associations can be defined here
  };
  User.prototype.userResponse = function userResponse() {
    const userData = {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      role: this.role,
      userName: this.userName,
      bio: this.bio,
      emailNotify: this.emailNotify,
      inAppNotify: this.inAppNotify,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };

    return userData;
  };
  return User;
};
