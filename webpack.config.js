const path = require("path");

export default {
  resolve: {
    alias: {
      jquery: path.join(__dirname, "./jquery-stub.js"),
    },
  },
};
