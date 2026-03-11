import connection from "../config/connectDB";

require('dotenv').config();


const isNumber = (params) => {
    let pattern = /^[0-9]*\d$/;
    return pattern.test(params);
}

function formateT (params) {
    let result = (params < 10) ? "0" + params : params;
    return result;
}


const commissions = async (auth, money) => {
    const [user] = await connection.query('SELECT `phone`, `code`, `invite`, `user_level`, `total_money` FROM users WHERE token = ?', [auth]);
    let userInfo = user


    const [level] = await connection.query('SELECT * FROM level ');

    let checkTime2 = timerJoin2(Date.now());


    let uplines2 = userInfo;
    let count = 0
    for (let i = 0; i < 6; i++) {
        const rosesFs = (money / 100) * level[i].f1

        if (uplines2.length !== 0) {
            let [upline1] = await connection.query('SELECT * FROM users WHERE code = ?', [uplines2[0].invite]);

            if (upline1.length > 0) {
                count++

                const commissions = `INSERT INTO commission SET 
                  phone = ?,
                  bonusby=?,
                  type = ?,
                  commission=?,
                  amount = ?,
                  level = ?,
                  date = ?`;
                await connection.execute(commissions, [upline1[0].phone, uplines2[0].phone, "Bet", rosesFs, money, count, checkTime2]);
                await connection.query('INSERT INTO subordinatedata SET phone = ?, bonusby=?, type = ?, commission=?, amount = ?, level=?, `date` = ?', [upline1[0].phone, uplines2[0].phone, "bet commission", rosesFs, money, count, checkTime2]);

                await connection.query('UPDATE users SET pending_commission = pending_commission + ? WHERE phone = ? ', [rosesFs, upline1[0].phone]);
                uplines2 = upline1;
            } else {
                break; // Exit the loop if no further uplines are found
            }
        } else {
            break; // Exit the loop if uplines2 is empty
        }
    }

}


const rosesPlus = async (auth, money) => {
    const [level] = await connection.query('SELECT * FROM level ');

    const [user] = await connection.query('SELECT `phone`, `code`, `invite`, `user_level`, `total_money` FROM users WHERE token = ? AND veri = 1 LIMIT 1 ', [auth]);
    let userInfo = user[0];
    const [f1] = await connection.query('SELECT `phone`, `code`, `invite`, `rank`, `user_level`, `total_money` FROM users WHERE code = ? AND veri = 1 LIMIT 1 ', [userInfo.invite]);

    let checkTime2 = timerJoin2(Date.now());



    if (userInfo.total_money >= 100) {
        if (f1.length > 0) {
            let infoF1 = f1[0];
            for (let levelIndex = 1; levelIndex <= 6; levelIndex++) {
                let rosesF = 0;
                if (infoF1.user_level >= levelIndex && infoF1.total_money >= 100) {
                    rosesF = (money / 100) * level[levelIndex - 1].f1;
                    if (rosesF > 0) {
                        await connection.query('UPDATE users SET roses_f = roses_f + ?, roses_today = roses_today + ? WHERE phone = ? ', [rosesF, rosesF, infoF1.phone]);
                        let timeNow = Date.now();
                        const datasql = 'INSERT INTO transaction_history SET phone = ?, detail = ?, balance = ?, `time` =?';
                        await connection.execute(datasql, [infoF1.phone, "Agent Commission", rosesF, checkTime2]);
                        const sql2 = `INSERT INTO roses SET 
                            phone = ?,
                            code = ?,
                            invite = ?,
                            f1 = ?,
                            time = ?`;
                        await connection.execute(sql2, [infoF1.phone, infoF1.code, infoF1.invite, rosesF, timeNow]);



                        const sql3 = `
                            INSERT INTO turn_over (phone, code, invite, daily_turn_over, total_turn_over)
                            VALUES (?, ?, ?, ?, ?)
                            ON DUPLICATE KEY UPDATE
                            daily_turn_over = daily_turn_over + VALUES(daily_turn_over),
                            total_turn_over = total_turn_over + VALUES(total_turn_over)
                            `;

                        await connection.execute(sql3, [infoF1.phone, infoF1.code, infoF1.invite, money, money]);
                    }
                }
                const [fNext] = await connection.query('SELECT `phone`, `code`, `invite`, `rank`, `user_level`, `total_money` FROM users WHERE code = ? AND veri = 1 LIMIT 1 ', [infoF1.invite]);
                if (fNext.length > 0) {
                    infoF1 = fNext[0];
                } else {
                    break;
                }
            }
        }
    }
}


const betcargame = async (req, res) => {
    
    let { typeid, join, x, money, activePoint } = req.body;
    let auth = req.cookies.auth;

    if (![1, 3, 5, 10].includes(typeid)) {
        return res.status(200).json({
            message: 'Invalid type id',
            status: false
        });
    }

    const gameMap = {
        1: 'cargame',
        3: 'cargame3',
        5: 'cargame5',
        10: 'cargame10',
    };
    const gameJoin = gameMap[typeid];

    const [cargameNow] = await connection.query(`SELECT period FROM cargame WHERE status = 0 AND game = ? ORDER BY id DESC LIMIT 1`, [gameJoin]);
    const [user] = await connection.query('SELECT * FROM users WHERE token = ? AND veri = 1 LIMIT 1', [auth]);

    if (!cargameNow[0] || !user[0] || !isNumber(x) || !isNumber(money)) {
        return res.status(200).json({
            message: 'Invalid data',
            status: false
        });
    }

    let userInfo = user[0];
    let period = cargameNow[0].period;
    let fee = (x * money) * 0.02;
    let total = (x * money) - fee;
    let timeNow = Date.now();
    let check = userInfo.money - total;

    if (check < 0) {
        return res.status(200).json({
            message: 'The amount is not enough',
            status: false
        });
    }

    let date = new Date();
    let id_product = formateT(date.getFullYear()) + formateT(date.getMonth() + 1) + formateT(date.getDate()) + Math.floor(Math.random() * 1000000000000000);
    let checkTime = timerJoin2(date.getTime());

    const sql = `INSERT INTO cargame_result SET 
        id_product = ?,
        phone = ?,
        code = ?,
        invite = ?,
        stage = ?,
        level = ?,
        money = ?,
        amount = ?,
        fee = ?,
        get = ?,
        game = ?,
        gamePosition=?,
        bet = ?,
        status = ?,
        today = ?,
        time = ?,
        isdemo = ?`;

    await connection.execute(sql, [id_product, userInfo.phone, userInfo.code, userInfo.invite, period, userInfo.level, total, x, fee, 0, gameJoin, activePoint, join, 0, checkTime, timeNow, userInfo.isdemo]);

    await connection.execute('UPDATE `users` SET `money` = `money` - ?, `rebate` = `rebate` + ? WHERE `token` = ?', [money * x, money * x, auth]);

    // Respond immediately after critical operations
    const [updatedUser] = await connection.query('SELECT * FROM users WHERE token = ? AND veri = 1 LIMIT 1', [auth]);

    let total_money = money * x;

    let total_recharge = userInfo.recharge - total_money;

    if (total_recharge < 0) {
        total_recharge = 0
    }

    await connection.execute('UPDATE `users` SET `recharge` = ? WHERE `phone` = ?', [total_recharge, userInfo.phone]);



    const datasql = 'INSERT INTO transaction_history SET phone = ?, detail = ?, balance = ?, `time` = ?';
    await connection.query(datasql, [userInfo.phone, "Bet", total, checkTime]);

    await rosesPlus(auth, money * x);
    await commissions(auth, money * x);

    res.status(200).json({
        message: 'Bet Succeed',
        status: true,
        change: updatedUser[0].level,
        money: updatedUser[0].money,
    });




};


function timerJoin2 (params = '', addHours = 0) {
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

    const formattedDate = `${getPart('year')}-${getPart('month')}-${getPart('day')} ${getPart('hour')}:${getPart('minute')}:${getPart('second')}`;

    return formattedDate;
}






const listOrderOld = async (req, res) => {
    let { typeid, pageno, pageto } = req.body;
    console.log(req.body);

    // Validate typeid
    if (![1, 3, 5, 10].includes(typeid)) {
        return res.status(200).json({
            message: 'Invalid type id',
            status: false
        });
    }

    // Validate pageno and pageto
    if (pageno < 1 || pageto < 1) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }

    let auth = req.cookies.auth;
    const [user] = await connection.query('SELECT phone, code, invite, level, money FROM users WHERE token = ? AND veri = 1 LIMIT 1', [auth]);

    if (!user[0]) {
        return res.status(200).json({
            message: 'Error! user is missing.',
            status: false
        });
    }

    let game = '';
    if (typeid == 1) game = 'cargame';
    if (typeid == 3) game = 'cargame3';
    if (typeid == 5) game = 'cargame5';
    if (typeid == 10) game = 'cargame10';


    const offset = pageno - 1; // Adjust for 1-based index
    const limit = pageto - pageno + 1; // Number of rows to fetch

    const [cargame] = await connection.query(`
        SELECT * 
        FROM cargame 
        WHERE status != 0 AND game = '${game}' 
        ORDER BY id DESC 
        LIMIT ${limit} OFFSET ${offset}
    `);

    const [cargameAll] = await connection.query(`SELECT * FROM cargame WHERE status != 0 AND game = '${game}'`);
    const [period] = await connection.query(`SELECT period, time FROM cargame WHERE status = 0 AND game = '${game}' ORDER BY id DESC LIMIT 1`);




    if (!cargame.length) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }

    if (!period.length) {
        return res.status(200).json({
            message: 'Error! period is missing.',
            status: false
        });
    }

    let page = Math.ceil(cargameAll.length / limit);

    return res.status(200).json({
        code: 0,
        msg: "Get success",
        data: {
            gameslist: cargame,
        },
        period: period[0].period,
        page: page,
        time: period[0].time,
        status: true
    });
};



const GetMyEmerdList = async (req, res) => {
    let { typeid, pageno, pageto } = req.body;



    if (typeid != 1 && typeid != 3 && typeid != 5 && typeid != 10) {
        return res.status(200).json({
            message: 'Invalid type id',
            status: false
        });
    }

    if (pageno < 0 || pageto < 0) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }
    let auth = req.cookies.auth;

    const [user] = await connection.query(
        "SELECT phone, code, invite, level, money FROM users WHERE token = ? AND veri = 1 LIMIT 1",
        [auth]
    );

    if (!user[0]) {
        return res.status(200).json({
            message: "Error! user is missing.",
            status: false,
        });
    }
    let game = '';
    if (typeid == 1) game = 'cargame';
    if (typeid == 3) game = 'cargame3';
    if (typeid == 5) game = 'cargame5';
    if (typeid == 10) game = 'cargame10';


    const offset = pageno - 1; // Adjust for 1-based index
    const limit = pageto - pageno + 1; // Number of rows to fetch


    const [cargame_result] = await connection.query(`SELECT * FROM cargame_result WHERE phone = ? AND game = '${game}' ORDER BY id DESC  LIMIT ${limit} OFFSET ${offset}`, [user[0].phone]);
    const [cargame_resultAll] = await connection.query(`SELECT * FROM cargame_result WHERE phone = ? AND game = '${game}' ORDER BY id DESC `, [user[0].phone]);

    if (cargame_result[0] === undefined || cargame_result[0] === null) {
        return res.status(200).json({
            code: 0,
            msg: "No more data",
            data: {
                gameslist: [],
            },
            status: false
        });
    }

    if (pageno === undefined || pageno === null || pageto === undefined || pageto === null || user[0] === undefined || user[0] === null || cargame_result[0] === undefined || cargame_result[0] === null) {
        return res.status(200).json({
            message: 'Error!',
            status: false
        });
    }
    let page = Math.ceil(cargame_resultAll.length / 10);



    return res.status(200).json({
        code: 0,
        msg: "Get success data",
        data: {
            gameslist: cargame_result,
        },
        page: page,
        status: true
    });
}


function generateRandomHash (length) {
    const characters = 'abcdef0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}





function timerJoins (params = '', addHours = 0) {
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

    const formattedDate = `${getPart('year')}${getPart('month')}${getPart('day')}`;

    return formattedDate;
}

// Function to shuffle the array in place
function shuffleArrayInPlace (array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}


const addcargame_handel = async (join, position) => {
    try {
        const [setting] = await connection.query('SELECT * FROM `admin`');
        let amount = Math.floor(Math.random() * 10);

        const [minPlayers] = await connection.query(
            `SELECT * FROM cargame_result WHERE gamePosition = ? AND status = 0 AND isdemo = 0 AND game = ?`, 
            [position, join]
        );

        if (minPlayers.length >= 1) {
            const betColumns = [
                { name: 'red_small', bets: ['0', '2', '4', 'd', 'n'] },
                { name: 'red_big', bets: ['6', '8', 'd', 'l'] },
                { name: 'green_big', bets: ['5', '7', '9', 'x', 'l'] },
                { name: 'green_small', bets: ['1', '3', 'x', 'n'] },
                { name: 'violet_small', bets: ['0', 't', 'n'] },
                { name: 'violet_big', bets: ['5', 't', 'l'] }
            ];

            shuffleArrayInPlace(betColumns);

            const categories = await Promise.all(
                betColumns.map(async column => {
                    const [result] = await connection.query(
                        `SELECT SUM(money) AS total_money FROM cargame_result WHERE gamePosition = ? AND game = ? AND status = 0 AND isdemo = 0 AND bet IN (${column.bets.map(() => '?').join(',')})`,
                        [position, join, ...column.bets]
                    );
                    return { name: column.name, total_money: parseInt(result[0]?.total_money) || 0 };
                })
            );

            shuffleArrayInPlace(categories);

            const smallestCategory = categories.reduce((smallest, category) =>
                (!smallest || category.total_money < smallest.total_money) ? category : smallest
            );

            const [color, size] = smallestCategory.name.split('_');
            let availableBets = betColumns.find(col => col.name === `${color}_${size}`)?.bets || [];
            const validBets = availableBets.filter(bet => !isNaN(parseInt(bet, 10)));
            amount = parseInt(validBets[Math.floor(Math.random() * validBets.length)], 10);
        }

        console.log(join, "position: ", position, " result: ", amount);
        
        return amount;
    } catch (error) {
        console.error(error);
    }
};

const addcargame = async (game) => {
    try {
        const gameMap = {
            1: 'cargame',
            3: 'cargame3',
            5: 'cargame5',
            10: 'cargame10'
        };
        let join = gameMap[game] || '';
        let updatenum = { 1: 1, 3: 2, 5: 3, 10: 4 }[game] || 1;

        const [cargameNow] = await connection.query(
            `SELECT period FROM cargame WHERE status = 0 AND game = ? ORDER BY id DESC LIMIT 1`, 
            [join]
        );

        let period = cargameNow[0]?.period || "9787955";
        const [setting] = await connection.query('SELECT * FROM `admin`');
        let nextResult = setting[0][join] || '-1';
        let newArr = '';

        if (nextResult == '-1') {
            let [result1, result2, result3] = await Promise.all([
                addcargame_handel(join, 1),
                addcargame_handel(join, 2),
                addcargame_handel(join, 3)
            ]);
            newArr = `${result1},${result2},${result3}`;
            
            console.log(join," result", newArr, "period", period);
            
            await connection.execute(
                `UPDATE cargame SET amount = ?, status = ? WHERE period = ? AND game = ?`,
                [newArr, 1, period, join]
            );
        } else {
            await connection.execute(
                `UPDATE cargame SET amount = ?, status = ? WHERE period = ? AND game = ?`,
                [nextResult, 1, period, join]
            );
        }

        let times = timerJoins(Date.now());
      

        const newPeriod = BigInt(period) + BigInt(1);
        
        console.log("data",join,game)

        await connection.execute(
            `INSERT INTO cargame (period, amount, game, status, time) VALUES (?, ?, ?, ?, ?)`,
            [String(newPeriod), 0, join, 0, timerJoin2(Date.now())]
        );

        await connection.execute(`UPDATE admin SET ${join} = -1`);
    } catch (error) {
        console.error(error);
    }
};




const handlingcargame1P = async (typeid) => {

    let game = '';
    if (typeid == 1) game = 'cargame';
    if (typeid == 3) game = 'cargame3';
    if (typeid == 5) game = 'cargame5';
    if (typeid == 10) game = 'cargame10';

    handlingcargamepostion(typeid, 1);
    handlingcargamepostion(typeid, 2);
    handlingcargamepostion(typeid, 3);

}


const handlingcargamepostion = async (typeid, carpostion) => {

    let game = '';
    if (typeid == 1) game = 'cargame';
    if (typeid == 3) game = 'cargame3';
    if (typeid == 5) game = 'cargame5';
    if (typeid == 10) game = 'cargame10';

try{
    
    

    const [cargameNow] = await connection.query(`SELECT * FROM cargame WHERE status != 0 AND game = '${game}'  ORDER BY id DESC LIMIT 1 `);

    // update ket qua
    await connection.execute(`UPDATE cargame_result SET result = ? WHERE status = 0 AND game = '${game}' AND gamePosition = ${carpostion} `, [cargameNow[0].amount]);
    
    let result = cargameNow[0]?.amount;
    
    function getDigitByPosition(numStr, position) {
        let numArray = numStr.split(','); // Split by comma to get an array
        return numArray[position - 1] ? Number(numArray[position - 1]) : null;
    }



    switch (getDigitByPosition(result, carpostion)) {
        case 0:
            await connection.execute(`UPDATE cargame_result SET status = 2 WHERE status = 0 AND game = "${game}" AND gamePosition = ${carpostion} AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "0" AND bet != "t" `, []);
            break;
        case 1:
            await connection.execute(`UPDATE cargame_result SET status = 2 WHERE status = 0 AND game = "${game}" AND gamePosition = ${carpostion}  AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "1" `, []);
            break;
        case 2:
            await connection.execute(`UPDATE cargame_result SET status = 2 WHERE status = 0 AND game = "${game}" AND gamePosition = ${carpostion}  AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "2" `, []);
            break;
        case 3:
            await connection.execute(`UPDATE cargame_result SET status = 2 WHERE status = 0 AND game = "${game}" AND gamePosition = ${carpostion}  AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "3" `, []);
            break;
        case 4:
            await connection.execute(`UPDATE cargame_result SET status = 2 WHERE status = 0 AND game = "${game}" AND gamePosition = ${carpostion}  AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "4" `, []);
            break;
        case 5:
            await connection.execute(`UPDATE cargame_result SET status = 2 WHERE status = 0 AND game = "${game}" AND gamePosition = ${carpostion}  AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "5" AND bet != "t" `, []);
            break;
        case 6:
            await connection.execute(`UPDATE cargame_result SET status = 2 WHERE status = 0 AND game = "${game}" AND gamePosition = ${carpostion}  AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "6" `, []);
            break;
        case 7:
            await connection.execute(`UPDATE cargame_result SET status = 2 WHERE status = 0 AND game = "${game}" AND gamePosition = ${carpostion}  AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "7" `, []);
            break;
        case 8:
            await connection.execute(`UPDATE cargame_result SET status = 2 WHERE status = 0 AND game = "${game}" AND gamePosition = ${carpostion}  AND bet != "l" AND bet != "n" AND bet != "d" AND bet != "8" `, []);
            break;
        case 9:
            await connection.execute(`UPDATE cargame_result SET status = 2 WHERE status = 0 AND game = "${game}" AND gamePosition = ${carpostion}  AND bet != "l" AND bet != "n" AND bet != "x" AND bet != "9" `, []);
            break;
        default:
            break;
    }

    if (getDigitByPosition(result, carpostion) < 5) {
        await connection.execute(`UPDATE cargame_result SET status = 2 WHERE status = 0 AND game = "${game}" AND gamePosition = ${carpostion}  AND bet = "l" `, []);
    } else {
        await connection.execute(`UPDATE cargame_result SET status = 2 WHERE status = 0 AND game = "${game}" AND gamePosition = ${carpostion}  AND bet = "n" `, []);
    }

    // lấy ra danh sách đặt cược chưa xử lý
    const [orders] = await connection.execute(`SELECT * FROM cargame_result WHERE status = 0 AND game = '${game}' AND gamePosition = ${carpostion} `);

    const processBet = async (orders) => {


        let result = getDigitByPosition(orders?.result, carpostion);
        let bet = orders.bet;
        let total = orders.money;
        let id = orders.id;
        let phone = orders.phone;
        let nhan_duoc = 0;

        if (bet == 'l' || bet == 'n') {
            nhan_duoc = total * 2;
        } else {
            if (result == 0 || result == 5) {
                if (bet == 'd' || bet == 'x') {
                    nhan_duoc = total * 1.5;
                } else if (bet == 't') {
                    nhan_duoc = total * 4.5;
                } else if (bet == "0" || bet == "5") {
                    nhan_duoc = total * 4.5;
                }
            } else {
                if (result == 1 && bet == "1") {
                    nhan_duoc = total * 9;
                } else if (result == 1 && bet == 'x') {
                    nhan_duoc = total * 2;
                }
                if (result == 2 && bet == "2") {
                    nhan_duoc = total * 9;
                } else if (result == 2 && bet == 'd') {
                    nhan_duoc = total * 2;
                }
                if (result == 3 && bet == "3") {
                    nhan_duoc = total * 9;
                } else if (result == 3 && bet == 'x') {
                    nhan_duoc = total * 2;
                }
                if (result == 4 && bet == "4") {
                    nhan_duoc = total * 9;
                } else if (result == 4 && bet == 'd') {
                    nhan_duoc = total * 2;
                }
                if (result == 6 && bet == "6") {
                    nhan_duoc = total * 9;
                } else if (result == 6 && bet == 'd') {
                    nhan_duoc = total * 2;
                }
                if (result == 7 && bet == "7") {
                    nhan_duoc = total * 9;
                } else if (result == 7 && bet == 'x') {
                    nhan_duoc = total * 2;
                }
                if (result == 8 && bet == "8") {
                    nhan_duoc = total * 9;
                } else if (result == 8 && bet == 'd') {
                    nhan_duoc = total * 2;
                }
                if (result == 9 && bet == "9") {
                    nhan_duoc = total * 9;
                } else if (result == 9 && bet == 'x') {
                    nhan_duoc = total * 2;
                }
            }
        }

        let checkTime2 = timerJoin2(Date.now());

        let totalsGet = parseFloat(nhan_duoc);

        await connection.execute('UPDATE `cargame_result` SET `get` = ?, `status` = 1 WHERE `id` = ? ', [totalsGet, id]);
        await connection.execute('INSERT INTO transaction_history SET phone = ?, detail = ?, balance = ?, `time` = ?', [phone, "Win", totalsGet, checkTime2]);
        await connection.execute('UPDATE `users` SET `money` = `money` + ? WHERE `phone` = ?', [totalsGet, phone]);
    };

    const promises = orders.map(order => processBet(order));

    await Promise.all(promises);
    
}catch(error){
  console.log(error)
}



}















module.exports = {

    betcargame,
    listOrderOld,
    GetMyEmerdList,
    handlingcargame1P,
    addcargame,

}