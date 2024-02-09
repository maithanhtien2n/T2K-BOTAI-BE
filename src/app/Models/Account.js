const mongoose = require("../../Database/ConnectDatabase");
const Schema = mongoose.Schema;

const Account = mongoose.model(
  "Accounts",
  new Schema(
    {
      email: { type: String, required: true },
      password: { type: String, required: true },
      moneyBalance: { type: Number, required: true, default: 0 },
      role: { type: String, required: true, default: "USER" },
      status: { type: String, required: true, default: "ACTIVE" },
    },
    { timestamps: true }
  )
);

module.exports = { Account };
