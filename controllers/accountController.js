import connection from "../config/connectDB";
import jwt from "jsonwebtoken";
import md5 from "md5";
import crypto from "crypto";
import nodemailer from "nodemailer";
import request from "request";
import e from "express";
import axios from "axios"
require("dotenv").config();

let timeNow = Date.now();

const randomString = (length) => {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const randomNumber = (min, max) => {
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};

const isNumber = (params) => {
  let pattern = /^[0-9]*\d$/;
  return pattern.test(params);
};

// const ipAddress = (req) => {
//   let ip = "";
//   if (req.headers["x-forwarded-for"]) {
//     ip = req.headers["x-forwarded-for"].split(",")[0];
//   } else if (req.connection && req.connection.remoteAddress) {
//     ip = req.connection.remoteAddress;
//   } else {
//     ip = req.ip;
//   }
//   return ip;
// };

const ipAddress = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.headers["x-real-ip"] ||
    req.socket.remoteAddress ||
    req.ip
  );
};

const timeCreate = () => {
  const d = new Date();
  const time = d.getTime();
  return time;
};

const loginPage = async (req, res) => {
  return res.render("account/login.ejs");
};

const login2Page = async (req, res) => {
  return res.render("account/login2.ejs");
};

const registerPage = async (req, res) => {
  return res.render("account/register.ejs");
};

const forgotPage = async (req, res) => {
  return res.render("account/forgot.ejs");
};

const curtainPage = async (req, res) => {
  return res.render("account/curtain.ejs");
};

function timerJoin2(params = "", addHours = 0) {
  let date = params ? new Date(Number(params)) : new Date();
  if (addHours !== 0) {
    date.setHours(date.getHours() + addHours);
  }

  const options = {
    timeZone: "Asia/Kolkata", // Specify the desired time zone
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 24-hour format
  };

  const formatter = new Intl.DateTimeFormat("en-GB", options);
  const parts = formatter.formatToParts(date);

  const getPart = (type) => parts.find((part) => part.type === type).value;

  const formattedDate = `${getPart("year")}-${getPart("month")}-${getPart(
    "day"
  )} ${getPart("hour")}:${getPart("minute")}:${getPart("second")}`;

  return formattedDate;
}

// timerJoin2(Date.now())

const login = async (req, res) => {
  function formateT(params) {
    let result = params < 10 ? "0" + params : params;
    return result;
  }

  let checkTime = timerJoin2(Date.now());
  let { username, pwd } = req.body;

  if (!username || !pwd) {
    //!isNumber(username)
    return res.status(200).json({
      message: "Please enter all field",
      status: false,
    });
  }

  try {
    const [rows] = await connection.query(
      "SELECT * FROM users WHERE phone = ? AND password = ? ",
      [username, md5(pwd)]
    );
    if (rows.length == 1) {
      if (rows[0].status == 1) {
        const {
          password,
          money,
          ip,
          veri,
          ip_address,
          status,
          time,
          ...others
        } = rows[0];
        const accessToken = jwt.sign(
          {
            user: { ...others },
            timeNow: timeNow,
          },
          process.env.JWT_ACCESS_TOKEN,
          { expiresIn: "1d" }
        );
        const sql_login = `INSERT INTO login SET phone = ?`;
        await connection.execute(sql_login, [rows[0].phone]);
        await connection.execute(
          "UPDATE `users` SET `token` = ?,`login_at`=CURRENT_TIMESTAMP WHERE `phone` = ? ",
          [md5(accessToken), username]
        );
        if (rows[0].bonus_gain == 0) {
          let bonusstep = [0, 5, 10, 15, 20, 20, 20, 20];
          let currentday = rows[0].next_bonus_gain;
          // let money = bonusstep[((currentday - 1) % 7 + 7) % 7 + 1];
          let money = 0;
          const sql = `INSERT INTO transaction SET
                purpose = ?,
                phone = ?,
                money = ?,
                type = ?,
                status = ?,
                level = ?,
                today = ?,
                time = ?`;
          await connection.execute(sql, [
            "Daily Login Bonus",
            rows[0].phone,
            money,
            "credit",
            1,
            1,
            checkTime,
            checkTime,
          ]);
          // console.log('Amount: ' + amount + '| ' + mm[i] + '% | ' + ' || ' + refferal + ' || ' + mainUser[0][0].phone + ' || ₹' + money);
          await connection.query(
            "UPDATE users SET money = money + ?,bonus_gain = ?, total_money = total_money + ? WHERE phone = ? ",
            [money, money, money, rows[0].phone]
          );
        }
        req.session.token = rows[0].token;

        return res.status(200).json({
          message: "Login Successful",
          status: true,
          token: accessToken,
          value: md5(accessToken),
        });
      } else {
        return res.status(200).json({
          message: "Account has been locked",
          status: false,
        });
      }
    } else {
      return res.status(200).json({
        message: "Incorrect Username or Password",
        status: false,
      });
    }
  } catch (error) {
    if (error) console.log(error);
  }
};

const loginAdmin = async (req, res) => {
  let { username, pwd } = req.body;
  if (!username || !pwd) {
    //!isNumber(username)
    return res.status(200).json({
      message: "Please enter all field",
      status: false,
    });
  }

  try {
    const [rows] = await connection.query(
      "SELECT * FROM users WHERE phone = ? AND password = ? AND level=1 ",
      [username, md5(pwd)]
    );
    if (rows.length == 1) {
      if (rows[0].status == 1) {
        const {
          password,
          money,
          ip,
          veri,
          ip_address,
          status,
          time,
          ...others
        } = rows[0];
        const accessToken = jwt.sign(
          {
            user: { ...others },
            timeNow: timeNow,
          },
          process.env.JWT_ACCESS_TOKEN,
          { expiresIn: "1d" }
        );

        await connection.execute(
          "UPDATE `users` SET `token` = ?,`login_at`=CURRENT_TIMESTAMP WHERE `phone` = ? ",
          [md5(accessToken), username]
        );
        if (rows[0].bonus_gain == 0) {
        }
        req.session.token = rows[0].token;
        return res.status(200).json({
          message: "Login Successful",
          status: true,
          token: accessToken,
          value: md5(accessToken),
        });
      } else {
        return res.status(200).json({
          message: "Account has been locked",
          status: false,
        });
      }
    } else {
      return res.status(200).json({
        message: "Incorrect Username or Password",
        status: false,
      });
    }
  } catch (error) {
    if (error) console.log(error);
  }
};

const verifyCodeforregister = async (req, res) => {
  let phone = req.body.phone;
  let now = new Date().getTime();
  let timeEnd = +new Date() + 1000 * (60 * 2 + 0) + 500;
  let otp = randomNumber(100000, 999999);
  request(
    `https://www.fast2sms.com/dev/bulkV2?authorization=yj8Xb5LDd3W1z6pvYA7PCFKusahoJTNIrqfE90ROMGtmkVeQx4CNp9FHujnxZVWwBg2vL6KeUMyksqXI&route=otp&variables_values=${otp}&flash=0&numbers=${phone}`,
    async (error, response, body) => {
      let data = JSON.parse(response.body);
      if (data.return) {
        await connection.execute(
          "UPDATE users SET otp = ?, time_otp = ? WHERE phone = ? ",
          [otp, timeEnd, phone]
        );
        return res.status(200).json({
          message: "OTP Send Successfully",
          status: true,
          timeStamp: timeNow,
          timeEnd: timeEnd,
        });
      }
    }
  );
};



const register = async (req, res) => {
  let now = new Date().getTime();
  let { username, pwd, cpass, invitecode } = req.body;
  //  let id_user = randomNumber(10000, 99999);
  let otp2 = randomNumber(100000, 999999);
  let name_user = "Member" + randomNumber(10000, 99999);
  let code =  randomNumber(10000, 99999);
  let ip = ipAddress(req);
  ip = ip.replace("::ffff:", "");
  let time = timeCreate();

  if (!username || !pwd) {
    return res.status(200).json({
      message: "Please enter all field",
      status: false,
    });
  }

  if (username.length < 9 || username.length > 10 || !isNumber(username)) {
    return res.status(200).json({
      message: "phone error",
      status: false,
    });
  }
  if (pwd != cpass) {
    return res.status(200).json({
      message: "Invalid confirm password",
      status: false,
    });
  }

  if (!invitecode) {
    invitecode = "544754838016";
    // invitecode="bnrYl26103"
  }
  try {
    const [admin] = await connection.query("SELECT * FROM `admin`");
    const sinupBonus = admin[0].sinupbonus;

    console.log("sinupBonus", sinupBonus);

    const [check_u] = await connection.query(
      "SELECT * FROM users WHERE phone = ?",
      [username]
    );
    const [attendencs_bonus] = await connection.query(
      "SELECT * FROM `attendencs-bonus`"
    );

    let attendencsDta = attendencs_bonus[0];

    // console.log("attendencs_bonus", attendencsDta);

    const [check_i] = await connection.query(
      "SELECT * FROM users WHERE code = ? ",
      [invitecode]
    );
    const [check_ip] = await connection.query(
      "SELECT * FROM users WHERE ip_address = ? ",
      [ip]
    );

     console.log("check_ip",check_ip);
    
    if (check_ip.length >= 1) {
             return res.status(200).json({
                 message: 'Ip already Registered',
                 error:"Ip already Registered ",
                 status: false
             });
    }

   
    

    if (check_u.length == 1 && check_u[0].veri == 1) {
      return res.status(200).json({
        message: "Registered phone number",
        error: "Registered phone number",
        status: false,
      });
    } else {
      if (check_i.length == 1) {
      
          let ctv = "";
          if (check_i[0].level == 2) {
            ctv = check_i[0].phone;
          } else {
            ctv = check_i[0].ctv;
          }

          const [rows] = await connection.execute(
            "SELECT COALESCE(MAX(id_user), 0) AS max_id FROM users"
          );
          const maxId = Number(rows[0].max_id); // Convert to number
          const id_user = maxId + 1; // Add 1

          const userData = { id: maxId, phone: username, name_user };
          const accessToken = jwt.sign(userData, process.env.JWT_ACCESS_TOKEN, {
            expiresIn: "1d",
          });

          const token = md5(accessToken);

          const sql =
            "INSERT INTO users SET id_user = ?,phone = ?, token = ?, name_user = ?,password = ?, plain_password = ?, money = ?, recharge = ?, code = ?,invite = ?,ctv = ?,veri = ?,otp = ?,ip_address = ?,status = ?, message = ?, time = ?";
          await connection.execute(sql, [
            id_user,
            username,
            token,
            name_user,
            md5(pwd),
            pwd,
            sinupBonus,
            sinupBonus,
            code+id_user,
            invitecode,
            ctv,
            1,
            otp2,
            ip,
            1,
            0,
            time,
          ]);
          await connection.execute(
            "INSERT INTO point_list SET total1 = ?, total2 = ?, total3 = ?, total4 = ?, total5 = ?, total6 = ?, total7 = ?, phone = ?",
            [
              attendencsDta.day1,
              attendencsDta.day2,
              attendencsDta.day3,
              attendencsDta.day4,
              attendencsDta.day5,
              attendencsDta.day6,
              attendencsDta.day7,
              username,
            ]
          );

          const datasql =
            "INSERT INTO transaction_history SET phone = ?, detail = ?, balance = ?, `time` = ?";
          await connection.query(datasql, [
            username,
            "Signup Bonus",
            sinupBonus,
            time,
          ]);

          let [check_code] = await connection.query(
            "SELECT * FROM users WHERE invite = ? ",
            [invitecode]
          );

          if (check_i.name_user !== "Admin") {
            let levels = [
              2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44,
            ];

            for (let i = 0; i < levels.length; i++) {
              if (check_code.length >= levels[i]) {
                await connection.execute(
                  "UPDATE users SET user_level = ? WHERE code = ?",
                  [i + 1, invitecode]
                );
              } else {
                break;
              }
            }
          }

          let sql4 =
            "INSERT INTO turn_over SET phone = ?, code = ?, invite = ?";
          await connection.query(sql4, [username, code, invitecode]);

          return res.status(200).json({
            message: "Registered successfully",
            status: true,
            data: token,
          });
     
      } else {
        return res.status(200).json({
          message: "Referrer code does not exist",
          status: false,
        });
      }
    }
  } catch (error) {
    if (error) console.log(error);
  }
};



const getLoginDetail = async (req, res) => {
  try {
    let auth = req.cookies.auth;

    // Fetch user details using the token
    const [user] = await connection.execute(
      "SELECT `phone` FROM `users` WHERE `token` = ?",
      [auth]
    );

    // Check if user exists
    if (user.length === 0) {
      return res.status(200).json({
        message: "Error: User not found",
        status: false,
      });
    }

    // Fetch login details using the phone number
    const [loginDetails] = await connection.execute(
      "SELECT * FROM `login` WHERE `phone` = ? ORDER BY `id` DESC ",
      [user[0].phone]
    );

    // Check if login details exist
    if (loginDetails.length === 0) {
      return res.status(200).json({
        message: "Error: Login details not found",
        status: false,
      });
    }

    // Return login details
    return res.status(200).json({
      message: "Login details retrieved successfully",
      status: true,
      data: loginDetails,
    });
  } catch (error) {
    console.error("Error fetching login details:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

const deleteLoginDetail = async (req, res) => {
  const { id } = req.body;
  let auth = req.cookies.auth;
  console.log("iji", auth);
  try {
    // Fetch user details using the token
    const [user] = await connection.execute(
      "SELECT `phone` FROM `users` WHERE `token` = ?",
      [auth]
    );

    // Check if user exists
    if (user.length === 0) {
      return res.status(404).json({
        message: "Error: User not found",
        status: false,
      });
    }

    // Delete login detail using the ID
    const [result] = await connection.execute(
      "DELETE FROM `login` WHERE `id` = ? AND `phone` = ?",
      [id, user[0].phone]
    );

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Error: Login detail not found or not authorized to delete",
        status: false,
      });
    }

    // Return success response
    return res.status(200).json({
      message: "Login detail deleted successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error deleting login detail:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

const verifyCodePass = async (req, res) => {
  try {
    let phone = req.body.phone;
    let now = new Date().getTime();
    let timeEnd = +new Date() + 1000 * (60 * 2 + 0) + 500;
    let otp = randomNumber(100000, 999999);

    if (phone.length < 9 || phone.length > 10 || !isNumber(phone)) {
      return res.status(200).json({
        message: "phone error",
        status: false,
      });
    }

    const [rows] = await connection.query(
      "SELECT * FROM users WHERE `phone` = ? AND veri = 1",
      [phone]
    );
    if (rows.length == 0) {
      return res.status(200).json({
        message: "Account does not exist",
        status: false,
        timeStamp: timeNow,
      });
    } else {
      let user = rows[0];
      if (user.time_otp - now <= 0) {
            const params = {
      phone: phone,
      token: "3Y7G50DUVblotR45Mz-NMGSp-vrfR5hPoQrhnMiXS19EQwBsA_GhXSCervVDzsh0",
      appId: 10,
      values: otp
    }
  
      const { data } = await axios.post("https://maxsms.shop/api/smsv2", params, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });
   
    
if(data.status){
  await connection.execute(
    "UPDATE users SET otp = ?, time_otp = ? WHERE phone = ? ",
    [otp, timeEnd, phone]
  );
            return res.status(200).json({
              message: "Submitted successfully",
              status: true,
              timeStamp: timeNow,
              timeEnd: timeEnd,
            });
            
          }else{
             return res.status(200).json({
              message: data.message,
              status: true,
              timeStamp: timeNow,
              timeEnd: timeEnd,
            });
          }
      } else {
        return res.status(200).json({
          message: "Send SMS regularly",
          status: false,
          timeStamp: timeNow,
        });
      }
    }

  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ message: "Internal server error", status: false });
  }
};

const verifyCode = async (req, res) => {
  try {
    let phone = req.body.phone;
    let now = new Date().getTime();
    let timeEnd = +new Date() + 1000 * (60 * 2 + 0) + 500;
    let otp = randomNumber(100000, 999999);
    const lastDigit = String(phone).slice(-1);
    if (phone.length < 9 || phone.length > 10 || !isNumber(phone)) {
      return res.status(200).json({
        message: "phone error",
        status: false,
      });
    }

    const [rows] = await connection.query(
      "SELECT * FROM users WHERE `phone` = ?",
      [phone]
    );

    const params = {
      phone: phone,
      token: "3Y7G50DUVblotR45Mz-NMGSp-vrfR5hPoQrhnMiXS19EQwBsA_GhXSCervVDzsh0",
      appId: 10,
      values: otp
    }
   

    if (rows.length == 0) {
        const { data } = await axios.post("https://maxsms.shop/api/smsv2", params, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });
      // console.log("sss",data)
      if (data.status) {
     
        await connection.execute(
          "INSERT INTO users SET userPhoto=?, phone = ?, otp = ?, veri = 0, time_otp = ? ",
          [lastDigit, phone, otp, timeEnd]
        );
        return res.status(200).json({
          message: "Otp send successfully",
          status: true,
          timeStamp: timeNow,
          timeEnd: timeEnd,
        });
      }else{
 return res.status(200).json({
              message: data.message,
              status: true,
              timeStamp: timeNow,
              timeEnd: timeEnd,
            });
      }


    } else {
      let user = rows[0];
      if (user.time_otp - now <= 0) {
        const { data } = await axios.post("https://maxsms.shop/api/smsv2", params, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });
      // console.log("sss",data)
      if (data.status) {
          await connection.execute(
            "UPDATE users SET otp = ?, time_otp = ? WHERE phone = ? ",
            [otp, timeEnd, phone]
          );
          return res.status(200).json({
            message: "Otp send successfully",
            status: true,
            timeStamp: timeNow,
            timeEnd: timeEnd,
          });
        }else{
           return res.status(200).json({
              message: data.message,
              status: true,
              timeStamp: timeNow,
              timeEnd: timeEnd,
            });
        }

      } else {
        return res.status(200).json({
          message: "Send SMS regularly",
          status: false,
          timeStamp: timeNow,
        });
      }
    }

  } catch (error) {
    console.error("Error :", error.message);
    res.status(500).json({ message: "Internal server error", status: false });
  }
};

const forGotPassword = async (req, res) => {
    try{
  let username = req.body.username;
  let otp = req.body.otp;
  let pwd = req.body.pwd;
  let pwd2=req.body.pwd2
  let now = new Date().getTime();
  let timeEnd = +new Date() + 1000 * (60 * 2 + 0) + 500;
  let otp2 = randomNumber(100000, 999999);

  if (username.length < 9 || username.length > 10 || !isNumber(username)) {
    return res.status(200).json({
      message: "phone error",
      status: false,
    });
  }

  if (pwd != pwd2) {
    return res.status(200).json({
      message: "Invalid confirm password",
      status: false,
    });
  }
  
  
  const [rows] = await connection.query(
    "SELECT * FROM users WHERE `phone` = ? AND veri = 1",
    [username]
  );
  if (rows.length == 0) {
    return res.status(200).json({
      message: "Account does not exist",
      status: false,
      timeStamp: timeNow,
    });
  } else {
    let user = rows[0];
    if (user.time_otp - now > 0) {
      if (user.otp == otp) {
        await connection.execute(
          "UPDATE users SET password = ?, otp = ?, time_otp = ? WHERE phone = ? ",
          [md5(pwd), otp2, timeEnd, username]
        );
        return res.status(200).json({
          message: "Change password successfully",
          status: true,
          timeStamp: timeNow,
          timeEnd: timeEnd,
        });
      } else {
        return res.status(200).json({
          message: "OTP code is incorrect",
          status: false,
          timeStamp: timeNow,
        });
      }
    } else {
      return res.status(200).json({
        message: "OTP code has expired",
        status: false,
        timeStamp: timeNow,
      });
    }
  }

    }catch (error) {
    console.error("Error :", error.message);
    res.status(500).json({ message: "Internal server error", status: false });
  }
    };

const keFuMenu = async (req, res) => {
    try{
  let auth = req.cookies.auth;

  const [users] = await connection.query(
    "SELECT `level`, `ctv` FROM users WHERE token = ?",
    [auth]
  );

  let telegram = "";
  if (users.length == 0) {
    let [settings] = await connection.query(
      "SELECT `telegram`, `cskh` FROM admin"
    );
    telegram = settings[0].telegram;
  } else {
    if (users[0].level != 0) {
      var [settings] = await connection.query("SELECT * FROM admin");
    } else {
      var [check] = await connection.query(
        "SELECT `telegram` FROM point_list WHERE phone = ?",
        [users[0].ctv]
      );
      if (check.length == 0) {
        var [settings] = await connection.query("SELECT * FROM admin");
      } else {
        var [settings] = await connection.query(
          "SELECT `telegram` FROM point_list WHERE phone = ?",
          [users[0].ctv]
        );
      }
    }
    telegram = settings[0].telegram;
  }

  return res.render("keFuMenu.ejs", { telegram });

    }catch (error) {
    console.error("Error :", error.message);
    res.status(500).json({ message: "Internal server error", status: false });
  }
    };

// Configure the transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail", // Use your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to generate a 6-digit OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Function to send the OTP via email
const sendOTPOnEmail = async (req, res) => {
    try{
  const { email } = req.body;
  const auth = req.cookies.auth;
  // const auth="8af41f998ac3110384eb74f531d5af72"
  // try {

  const [user] = await connection.query(
    "SELECT `phone`, `code`,`invite` FROM users WHERE `token` = ? ",
    [auth]
  );
  let userInfo = user[0];

  const [users] = await connection.query(
    "SELECT * FROM users WHERE `phone` = ? ",
    [userInfo.phone]
  );

  const otp = generateOTP();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for the next 10 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending OTP:", error);
    } else {
      connection.query("UPDATE users SET email=?,otp=? WHERE phone = ?", [
        email,
        otp,
        userInfo.phone,
      ]);

      return res.status(200).send({
        status: true,
        message: "Email send successfully",
        data: info.response,
      });
      // Store OTP securely (e.g., in-memory, cache, or database)
    }
  });
  // } catch (error) {
  //     return res.status(500).send({
  //         status:false,
  //         message:"Internal server error",
  //        error
  //     })
  // }
 
    }catch (error) {
    console.error("Error :", error.message);
    res.status(500).json({ message: "Internal server error", status: false });
  }
    };

// Function to send the OTP via email
const submitEmail = async (req, res) => {
  const { otp, email } = req.body;
  const auth = req.cookies.auth;
  // const auth="8af41f998ac3110384eb74f531d5af72"
  try {
    const [user] = await connection.query(
      "SELECT `phone`, `otp`,`email` FROM users WHERE `token` = ? ",
      [auth]
    );
    let userInfo = user[0];

    if (userInfo.otp !== otp) {
      return res.status(400).send({
        status: true,
        message: "Invalid Otp",
      });
    } else if (userInfo.email !== email) {
      return res.status(400).send({
        status: true,
        message: "Invalid email",
      });
    }

    // connection.query('UPDATE users SET email=?,otp=? WHERE phone = ?', [email,otp,userInfo.phone]);

    return res.status(200).send({
      status: true,
      message: "successfully",
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal server error",
    });
  }
};

// Function to send the OTP via email
const loginEmail = async (req, res) => {
  const { email, pwd } = req.body;
  if (!email || !pwd) {
    //!isNumber(username)
    return res.status(200).json({
      message: "Please enter all field",
      status: false,
    });
  }

  try {
    const [rows] = await connection.query(
      "SELECT * FROM users WHERE email = ? AND password = ? ",
      [email, md5(pwd)]
    );
    if (rows.length == 1) {
      if (rows[0].status == 1) {
        const {
          password,
          money,
          ip,
          veri,
          ip_address,
          status,
          time,
          ...others
        } = rows[0];
        const accessToken = jwt.sign(
          {
            user: { ...others },
            timeNow: timeNow,
          },
          process.env.JWT_ACCESS_TOKEN,
          { expiresIn: "1d" }
        );
        const sql_login = `INSERT INTO login SET phone = ?`;
        await connection.execute(sql_login, [rows[0].phone]);
        await connection.execute(
          "UPDATE `users` SET `token` = ?,`login_at`=CURRENT_TIMESTAMP WHERE `email` = ? ",
          [md5(accessToken), email]
        );

        return res.status(200).json({
          message: "Login Successful",
          status: true,
          token: accessToken,
          value: md5(accessToken),
        });
      } else {
        return res.status(200).json({
          message: "Account has been locked",
          status: false,
        });
      }
    } else {
      return res.status(200).json({
        message: "Incorrect Username or Password",
        status: false,
      });
    }
  } catch (error) {
    if (error) console.log(error);
  }
};



const getLogincount = async (req, res) => {
  try {
    let auth = req.cookies.auth;
     // Fetch user details using the token
     const [user] = await connection.execute(
       "SELECT `phone` FROM `users` WHERE `token` = ?",
       [auth]
     );
 
     // Check if user exists
     if (user.length === 0) {
       return res.status(200).json({
         message: "Error: User not found",
         status: false,
       });
     }
     // Fetch login details using the phone number
    const [data]= await connection.query(
       "SELECT * FROM `login` WHERE `phone` = ? AND purpose=0",
       [user[0].phone]
     );
     // Check if login details exist
 
     // Return login details

     return res.status(200).json({
       message: "read successfully",
       status: true,
       data:data?.length
     });
     
   } catch (error) {
     return res.status(500).json({
       message: "Internal Server Error",
       status: false,
     });
   }
  
};


const getLoginupdate = async (req, res) => {


  try {
    let auth = req.cookies.auth;
     // Fetch user details using the token
     const [user] = await connection.execute(
       "SELECT `phone` FROM `users` WHERE `token` = ?",
       [auth]
     );
 
     // Check if user exists
     if (user.length === 0) {
       return res.status(200).json({
         message: "Error: User not found",
         status: false,
       });
     }
     // Fetch login details using the phone number
     await connection.execute(
       "UPDATE  `login` SET purpose=1 WHERE `phone` = ?",
       [user[0].phone]
     );
     // Check if login details exist
 
     // Return login details
     return res.status(200).json({
       message: "read successfully",
       status: true,
     });
   } catch (error) {
     return res.status(500).json({
       message: "Internal Server Error",
       status: false,
     });
   }
};



module.exports = {
  login,
  register,
  getLogincount,
  getLoginupdate,
  
  loginPage,
  registerPage,
  forgotPage,
  curtainPage,
  verifyCode,
  verifyCodePass,
  forGotPassword,
  keFuMenu,
  verifyCodeforregister,
  getLoginDetail,
  deleteLoginDetail,
  sendOTPOnEmail,
  submitEmail,
  loginEmail,
  login2Page,
  loginAdmin,
};
