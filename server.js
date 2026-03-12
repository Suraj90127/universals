import "dotenv/config";
import express from "express";
import connection from "./config/connectDB";
import configViewEngine from "./config/configEngine";
import winGoController from "./controllers/winGoController";
import k5Controller from "./controllers/k5Controller";
import k3Controller from "./controllers/k3Controller";
import routes from "./routes/web";
import cronJobContronler from "./controllers/cronJobContronler";
import socketIoController from "./controllers/socketIoController";
import carController from "./controllers/carController";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import { fileURLToPath } from "url";
import axios from "axios";
import http from "http";
import fs from "fs";
import { Server } from "socket.io";
const v8 = require("v8");
// console.log(
//   "Heap size limit:",
//   v8.getHeapStatistics().heap_size_limit / 1024 / 1024,
//   "MB"
// );

const fileUpload = require("express-fileupload");

require("./instrument.js");
const cookieParser = require("cookie-parser");
const app = express();
const server = http.createServer(app);
const logFilePath = path.join(__dirname, "server.log");

const corsdata = [
  "https://universals.pro",
  "/",
  "http://localhost:3000",
  "https://bot.universals.pro",
  "https://h5.workorder.support.universals.pro",
  "http://localhost:5173"
];

// Socket IO setup with CORS
const io = new Server(server, {
  cors: {
    origin: corsdata, // Adjust to your actual client if needed
    // origin: "/", // Adjust to your actual client if needed
    methods: ["GET", "POST"],
  },
});

// Log when a client connects or disconnects
io.on("connection", (socket) => {
  //logToFile(`Socket connected - ID: ${socket.id}`);

  socket.on("disconnect", () => {
    //logToFile(`Socket disconnected - ID: ${socket.id}`);
  });
});

// Middleware for logging HTTP requests
app.use((req, res, next) => {
  //logToFile(`Request received - PID: ${process.pid}, Method: ${req.method}, URL: ${req.url}`);
  next();
});


// Enable CORS
app.use(
  cors({
    origin: corsdata,
 
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Middleware for static files
app.use(express.static(path.join(__dirname, "public")));

app.use(
  fileUpload({
    //body-parser-for-file  ;
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Disable cache
app.options("*", cors());
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Surrogate-Control", "no-store");
  next();
});

// Middleware setup
app.set("trust proxy", true);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.JWT_ACCESS_TOKEN,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// cronJobContronler.cronJobGame1p(io);

// Set up view engine
configViewEngine(app);

// Set up routes
routes.initWebRouter(app);

// Log socket message for admin
socketIoController.sendMessageAdmin(io);
//logToFile('Socket message to admin sent');

// Serve client-side React application
app.use(express.static(path.join(__dirname, "/client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

// Cron game 1 Phut
// cronJobContronler.cronJobGame1p(io);

const apiUrl_lottery7_30 = "https://lottery7api.com/api/webapi/GetGameIssue";

const headers_lottery7_30 = {
  accept: "application/json, text/plain, */*",
  "content-type": "application/json;charset=UTF-8",
  authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIxNzM3OTUxMzgxIiwibmJmIjoiMTczNzk1MTM4MSIsImV4cCI6IjE3Mzc5NTMxODEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2V4cGlyYXRpb24iOiIxLzI3LzIwMjUgMTA6MTY6MjEgQU0iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBY2Nlc3NfVG9rZW4iLCJVc2VySWQiOiIxNTAwMDQyNyIsIlVzZXJOYW1lIjoiOTEzNDYzNTY1MTY0IiwiVXNlclBob3RvIjoiMSIsIk5pY2tOYW1lIjoiTWVtYmVyTk5HWkhGSVQiLCJBbW91bnQiOiI1OC4wMCIsIkludGVncmFsIjoiMCIsIkxvZ2luTWFyayI6Ikg1IiwiTG9naW5UaW1lIjoiMS8yNy8yMDI1IDk6NDY6MjEgQU0iLCJMb2dpbklQQWRkcmVzcyI6IjIyMy4xMjMuMTkuODYiLCJEYk51bWJlciI6IjAiLCJJc3ZhbGlkYXRvciI6IjAiLCJLZXlDb2RlIjoiNiIsIlRva2VuVHlwZSI6IkFjY2Vzc19Ub2tlbiIsIlBob25lVHlwZSI6IjAiLCJVc2VyVHlwZSI6IjAiLCJVc2VyTmFtZTIiOiIiLCJpc3MiOiJqd3RJc3N1ZXIiLCJhdWQiOiJsb3R0ZXJ5VGlja2V0In0.sBtbtPw0DOQ9h3Ii13ry4v_U5eAFAXspI26rT-otMx8`,
  origin: "https://www.lottery7j.com",
  referer: "https://www.lottery7j.com/",
  "user-agent":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
};

const requestData_lottery_30 = {
  typeId: 30,
  language: 0,
  random: "54b62524c66b4f64b7890d6a4e59ff78",
  signature: "BC7CE0CA59E69E8C5BEA6F198EBCDC3E",
  timestamp: 1737370579,
};

const requestData_lottery_1 = {
  typeId: 1,
  language: 0,
  random: "7da339925f8c449d8de871aa2a650248",
  signature: "6E4C6BC8353A49D861007900022CA13B",
  timestamp: 1737370579,
};

const apiUrl_bigdaddygame_30 =
  "https://api.bigdaddygame.cc/api/webapi/GetGameIssue";

const headers_bigdaddygame_30 = {
  accept: "application/json, text/plain, */*",
  "accept-language": "en-US,en;q=0.9,ur;q=0.8",
  "ar-origin": "https://www.bdg345.com",
  authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIxNzQ1NTI5OTYzIiwibmJmIjoiMTc0NTUyOTk2MyIsImV4cCI6IjE3NDU1MzE3NjMiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2V4cGlyYXRpb24iOiI0LzI1LzIwMjUgMzoyNjowMyBBTSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFjY2Vzc19Ub2tlbiIsIlVzZXJJZCI6IjE2NTg2NDM5IiwiVXNlck5hbWUiOiI5MTM0NjM1NjUxNjQiLCJVc2VyUGhvdG8iOiIxIiwiTmlja05hbWUiOiJNZW1iZXJOTkdQM1BGQSIsIkFtb3VudCI6IjAuMDAiLCJJbnRlZ3JhbCI6IjAiLCJMb2dpbk1hcmsiOiJINSIsIkxvZ2luVGltZSI6IjQvMjUvMjAyNSAyOjU2OjAzIEFNIiwiTG9naW5JUEFkZHJlc3MiOiIyMjMuMTIzLjIyLjY1IiwiRGJOdW1iZXIiOiIwIiwiSXN2YWxpZGF0b3IiOiIwIiwiS2V5Q29kZSI6IjIiLCJUb2tlblR5cGUiOiJBY2Nlc3NfVG9rZW4iLCJQaG9uZVR5cGUiOiIwIiwiVXNlclR5cGUiOiIwIiwiVXNlck5hbWUyIjoiIiwiaXNzIjoiand0SXNzdWVyIiwiYXVkIjoibG90dGVyeVRpY2tldCJ9.R-uofUa3Q6yB0XJ3E8PE2nXb6AY8lrSHxCvItEBbJqQ",
  "cache-control": "no-cache",
  "content-type": "application/json;charset=UTF-8",
  origin: "https://www.bdg345.com",
  pragma: "no-cache",
  priority: "u=1, i",
  referer: "https://www.bdg345.com/",
  "sec-ch-ua":
    '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "cross-site",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
};

const bodyData_bigdaddygame_30 = {
  typeId: 30,
  language: 0,
  random: "d9c55312d6e64447a304c2f5d05637e9",
  signature: "9B587D3A0E53E3D2D6E322E6E39C5D17",
  timestamp: 1745530982,
};

const bodyData_bigdaddygame_1 = {
  typeId: 1,
  language: 0,
  random: "cf8c314ff32d4616b572c3b3fd9cd8dc",
  signature: "A4E8A353C3E1F1E19C7763468D36DB83",
  timestamp: 1745530781,
};

const apiUrl_daman_30 =
  "https://api.damanapiopawer.com/api/webapi/GetGameIssue";

const headers_daman_30 = {
  accept: "application/json, text/plain, */*",
  "accept-language": "en-US,en;q=0.9,ur;q=0.8",
  "ar-origin": "https://damangames.bet",
  authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIxNzQ1NTMwODM4IiwibmJmIjoiMTc0NTUzMDgzOCIsImV4cCI6IjE3NDU1MzI2MzgiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2V4cGlyYXRpb24iOiI0LzI1LzIwMjUgMzo0MDozOCBBTSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFjY2Vzc19Ub2tlbiIsIlVzZXJJZCI6IjE2ODc5ODE3IiwiVXNlck5hbWUiOiI5MTMxMDEzNjE2NDciLCJVc2VyUGhvdG8iOiIxIiwiTmlja05hbWUiOiJNZW1iZXJOTkc5WTJOMiIsIkFtb3VudCI6IjAuMDAiLCJJbnRlZ3JhbCI6IjAiLCJMb2dpbk1hcmsiOiJINSIsIkxvZ2luVGltZSI6IjQvMjUvMjAyNSAzOjEwOjM4IEFNIiwiTG9naW5JUEFkZHJlc3MiOiIyMjMuMTIzLjIyLjY1IiwiRGJOdW1iZXIiOiIwIiwiSXN2YWxpZGF0b3IiOiIwIiwiS2V5Q29kZSI6IjEiLCJUb2tlblR5cGUiOiJBY2Nlc3NfVG9rZW4iLCJQaG9uZVR5cGUiOiIwIiwiVXNlclR5cGUiOiIwIiwiVXNlck5hbWUyIjoiIiwiaXNzIjoiand0SXNzdWVyIiwiYXVkIjoibG90dGVyeVRpY2tldCJ9.DqCHaafB_7wOnbtQb2idgujP_kBsSQwiHSS4F8V0_Mw",
  "cache-control": "no-cache",
  "content-type": "application/json;charset=UTF-8",
  origin: "https://damangames.bet",
  pragma: "no-cache",
  priority: "u=1, i",
  referer: "https://damangames.bet/",
  "sec-ch-ua":
    '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "cross-site",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
};

const bodyData_daman_30 = {
  typeId: 30,
  language: 0,
  random: "20169793c69743f9b77a82976d80e2c9",
  signature: "D5D46E7C1DC8D0C3C75FB7DCF9117901",
  timestamp: 1745530922,
};

const bodyData_daman_1 = {
  typeId: 1,
  language: 0,
  random: "4805f24417314382ac26184c1517554b",
  signature: "64AAB3A5FD018B1B6BEA42E42C58873A",
  timestamp: 1745530895,
};

// URLs and request bodies
const urls = [
  {
    url: apiUrl_lottery7_30,
    headers: headers_lottery7_30,
    body: requestData_lottery_30,
    name: "Lottery7",
  },
  {
    url: apiUrl_bigdaddygame_30,
    headers: headers_bigdaddygame_30,
    body: bodyData_bigdaddygame_30,
    name: "BigDaddy",
  },
  {
    url: apiUrl_daman_30,
    headers: headers_daman_30,
    body: bodyData_daman_30,
    name: "Daman",
  },
];

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const waitForNextPeriod = async (currentPeriod) => {
  const maxAttempts = 50;
  const apiTimeout = 500;
  const retryInterval = 1000;

  const withTimeout = (promise, ms) =>
    Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("API timeout")), ms)
      ),
    ]);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const start = Date.now();
    let foundResponse = null;

    try {
      const calls = urls.map(({ url, headers, body, name }) =>
        withTimeout(
          axios
            .post(url, body, { headers })
            .then((res) => ({ name, data: res.data }))
            .catch(() => null),
          apiTimeout
        )
      );

      const results = await Promise.allSettled(calls);

  

      for (const result of results) {
        //console.log("results from server", result.value?.data?.data?.issueNumber ," currentPeriod ", currentPeriod);
        if (
          result.status === "fulfilled" &&
          result.value?.data?.data?.issueNumber > currentPeriod
        ) {
          foundResponse = result.value;
          break;
        }
      }

      if (foundResponse) {
        //console.log(`✅ New period from ${foundResponse.name}:`, foundResponse.data.data.issueNumber);
        return foundResponse.data;
      }
    } catch (err) {
      console.error(`⚠️ Attempt ${attempt} failed:`, err.message);
    }

    console.log(`⏳ Attempt ${attempt}: No new period, retrying...`);
    const elapsed = Date.now() - start;
    const wait = Math.max(retryInterval - elapsed, 0);
    await new Promise((res) => setTimeout(res, wait));
  }

  // console.log("❌ Max attempts reached without detecting new period.");
  return null;
};

const urls_1 = [
  {
    url: apiUrl_lottery7_30,
    headers: headers_lottery7_30,
    body: requestData_lottery_1,
    name: "Lottery7",
  },
  {
    url: apiUrl_bigdaddygame_30,
    headers: headers_bigdaddygame_30,
    body: bodyData_bigdaddygame_1,
    name: "BigDaddy",
  },
  {
    url: apiUrl_daman_30,
    headers: headers_daman_30,
    body: bodyData_daman_1,
    name: "Daman",
  },
];



const bearerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIxNzM3OTUxMzgxIiwibmJmIjoiMTczNzk1MTM4MSIsImV4cCI6IjE3Mzc5NTMxODEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2V4cGlyYXRpb24iOiIxLzI3LzIwMjUgMTA6MTY6MjEgQU0iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBY2Nlc3NfVG9rZW4iLCJVc2VySWQiOiIxNTAwMDQyNyIsIlVzZXJOYW1lIjoiOTEzNDYzNTY1MTY0IiwiVXNlclBob3RvIjoiMSIsIk5pY2tOYW1lIjoiTWVtYmVyTk5HWkhGSVQiLCJBbW91bnQiOiI1OC4wMCIsIkludGVncmFsIjoiMCIsIkxvZ2luTWFyayI6Ikg1IiwiTG9naW5UaW1lIjoiMS8yNy8yMDI1IDk6NDY6MjEgQU0iLCJMb2dpbklQQWRkcmVzcyI6IjIyMy4xMjMuMTkuODYiLCJEYk51bWJlciI6IjAiLCJJc3ZhbGlkYXRvciI6IjAiLCJLZXlDb2RlIjoiNiIsIlRva2VuVHlwZSI6IkFjY2Vzc19Ub2tlbiIsIlBob25lVHlwZSI6IjAiLCJVc2VyVHlwZSI6IjAiLCJVc2VyTmFtZTIiOiIiLCJpc3MiOiJqd3RJc3N1ZXIiLCJhdWQiOiJsb3R0ZXJ5VGlja2V0In0.sBtbtPw0DOQ9h3Ii13ry4v_U5eAFAXspI26rT-otMx8";

const apiUrl = "https://lottery7api.com/api/webapi/GetGameIssue";

const headers = {
  accept: "application/json, text/plain, */*",
  "content-type": "application/json;charset=UTF-8",
  authorization: `Bearer ${bearerToken}`,
  origin: "https://www.lottery7j.com",
  referer: "https://www.lottery7j.com/",
  "user-agent":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
};

const apiUrl_trx = "https://tirangaapi.com/api/webapi/GetTRXGameIssue";

const headers_trx = {
  accept: "application/json, text/plain, */*",
  "accept-language": "en-US,en;q=0.9,ur;q=0.8",
  "ar-origin": "https://www.tirangagame.top",
  authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIxNzQyNTcwNjQwIiwibmJmIjoiMTc0MjU3MDY0MCIsImV4cCI6IjE3NDI1NzI0NDAiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2V4cGlyYXRpb24iOiIzLzIxLzIwMjUgOToyNDowMCBQTSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFjY2Vzc19Ub2tlbiIsIlVzZXJJZCI6IjE5NzQxNDA4IiwiVXNlck5hbWUiOiI5MTM0NjM1NjUxMTEiLCJVc2VyUGhvdG8iOiIxIiwiTmlja05hbWUiOiJNZW1iZXJOTkdVQ01VRiIsIkFtb3VudCI6IjAuMDAiLCJJbnRlZ3JhbCI6IjAiLCJMb2dpbk1hcmsiOiJINSIsIkxvZ2luVGltZSI6IjMvMjEvMjAyNSA4OjU0OjAwIFBNIiwiTG9naW5JUEFkZHJlc3MiOiIyMjMuMTIzLjQuMzAiLCJEYk51bWJlciI6IjAiLCJJc3ZhbGlkYXRvciI6IjAiLCJLZXlDb2RlIjoiNyIsIlRva2VuVHlwZSI6IkFjY2Vzc19Ub2tlbiIsIlBob25lVHlwZSI6IjAiLCJVc2VyVHlwZSI6IjAiLCJVc2VyTmFtZTIiOiIiLCJpc3MiOiJqd3RJc3N1ZXIiLCJhdWQiOiJsb3R0ZXJ5VGlja2V0In0.LkXXnNLwjKqy1WpostRg3LoVo6fgv2ubYY6KJzON-c8", // use full token
  "content-type": "application/json;charset=UTF-8",
  origin: "https://www.tirangagame.top",
  referer: "https://www.tirangagame.top/",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
};

const bodyData_trx = {
  typeId: 13,
  language: 0,
  random: "39392be50209437b8c310629eccab405",
  signature: "0FCBB43C3DB5407A43D20393ADA6CA3A",
  timestamp: 1744432487,
};

async function startCountdown(gameId, requestData) {
  var response = await axios.post(apiUrl_lottery7_30, requestData, {
    headers_lottery7_30,
  });
  var data = response.data.data;

  var end = new Date(data.endTime);
  var service = new Date(data.serviceTime);

  if (isNaN(end.getTime()) || isNaN(service.getTime())) {
    console.error("Invalid date format GameID ", gameId);
  }

  let endWithOffset = end.getTime();
  var countdown = (endWithOffset - service.getTime()) / 1000;

  //   //console.log("endWithOffset",countdown)
  // let countdown = Math.floor((end.getTime() - Date.now()) / 1000);

  let winGoTriggered = false;
  let winGoRunning = false;

  const countdownInterval = setInterval(async () => {
    
    // Declare variables OUTSIDE so they are always defined
    let minute = 0;
    let secondtime1 = 0;
    let secondtime2 = 0;
    
    if (gameId === 3 || gameId === 5) {
    
        const indiaTime = moment().tz("Asia/Kolkata");
    
        const currentSeconds = indiaTime.seconds();
        const currentMinutes = indiaTime.minutes();
    
        // Total parts per hour
        let totalParts = (gameId === 3) ? 20 : 12;
    
        // Minutes per part
        let partDuration = 60 / totalParts;
    
        // Total minutes passed in hour (float)
        let minutesPassed = currentMinutes + (currentSeconds / 60);
    
        // Current part index
        let currentPart = Math.floor(minutesPassed / partDuration);
    
        // Ending minute of current part
        let partEndMinute = (currentPart + 1) * partDuration;
    
        // Time left (in minutes, float)
        let timeLeft = partEndMinute - minutesPassed;
    
        // Convert total time left to seconds
        let countdown = Math.floor(timeLeft * 60);
        if (countdown < 0) countdown = 0;
    
        // Assign to pre-defined variables
        minute = Math.floor(countdown / 60);
        secondtime1 = Math.floor((countdown % 60) / 10);
        secondtime2 = (countdown % 60) % 10;
    }



    if (gameId == 10) {
      // //console.log("times",end,service)

      io.emit(`timeUpdate_30`, { minute, secondtime1, secondtime2 });
    } else if (gameId == 1) {
      io.emit(`timeUpdate_11`, { minute, secondtime1, secondtime2 });
    } else {
      io.emit(`timeUpdate_${gameId}`, { minute, secondtime1, secondtime2 });
    }

    if (countdown === 29) {
      winGoRunning = false;
    }

    if (countdown === 5) {
      await connection.execute(
        "UPDATE wingo SET stop = ? WHERE game = ? AND status = ?",
        [1, `wingo${gameId}`, 0]
      );
    }

    if (countdown === 3 && !winGoTriggered) {
      winGoTriggered = true;
      if (!winGoRunning) {
        winGoRunning = true;
        try {
          await winGoController[`addWinGo_${gameId}`]();
          await winGoController.handlingWinGo1P(gameId);

     
        } catch (error) {
          console.error(`Error in winGo logic for game ${gameId}:`, error);
        } finally {
          winGoRunning = false;
        }
      }
    }

    if (countdown == 2) {
      if (gameId == 10) {
          
          
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const [winGo1_10] = await connection.execute(
          'SELECT * FROM `wingo` WHERE `game` = "wingo10" ORDER BY `id` DESC LIMIT 2',
          []
        );
        const data_10 = winGo1_10;
        io.emit("data-server", { data: data_10 });
      } else if (gameId == 5) {
        const [winGo1_5] = await connection.execute(
          'SELECT * FROM `wingo` WHERE `game` = "wingo5" ORDER BY `id` DESC LIMIT 2',
          []
        );
        const data_5 = winGo1_5;
        io.emit("data-server", { data: data_5 });
      } else if (gameId == 3) {
        const [winGo1_3] = await connection.execute(
          'SELECT * FROM `wingo` WHERE `game` = "wingo3" ORDER BY `id` DESC LIMIT 2 ',
          []
        );
        const data_3 = winGo1_3; // Cầu mới chưa có kết quả
        io.emit("data-server", { data: data_3 });
      } else if (gameId == 1) {
        const [winGo1] = await connection.execute(
          'SELECT * FROM `wingo` WHERE `game` = "wingo" ORDER BY `id` DESC LIMIT 2'
        );
        io.emit("data-server", { data: winGo1 });
        io.emit("data-server-1", { data: winGo1 });
      }
    }

    countdown--;


    if (countdown == 1) {
      // //console.log("countdown");

      let response, data;
      //console.log(`Waiting 900ms before making API call for game ${gameId}...`);
      //await new Promise((resolve) => setTimeout(resolve, 900)); // Fake waiting

      try {
        response = await Promise.race([
          axios.post(apiUrl, requestData, { headers }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 900)
          ),
        ]);

        data = response.data.data;
        end = new Date(data.endTime);
        service = new Date(data.serviceTime);

        if (isNaN(end.getTime()) || isNaN(service.getTime())) {
          console.error("Invalid date format for GameID", gameId);
          throw new Error("Invalid API response");
        }

        //console.log(`API responded successfully for game ${gameId}`);
      } catch (error) {
        console.error(
          `API delay or error for GameID ${gameId}, using fallback.`
        );

        if (gameId == 10) {
          end = new Date(Date.now() + 30000);
          service = new Date();
        } else if (gameId == 5) {
          end = new Date(Date.now() + 300000);
          service = new Date();
        } else if (gameId == 3) {
          end = new Date(Date.now() + 180000);
          service = new Date();
        } else if (gameId == 1) {
          end = new Date(Date.now() + 60000);
          service = new Date();
        }
      }

      endWithOffset = end.getTime();
      countdown = (endWithOffset - service.getTime()) / 1000;
      winGoTriggered = false;

      //console.log(`New countdown set for game ${gameId}: ${countdown} seconds`);

      try {
        if (winGoRunning) {
          //console.log(`Waiting for winGoRunning to finish for game ${gameId}...`);
          while (winGoRunning) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }

        const [winGoData] = await connection.execute(
          `SELECT * FROM wingo WHERE game = ? ORDER BY id DESC LIMIT 2`,
          [`wingo${gameId}`]
        );
        io.emit("data-server", { data: winGoData });
        // console.log(`Emitted winGo data for game ${gameId}`);
      } catch (error) {
        console.error(`Error fetching wingo data for game ${gameId}:`, error);
      }
    }
  }, 1000);
}

// Request data for different games
const requestData_30 = {
  typeId: 30,
  language: 0,
  random: "54b62524c66b4f64b7890d6a4e59ff78",
  signature: "BC7CE0CA59E69E8C5BEA6F198EBCDC3E",
  timestamp: 1737370579,
};

const requestData_1 = {
  typeId: 1,
  language: 0,
  random: "7da339925f8c449d8de871aa2a650248",
  signature: "6E4C6BC8353A49D861007900022CA13B",
  timestamp: 1737370579,
};

const requestData_1_trx = {
  language: 0,
  random: "27db983462f74d4e99a87a6454e823b3",
  signature: "DA704CEEA5A3EC9E7978E24D94463D35",
  timestamp: 1742540672,
  typeId: 13,
};

const requestData_3 = {
  typeId: 2,
  language: 0,
  random: "80dc1455763f493488f08286bf65fb6f",
  signature: "FBA6634AB477F8D7435BA0DAC9E64277",
  timestamp: 1737370579,
};

const requestData_5 = {
  typeId: 3,
  language: 0,
  random: "6931e25a1af94196a38eb9c7ffcb449b",
  signature: "CEB52D88DE5F0A638E97BBEC6CB811FD",
  timestamp: 1737370579,
};

const logFile = path.join(__dirname, "wingo10countdown.log");


const moment = require("moment-timezone");

const get30SecondPeriod = async () => {
  const ts = Date.now();
  const apiUrl = `https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json?ts=${ts}`;

  const headers = {
    accept: "application/json, text/plain, */*",
  };

  let attempts = 0;
  const maxApiRetries = 3;
  const apiTimeout = 5000;

  while (attempts < maxApiRetries) {
    try {
      const response = await axios.get(apiUrl, { headers, timeout: apiTimeout });

      // 🔹 get latest issue number and +1 for next
      const issue = response.data?.data?.list?.[0]?.issueNumber;
      if (issue) {
        return (BigInt(issue) + BigInt(1)).toString();
      }
      return null;
    } catch (error) {
      attempts++;
      console.error(`API call failed (Attempt ${attempts}):`, error.message);
      if (attempts >= maxApiRetries) {
        throw new Error("API failed after maximum retries");
      }
    }
  }
  return null;
};

const get1MSecondPeriod = async (previousPeriod = null) => {
  // console.log("🔎 Getting new period, previousPeriod:", previousPeriod);

  const headers = {
    accept: "application/json, text/plain, */*",
  };

  const maxApiRetries = 10;   // 🔹 max 10 attempts
  const apiTimeout = 1000;    // 🔹 1 second timeout per call
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let attempts = 0;

  while (attempts < maxApiRetries) {
    try {
      const ts = Date.now();
      const apiUrl = `https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?ts=${ts}`;

      const response = await axios.get(apiUrl, { headers, timeout: apiTimeout });
      const apiPeriod = response.data?.data?.list?.[0]?.issueNumber;

      // console.log("🔎 API returned period:", apiPeriod);

      if (apiPeriod) {
        // Case 1: No previousPeriod → return current API period
        if (!previousPeriod) {
          // console.log("✅ Current period (no previousPeriod provided):", apiPeriod);
          return (BigInt(apiPeriod) + BigInt(1)).toString();
        }

        // Case 2: Wait for strictly greater period
        if (BigInt(apiPeriod) >= BigInt(previousPeriod)) {
          // console.log("✅ Found new period:", apiPeriod);
          return (BigInt(apiPeriod) + BigInt(1)).toString();
        } else {
          // console.warn(
          //   `⏳ Still old period (API=${apiPeriod}, Previous=${previousPeriod}), retrying...`
          // );
        }
      } else {
        console.warn("⚠️ No issue found in response, retrying...");
      }
    } catch (error) {
      console.error(
        `❌ API call failed (Attempt ${attempts + 1}):`,
        error.code || error.message
      );
    }

    attempts++;
    if (attempts >= maxApiRetries) {
      throw new Error("API failed after maximum retries");
    }
    await delay(500); // 🔹 wait before retry
  }

  return null;
};




async function startCountdown_30(requestData) {
  let gameId = 10;

  try {
    // 🔹 get next period id from API
    let period_id = await get30SecondPeriod();
    //console.log("first time api call period_id", period_id);

    let winGoTriggered = false;
    let winGoRunning = false;

    const countdownInterval = setInterval(async () => {
      try {
        // 🔹 get current India time
        const indiaTime = moment().tz("Asia/Kolkata");
        const currentSeconds = indiaTime.seconds(); // 0–59

        // 🔹 countdown = 30 → 0 every 30 seconds
        let countdown = 30 - (currentSeconds % 30);
        
        //console.log("countdown" , countdown, "period_id", period_id, "new")

        // frontend values
        let minute = Math.floor(countdown / 60);
        let secondtime1 = Math.floor(countdown / 10);
        let secondtime2 = countdown % 10;
        io.emit(`timeUpdate_30`, { minute, secondtime1, secondtime2 });

        ////// stop game at countdown = 5
        if (countdown === 5) {
          await connection.execute(
            "UPDATE wingo SET stop = ? WHERE game = ? AND status = ?",
            [1, `wingo${gameId}`, 0]
          );
        }

        ////// main game trigger at countdown = 2
        if (countdown === 2 && !winGoTriggered) {
          winGoTriggered = true;
          winGoRunning = true;

          // console.log("addwingo function called--------------");

          try {
            // 🔹 get fresh next period

            await Promise.all([
              winGoController.addWinGo_10(period_id),
            
            ]);

            await Promise.all([
              winGoController.handlingWinGo1P(gameId),
            ]);

            period_id = await get30SecondPeriod();
            //console.log("period_id new in server", period_id, "countdown", countdown);
            
            // console.log("time reach 2 second", period_id);
          } catch (error) {
            console.log("❌ Error in winGo logic:", error.message);
          } finally {
            winGoRunning = false;
          }
        }

        ////// fetch last results at countdown = 1
        if (countdown === 1) {
          try {
              
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const [winGo1_10] = await connection.execute(
              'SELECT * FROM `wingo` WHERE `game` = "wingo10" ORDER BY `id` DESC LIMIT 2'
            );
            io.emit("data-server", { data: winGo1_10 });
          } catch (error) {
            console.log("❌ Error fetching wingo data:", error.message);
          }

          // reset trigger for next cycle
          winGoTriggered = false;
        }
      } catch (error) {
        console.log("❌ Error in countdown loop:", error.message);
        clearInterval(countdownInterval);
        restartCountdown(requestData);
      }
    }, 1000);
  } catch (error) {
    console.log("❌ Failed to start countdown:", error.message);
    restartCountdown(requestData);
  }
}

async function startCountdown_1(requestData) {
  let gameId = 1;
  let coutdone = true;

  try {
    let period_id = await get1MSecondPeriod();
    // console.log("✅ First period_id:", period_id);

    let issueNumber_trx = await fetchIssueNumber(
      apiUrl_trx,
      bodyData_trx,
      headers_trx
    );

    let winGoTriggered = false;
    let winGoRunning = false;

    let countdownInterval = setInterval(async () => {
      try {
        // ⏰ India clock seconds
        const indiaTime = moment().tz("Asia/Kolkata");
        const currentSeconds = indiaTime.seconds(); // 0–59

        // 🔹 countdown = 60 → 0 every minute
        let countdown = 60 - (currentSeconds % 60);
        if (countdown === 60) countdown = 0; // handle exact minute

        // frontend values
        let minute = Math.floor(countdown / 60);
        let secondtime1 = Math.floor(countdown / 10);
        let secondtime2 = countdown % 10;
        
        // console.log("countdown" , countdown, "period_id", period_id, "new")
        
        if (countdown >= 55 && countdown <= 57) {
            coutdone = true;
            winGoTriggered = false; 
            // console.log("⚡ Flags reset: coutdone = true, winGoTriggered = false");
        }


        // Emit timer to frontend
        io.emit(`timeUpdate_11`, { minute, secondtime1, secondtime2, countdown });

        // 🎯 Trigger when countdown = 3
        if (countdown <= 3 && !winGoTriggered) {
          winGoTriggered = true;
          winGoRunning = true;

          try {
            await connection.execute(
              "UPDATE wingo SET stop = ? WHERE game = ? AND status = ?",
              [1, `wingo`, 0]
            );

            await Promise.all([
              winGoController.addWinGo_1(period_id),
              winGoController.addWinGo_11(issueNumber_trx),
              k5Controller.add5D(1),
              k3Controller.addK3(1),
            ]);
            
            

            await Promise.all([
              winGoController.handlingWinGo1P(1),
              winGoController.handlingWinGo1P(11),
              k5Controller.handling5D(1),
              k3Controller.handlingK3(1),
            ]);
          } catch (error) {
            console.error("❌ Error in WinGo process:", error.message);
          } finally {
            winGoRunning = false;
          }
        }
        
        // 🎯 At countdown = 0 → fetch new period for next round
        if (coutdone && countdown <= 3) {
            
              // console.log("🔄 timer is less than 2 call for new api");
              
              coutdone = false; // reset trigger flag
             
              try {
                period_id = await get1MSecondPeriod(period_id);

                
                // console.log("🔄 New wingo period_id:", period_id);
                
                issueNumber_trx = await fetchIssueNumber(
                  apiUrl_trx,
                  bodyData_trx,
                  headers_trx
                );
                
                // console.log("🔄 New trx period_id:", issueNumber_trx);
                
                // console.log("🔄 New period_id:", period_id, "| New issueNumber_trx:", issueNumber_trx);
              } catch (error) {
                console.error("❌ Failed to fetch new period:", error.message);
              }
        }

        // 🎯 Emit results on countdown = 1
        if (countdown === 1) {
          try {
              
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const [winGo1] = await connection.execute(
              'SELECT * FROM `wingo` WHERE `game` = "wingo" ORDER BY `id` DESC LIMIT 2'
            );
            io.emit("data-server", { data: winGo1 });
            io.emit("data-server-1", { data: winGo1 });

            const [winGo11] = await connection.execute(
              'SELECT * FROM `wingo` WHERE `game` = "trx" ORDER BY `id` DESC LIMIT 2'
            );
            io.emit("data-server-trx", { data: winGo11 });
            io.emit("data-server-trx-1", { data: winGo11 });
          } catch (error) {
            console.error("❌ Error fetching wingo data:", error.message);
          }
        }

        
      } catch (error) {
        console.error("❌ Countdown loop error:", error.message);
        clearInterval(countdownInterval);
        restartCountdown_1(requestData);
      }
    }, 1000);
  } catch (error) {
    console.error("❌ Failed to start countdown:", error.message);
    restartCountdown_1(requestData);
  }
}



// Function to restart the countdown after an error
async function restartCountdown(requestData) {
  ////logToFile("🔄 Restarting countdown after failure...");
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait before retrying
  startCountdown_30(requestData);
}

const logFile_1 = path.join(__dirname, "wingo1countdown.log");

function logToFile_1(message) {
  const timestamp = new Date().toLocaleString();
  fs.appendFileSync(logFile_1, `[${timestamp}] ${message}\n`);
}

async function fetchIssueNumber(delay = 500) {
  const apiUrl = "https://draw.ar-lottery01.com/TrxWinGo/TrxWinGo_1M.json";
  const headers = {
    accept: "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9,ur;q=0.8",
    "cache-control": "no-cache",
    pragma: "no-cache",
    priority: "u=1, i",
    "sec-ch-ua":
      '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    referer: "https://www.tirangagame.top/",
  };

  let attempt = 1;
  while (true) {
    try {
      const response = await axios.get(apiUrl, { headers });

      //console.log("response json",response);
      const issueNumber = response.data?.current?.issueNumber;

      //console.log("issueNumber json",issueNumber);

      if (issueNumber) {
        let indiaTime = new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        });
        console.log(
          `Attempt: ${attempt}, Issue Number: ${issueNumber}, Time (India): ${indiaTime}`
        );
        return issueNumber;
      }
    } catch (error) {
      console.error(`Attempt ${attempt} Failed:`, error.message);
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Response Data:", error.response.data);
      } else if (error.request) {
        console.error("No response received");
      }
    }

    console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
    attempt++;
    await new Promise((res) => setTimeout(res, delay));
  }
}





// Function to restart the countdown after an error
async function restartCountdown_1(requestData) {
  //////logToFile_1(`🔄 Restarting countdown after failure for GameID 1...`);
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait before retrying
  startCountdown_1(requestData);
}

// Start countdowns for different games
startCountdown_30(requestData_30);

startCountdown_1(requestData_1, requestData_1_trx);

//startCountdown(1, requestData_1);

startCountdown(3, requestData_3);

startCountdown(5, requestData_5);


const port = process.env.PORT || 7780;



let interval1, interval2; // जहाँ तुमने intervals बनाए



server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



let isShuttingDown = false;

function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`${signal} received, cleaning up...`);

  // 👉 सभी intervals/timers clear करो
  clearInterval(interval1);
  clearInterval(interval2);

  // 👉 HTTP server बंद करो
  server.close(() => {
    console.log("Server closed, exiting now");
    process.exit(0);
  });
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));


//logToFile(`Starting application with PID: ${process.pid}`);
