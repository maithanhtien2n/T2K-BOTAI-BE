module.exports = (app) => {
  const { onResponse, checkNullRequest } = require("../Utils/index");

  const controllerName = "auth";
  const onRoute = (method, route, handler) => {
    app[method](`/api/v1/${controllerName}/${route}`, handler);
  };

  // Service import
  const authService = require("../Services/AuthService");

  // API đăng ký tài khoản
  onRoute("post", "register", async (req, res) => {
    try {
      // Các hàm xử lý request
      checkNullRequest(req.body, ["email", "password"]);

      // Dữ liệu từ request
      const { email, password } = req.body;

      // Hàm xử lý logic và trả ra kết quả
      const result = await authService.register({ email, password });

      // Hàm trả về response cho người dùng
      onResponse(res, result).ok({ sttValue: "Đăng ký tài khoản thành công!" });
    } catch (error) {
      onResponse(res, null).badRequest(error);
    }
  });

  // API đăng nhập
  onRoute("post", "login", async (req, res) => {
    try {
      // Các hàm xử lý request
      checkNullRequest(req.body, ["email", "password"]);

      // Dữ liệu từ request
      const { email, password } = req.body;

      // Hàm xử lý logic và trả ra kết quả
      const result = await authService.login({ email, password });

      // Hàm trả về response cho người dùng
      onResponse(res, result).ok({ sttValue: "Đăng nhập thành công!" });
    } catch (error) {
      onResponse(res, null).badRequest(error);
    }
  });
};
