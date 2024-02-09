module.exports = (app) => {
  const { onResponse, checkNullRequest } = require("../Utils/index");
  const { onRouteCustom } = require("../Middlewares/index");

  const controllerName = "user";
  const onRoute = (method, route, handler, accuracy) => {
    onRouteCustom(app, controllerName, method, route, handler, accuracy);
  };

  // Service import
  const commonService = require("../Services/CommonService");

  // API mở file ảnh hoặc video
  const onApiOpenFile = (folderName = "") => {
    app.get(`/uploads${folderName}/:name`, (req, res) => {
      const fileName = req.params.name;
      const options = {
        root: `uploads${folderName}`,
        headers: {
          "Content-Type": fileName.endsWith(".mp4") ? "video/mp4" : "image",
        },
      };
      res.sendFile(fileName, options, (error) => {
        if (error) {
          onResponse(res, null).badRequest(error);
        }
      });
    });
  };
  onApiOpenFile("/avatar");
  onApiOpenFile("/image");
};
