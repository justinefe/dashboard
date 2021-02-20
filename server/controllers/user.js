import crypto from "crypto";
import faker from "faker";
import moment from "moment";
import Sequelize from "sequelize";
import models from "../database/models";
import helpers from "../helpers";
import { createToken } from "../helpers/inviteToken";
// import sendEmail from '../services/email';
import { emailSender } from "../services/email";
import { resetPasswordMessage, activationMessage } from "../services";
import dbRepository from "../helpers/dbRepository";

const userRepository = new dbRepository(models.User);

const { successStat, errorStat, comparePassword } = helpers;

const { Op } = Sequelize;

const groupBy = (objectArray, property) =>
  objectArray.reduce((acc, obj) => {
    let key = obj[property];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {});
const groupValue = (arr, groupName) =>
  arr.reduce((accumulator, item) => {
    if (item.role === groupName) {
      accumulator = item.count;
    }
    return accumulator;
  }, 0);

/**
 * / @static
 * @description Allows a user to sign in
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */
export const login = async (req, res) => {
  const { email, password } = req.body.user;
  const user = await models.User.findOne({ where: { email } });

  if (!user) return errorStat(res, 401, "Incorrect Login information");

  const matchPasswords = comparePassword(password, user.password);

  if (!matchPasswords) {
    return errorStat(res, 401, "Incorrect Login information");
  }
  const token = createToken({
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    email: user.email,
    role: user.role,
  });
  // await req.session.login(user.role, { user: user.dataValues }, res);
  const message = "Login successful";

  return successStat(res, 200, "user", {
    ...user.userResponse(),
    ...token,
    message,
  });
};

/**
 * / @static
 * @description Allows a user to sign up
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */
export const signup = async (req, res) => {
  const { role, totalUser } = req.body;
  const months = [];

  for (let i = 0; i <= 17 * 12 - 1; i++) {
    const tempdate = moment("2003-01-01")
      .clone()
      .add(i, "months")
      .format("YYYY-MM-D");

    months.push(tempdate);
  }

  const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  };
  const genders = [
    "Male",
    "Female",
    "Transgender",
    "gender neutral",
    "non-binary",
    "agender",
    "pangender",
    "genderqueer",
    "two-spirit",
    "third gender",
  ];

  const ethnicity = [
    "Urhobo",
    "Yoruba",
    "Hausa",
    "Igbo",
    "Efik",
    "Eshan",
    "Idoma",
    "Ijaw",
  ];
  const nationality = [
    "Liberia",
    "Ghana",
    "Nigeria",
    "Mali",
    "United Kingdom",
    "Brazil",
    "Malawi",
    "Togo",
    "Congo",
    "Burkinafaso",
    "Ecuador",
    "Mexico",
    "United State",
    "Canada",
    "Spain",
  ];
  const users = await models.User.bulkCreate(
    Array(Number(totalUser))
      .fill()
      .map((_, i) => ({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: "Password@123",
        role,
        userName: faker.name.findName(),
        ethnicity: ethnicity[Math.ceil(Math.random() * ethnicity.length - 1)],
        age:
          role === "principal"
            ? getRandomIntInclusive(40, 65)
            : role === "teacher"
            ? getRandomIntInclusive(22, 55)
            : getRandomIntInclusive(6, 30),
        gender: genders[Math.ceil(Math.random() * genders.length - 1)],
        joinDate: months[Math.ceil(Math.random() * months.length - 1)],
        image_url: faker.image.imageUrl(),
        nationality:
          nationality[Math.ceil(Math.random() * nationality.length - 1)],
      }))
  );

  const message = "Registration is successful";
  return successStat(res, 201, "user", {
    users,
    message,
  });
};

/**
 * / @static
 * @description Allows a user to sign up
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */
export const users = async (req, res) => {
  const users = await models.User.findAll();
  const message = "Registration is successful";
  return successStat(res, 201, "user", {
    users,
    message,
  });
};
/**
 * / @static
 * @description Allows a user to sign up
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */
export const usercount = async (req, res) => {
  const users = await models.sequelize.query(`
  select count(role), role from "Users" group by role order by role`);

  const message = "Registration is successful";
  const userCC = {
    principal: groupValue(users[0], "principal"),
    teacher: groupValue(users[0], "teacher"),
    student: groupValue(users[0], "student"),
  };
  return successStat(res, 201, "user", {
    User: userCC,
    message,
  });
};
/**
 * / @static
 * @description Allows a user to sign up
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */
export const gender = async (req, res) => {
  const users = await models.sequelize.query(
    `select count(gender), gender from "Users" group by gender`
  );
  const message = "Registration is successful";
  return successStat(res, 201, "user", {
    User: users[0],
    message,
  });
};

/**
 * / @static
 * @description Allows a user to sign up
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */
export const joindate = async (req, res) => {
  const users = await models.sequelize.query(
    `select distinct date_trunc('year', "joinDate") as year, count(role),
     role from "Users" group by year, role order by year`
  );
  const yearDistribution = Object.values(groupBy(users[0], "year")).map(
    (year) => ({
      year: moment(year[0].year).format("YYYY"),
      principal: groupValue(year, "principal"),
      teacher: groupValue(year, "teacher"),
      student: groupValue(year, "student"),
    })
  );

  const message = "Registration is successful";
  return successStat(res, 201, "user", {
    User: yearDistribution,
    message,
  });
};

/**
 * / @static
 * @description Allows a user to sign up
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */
export const agedistribution = async (req, res) => {
  const users = await models.sequelize.query(
    `select count(age), age, role from "Users" group by age, role order by age `
  );
  const ageDistribution = Object.values(groupBy(users[0], "age")).map(
    (age) => ({
      age: age[0].age,
      principal: groupValue(age, "principal"),
      teacher: groupValue(age, "teacher"),
      student: groupValue(age, "student"),
    })
  );

  const message = "Registration is successful";
  return successStat(res, 201, "user", {
    User: ageDistribution,
    message,
  });
};

/**
 * / @static
 * @description Allows a user to sign up
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */
export const ethnicity = async (req, res) => {
  const users = await models.sequelize.query(
    `select count(ethnicity), ethnicity from "Users" group by ethnicity`
  );
  const message = "Registration is successful";
  return successStat(res, 201, "user", {
    User: users[0],
    message,
  });
};

/**
 * / @static
 * @description Allows a user to sign up
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */
export const nationality = async (req, res) => {

  const users = await models.sequelize.query(
    `select count(nationality), nationality from "Users" group by nationality`
  );
  const message = "Registration is successful";
  return successStat(res, 201, "user", {
    User: users[0],
    message,
  });
};

/**
 * / @static
 * @description Allows a user to sign up
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */
export const year = async (req, res) => {
  const years = await models.sequelize.query(`
    select distinct date_trunc('year', "joinDate") as year from "Users" order by year
`);

  const message = "Registration is successful";
  return successStat(res, 201, "user", {
    year: years[0],
    message,
  });
};

/**
 * / @static
 * @description Allows a user to sign up
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */
export const month = async (req, res) => {
  const { year } = req.query;
  const months = await models.sequelize.query(`
  SELECT count(date_trunc('month', "joinDate")),date_trunc('month', "joinDate") as month, role from "Users" where EXTRACT(year from "joinDate") = ${year} group by date_trunc('month', "joinDate"), role order by month
`);

  const monthArray = Object.values(groupBy(months[0], "month")).map(
    (month) => ({
      month: month[0].month,
      principal: groupValue(month, "principal"),
      teacher: groupValue(month, "teacher"),
      student: groupValue(month, "student"),
    })
  );
  const message = "Registration is successful";
  return successStat(res, 201, "user", {
    month: monthArray,
    message,
  });
};

/**
 * / @static
 * @description Allows a user to sign up
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */
export const week = async (req, res) => {
  const { year } = req.query;
  const weeks = await models.sequelize.query(`
  SELECT count(date_trunc('week', "joinDate")),date_trunc('week', "joinDate") as week, role from "Users" where EXTRACT(year from "joinDate") = ${year} group by date_trunc('week', "joinDate"), role order by week
`);
  const weekArray = Object.values(groupBy(weeks[0], "week")).map((week) => ({
    week: week[0].week,
    principal: groupValue(week, "principal"),
    teacher: groupValue(week, "teacher"),
    student: groupValue(week, "student"),
  }));
  const message = "Registration is successful";
  return successStat(res, 201, "user", {
    week: weekArray,
    message,
  });
};

/**
 * / @static
 * @description Allows a user to sign up
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} object containing user data and access Token
 * @memberof UserController
 */
export const day = async (req, res) => {
  const { year, month } = req.query;
  const days = await models.sequelize.query(`
  SELECT count(date_trunc('day', "joinDate")),date_trunc('day', "joinDate") as day, role from "Users" where EXTRACT(year from "joinDate") = ${year} and EXTRACT(month from "joinDate") = ${month} group by date_trunc('day', "joinDate"), role order by day
`);

  const daysArray = Object.values(groupBy(days[0], "day")).map((day) => ({
    day: day[0].day,
    principal: groupValue(day, "principal"),
    teacher: groupValue(day, "teacher"),
    student: groupValue(day, "student"),
  }));
  const message = "Registration is successful";
  return successStat(res, 201, "user", {
    day: daysArray,
    message,
  });
};
