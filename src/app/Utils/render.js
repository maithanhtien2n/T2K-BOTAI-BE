module.exports = {
  // Random value
  generateRandomCode: (v1, v2, length) => {
    var characters = `${v1}${v2}`;
    var code = "";

    for (var i = 0; i < length; i++) {
      var randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  },
};
