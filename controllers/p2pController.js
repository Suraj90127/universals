import connection from "../config/connectDB";
import md5 from "md5";
import fs from "fs";
import util from "util";
import path from "path";


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


const p2p = async (req, res) => {
  const auth = req.cookies.auth;
  const { money, userId } = req.body;

  try {
    if (!auth) {
      return res.status(400).json({ message: "Unauthorized", status: false });
    }

    if (!money || isNaN(money) || money <= 0) {
      return res.status(400).json({ message: "Invalid transfer amount", status: false });
    }

    const [user] = await connection.query(
      "SELECT phone, money, p2pwallet, id_user, code, invite FROM users WHERE token = ?",
      [auth]
    );
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    const sender = user[0];
const p2pMoney=Number(sender.p2pwallet)
const p2pAmount=Number(money)
    if (p2pMoney < p2pAmount) {
      return res.status(400).json({
        message: "Insufficient Fund",
        status: false,
      });
    }

    const [trans] = await connection.query(
      "SELECT phone, money, id_user, code, invite FROM users WHERE id_user = ?",
      [userId]
    );
    if (trans.length === 0) {
      return res.status(404).json({ message: "Invalid receiver ID", status: false });
    }

    const receiver = trans[0];

 
 
 
 
 
 
 // ✅ Check 4-level UPLINE or DOWNLINE connection

let allowed = false;

// Helper: find 4-level uplines
const findUplines = async (inviteCode, levelsLeft) => {
  if (!inviteCode || levelsLeft === 0) return [];
  const [upline] = await connection.query(
    "SELECT code, invite FROM users WHERE code = ?",
    [inviteCode]
  );
  if (upline.length === 0) return [];
  const nextUpline = upline[0];
  return [nextUpline, ...(await findUplines(nextUpline.invite, levelsLeft - 1))];
};

// Helper: find 4-level downlines (recursive, all branches)
const findDownlines = async (code, levelsLeft) => {
  if (!code || levelsLeft === 0) return [];
  const [rows] = await connection.query(
    "SELECT code, invite FROM users WHERE invite = ?",
    [code]
  );
  if (rows.length === 0) return [];
  let all = [...rows];
  for (const r of rows) {
    const sub = await findDownlines(r.code, levelsLeft - 1);
    all = all.concat(sub);
  }
  return all;
};

// 1️⃣ Check uplines (max 4)
const uplines = await findUplines(sender.invite, 4);
if (uplines.some((u) => u.code === receiver.code)) {
  allowed = true;
}

// 2️⃣ Check downlines (max 4)
if (!allowed) {
  const downlines = await findDownlines(sender.code, 4);
  if (downlines.some((d) => d.code === receiver.code)) {
    allowed = true;
  }
}

if (!allowed) {
  return res.status(400).json({
    message: "You can only transfer within 4-level uplines or downlines",
    status: false,
  });
}

 
 
 
 
 
 
 
 
 

    // Timestamp
    const checkTime = timerJoin2(Date.now());

    // Deduct from sender
    await connection.query(
      "UPDATE users SET p2pwallet = p2pwallet - ? WHERE phone = ?",
      [money, sender.phone]
    );

    // Add to receiver
    await connection.query(
      "UPDATE users SET p2pwallet = p2pwallet + ? WHERE phone = ?",
      [money, receiver.phone]
    );

    // Log transaction
    await connection.query(
      "INSERT INTO p2p (phone, transfer, userId, transferId, amount, date) VALUES (?, ?, ?, ?, ?, ?)",
      [sender.phone, receiver.phone, sender.id_user, receiver.id_user, money, checkTime]
    );

    await connection.query(
      "INSERT INTO transaction_history (phone, detail, balance, time) VALUES (?, ?, ?, ?)",
      [sender.phone, "P2P Transfer", money, checkTime]
    );

    await connection.query(
      "INSERT INTO transaction_history (phone, detail, balance, time) VALUES (?, ?, ?, ?)",
      [receiver.phone, "P2P Received", money, checkTime]
    );

    return res.status(200).json({
      message: "P2P transfer successful",
      status: true,
    });
  } catch (error) {
    console.error("P2P Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: false,
      error: error.message,
    });
  }
};



const getP2PByPhone = async (req, res) => {

  const auth = req.cookies.auth;
  try {
      const [user] = await connection.query(
      "SELECT phone, money, id_user FROM users WHERE token = ?",
      [auth]
    );
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found", status: false });
    }
    // Fetch all transactions where this phone is sender or receiver
    const [transactions] = await connection.query(
      `SELECT * FROM p2p 
       WHERE phone = ?
       ORDER BY id DESC`,
      [user[0].phone]
    );

    if (transactions.length === 0) {
      return res.status(404).json({
        message: "No P2P transactions found for this phone",
        status: false,
      });
    }

    res.status(200).json({
      message: "P2P transactions fetched successfully",
      status: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching P2P by phone:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
      error: error.message,
    });
  }
};


const getP2PByTransfer = async (req, res) => {

  const auth = req.cookies.auth;
  try {
      const [user] = await connection.query(
      "SELECT phone, money, id_user FROM users WHERE token = ?",
      [auth]
    );
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found", status: false });
    }
    // Fetch all transactions where this phone is sender or receiver
    const [transactions] = await connection.query(
      `SELECT * FROM p2p 
       WHERE transfer = ?
       ORDER BY id DESC`,
      [user[0].phone]
    );

    if (transactions.length === 0) {
      return res.status(404).json({
        message: "No P2P transactions found for this phone",
        status: false,
      });
    }

    res.status(200).json({
      message: "P2P transactions fetched successfully",
      status: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching P2P by phone:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
      error: error.message,
    });
  }
};

const getP2PAll = async (req, res) => {
  const auth = req.cookies.auth;
  const { value } = req.query; // 🔍 Search text from query params

  try {
    let query = `SELECT * FROM p2p WHERE 1=1`; // <-- Always true
    const params = [];

    // ✅ Add dynamic search condition
    if (value) {
      query += ` AND (userId LIKE ? OR transferId LIKE ?)`;
      const searchValue = `%${value}%`;
      params.push(searchValue, searchValue);
    }

    query += ` ORDER BY id DESC`;

    const [transactions] = await connection.query(query, params);

    if (transactions.length === 0) {
      return res.status(404).json({
        message: "No P2P transactions found",
        status: false,
      });
    }

    res.status(200).json({
      message: "P2P transactions fetched successfully",
      status: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Error fetching P2P transactions:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
      error: error.message,
    });
  }
};



const trasferToMain = async (req, res) => {
  const auth = req.cookies.auth;
  let { amount,password } = req.body; // 🔍 Search text from query params

  try {
      


    // ✅ Add dynamic search condition
    const [user] = await connection.query(
      "SELECT * FROM users WHERE `token` = ? AND password = ?",
      [auth, md5(password)]
    );
    
     if (user.length == 0) {
      return res.status(200).json({
        message: "Invalid password",
        status: false,
      });
    }
    let userInfo=user[0]
        const checkTime=timerJoin2(Date.now())
       
const numAmount = parseFloat(amount);

if (isNaN(numAmount) || numAmount <= 0) {
  return res.status(400).json({
    message: "Invalid amount",
    status: false,
  });
}

let userAmount=parseFloat(userInfo.p2pwallet)

if (userAmount < numAmount) {
  return res.status(400).json({
    message: "Insufficient Fund",
    status: false,
  });
}



 if (!auth || !amount || amount < 99) {
      return res.status(200).json({
        message: "Minimum amount 100",
        status: false,
      });
    }

   await connection.execute(
        "UPDATE users SET money = money + ?,p2pwallet=p2pwallet-?,recharge=recharge+? WHERE phone = ? ",
        [amount,amount,2*Number(amount), userInfo.phone]
      );
      
       await connection.query(
              "INSERT INTO transaction_history SET phone = ?, detail = ?, balance = ?, time = ?",
              [userInfo.phone, "P2P Add Account", amount, checkTime]
            );
            
               await connection.query(
              "INSERT INTO p2p_to_main SET phone = ?, amount = ?, date = ?",
              [userInfo.phone, amount, checkTime]
            );
            
      
   return res.status(200).json({
      message: "Transfer successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error fetching P2P transactions:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
      error: error.message,
    });
  }
};



const getP2PMain = async (req, res) => {

  const auth = req.cookies.auth;
  try {
      const [user] = await connection.query(
      "SELECT phone, money, id_user FROM users WHERE token = ?",
      [auth]
    );
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found", status: false });
    }
    // Fetch all transactions where this phone is sender or receiver
    const [transactions] = await connection.query(
      `SELECT * FROM p2p_to_main 
       WHERE phone = ?
       ORDER BY id DESC`,
      [user[0].phone]
    );

const [result] = await connection.query(
  `SELECT *, SUM(amount) AS total_amount 
   FROM p2p_to_main 
   WHERE phone = ?`,
  [user[0].phone]
);
const [results] = await connection.query(
  `SELECT *, SUM(amount) AS total_amount 
   FROM p2p 
   WHERE phone = ?`,
  [user[0].phone]
);

// Total amount
const totalAmount = result[0]?.total_amount || 0;
const totalAmountUser = results[0]?.total_amount || 0;


    if (transactions.length === 0) {
      return res.status(404).json({
        message: "No P2P transactions found for this phone",
        status: false,
      });
    }

   return res.status(200).json({
      message: "P2P transactions fetched successfully",
      status: true,
      data: {
          transactions,
          totalAmount,
        totalAmountUser          
          
      },
    });
  } catch (error) {
    console.error("Error fetching P2P by phone:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
      error: error.message,
    });
  }
};


const getP2PMainAdmin = async (req, res) => {

  const auth = req.cookies.auth;
  try {
      const [user] = await connection.query(
      "SELECT phone, money, id_user FROM users WHERE token = ?",
      [auth]
    );
    if (user.length === 0) {
      return res.status(404).json({ message: "User not found", status: false });
    }
    // Fetch all transactions where this phone is sender or receiver
const [transactions] = await connection.query(
  `SELECT * FROM p2p_to_main 
   ORDER BY id DESC`
);


    if (transactions.length === 0) {
      return res.status(404).json({
        message: "No P2P transactions found for this phone",
        status: false,
      });
    }

   return res.status(200).json({
      message: "P2P transactions fetched successfully",
      status: true,
      data: transactions
    });
  } catch (error) {
    console.error("Error fetching P2P by phone:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
      error: error.message,
    });
  }
};



const getP2PMainforUser = async (req, res) => {
  const { phone } = req.params;
  let { page = 1, limit = 10 } = req.query; // Default: page 1, 10 records per page

  // Convert to integers
  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  try {
    // Count total records for this phone
    const [countResult] = await connection.query(
      `SELECT COUNT(*) AS total FROM p2p_to_main WHERE phone = ?`,
      [phone]
    );
    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / limit);

    // Fetch paginated transactions
    const [transactions] = await connection.query(
      `SELECT * FROM p2p_to_main 
       WHERE phone = ?
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [phone, limit, offset]
    );

    if (transactions.length === 0) {
      return res.status(404).json({
        message: "No P2P transactions found for this phone",
        status: false,
      });
    }

    return res.status(200).json({
      message: "P2P transactions fetched successfully",
      status: true,
      currentPage: page,
      page_total:totalPages,
      totalRecords,
      limit,
      datas: transactions,
    });
  } catch (error) {
    console.error("Error fetching P2P by phone:", error);
    res.status(500).json({
      message: "Internal Server Error",
      status: false,
      error: error.message,
    });
  }
};


module.exports = {
  
  getP2PByTransfer,
  getP2PByPhone,
  p2p,
  getP2PAll,
  trasferToMain,
  getP2PMain,
  getP2PMainAdmin,
  getP2PMainforUser
};
