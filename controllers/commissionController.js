import connection from "../config/connectDB";
// import jwt from 'jsonwebtoken'
// import md5 from "md5";
import axios from "axios";
import path from 'path';
import fs from 'fs';
// import e from "express";
require('dotenv').config();





const promotion = async (req, res) => {
    try {
        const [allUsers] = await connection.query('SELECT `id` FROM users');
        
        // const [allUsers] = await connection.query('SELECT `id` FROM users WHERE DATE(login_at) BETWEEN DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND CURDATE()');
        

        for (let ui of allUsers) {
            try {
                let auth = ui.id;
                // let auth = 12906// 12950; 
                console.log("auth ji", auth);

                if (!auth) {
                    console.warn(`Skipping user with missing auth token`);
                    continue;
                }

                const [user] = await connection.query('SELECT `phone`, `code`, `invite`, `roses_f`, `roses_f1`, `roses_today` FROM users WHERE `id` = ?', [auth]);

                if (!user || user.length === 0) {
                    console.warn(`User not found for token: ${auth}`);
                    continue;
                }

                let userInfo = user[0];
                let selectedData = [];
                let level2to6activeuser = 0;

                let currentDate = timerJoin2(Date.now() - 24 * 60 * 60 * 1000);
                

                async function fetchInvitesByCode(code, depth = 1) {
                    if (depth > 6) return;

                    const [inviteData] = await connection.query('SELECT `id_user`,`name_user`,`phone`, `code`, `invite`, `rank`, `user_level`, `total_money` FROM users WHERE `invite` = ?', [code]);
                    const [activeToday] = await connection.query('SELECT `phone`, `code`, `invite`, `time` FROM users WHERE `invite` = ? AND DATE(`today`) = ?', [code, currentDate]);

                    level2to6activeuser += activeToday.length;

                    for (const invite of inviteData) {
                        selectedData.push(invite);
                        await fetchInvitesByCode(invite.code, depth + 1);
                    }
                }

                const [level1_today_rows] = await connection.query('SELECT `phone`, `code`, `invite`, `time` FROM users WHERE `invite` = ?', [userInfo.code]);
                const [level1_today_rows_today] = await connection.query('SELECT `phone`, `code`, `invite`, `time` FROM users WHERE `invite` = ? AND DATE(`today`) = ?', [userInfo.code, currentDate]);

                // ---------- LEVEL 1 USERS ----------
                let totalDepositCount = 0;
                let totalDepositAmount = 0;
                let firstDepositCount = 0;
                
                for (const user of level1_today_rows) {
                  await fetchInvitesByCode(user.code);
                
                  // 🔹 Fetch today's successful deposits
                  const [deposits] = await connection.query(
                    `SELECT money 
                     FROM recharge 
                     WHERE phone = ? 
                       AND DATE(today) = ? 
                       AND status = 1 
                       AND isdemo = 0`,
                    [user.phone, currentDate]
                  );
                
                  // 🔹 Update total count and amount
                  totalDepositCount += deposits.length;
                  totalDepositAmount += deposits.reduce(
                    (sum, dep) => sum + parseFloat(dep.money),
                    0
                  );
                
                  // 🔹 Check if today is the user's first deposit day
                  const [firstDepositCheck] = await connection.query(
                    `SELECT COUNT(*) AS is_first_deposit_today
                     FROM recharge
                     WHERE status = 1
                       AND isdemo = 0
                       AND phone = ?
                       AND DATE(today) = ?
                       AND DATE(today) = (
                           SELECT DATE(MIN(today))
                           FROM recharge
                           WHERE phone = ?
                             AND status = 1
                             AND isdemo = 0
                       )`,
                    [user.phone, currentDate, user.phone]
                  );
                
                  // 🔹 Increment if first deposit occurred today
                  if (firstDepositCheck[0].is_first_deposit_today > 0) {
                    firstDepositCount++;
                  }
                }
                
                
                // ---------- LEVEL 2 TO LEVEL 6 USERS ----------
                const level2_to_level6_today_rows = selectedData;
                let level2_to_level6totalDepositCount = 0;
                let level2_to_level6totalDepositAmount = 0;
                let level2_to_level6firstDepositCount = 0;
                
                for (const user of level2_to_level6_today_rows) {
                  // 🔹 Fetch today's successful deposits
                  const [deposits] = await connection.query(
                    `SELECT money 
                     FROM recharge 
                     WHERE phone = ? 
                       AND DATE(today) = ? 
                       AND status = 1 
                       AND isdemo = 0`,
                    [user.phone, currentDate]
                  );
                
                  // 🔹 Update total count and amount
                  level2_to_level6totalDepositCount += deposits.length;
                  level2_to_level6totalDepositAmount += deposits.reduce(
                    (sum, dep) => sum + parseFloat(dep.money),
                    0
                  );
                
                  // 🔹 Check if today is the user's first deposit day
                  const [firstDepositCheck] = await connection.query(
                    `SELECT COUNT(*) AS is_first_deposit_today
                     FROM recharge
                     WHERE status = 1
                       AND isdemo = 0
                       AND phone = ?
                       AND DATE(today) = ?
                       AND DATE(today) = (
                           SELECT DATE(MIN(today))
                           FROM recharge
                           WHERE phone = ?
                             AND status = 1
                             AND isdemo = 0
                       )`,
                    [user.phone, currentDate, user.phone]
                  );
                
                  // 🔹 Increment if first deposit occurred today
                  if (firstDepositCheck[0].is_first_deposit_today > 0) {
                    level2_to_level6firstDepositCount++;
                  }
                }
                
                
                // ---------- OPTIONAL LOGGING ----------
                console.log("Level 1 Summary:");
                console.log("Total Deposits:", totalDepositCount);
                console.log("Total Deposit Amount:", totalDepositAmount);
                console.log("First Deposit Count:", firstDepositCount);
                
                console.log("Level 2–6 Summary:");
                console.log("Total Deposits:", level2_to_level6totalDepositCount);
                console.log("Total Deposit Amount:", level2_to_level6totalDepositAmount);
                console.log("First Deposit Count:", level2_to_level6firstDepositCount);


                const formattedNextDate = new Date().toISOString().split('T')[0];
                const [existingUser] = await connection.query('SELECT `id` FROM `promotion_data` WHERE `phone` = ? AND date(`date`) = ?', [userInfo.phone, currentDate]);

                if (existingUser.length > 0) {
                    await connection.query('UPDATE `promotion_data` SET `direct_register` = ?, `direct_deposit_num` = ?, `direct_deposit_amount` = ?, `direct_deposit_first` = ?, `indirect_register` = ?, `indirect_deposit_num` = ?, `indirect_deposit_amount` = ?, `indirect_deposit_first` = ?, `levelonealltimeactive` = ?, `level2to6alltimeactive` = ? WHERE `phone` = ? AND date(`date`) = ?', [
                        level1_today_rows_today.length, totalDepositCount, totalDepositAmount, firstDepositCount,
                        level2to6activeuser, level2_to_level6totalDepositCount, level2_to_level6totalDepositAmount, level2_to_level6firstDepositCount,
                        level1_today_rows.length, selectedData.length,
                        userInfo.phone, currentDate
                    ]);
                } else {
                    await connection.query('INSERT INTO `promotion_data` (`phone`, `direct_register`, `direct_deposit_num`, `direct_deposit_amount`, `direct_deposit_first`, `indirect_register`, `indirect_deposit_num`, `indirect_deposit_amount`, `indirect_deposit_first`, `levelonealltimeactive`, `level2to6alltimeactive`, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
                        userInfo.phone, level1_today_rows_today.length, totalDepositCount, totalDepositAmount, firstDepositCount,
                        level2to6activeuser, level2_to_level6totalDepositCount, level2_to_level6totalDepositAmount, level2_to_level6firstDepositCount,
                        level1_today_rows.length, selectedData.length, currentDate
                    ]);
                }
            } catch (innerError) {
                console.error(`Error processing user token: ${ui.token}`, innerError);
                continue;
            }
        }

        console.log("All done every thing okay done promo");
        
        return "All done"
    } catch (error) {
        console.error("An error occurred:", error);
    }
};




function timerJoin2(params = '', addHours = 0) {
    let date = params ? new Date(Number(params)) : new Date();
    if (addHours !== 0) {
        date.setHours(date.getHours() + addHours);
    }

    const options = {
        timeZone: 'Asia/Kolkata', // Specify the desired time zone
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24-hour format
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const parts = formatter.formatToParts(date);

    const getPart = (type) => parts.find(part => part.type === type).value;

    const formattedDate = `${getPart('year')}-${getPart('month')}-${getPart('day')}`;

    return formattedDate;
}


const downlinerecharge_new = async (req, res) => {

  const date = timerJoin2(Date.now(), -24);
  const [allUsers] = await connection.query('SELECT `id` FROM users');

  for (let ui of allUsers) {
    try {
      let auth = ui.id;
      console.log("auth ui", auth);

      if (!auth) {
        return res.status(401).json({
          message: "Unauthorized",
          status: false,
          timeStamp: new Date().getTime(),
        });
      }

      const [user] = await connection.query(
        "SELECT `phone`, `code`, `invite` FROM users WHERE `id` = ?",
        [auth]
      );

      if (!user.length) {
        continue;
      }

      const userInfo = user[0];

      const [selectedData] = await connection.query(
        `WITH RECURSIVE downline AS (
           SELECT id_user, name_user, phone, code, invite, time, 1 AS level
           FROM users
           WHERE invite = ?
           UNION ALL
           SELECT u.id_user, u.name_user, u.phone, u.code, u.invite, u.time, d.level + 1
           FROM users u
           INNER JOIN downline d ON u.invite = d.code
           WHERE d.level < 7
         )
         SELECT * FROM downline`,
        [userInfo.code]
      );

      if (!selectedData.length) {
        console.log(`No downline users for ${userInfo.phone}`);
        continue;
      }

      const userIds = selectedData.map(u => u.id_user);

      const [existingRecords] = userIds.length > 0
        ? await connection.query(
            `SELECT userId, totalBetAmount, totalRechargeAmount, deposits_count, bet_count, first_deposit_amount,
                    p2p_amount, p2p_count
             FROM downline_recharges
             WHERE userId IN (?) AND DATE(dates) = ?`,
            [userIds, date]
          )
        : [];

      const existingMap = new Map(existingRecords.map(r => [r.userId, r]));

      let total_first_recharge_count = 0;
      let total_first_recharge_amount = 0;
      let total_recharge_count = 0;
      let total_recharge_amount = 0;
      let total_bet_count = 0;
      let total_bet_amount = 0;
      let better_number = 0;
      let total_p2p_count = 0;
      let total_p2p_amount = 0;

      const downline_user = selectedData.map(u => ({ userId: u.id_user, level: u.level }));
      const newRecords = [];

      for (const user of selectedData) {
        const existingRecord = existingMap.get(user.id_user);
        if (existingRecord) {
          total_bet_count += existingRecord.bet_count;
          total_recharge_amount += parseFloat(existingRecord.totalRechargeAmount);
          total_recharge_count += existingRecord.deposits_count;
          total_bet_amount += parseFloat(existingRecord.totalBetAmount);
          total_first_recharge_amount += parseFloat(existingRecord.first_deposit_amount);
          total_p2p_count += parseInt(existingRecord.p2p_count || 0);
          total_p2p_amount += parseFloat(existingRecord.p2p_amount || 0);
          if (existingRecord.first_deposit_amount > 0) total_first_recharge_count++;
          if (existingRecord.totalBetAmount > 0) better_number++;
        } else if (!newRecords.some(r => r.id_user === user.id_user)) {
          newRecords.push(user);
        }
      }

      if (newRecords.length) {
        const phones = newRecords.map(u => u.phone);

        const [combinedData] = await connection.query(
          `SELECT phone,
                  SUM(IFNULL(money, 0)) AS grand_total_money,
                  COUNT(*) AS row_count
           FROM (
             SELECT phone, money, today AS date FROM minutes_1 WHERE phone IN (?) AND DATE(today) = ? AND isdemo = 0
             UNION ALL
             SELECT phone, money, bet_data AS date FROM result_k3 WHERE phone IN (?) AND DATE(bet_data) = ?
             UNION ALL
             SELECT phone, money, bet_data AS date FROM result_5d WHERE phone IN (?) AND DATE(bet_data) = ?
           ) combined_table
           GROUP BY phone`,
          [phones, date, phones, date, phones, date]
        );

        const phoneMap = new Map(combinedData.map(r => [r.phone, r]));

        for (const user of newRecords) {
          const record = phoneMap.get(user.phone) || { grand_total_money: 0, row_count: 0 };

          // ✅ Recharge stats
          const [rechargeRecord] = await connection.query(
            `SELECT IFNULL(SUM(money), 0) AS grand_total_money
             FROM recharge
             WHERE phone = ? AND status = 1 AND DATE(today) = ? AND isdemo = 0`,
            [user.phone, date]
          );

          const [deposits] = await connection.query(
            `SELECT COUNT(*) AS row_count
             FROM recharge
             WHERE phone = ? AND status = 1 AND DATE(today) = ? AND isdemo = 0`,
            [user.phone, date]
          );

          // ✅ P2P stats
          const [p2pData] = await connection.query(
            `SELECT IFNULL(SUM(amount),0) AS total_amount, COUNT(*) AS total_count
             FROM p2p_to_main
             WHERE phone = ? AND DATE(date) = ?`,
            [user.phone, date]
          );

          const rechargeAmount = parseFloat(rechargeRecord[0].grand_total_money || 0);
          const p2pAmount = parseFloat(p2pData[0].total_amount || 0);
          const p2pCount = parseInt(p2pData[0].total_count || 0);

          const [rowsss] = await connection.query(
            `SELECT r.money AS first_deposit_money
             FROM recharge r
             WHERE r.status = 1 AND r.isdemo = 0 AND DATE(r.today) = ? AND r.phone = ? 
               AND r.id = (SELECT MIN(id) FROM recharge WHERE phone = r.phone AND status = 1 AND isdemo = 0)`,
            [date, user.phone]
          );

          const first_deposit_amount = rowsss.length > 0
            ? parseFloat(rowsss[0].first_deposit_money)
            : 0;

          const [firstDepositCheck] = await connection.query(
            `SELECT COUNT(*) AS is_first_deposit_today
             FROM recharge
             WHERE status = 1 AND isdemo = 0 AND phone = ? AND DATE(today) = ?
               AND DATE(today) = (SELECT DATE(MIN(today)) FROM recharge WHERE phone = ? AND status = 1 AND isdemo = 0)`,
            [user.phone, date, user.phone]
          );

          if (firstDepositCheck[0].is_first_deposit_today > 0) {
            total_first_recharge_count++;
          }

          total_bet_count += record.row_count;
          total_recharge_amount += rechargeAmount;
          total_p2p_amount += p2pAmount;
          total_p2p_count += p2pCount;
          total_recharge_count += deposits[0].row_count;
          total_bet_amount += parseFloat(record.grand_total_money);
          total_first_recharge_amount += first_deposit_amount;
          if (record.grand_total_money > 0) better_number++;

          await connection.query(
            `INSERT INTO downline_recharges 
              (userId, totalBetAmount, totalRechargeAmount, deposits_count, bet_count, dates, first_deposit_amount, p2p_amount, p2p_count)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              user.id_user,
              record.grand_total_money,
              rechargeAmount,
              deposits[0].row_count,
              record.row_count,
              date,
              first_deposit_amount,
              p2pAmount,
              p2pCount
            ]
          );
        }
      }

      // ✅ Update or insert into downline_summary
      const [existingRecord] = await connection.query(
        `SELECT * FROM downline_summary WHERE phone = ? AND DATE(date) = ?`,
        [userInfo.phone, date]
      );

      if (existingRecord.length > 0) {
        await connection.query(
          `UPDATE downline_summary
           SET total_first_recharge_count = ?, 
               total_recharge_count = ?, 
               total_recharge_amount = ?, 
               total_bet_count = ?, 
               total_bet_amount = ?, 
               better_number = ?, 
               downline_user = ?, 
               date = ?,
               first_deposit_amount = ?,
               p2p_amount = ?,
               p2p_count = ?
           WHERE phone = ? AND DATE(date) = ?`,
          [
            total_first_recharge_count,
            total_recharge_count,
            total_recharge_amount,
            total_bet_count,
            total_bet_amount,
            better_number,
            JSON.stringify(downline_user),
            date,
            total_first_recharge_amount,
            total_p2p_amount,
            total_p2p_count,
            userInfo.phone,
            date
          ]
        );
      } else {
        await connection.query(
          `INSERT INTO downline_summary 
            (phone, total_first_recharge_count, total_recharge_count, total_recharge_amount, total_bet_count, total_bet_amount, better_number, downline_user, date, first_deposit_amount, p2p_amount, p2p_count)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userInfo.phone,
            total_first_recharge_count,
            total_recharge_count,
            total_recharge_amount,
            total_bet_count,
            total_bet_amount,
            better_number,
            JSON.stringify(downline_user),
            date,
            total_first_recharge_amount,
            total_p2p_amount,
            total_p2p_count
          ]
        );
      }

    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({
        message: error.message,
        status: false,
        timeStamp: new Date().getTime(),
      });
    }
  }

  console.log("All done everything fine subordinatedata");

  await connection.query(
    `DELETE FROM downline_summary
     WHERE id NOT IN (
       SELECT * FROM (
         SELECT MIN(id)
         FROM downline_summary
         WHERE DATE(date) = ?
         GROUP BY phone
       ) AS temp
     ) AND DATE(date) = ?`,
    [date, date]
  );
};

// promotion()
// downlinerecharge_new()


module.exports = {
    promotion,
    downlinerecharge_new,
}

