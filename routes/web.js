import express from "express";
import connection from "../config/connectDB";
import accountController from "../controllers/accountController";
import homeController from "../controllers/homeController";
import winGoController from "../controllers/winGoController";
import userController from "../controllers/userController";
import bettingController from "../controllers/bettingController";
import jilliController from "../controllers/jilliController";
import middlewareController from "../controllers/middlewareController";
import adminController from "../controllers/adminController";
import dailyController from "../controllers/dailyController";
import k5Controller from "../controllers/k5Controller";
import k3Controller from "../controllers/k3Controller";
import paymentController from "../controllers/paymentController";
import { rateLimit } from "express-rate-limit";
import allGameController from "../controllers/allGameController";
import carController from "../controllers/carController";
import supportController from "../controllers/supportController";
import commissionController from "../controllers/commissionController"
import p2pController from "../controllers/p2pController"

import { addBonus, addProblem, addUSDTAddress, bankModification, bankName, depositNotReceived, ifscModification, sendOtp, updatePassword, updatePassword2 ,getDepositNotReceived,getifscModification,getUserBank,getBankModification,bonusDetails,problemsDetails,getUsdtAddress,problemAcceptOrReject,bonusAcceptOrReject,addressAcceptOrReject,modifyBankAcceptorReject,depositAcceptOrReject,getwithdrawlProblems,withdrawlProblemsAcceptOrReject,getRecharge,getwithdrawl2,withdrawlProblems} from "../controllers/depositNotRecieved";


const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({ storage: storage });

let router = express.Router();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

const allowedIps = ["154.80.91.199", "106.219.162.65", "106.219.164.242"];




const maintenanceMode = (req, res, next) => {
  const clientIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if (allowedIps.includes(clientIp)) {
    // Allow access if IP is in the allowed list
    return next();
  }

  // Return a beautiful HTML page for maintenance mode
  res.status(503).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Maintenance Mode</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                }
                .container {
                    text-align: center;
                }
                h1 {
                    font-size: 3em;
                    margin-bottom: 0.5em;
                }
                p {
                    font-size: 1.2em;
                }
                .logo {
                    width: 100px;
                    height: auto;
                    margin-bottom: 1em;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img src="https://img.lovepik.com/free-png/20211215/lovepik-child-asleep-waiting-for-a-gift-png-image_401649100_wh1200.png" alt="Logo" class="logo">
                <h1>We're currently undergoing maintenance</h1>
                <p>Our site is currently being updated. We'll be back online shortly. Thank you for your patience!</p>
            </div>
        </body>
        </html>
    `);
};

const initWebRouter = (app) => {
  // app.use(maintenanceMode);

  // app.use(maintenanceMode);
  // page account
  

  router.delete('/delete/item/:id', async (req, res) => {
      
    const { id } = req.params;
    
    try {
      const sql = `DELETE FROM rechargeBonus WHERE id = ?`;
      const [result] = await connection.execute(sql, [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      res.status(200).json({ success: true, message: 'Item deleted successfully' });
    } catch (err) {
      console.error("Error deleting item:", err);
      res.status(500).json({ error: 'Database query failed' });
    }
    
  });
    
    
    
 router.get("/gettime_now", (req, res) => {
  res.status(503).send(`<form action="/support/submitGameProblem" method="POST" enctype="multipart/form-data">
  <!-- Issue Description -->
  <div class="form-item">
    <label for="issueDescription">Explain the issue happen to you inside the game clear and detail:</label>
    <textarea id="issueDescription" name="issueDescription" rows="5" placeholder="Please enter content" maxlength="500" required></textarea>
  </div>

  <!-- Tiranga ID -->
  <div class="form-item">
    <label for="tirangaId">Tiranga ID:</label>
    <input type="text" id="tirangaId" name="games_id" placeholder="Please enter username" required />
  </div>

  <!-- Attach Photo -->
  <div class="form-item">
    <label for="photo">Attach Photo:</label>
    <input type="file" id="photo" name="photo" accept="image/*" />
  </div>

  <!-- Attach PDF File -->
  <div class="form-item">
    <label for="pdfFile">Attach PDF File:</label>
    <input type="file" id="pdfFile" name="pdf" accept=".pdf,image/*,video/*" />
  </div>

  <!-- Attach Video -->
  <div class="form-item">
    <label for="video">Attach Video:</label>
    <input type="file" id="video" name="video_path" accept=".pdf,image/*,video/*" />
  </div>

  <!-- Submit Button -->
  <div class="form-item">
    <button type="submit">Submit</button>
  </div>
</form>

`);
});

     router.get("/api/postbackcallback", (req, res) => {
      const {
        user,
        txid,
        rev,
        amount,
        hash,
        ip,
        type,
        wid
      } = req.query;
    
      // Hash validation
      console.log("📩 Postback Received:");
      console.log("UserID: ", user);
      console.log("TransactionID: ", txid);
      console.log("Revenue: ", rev);
      console.log("Currency Amount: ", amount);
      console.log("Hash: ", hash);
      console.log("IP: ", ip);
      console.log("Type: ", type);
      console.log("WithdrawID: ", wid);
    
      // Always return 200 OK
      res.status(200).send("OK");
    });
  router.post('/support/submit-verification', supportController.upload, supportController.submitVerification);
  
  router.post('/support/submitGameProblem', supportController.uploadGameProblem, supportController.submitGameProblem);
    
  router.post('/support/submit-verification-id', supportController.upload_Retrieve_Login, supportController.submit_Retrieve_Login);


  router.get("/keFuMenu", accountController.keFuMenu);
  router.get("/admin/login", accountController.login2Page);

  router.post("/api/sent/otp/verify", accountController.verifyCode);
  router.post("/api/sent/otp/verify/reset", accountController.verifyCodePass);
  router.post("/api/resetPasword", accountController.forGotPassword);

  // router.get('/salery_send', homeController.salerySend);
  router.post("/api/sent/otp/verify1", accountController.verifyCodeforregister);
  router.post("/api/addutr", userController.addutr);

  router.get("/aviator", userController.aviator);

   // all game apis
  router.post("/api/spribeapi/checkBalance", allGameController.checkBalance);
  router.post(
    "/api/spribeapi/transferBalance",
    allGameController.transferBalance
  );
  router.post("/api/spribeapi/launchGame", allGameController.launchGame);
  router.get("/api/spribeapi/gamelist", allGameController.getgamedetails);
  router.get("/api/spribeapi/gameProvider", allGameController.gameProvider);
  router.get("/api/spribeapi/gameType", allGameController.gameType);
  router.get(
    "/api/spribeapi/gameListByProvider",
    allGameController.gameListByProvider
  );
  router.get(
    "/api/spribeapi/gameListByGameType",
    allGameController.gameListByGameType
  );
  router.get(
    "/api/spribeapi/gameListByGameTypeAndProvider",
    allGameController.gameListByGameTypeAndProvider
  );
  router.post("/api/spribeapi/gameHistory/:id", allGameController.gameHistory);
  

  // page home
  // router.get('/', (req, res) => {
  //     return res.redirect('/#');
  // });

  router.get("/checkDes", middlewareController, homeController.checkDes);
  router.get("/checkRecord", middlewareController, homeController.checkRecord);


  router.get("/getdetaDet", winGoController.getdetaDet);
  
  
    router.post("/api/p2p",  middlewareController, p2pController.p2p);
 router.get("/api/getP2PByTransfer", middlewareController, p2pController.getP2PByTransfer);
  router.get("/api/getP2PByPhone", middlewareController, p2pController.getP2PByPhone);
  router.get("/api/getP2PAll", middlewareController, p2pController.getP2PAll);
  router.post("/api/trasferToMain", middlewareController, p2pController.trasferToMain);
    router.get("/api/getP2PMain", middlewareController, p2pController.getP2PMain);
    router.get("/api/getP2PMainforUser/:phone", middlewareController, p2pController.getP2PMainforUser); 
    

  router.get("/admin/manager/p2p",   adminController.middlewareAdminController, adminController.p2pPage);
  
  router.get("/admin/manager/p2pmain",   adminController.middlewareAdminController, adminController.p2pMainPage);

  router.get("/api/getP2PMainAdmin",   adminController.middlewareAdminController, p2pController.getP2PMainAdmin);


  router.post("/api/editbankstatus",   adminController.middlewareAdminController, adminController.editbankstatus);  
  
  
  
  // router.get('/wallet/transfer', middlewareController, homeController.transfer);

  router.get(
    "/api/webapi/downlinerecharge/list",
    middlewareController,
    userController.downlinerecharge
  );
  router.post(
    "/api/webapi/downlinerecharge-data/list-data",
    middlewareController,
    userController.downlinerecharge_data
  );
    router.post(
    "/api/webapi/fetchPromotionDataUser",
    middlewareController,
    userController.fetchPromotionDataUser
  );


  router.get(
    "/api/webapi/commissiondata",
    middlewareController,
    userController.commissiondata
  );
  
   router.get(
    "/api/webapi/logincount",
    middlewareController,
    accountController.getLogincount
  );
  
   router.get(
    "/api/webapi/loginupdate",
    middlewareController,
    accountController.getLoginupdate
  );
  
  
  
 router.get("/api/webapi/promotioncron", commissionController.promotion);
 router.get("/api/webapi/downlinerecharge_newcron", commissionController.downlinerecharge_new); 
 router.get("/api/webapi/tradeCommissioncron", winGoController.tradeCommission); 

 router.get("/api/webapi/vipLevelEverycron", userController.vipLevelSingle); 

 router.get("/api/webapi/vipLevelMonthlycron", userController.vipLevelMonthly); 
  

  router.get(
    "/api/webapi/subordinatedata",
    middlewareController,
    userController.subordinatedata
  );
  router.get("/api/webapi/get-Notification", adminController.getNotification);
  router.get(
    "/api/webapi/vip-level",
    middlewareController,
    userController.vipLevel
  );
  router.get(
    "/api/webapi/vip-data",
     middlewareController,
    userController.getVipData
  );
  router.post(
    "/api/webapi/email-otp",
    middlewareController,
    accountController.sendOTPOnEmail
  );
  router.post(
    "/api/webapi/email",
    middlewareController,
    accountController.submitEmail
  );
  router.post("/api/webapi/login-email", accountController.loginEmail);
  router.post("/api/webapi/login-admin", accountController.loginAdmin);

  router.get(
    "/admin/manager/promotions",
    adminController.middlewareAdminController,
    adminController.promotionsPage
  );
  
    router.post(
    "/api/webapi/admin/totalJoin",
    adminController.middlewareAdminController,
    adminController.totalJoin
  );
  

  router.get("/user/permissions", async (req, res) => {
    try {
      let auth = req.cookies.auth;

      // Fetch user based on the token
      const [user] = await connection.query(
        "SELECT * FROM users WHERE token = ?",
        [auth]
      );

      if (user.length === 0) {
        return res.status(200).json({ message: "Failed", status: false });
      }

      let userId = user[0].phone;

      // Fetch user permissions
      const [rows] = await connection.query(
        "SELECT permission_key, permission_value FROM user_permissions WHERE user_id = ?",
        [userId]
      );

      const permissions = rows.reduce((acc, row) => {
        acc[row.permission_key] = row.permission_value === 1 ? "1" : "0";
        return acc;
      }, {});

      res.json({ success: true, permissions });
    } catch (error) {
      console.error("Error fetching permissions:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  router.post(
    "/webapi/createsubadmin",
    adminController.middlewareAdminController,
    adminController.createsubadmin
  );
  
  router.get(
    "/webapi/getAllAdmins",
    adminController.middlewareAdminController,
    adminController.getAllAdmins
  );
  
  //router.post(
  //  "/webapi/deleteadmin",
  //  adminController.middlewareAdminController,
  //  adminController.deleteadmin
  //);
  
  
  router.post(
    "/webapi/deleteadmin",
    adminController.middlewareAdminController,
    adminController.deleteadmin_1
  );
  
  router.post(
    "/webapi/edituserpermissions",
    adminController.middlewareAdminController,
    adminController.editUserPermissions
  );
  
  router.get(
    "/webapi/getuserpermissions",
    adminController.middlewareAdminController,
    adminController.getUserPermissions
  );
  
  


  router.get(
    "/api/webapi/random-promotion",
    middlewareController,
    userController.getpromotiondata
  );
  router.post(
    "/api/webapi/update-promotion",
    adminController.middlewareAdminController,
    userController.updateRandomPromotion
  );
  router.post(
    "/api/webapi/update-rank",
    adminController.middlewareAdminController,
    userController.makePromotion
  );
  router.post(
    "/api/webapi/daily-bet-commition",
    // adminController.middlewareAdminController,
    userController.dailyBetCommition
  );
  router.post(
    "/api/webapi/update-attendencs-bonus",
    // adminController.middlewareAdminController,
    adminController.attendanceBonus
  );

  router.get(
    "/api/webapi/get-attendencs-bonus",
    // adminController.middlewareAdminController,
    adminController.getattendanceBonus
  );
  router.post(
    "/api/webapi/get-ligalTrade-data",
    // adminController.middlewareAdminController,
    adminController.ligalTrade
  );
  router.post(
    "/api/webapi/get-profit-loss",
    adminController.middlewareAdminController,
    adminController.profitLoss
  );

  router.post("/api/webapi/set-warning-alert", adminController.setWarningAlert);
  router.post(
    "/api/webapi/set-deposite-requrment",
    adminController.middlewareAdminController,
    adminController.setdepositerequrments
  );
  router.get(
    "/api/webapi/get-deposite-requrment",
    adminController.middlewareAdminController,
    adminController.getdepositerequrments
  );
  router.post(
    "/api/webapi/set-website-mode",
    adminController.middlewareAdminController,
    adminController.setwebsiteMode
  );
  router.get(
    "/api/webapi/get-website-mode",
    adminController.middlewareAdminController,
    adminController.geWebsiteMode
  );
  router.post("/api/webapi/set-sinup-bonus", adminController.setSinupBonus);
  router.post("/api/webapi/set-vip-data", adminController.vipData);
  router.post(
    "/api/webapi/set-userBet-commition",
    adminController.setUserBetCommition
  );
  router.post(
    "/api/webapi/set-recharge-bonus",
    // adminController.middlewareAdminController,
    adminController.setRechargeBonus
  );
  router.delete(
    "/api/webapi/delete-recharge-bonus/:id",
    adminController.deleteRechargeBonus
  );

  router.post(
    "/api/webapi/update-recharge-bonus",
    // adminController.middlewareAdminController,
    adminController.updateRechargeBonus
  );
  router.get(
    "/api/webapi/getrecharge-bonus",
    // adminController.middlewareAdminController,
    adminController.getRechargeBonusCount
  );
  router.get(
    "/api/webapi/get-active-user",
    adminController.middlewareAdminController,
    adminController.activeUser
  );
  router.get(
    "/api/webapi/get-winning-percentage",
    adminController.middlewareAdminController,
    adminController.winningPercentage
  );
  router.post(
    "/api/webapi/set-invitation-bonus",
    // adminController.middlewareAdminController,
    adminController.setInvitationBonus
  );
  router.post(
    "/api/webapi/update-inviaion-bonus",
    // adminController.middlewareAdminController,
    adminController.updateInvitationBonus
  );
  router.delete(
    "/api/webapi/delete-inviaion-bonus",
    // adminController.middlewareAdminController,
    adminController.deleteInvitationBonus
  );
  router.get(
    "/api/webapi/get-invitation-bonus",
    // adminController.middlewareAdminController,
    userController.getInvitationBonus
  );

  router.get("/wallet", middlewareController, homeController.walletPage);
  router.get(
    "/wallet/recharge",
    middlewareController,
    homeController.rechargePage
  );
  router.get(
    "/wallet/withdrawal",
    middlewareController,
    homeController.withdrawalPage
  );
  router.get(
    "/wallet/rechargerecord",
    middlewareController,
    homeController.rechargerecordPage
  );
  router.get(
    "/wallet/withdrawalrecord",
    middlewareController,
    homeController.withdrawalrecordPage
  );
  router.get("/wallet/addBank", middlewareController, homeController.addBank);
  router.get(
    "/wallet/downlinerecharge",
    middlewareController,
    homeController.downlinerechargePage
  );
  router.get(
    "/wallet/transactionhistory",
    middlewareController,
    homeController.transactionhistoryPage
  );

  router.get(
    "/wallet/paynow/manual_upi",
    middlewareController,
    paymentController.initiateManualUPIPayment
  );
  router.get(
    "/wallet/paynow/manual_usdt",
    middlewareController,
    paymentController.initiateManualUSDTPayment
  );
  router.post(
    "/wallet/paynow/manual_upi_request",
    middlewareController,
    paymentController.addManualUPIPaymentRequest
  );
  router.post(
    "/wallet/paynow/manual_usdt_request",
    middlewareController,
    paymentController.addManualUSDTPaymentRequest
  );
  router.post(
    "/wallet/paynow/wowpay",
    middlewareController,
    paymentController.initiateWowPayPayment
  );
  router.post(
    "/wallet/verify/wowpay",
    middlewareController,
    paymentController.verifyWowPayPayment
  );
  router.get(
    "/wallet/verify/wowpay",
    middlewareController,
    paymentController.verifyWowPayPayment
  );
  router.post(
    "/wallet/paynow/upi",
    middlewareController,
    paymentController.initiateUPIPayment
  );
  router.post(
    "/wallet/paynow/verify-sunpay",
    limiter,
    paymentController.verifySunpayPayment
  );
  router.post(
    "/wallet/paynow/sunpay",
    middlewareController,
    paymentController.initiateSunpayPayment
  );
  router.get(
    "/wallet/verify/upi",
    middlewareController,
    paymentController.verifyUPIPayment
  );

  router.get("/mian", middlewareController, homeController.mianPage);

  router.get(
    "/recordsalary",
    middlewareController,
    homeController.recordsalary
  );
  router.get(
    "/getrecord",
    middlewareController,
    homeController.getSalaryRecord
  );
  router.get("/about", middlewareController, homeController.aboutPage);
  router.get(
    "/redenvelopes",
    middlewareController,
    homeController.redenvelopes
  );
  router.get("/mian/forgot", middlewareController, homeController.forgot);
  router.get("/newtutorial", homeController.newtutorial);
  router.get(
    "/about/privacyPolicy",
    middlewareController,
    homeController.privacyPolicy
  );
  router.get(
    "/about/riskAgreement",
    middlewareController,
    homeController.riskAgreement
  );

  router.get("/myProfile", middlewareController, homeController.myProfilePage);

  router.post(
    "/admin/manager/settings/demo",
    adminController.middlewareAdminController,
    adminController.settingdemo
  );

  // BET trx
  router.get("/trx", middlewareController, winGoController.trxPage);
  router.get("/trx/3", middlewareController, winGoController.trxPage3);
  router.get("/trx/5", middlewareController, winGoController.trxPage5);
  router.get("/trx/10", middlewareController, winGoController.trxPage10);

  // BET K5D
  router.get("/5d", middlewareController, k5Controller.K5DPage);
  router.post(
    "/api/webapi/action/5d/join",
    middlewareController,
    k5Controller.betK5D
  ); // register
  router.post(
    "/api/webapi/5d/GetNoaverageEmerdList",
    middlewareController,
    k5Controller.listOrderOld
  ); // register
  router.post(
    "/api/webapi/5d/GetMyEmerdList",
    middlewareController,
    k5Controller.GetMyEmerdList
  ); // register


  router.post(
    "/api/webapi/action/cargame/join",
    middlewareController,
    carController.betcargame
  ); // register
  router.post(
    "/api/webapi/cargame/GetNoaverageEmerdList",
    middlewareController,
    carController.listOrderOld
  ); // register
  router.post(
    "/api/webapi/cargame/GetMyEmerdList",
    middlewareController,
    carController.GetMyEmerdList
  ); // register

  // BET K3
  router.get("/k3", middlewareController, k3Controller.K3Page);

  router.post(
    "/api/webapi/action/k3/join",
    middlewareController,
    k3Controller.betK3
  ); // register
  router.post(
    "/api/webapi/k3/GetNoaverageEmerdList",
    middlewareController,
    k3Controller.listOrderOld
  ); // register
  router.post(
    "/api/webapi/k3/GetMyEmerdList",
    middlewareController,
    k3Controller.GetMyEmerdList
  ); // register

  // login | register
  router.post("/api/webapi/login", accountController.login); // login
  router.post(
    "/api/webapi/notification",
    middlewareController,
    accountController.deleteLoginDetail
  ); // delete
  router.get(
    "/api/webapi/notification",
    middlewareController,
    accountController.getLoginDetail
  ); //show
  router.post("/api/webapi/register", accountController.register); // register
  router.get("/aviator", middlewareController, userController.aviator);
  router.get(
    "/api/webapi/GetUserInfo",
    middlewareController,
    userController.userInfo
  ); // get info account
  router.post(
    "/api/webapi/change/userInfo",
    middlewareController,
    userController.changeUser
  ); // get info account
  router.post(
    "/api/webapi/change/pass",
    middlewareController,
    userController.changePassword
  ); // get info account
  router.post(
    "/api/webapi/change/userPhoto",
    middlewareController,
    userController.changeUserPhoto
  ); // get info account

  router.post(
    "/api/webapi/rebateCreate",
    middlewareController,
    userController.rebateCreate
  ); // get info account
  
  router.get(
    "/api/webapi/getRebate",
    middlewareController,
    userController.getRebate
  ); // get info account
  
  router.get(
    "/api/webapi/transactioncatgory",
    userController.transactioncatgory
  ); // get info account

  // bet wingo
  router.post(
    "/api/webapi/action/join",
    middlewareController,
    winGoController.betWinGo
  ); // register
  router.post(
    "/api/webapi/GetNoaverageEmerdList",
    middlewareController,
    winGoController.listOrderOld
  ); // register
  router.post(
    "/api/webapi/GetMyEmerdList",
    middlewareController,
    winGoController.GetMyEmerdList
  ); // register

  router.get(
    "/api/webapi/totalcommission",
    middlewareController,
    userController.totalCommission
  ); // register
  // promotion
  router.get(
    "/api/webapi/promotion",
    middlewareController,
    userController.promotionNew
  ); // register



  router.get(
    "/api/webapi/transactionhistory",
    middlewareController,
    userController.transactionHistory
  ); // register
  router.post(
    "/api/webapi/checkIn",
    middlewareController,
    userController.checkInHandling
  ); // register
  router.get(
    "/api/webapi/check/Info",
    middlewareController,
    userController.infoUserBank
  ); // register
  router.post(
    "/api/webapi/addBank",
    middlewareController,
    userController.addBank
  ); // register
  
   router.post(
    "/api/webapi/addusdt",
    middlewareController,
    userController.addUSDT
  ); // register
  
      router.post(
    "/api/webapi/addupi",
    middlewareController,
    userController.addUpi
  ); // register
  
  
  
  router.post(
    "/api/webapi/otp",
    middlewareController,
    userController.verifyCode
  ); // register
  router.post(
    "/api/webapi/use/redenvelope",
    middlewareController,
    userController.useRedenvelope
  ); // register
  router.get(
    "/api/webapi/get/redenvelope",
    middlewareController,
    userController.getRedenvelope
  ); // register
  router.get(
    "/api/webapi/new-subordinate",
    middlewareController,
    userController.newSubordinateData
  ); // register
  router.get(
    "/api/webapi/calculateDownlineBonuses",
    middlewareController,
    userController.calculateDownlineBonuses
  );
  // wallet
  router.post(
    "/api/webapi/recharge",
    middlewareController,
    // upload.none(),
    userController.recharge
  );
  
  
    router.post(
  "/api/webapi/zilpayCallback",

  userController.zilpayCallback
);


  
   router.post(
    "/api/webapi/zilpay",
 middlewareController,
    userController.zilpay
  );
  
  
  router.get("/api/webapi/bhatclub_callback", userController.handleCallback);
  router.post(
    "/api/webapi/online-recharge",
    middlewareController,
    // upload.none(),
    userController.onlineRecharge
  );
  router.post(
    "/api/webapi/cancel_recharge",
    middlewareController,
    userController.cancelRecharge
  ); // register
  router.post("/wowpay/create", middlewareController, userController.wowpay);
  router.post(
    "/api/webapi/confirm_recharge",
    middlewareController,
    userController.confirmRecharge
  );
  
  router.get(
    "/api/webapi/getdailyactivyreward",
    middlewareController,
    userController.getdailyactivyreward
  );
  
    router.get("/api/webapi/bonus-get", async (req, res) => {
      try {
        const [bonusSettings] = await connection.query(
          "SELECT `id`, `betrequriment`, `bonus`, `type`, `created_at`, `updated_at` FROM `bonus_settings`"
        );
        return res.status(200).json({ message: "Bonus retrieved successfully", success: true, data: bonusSettings });
      } catch (error) {
        console.error("Error fetching bonus settings:", error);
        return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
      }
    });
    
    router.post("/api/webapi/bonus-settings", async (req, res) => {
      try {
        const { betrequriment, bonus, type } = req.body;
    
        if (!betrequriment || !bonus || !type) {
          return res.status(400).json({ message: "Missing required fields", success: false });
        }
    
        await connection.query(
          "INSERT INTO bonus_settings (betrequriment, bonus, type) VALUES (?, ?, ?)",
          [betrequriment, bonus, type]
        );
    
        return res.status(201).json({ message: "Bonus setting created successfully", success: true });
      } catch (error) {
        console.error("Error creating bonus setting:", error);
        return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
      }
    });
    
    // Update an existing bonus setting
    router.post("/api/webapi/bonus-settings_update", async (req, res) => {
      try {
          
        const { betrequriment, bonus, type, id } = req.body;
    
        if (!betrequriment || !bonus || !type) {
          return res.status(400).json({ message: "Missing required fields", success: false });
        }
    
        const [result] = await connection.query(
          "UPDATE bonus_settings SET betrequriment = ?, bonus = ?, type = ? WHERE id = ?",
          [betrequriment, bonus, type, id]
        );
    
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Bonus setting not found", success: false });
        }
    
        return res.status(200).json({ message: "Bonus setting updated successfully", success: true });
      } catch (error) {
        console.error("Error updating bonus setting:", error);
        return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
      }
    });
    
    // Delete a bonus setting
    router.delete("/api/webapi/bonus-settings/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const [result] = await connection.query("DELETE FROM bonus_settings WHERE id = ?", [id]);
    
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Bonus setting not found", success: false });
        }
    
        return res.status(200).json({ message: "Bonus setting deleted successfully", success: true });
      } catch (error) {
        console.error("Error deleting bonus setting:", error);
        return res.status(500).json({ message: "Internal server error", success: false, error: error.message });
      }
    });
  
  router.get(
    "/api/webapi/myTeam",
    middlewareController,
    userController.listMyTeam
  ); // register
  router.get(
    "/api/webapi/recharge/list",
    middlewareController,
    userController.listRecharge
  ); // register
  
     router.get(
    "/api/webapi/recharge/list2",
    middlewareController,
    userController.listRecharge2
  ); // register
  
  
  router.get(
    "/api/webapi/withdraw/list",
    middlewareController,
    userController.listWithdraw
  ); // register
  router.get(
    "/api/webapi/recharge/check",
    middlewareController,
    userController.recharge2
  ); // register
  router.post(
    "/api/webapi/withdrawal",
    middlewareController,
    userController.withdrawal3
  ); // register
  router.post(
    "/api/webapi/callback_bank",
    middlewareController,
    userController.callback_bank
  ); // register
  router.post(
    "/api/webapi/recharge/update",
    middlewareController,
    userController.updateRecharge
  ); // update recharge
  // router.post('/api/webapi/transfer', middlewareController, userController.transfer); // register
  // router.get('/api/webapi/transfer_history', middlewareController, userController.transferHistory); //
  router.get(
    "/api/webapi/confirm_recharge_usdt",
    middlewareController,
    userController.confirmUSDTRecharge
  ); //
  router.post(
    "/api/webapi/confirm_recharge_usdt",
    middlewareController,
    userController.confirmUSDTRecharge
  ); //

  router.post(
    "/api/webapi/search",
    middlewareController,
    userController.search
  ); // register

  // daily
  router.get(
    "/manager/index",
    dailyController.middlewareDailyController,
    dailyController.dailyPage
  );
  router.get(
    "/manager/listRecharge",
    dailyController.middlewareDailyController,
    dailyController.listRecharge
  );
  router.get(
    "/manager/listWithdraw",
    dailyController.middlewareDailyController,
    dailyController.listWithdraw
  );
  router.get(
    "/manager/members",
    dailyController.middlewareDailyController,
    dailyController.listMeber
  );
  router.get(
    "/manager/profileMember",
    dailyController.middlewareDailyController,
    dailyController.profileMember
  );
  router.get(
    "/manager/settings",
    dailyController.middlewareDailyController,
    dailyController.settingPage
  );
  router.get(
    "/manager/gifts",
    dailyController.middlewareDailyController,
    dailyController.giftPage
  );
  router.get(
    "/manager/support",
    dailyController.middlewareDailyController,
    dailyController.support
  );
  router.get(
    "/manager/member/info/:phone",
    dailyController.middlewareDailyController,
    dailyController.pageInfo
  );

  router.post(
    "/manager/member/info/:phone",
    dailyController.middlewareDailyController,
    dailyController.userInfo
  );
  router.post(
    "/manager/member/listRecharge/:phone",
    dailyController.middlewareDailyController,
    dailyController.listRechargeMem
  );
  router.post(
    "/manager/member/listWithdraw/:phone",
    dailyController.middlewareDailyController,
    dailyController.listWithdrawMem
  );
  router.post(
    "/manager/member/redenvelope/:phone",
    dailyController.middlewareDailyController,
    dailyController.listRedenvelope
  );
  router.post(
    "/manager/member/bet/:phone",
    dailyController.middlewareDailyController,
    dailyController.listBet
  );

  router.post(
    "/manager/settings/list",
    dailyController.middlewareDailyController,
    dailyController.settings
  );
  router.post(
    "/manager/createBonus",
    dailyController.middlewareDailyController,
    dailyController.createBonus
  );
  router.post(
    "/manager/listRedenvelops",
    dailyController.middlewareDailyController,
    dailyController.listRedenvelops
  );

  router.post(
    "/manager/listRecharge",
    dailyController.middlewareDailyController,
    dailyController.listRechargeP
  );
  router.post(
    "/manager/listWithdraw",
    dailyController.middlewareDailyController,
    dailyController.listWithdrawP
  );

  router.post(
    "/api/webapi/statistical",
    dailyController.middlewareDailyController,
    dailyController.statistical
  );
  router.post(
    "/manager/infoCtv",
    dailyController.middlewareDailyController,
    dailyController.infoCtv
  ); // get info account
  router.post(
    "/manager/infoCtv/select",
    dailyController.middlewareDailyController,
    dailyController.infoCtv2
  ); // get info account
  router.post(
    "/api/webapi/manager/listMember",
    dailyController.middlewareDailyController,
    dailyController.listMember
  ); // get info account

  router.post(
    "/api/webapi/manager/buff",
    dailyController.middlewareDailyController,
    dailyController.buffMoney
  ); // get info account

  router.post(
    "/admin/manager/settings/need",
    // adminController.middlewareAdminController,
    adminController.settingneed
  );

  router.post(
    "/admin/manager/set-spin-data",
    // adminController.middlewareAdminController,
    adminController.spinController
  );
  router.get(
    "/api/webapi/get-spin-data",
     middlewareController,
    userController.getSpinData
  );
  router.get(
    "/api/webapi/clime-spin-data",
    middlewareController,
    userController.claimSpin
  );
  
    router.get(
    "/api/webapi/spin-history",
    middlewareController,
    userController.spineHistory
  );

  // admin

  //  user problem
  router.post(
    "/api/webapi/userProblem",
    middlewareController,
    userController.userProblem
  ); // register
  router.post(
    "/api/webapi/userProblem-get",
    middlewareController,
    userController.userProblemGet
  ); // register
  router.get(
    "/api/webapi/admin/livechat",
    middlewareController,
    userController.adminProblemGet
  ); // register
  router.post(
    "/api/webapi/admin/livechatupdate",
    middlewareController,
    userController.adminProblemSubmit
  ); // register

  router.get(
    "/api/webapi/admin/get-commission",
     middlewareController,
    winGoController.tradeCommissionGet
  ); // register

  router.get(
    "/api/webapi/admin/update-commission",
    middlewareController,
    winGoController.tradeCommissionadmin
  ); // register

  router.get(
    "/admin/manager/lives",
    adminController.middlewareAdminController,
    adminController.livePage
  ); // get info account

  router.get(
    "/admin/manager/userlevel",
    adminController.middlewareAdminController,
    adminController.userlevelPage
  ); // get info account
   router.get(
    "/admin/manager/userlevelAll",
    adminController.middlewareAdminController,
    adminController.userlevelAllPage
  ); // get info account
  

  router.post(
    "/api/webapi/admin/manager/user-data",
    adminController.middlewareAdminController,
    adminController.downlinerecharge_data_admin
  ); // get promotion data

  router.post(
    "/api/webapi/admin/manager/user-data-all",
    adminController.middlewareAdminController,
    adminController.downlinerecharge_data_adminAll
  ); // get promotion data

  router.post(
    "/admin/manager/addust",
    adminController.middlewareAdminController,
    adminController.adminaddUSDT
  );

  router.get("/admin/manager/banner", adminController.bannerPage);
  router.get(
    "/admin/manager/activity-banner",
    adminController.activitybannerPage
  );
  router.get("/admin/manager/logo-setting", adminController.logoSettingPage);
  router.get(
    "/admin/manager/chennal-setting",
    adminController.chennalSettingPage
  );

  router.get("/api/webapi/banner", adminController.getBanner);
  router.post("/api/webapi/banners", adminController.updateBanner);
  router.post(
    "/api/webapi/activity-banners",
    adminController.updateActivityBanner
  );
  router.post("/api/webapi/logo-banners", adminController.updateLogo);
  router.post("/api/webapi/update-chennal", adminController.updateChennal);

  router.post("/api/webapi/getDataRecharge", adminController.getDataRecharge);

  router.get(
    "/admin/manager/vipsection",
    adminController.middlewareAdminController,
    adminController.vipsection
  );

  router.get(
    "/admin/manager/FirstDepositBonus",
    adminController.middlewareAdminController,
    adminController.FirstDepositBonus
  );
  router.get(
    "/admin/manager/createsubpanel",
    adminController.middlewareAdminController,
    adminController.createsubpanel
  );
  router.get(
    "/admin/manager/llegaltrade",
    adminController.middlewareAdminController,
    adminController.llegaltrade
  );
  router.get(
    "/admin/manager/Supportsection",
    adminController.middlewareAdminController,
    adminController.Supportsection
  );
  router.get(
    "/admin/manager/profitloss",
    adminController.middlewareAdminController,
    adminController.profitloss
  );
  router.get(
    "/admin/manager/spinwheel",
    adminController.middlewareAdminController,
    adminController.spinwheel
  );
  router.get(
    "/admin/manager/activitysettings",
    adminController.middlewareAdminController,
    adminController.activitysettings
  );
  router.get(
    "/admin/manager/InvitationBonus",
    adminController.middlewareAdminController,
    adminController.InvitationBonus
  );

  router.get(
    "/admin/manager/index",
    adminController.middlewareAdminController,
    adminController.adminPage
  ); // get info account
  router.get(
    "/admin/manager/index/3",
    adminController.middlewareAdminController,
    adminController.adminPage3
  ); // get info account
  router.get(
    "/admin/manager/index/5",
    adminController.middlewareAdminController,
    adminController.adminPage5
  ); // get info account
  router.get(
    "/admin/manager/index/10",
    adminController.middlewareAdminController,
    adminController.adminPage10
  ); // get info account
  
  
    router.get(
    "/api/webapi/admin/transactionHistory",
    adminController.middlewareAdminController,
    adminController.transactionHistoryadmin
  ); // get info account
  
   router.get(
    "/admin/manager/commission",
    adminController.middlewareAdminController,
    adminController.commissionHistoryPage
  ); // get info account
  
  
  
  
  
     router.post(
    "/api/admin/enableWithdraw",
    adminController.middlewareAdminController,
    adminController.enableWithdraw
  ); // get info account
  
  
   router.get(
    "/admin/manager/carIndex",
    adminController.middlewareAdminController,
    adminController.adminCarPage
  ); // get info account
  router.get(
    "/admin/manager/carIndex/3",
    adminController.middlewareAdminController,
    adminController.adminCarPage3
  ); // get info account
  router.get(
    "/admin/manager/carIndex/5",
    adminController.middlewareAdminController,
    adminController.adminCarPage5
  ); // get info account
  router.get(
    "/admin/manager/carIndex/10",
    adminController.middlewareAdminController,
    adminController.adminCarPage10
  ); // get info account
  
  
  

  router.get(
    "/admin/manager/Home",
    adminController.middlewareAdminController,
    homeController.homeAdminPage
  );

  // trx
  router.get(
    "/admin/manager/trx",
    adminController.middlewareAdminController,
    adminController.admintrxPage
  ); // get info account
  router.get(
    "/admin/manager/trx/3",
    adminController.middlewareAdminController,
    adminController.admintrxPage3
  ); // get info account
  router.get(
    "/admin/manager/trx/5",
    adminController.middlewareAdminController,
    adminController.admintrxPage5
  ); // get info account
  router.get(
    "/admin/manager/trx/10",
    adminController.middlewareAdminController,
    adminController.admintrxPage10
  ); // get info account

  router.get(
    "/admin/manager/5d",
    adminController.middlewareAdminController,
    adminController.adminPage5d
  ); // get info account

  router.get(
    "/admin/manager/5d/3",
    adminController.middlewareAdminController,
    adminController.adminPage5d
  ); // get info account

  router.get(
    "/admin/manager/5d/5",
    adminController.middlewareAdminController,
    adminController.adminPage5d
  ); // get info account

  router.get(
    "/admin/manager/5d/10",
    adminController.middlewareAdminController,
    adminController.adminPage5d
  ); // get info account
  router.get(
    "/admin/manager/k3",
    adminController.middlewareAdminController,
    adminController.adminPageK3
  ); // get info account

  router.get(
    "/admin/manager/members",
    adminController.middlewareAdminController,
    adminController.membersPage
  ); // get info account
  router.get(
    "/admin/manager/createBonus",
    adminController.middlewareAdminController,
    adminController.giftPage
  ); // get info account
  router.get(
    "/admin/manager/ctv",
    adminController.middlewareAdminController,
    adminController.ctvPage
  ); // get info account
    router.get(
    "/admin/manager/demouser",
    adminController.middlewareAdminController,
    adminController.demouser
  ); // get info account
  router.get(
    "/admin/manager/ctv/profile/:phone",
    adminController.middlewareAdminController,
    adminController.ctvProfilePage
  ); // get info account

  router.get(
    "/admin/manager/turnover",
    adminController.middlewareAdminController,
    adminController.turnover
  ); // get info account
  router.get(
    "/admin/manager/betting",
    adminController.middlewareAdminController,
    adminController.betting
  ); // get info account
  router.get(
    "/admin/manager/today_report",
    adminController.middlewareAdminController,
    adminController.todayreport
  ); // get info account
  
  router.post(
    "/admin/manager/settings/message",
    adminController.middlewareAdminController,
    adminController.settingMessage
  ); // get info account
  
  router.get(
    "/admin/manager/settings",
    adminController.middlewareAdminController,
    adminController.settings
  ); // get info account
  
  router.get(
    "/admin/manager/listRedenvelops",
    adminController.middlewareAdminController,
    adminController.listRedenvelops
  ); // get info account
  router.post(
    "/admin/manager/infoCtv",
    adminController.middlewareAdminController,
    adminController.infoCtv
  ); // get info account
  router.post(
    "/admin/manager/infoCtv/select",
    adminController.middlewareAdminController,
    adminController.infoCtv2
  ); // get info account
  router.post(
    "/admin/manager/settings/bank",
    adminController.middlewareAdminController,
    adminController.settingBank
  ); // get info account
  router.post(
    "/admin/manager/settings/cskh",
    adminController.middlewareAdminController,
    adminController.settingCskh
  ); // get info account
  router.post(
    "/admin/manager/settings/buff",
    adminController.middlewareAdminController,
    adminController.settingbuff
  ); // get info account
  router.post(
    "/admin/manager/create/ctv",
    adminController.middlewareAdminController,
    adminController.register
  ); // get info account
  router.post(
    "/admin/manager/settings/get",
    adminController.middlewareAdminController,
    adminController.settingGet
  ); // get info account
  router.post(
    "/admin/manager/createBonus",
    adminController.middlewareAdminController,
    adminController.createBonus
  ); // get info account

  router.post(
    "/admin/member/listRecharge/:phone",
    adminController.middlewareAdminController,
    adminController.listRechargeMem
  );
  router.post(
    "/admin/member/listWithdraw/:phone",
    adminController.middlewareAdminController,
    adminController.listWithdrawMem
  );
  router.post(
    "/admin/member/redenvelope/:phone",
    adminController.middlewareAdminController,
    adminController.listRedenvelope
  );
  router.post(
    "/admin/member/bet/:phone",
    adminController.middlewareAdminController,
    adminController.listBet
  );

  router.get(
    "/admin/manager/export/todayrecharge",
    adminController.middlewareAdminController,
    adminController.todayrechargeexport
  ); // get info account
  router.get(
    "/admin/manager/recharge",
    adminController.middlewareAdminController,
    adminController.rechargePage
  ); // get info account
  router.get(
    "/admin/manager/allrecharge",
    adminController.middlewareAdminController,
    adminController.rechargeAllPage
  ); // get info account
  router.get(
    "/admin/manager/successrecharge",
    adminController.middlewareAdminController,
    adminController.rechargeSuccessPage
  ); // get info account
  
    router.get(
    "/admin/manager/failedrecharge",
    adminController.middlewareAdminController,
    adminController.rechargeFailedPage
  ); // get info account
  
  
  router.get(
    "/admin/manager/pandingrecharge",
    adminController.middlewareAdminController,
    adminController.rechargePandingPage
  ); // get info account
  router.get(
    "/admin/manager/failrecharge",
    adminController.middlewareAdminController,
    adminController.rechargeFailPage
  ); // get info account
  
    router.get(
    "/admin/manager/withdrawfailed",
    adminController.middlewareAdminController,
    adminController.withdrawFailPage
  ); // get info account

  router.get(
    "/admin/manager/withdraw",
    adminController.middlewareAdminController,
    adminController.withdraw
  ); // get info account
  // router.get('/admin/manager/level', adminController.middlewareAdminController, adminController.level); // get info account
  router.get(
    "/admin/manager/levelSetting",
    adminController.middlewareAdminController,
    adminController.levelSetting
  );
  router.get(
    "/admin/manager/CreatedSalaryRecord",
    adminController.middlewareAdminController,
    adminController.CreatedSalaryRecord
  );
  router.get(
    "/admin/manager/rechargeRecord",
    adminController.middlewareAdminController,
    adminController.rechargeRecord
  ); // get info account
  router.get(
    "/admin/manager/withdrawRecord",
    adminController.middlewareAdminController,
    adminController.withdrawRecord
  ); // get info account
  router.get(
    "/admin/manager/statistical",
    adminController.middlewareAdminController,
    adminController.statistical
  ); // get info account
  router.get(
    "/admin/member/info/:id",
    adminController.middlewareAdminController,
    adminController.infoMember
  );
  router.get(
    "/api/webapi/admin/getLevelInfo",
    adminController.middlewareAdminController,
    adminController.getLevelInfo
  );
  router.get(
    "/api/webapi/admin/getSalary",
    adminController.middlewareAdminController,
    adminController.getSalary
  );

  router.post(
    "/admin/member/editbank",
    adminController.middlewareAdminController,
    adminController.editbank
  );
  router.post(
    "/api/webapi/admin/updateLevel",
    adminController.middlewareAdminController,
    adminController.updateLevel
  ); // get info account
  router.post(
    "/api/webapi/admin/CreatedSalary",
    adminController.middlewareAdminController,
    adminController.CreatedSalary
  ); // get info account

  router.get(
    "/api/webapi/getweeldetails",
     middlewareController,
    userController.redeemSpin
  );

  router.post(
    "/api/webapi/admin/listMember",
    adminController.middlewareAdminController,
    adminController.listMember
  ); // get info account
  router.post(
    "/api/webapi/admin/listctv",
    adminController.middlewareAdminController,
    adminController.listCTV
  ); // get info account
  router.post(
    "/api/webapi/admin/withdraw",
    adminController.middlewareAdminController,
    adminController.handlWithdraw
  ); // get info account
  
   router.post(
    "/api/handlWithdrawCallback",
    adminController.handlWithdrawCallback 
  );
  
  
  
  router.post(
    "/api/webapi/admin/recharge",
    adminController.middlewareAdminController,
    adminController.recharge
  ); // get info account
  
  router.post(
    "/api/webapi/admin/rechargeDuyet",
    adminController.middlewareAdminController,
    adminController.rechargeDuyet
  ); // get info account
  
  router.post(
    "/api/webapi/admin/spinset",
    adminController.middlewareAdminController,
    adminController.spinset
  ); // get info account
  
  router.post(
    "/api/webapi/admin/member/info",
    adminController.middlewareAdminController,
    adminController.userInfo
  ); // get info account
  router.post(
    "/api/webapi/admin/statistical",
    // adminController.middlewareAdminController,
    adminController.statistical2
  ); // get info account

  router.post(
    "/api/webapi/admin/banned",
    adminController.middlewareAdminController,
    adminController.banned
  ); // get info account
  
    router.post(
    "/api/webapi/admin/eliga-unblock",
    adminController.middlewareAdminController,
    adminController.eligaUnblockUser
  ); // get info account
  
  router.post(
    "/api/webapi/unblockLigaltrade",
    adminController.middlewareAdminController,
    adminController.unblockLigaltrade
  );
  
  
  
  
  router.post(
    "/api/webapi/admin/turnover",
    adminController.middlewareAdminController,
    adminController.turnover_report
  ); // get info account
  router.post(
    "/api/webapi/admin/betting",
    adminController.middlewareAdminController,
    adminController.betting_report
  ); // get info account
  router.post(
    "/api/webapi/admin/todayreport",
    adminController.middlewareAdminController,
    adminController.today_report
  ); // get info account

  router.post(
    "/api/webapi/admin/racing/totalJoin",
    adminController.middlewareAdminController,
    adminController.totalJoinRacing
  ); // get info account
  
  
  router.post(
    "/api/webapi/admin/change",
    adminController.middlewareAdminController,
    adminController.changeAdmin
  ); // get info account
  
    router.post(
    "/api/webapi/admin/racing/change",
    adminController.middlewareAdminController,
    adminController.changeAdminRacing
  ); // get info account
  
  
  router.post(
    "/api/webapi/admin/profileUser",
    adminController.middlewareAdminController,
    adminController.profileUser
  ); // get info account

  // admin 5d
  router.post(
    "/api/webapi/admin/5d/listOrders",
    adminController.middlewareAdminController,
    adminController.listOrderOld
  ); // get info account
  router.post(
    "/api/webapi/admin/k3/listOrders",
    adminController.middlewareAdminController,
    adminController.listOrderOldK3
  ); // get info account
  router.post(
    "/api/webapi/admin/5d/editResult",
    adminController.middlewareAdminController,
    adminController.editResult
  ); // get info account
  router.post(
    "/api/webapi/admin/k3/editResult",
    adminController.middlewareAdminController,
    adminController.editResult2
  ); // get info account
  // my admin code
  router.get(
    "/admin/manager/notification",
    adminController.middlewareAdminController,
    adminController.notificationPage
  ); // get info account
  router.post(
    "/api/webapi/admin/create-notification",
    adminController.middlewareAdminController,
    adminController.createNotification
  ); // get info account
  router.post(
    "/api/webapi/admin/delete-notification/:id",
    adminController.middlewareAdminController,
    adminController.singleNotificationDelete
  ); // get info account

  router.get(
    "/api/webapi/GetTopBettingboardGame/:app_id",
    middlewareController,
    bettingController.boardGame
  );
  router.get("/api/webapi/jilihistory/:account", jilliController.gamehistory);
  // router.get('/api/webapi/GetJilliboardGame/:gameId', middlewareController, jilliController.boardGame);
  // router.get('/api/webapi/getboardGameInfo', middlewareController, jilliController.getboardGameInfo);
  // router.get('/api/webapi/transferMoneyToMainWallet', middlewareController, jilliController.transferMoneyToMainWallet);

  router.get(
    "/api/webapi/GetJilliboardGame/:gameId",
    middlewareController,
    jilliController.jillistart
  );
  router.get(
    "/api/webapi/getboardGameInfo",
    middlewareController,
    jilliController.jillimoney
  );
  router.get(
    "/api/webapi/transferMoneyToMainWallet",
    middlewareController,
    jilliController.jillitransfermoney
  );
  
    router.get(
    "/api/webapi/demoUser",
    adminController.middlewareAdminController,
    adminController.demoUser
  );
    router.post(
    "/api/webapi/convertAgent",
    adminController.middlewareAdminController,
    adminController.convertAgent
  );
  
  
//   pages
 router.get(
    "/admin/manager/deposite",
    adminController.middlewareAdminController,
    adminController.depositePage
  );
  router.get(
    "/admin/manager/withdrawal",
    adminController.middlewareAdminController,
    adminController.withdrawalPage
  );

  router.get(
    "/admin/manager/changeloginid",
    adminController.middlewareAdminController,
    adminController.changeloginIdPass
  );
  router.get(
    "/admin/manager/modifyBankInfo",
    adminController.middlewareAdminController,
    adminController.modifyBankInfo
  );
  router.get(
    "/admin/manager/usdtAddress",
    adminController.middlewareAdminController,
    adminController.usdtaddress
  );
  router.get(
    "/admin/manager/activityBonus",
    adminController.middlewareAdminController,
    adminController.activityBonus
  );

  router.get(
    "/admin/manager/gameproblems",
    adminController.middlewareAdminController,
    adminController.gameProblems
  );

   
// suport system  
   router.get("/api/recharge/:auth",getRecharge);
router.get("/api/withdrawl2/:auth",getwithdrawl2);

  
  
  
  router.post("/api/deposit" ,depositNotReceived ) ;
  
  router.post("/api/ifsc" , ifscModification );
  
  router.post("/api/bankName" , bankName)
  
  router.post("/api/modification",bankModification);
  
  router.post("/api/usdt", addUSDTAddress);
  
  router.post("/api/bonus" ,  addBonus);
  
  router.post("/api/problem", addProblem);
  
  router.post("/api/sendotp", sendOtp);
  
  router.post("/api/updatepassword", updatePassword )
  
  router.post("/api/password", updatePassword2)
  
  
  //get details api
  router.get("/api/webapi/getdetails", getDepositNotReceived ); //
 router.get("/api/webapi/usdtdetails",getUsdtAddress)



  router.get("/api/webapi/modificationdetails",getifscModification);
  router.get("/api/webapi/userbankdetails",getUserBank);



  router.get("/api/webapi/bankdetails",getBankModification);//
  router.get("/api/webapi/bonusdetails",bonusDetails); //
  router.get("/api/webapi/problemsdetails" ,problemsDetails);//
  router.get("/api/webapi/withproblem",getwithdrawlProblems);

router.post("/api/withdrawlproblem" ,withdrawlProblems)


  //Admin 
 router.post("/api/webapi/status/:status/:id" ,depositAcceptOrReject);

router.post("/api/webapi/bankstatus/:status/:id",modifyBankAcceptorReject);


router.post("/api/webapi/addressstatus/:status/:id",addressAcceptOrReject);

router.post("/api/webapi/bonusstatus/:status/:id",bonusAcceptOrReject);

router.post("/api/webapi/problemsstatus/:status/:id",problemAcceptOrReject);

router.post("/api/webapi/withprob/:status/:id",withdrawlProblemsAcceptOrReject);



// 🧠 History filter route
router.post(
  "/api/webapi/historyfilter",
  middlewareController, // middleware if required
  userController.getHistoryFilter
);



  return app.use("/", router);
};

module.exports = {
  initWebRouter,
};
