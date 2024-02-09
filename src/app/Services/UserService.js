require("dotenv").config();

const { throwError, cloneObjectWithoutFields } = require("../Utils/index");
const commonService = require("./CommonService");

const { Account } = require("../Models/Account");
const { User } = require("../Models/User");

module.exports = {
  getAllUser: async ({ tab = "ALL", keySearch = "" }) => {
    try {
      const accountInfo = await User.find({ role: "USER" }).populate({
        path: "accountId",
        model: Account,
        select: "email role status createdAt updatedAt",
      });

      const all = accountInfo.map((item) => ({
        account: item?.accountId,
        user: cloneObjectWithoutFields(item, ["accountId", "__v"]),
      }));
      const active = all.filter(({ account }) => account.status === "ACTIVE");
      const locked = all.filter(({ account }) => account.status === "LOCKED");

      switch (tab) {
        case "ALL":
          return {
            all: all.filter(
              (item) =>
                item.account.email.includes(keySearch) ||
                item.user.phoneNumber.includes(keySearch)
            ),
            active,
            locked,
          };
        case "ACTIVE":
          return {
            all,
            active: active.filter(
              (item) =>
                item.account.email.includes(keySearch) ||
                item.user.phoneNumber.includes(keySearch)
            ),
            locked,
          };
        case "LOCKED":
          return {
            all,
            active,
            locked: locked.filter(
              (item) =>
                item.account.email.includes(keySearch) ||
                item.user.phoneNumber.includes(keySearch)
            ),
          };
      }
    } catch (error) {
      throw error;
    }
  },

  getOneUser: async (userId) => {
    try {
      const accountInfo = await User.findById(userId).populate({
        path: "accountId",
        model: Account,
        select: "email moneyBalance role status createdAt updatedAt",
      });

      return [accountInfo].map((item) => ({
        account: item?.accountId,
        user: cloneObjectWithoutFields(item, ["accountId", "__v"]),
      }))[0];
    } catch (error) {
      throw error;
    }
  },

  saveOneUser: async (userId, data) => {
    try {
      const fieldImage = "avatar";
      let infoData = { ...data };
      if (!data[fieldImage] || data[fieldImage].base64.includes("http")) {
        infoData.avatar = null;
      }

      console.log(infoData);

      const updateUser = await commonService.uploadFile(
        User,
        { field: fieldImage, location: "avatar/" },
        userId,
        infoData
      );

      return updateUser;
    } catch (error) {
      throw error;
    }
  },

  updateStatusAccount: async ({ ids, status }) => {
    try {
      if (!ids.length) {
        return ids.length + " dòng";
      }

      for (const id of ids) {
        await Account.updateOne({ _id: id }, { status });
      }

      return ids.length + " dòng";
    } catch (error) {
      throw error;
    }
  },

  updateMoneyBalanceUser: async ({ ids, moneyBalance }) => {
    try {
      if (!ids.length) {
        return ids.length + " dòng";
      }

      if (+moneyBalance > 1000000) {
        throwError(401, "Số tiền mỗi lần nạp phải nhỏ hơn 1.000.000 vnđ");
      }

      for (const id of ids) {
        const account = await Account.findById(id);
        await Account.updateOne(
          { _id: id },
          { moneyBalance: +account.moneyBalance + +moneyBalance }
        );
      }

      return ids.length + " dòng";
    } catch (error) {
      throw error;
    }
  },
};
