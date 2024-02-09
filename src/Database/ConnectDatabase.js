const mongoose = require("mongoose");

// Kết nối đến MongoDB
mongoose.connect(
  "mongodb+srv://maithanhtien2n:tien2000@t2ktest.1s18ia1.mongodb.net/T2KTest?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Sự kiện kết nối thành công
mongoose.connection.on("connected", () => {
  console.log("Kết nối đến MongoDB thành công");
});

// Sự kiện lỗi kết nối
mongoose.connection.on("error", (err) => {
  console.error("Kết nối đến MongoDB lỗi:", err);
});

// Sự kiện ngắt kết nối
mongoose.connection.on("disconnected", () => {
  console.log("Ngắt kết nối đến MongoDB");
});

module.exports = mongoose;
