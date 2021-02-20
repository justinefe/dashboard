import express from "express";
import "express-async-errors";
import {
  signup,
  usercount,
  users,
  year,
  gender,
  joindate,
  agedistribution,
  ethnicity,
  nationality,
  month,
  week,
  day,
} from "../../controllers/user";
import middlewares from "../../middlewares";

const { validate, signUpSchema } = middlewares;

const userRoutes = express();

userRoutes.post("/signup", validate(signUpSchema), signup);
userRoutes.post("/month", month);
userRoutes.post("/week", week);
userRoutes.post("/day", day);
userRoutes.get("/", users);
userRoutes.get("/usercount", usercount);
userRoutes.get("/gender", gender);
userRoutes.get("/joindate", joindate);
userRoutes.get("/agedistribution", agedistribution);
userRoutes.get("/ethnicity", ethnicity);
userRoutes.get("/nationality", nationality);
userRoutes.get("/year", year);

export default userRoutes;
