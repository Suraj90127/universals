module.exports = {
  apps: [
    {
      name: "bdcwin",
      script: "./node_modules/.bin/babel-node",
      args: "server.js",
      node_args: "--max-old-space-size=26384",
      watch: false,
      kill_timeout: 5000   // 5 सेकंड wait करे force kill से पहले
    }
  ]
};
