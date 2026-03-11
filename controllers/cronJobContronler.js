import connection from "../config/connectDB";
import winGoController from "./winGoController";
import k5Controller from "./k5Controller";
import k3Controller from "./k3Controller";
import userController from "./userController";
import cron from "node-cron";
const cronJobGame1p =async (io) => {
  
  const currentTime = new Date();
console.log("Current server time:", currentTime.toString());



  cron.schedule("0 1 * * *", async () => {
  console.log("Running cron at 1:00 AM IS dddT");
     await winGoController.tradeCommission();
      // await userController.vipLevelEvery();
      
}, {
  timezone: "Asia/Kolkata"
});

 cron.schedule("0 2 * * *", async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedDate = yesterday.toISOString().split("T")[0];
    await connection.query("DELETE FROM wingo WHERE time BETWEEN '2025-02-01' AND ?",[formattedDate])
})
  
  // one month
  cron.schedule("0 0 1 * *", async () => {
    await userController.vipLevelMonthly();
  });
};

module.exports = {
  cronJobGame1p,
};
