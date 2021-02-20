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
      ethnicity: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM(
          "student",
          "teacher",
          "principal",
          "vicePrincipal",
          "nonTeachingStaff"
        ),
        defaultValue: "teacher",
      },

      gender: DataTypes.STRING,
      nationality: DataTypes.STRING,
      age: DataTypes.INTEGER,
      image_url: DataTypes.STRING,
      expiredAt: DataTypes.DATE,
      joinDate: DataTypes.DATE,
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
      createdAt: this.createdAt,
    };

    return userData;
  };
  return User;
};
