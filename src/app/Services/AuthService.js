require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { throwError, cloneObjectWithoutFields } = require("../Utils/index");

const { Account } = require("../Models/Account");
const { User } = require("../Models/User");

module.exports = {
  register: async ({ email, password }) => {
    try {
      const account = await Account.findOne({ email });

      if (account) {
        throwError("EMAIL_EXISTS", "Email đã tồn tại!");
      }

      const result = await Account.create({
        email,
        password: bcrypt.hashSync(password, 10), // Mã hóa mật khẩu
      });

      await User.create({ accountId: result._id });

      return cloneObjectWithoutFields(result, ["password", "__v"]);
    } catch (error) {
      throw error;
    }
  },

  login: async ({ email, password }) => {
    try {
      const account = await Account.findOne({ email });

      if (!account || !bcrypt.compareSync(password, account.password)) {
        throwError(
          "INCORRECT_INFO",
          "Tên tài khoản hoặc mật khẩu không chính xác!"
        );
      }

      if (account.status === "LOCKED") {
        throwError("ACCOUNT_BLOCKED", "Tài khoản của bạn đã bị khóa!");
      }

      const user = await User.findOne({ accountId: account._id });

      const result = {
        account: cloneObjectWithoutFields(account, ["password", "__v"]),
        user: cloneObjectWithoutFields(user, ["__v"]),
      };

      return {
        userData: result,
        accessToken: jwt.sign(
          cloneObjectWithoutFields(account, [
            "moneyBalance",
            "password",
            "createdAt",
            "updatedAt",
            "__v",
          ]),
          process.env.JWT_SECRET
          // { expiresIn: "10h" }
        ),
      };
    } catch (error) {
      throw error;
    }
  },
};
