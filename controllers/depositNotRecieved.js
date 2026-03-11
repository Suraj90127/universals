import connection from "../config/connectDB";
const { uploadImage } = require("../utils/uploadImage");
const md5 = require("md5");
import request from "request";



exports.depositNotReceived = async (req, res) => {
    try {
         console.log(req.body);
        const { UTRNumber, ReceiverUPIID, OrderNumber, OrderAmount,auth } =   req.body;
        console.log(UTRNumber ,ReceiverUPIID,OrderNumber,OrderAmount)

        const [results] = await connection.query("SELECT phone FROM users WHERE token = ?", [auth]);

        if (results.length === 0) {
            return res.status(400).json({ message: "User does not exist", success: false });
        }

        const phone = results[0].phone; 
        console.log(phone, "this is phone number");

        if (!UTRNumber || !ReceiverUPIID || !OrderNumber || !OrderAmount) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        let proof1Url = null;
        let proof2Url = null;

        if (req.files) {
            if (req.files.proof1) {
                proof1Url = await uploadImage(req.files.proof1);
            }
            if (req.files.proof2) {
                proof2Url = await uploadImage(req.files.proof2);
            }
        }

        // Insert into the database

        const saveData  =  await connection.query(` INSERT INTO DepositNotReceived 
            (UTRNumber, ReceiverUPIID, OrderNumber, OrderAmount, proof1, proof2,phone)
            VALUES (?, ?, ?, ?, ?, ?,?)` ,  [UTRNumber, ReceiverUPIID, OrderNumber, OrderAmount, proof1Url, proof2Url,phone])
        
          return res.status(200).json({
          success:true,
          message:"details update successfully"

        })


    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
};

//withdrawl problems 

exports.withdrawlProblems = async(req,res)=>{
  try{
          
          const { auth, BankName, ifsccode, AccountNumber, UsdtAddress, ProblemDescription, OrderNumber, OrderAmount } = req.body;

          const [results] = await connection.query("SELECT phone FROM users WHERE token = ?", [auth]);

          if (results.length === 0) {
            return res.status(400).json({ message: "User does not exist", success: false });
          }

         const phone = results[0].phone; 
         console.log(phone, "this is phone number");


         let proof1Url = null;
        let proof2Url = null;

        if (req.files) {
            if (req.files.proof1) {
                proof1Url = await uploadImage(req.files.proof1);
            }
            if (req.files.proof2) {
                proof2Url = await uploadImage(req.files.proof2);
            }
        }


         await connection.query(`INSERT INTO withdrawlProblem (phone, BankName, ifsccode, AccountNumber, UsdtAddress, ProblemDescription, OrderNumber, OrderAmount, proof1, proof2)
          VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            
            phone || null, 
            BankName || null, 
            ifsccode || null, 
            AccountNumber || null, 
            UsdtAddress || null, 
            ProblemDescription || null, 
            OrderNumber || null, 
            OrderAmount || null, 
            proof1Url || null, 
            proof2Url || null
        ])


        return res.status(200).json({
              success:true,
              message:"Problem update successfully"
        })


        

  }
  catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Server error", success: false, error: error.message });
  }

  
}




//ifsc-modification 

exports.ifscModification = async (req, res) => {
    try {
        const {BankNumber,IFSCCode,auth} = req.body;

        const [results] = await connection.query("SELECT phone FROM users WHERE token = ?", [auth]);

        if (results.length === 0) {
            return res.status(400).json({ message: "User does not exist", success: false });
        }

        const phone = results[0].phone; 
        console.log(phone, "this is phone number");

        if (!BankNumber || !IFSCCode) {
            return res.status(400).json({ message: "Both BankNumber and IFSCCode are required", success: false });
        }
        
   await connection.query(
  "UPDATE user_bank SET stk = ?, email = ? WHERE phone = ?",
  [BankNumber, IFSCCode, results[0].phone]
);

// console.log("jjjjj",BankNumber, IFSCCode, results[0].phone)
        const saveIfsc  =  await connection.query(`INSERT INTO IFSCModification (BankNumber, IFSCCode,phone) VALUES (?,?,?)`,[BankNumber, IFSCCode,phone])

        return res.status(200).json({
          success:true,
          message:"details update successfully"

        })


    } catch (error) {
        return res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
};



//-->Bank Name 


exports.bankName = async (req, res) => {
  try {

      // const { stk, name_bank, name_user, sdt, tp, email, tinh, chi_nhanh,auth } = req.body;
      const{BankNumber ,BankName,auth } = req.body
      console.log(req.body);

      const [results] = await connection.query("SELECT phone FROM users WHERE token = ?", [auth]);

      if (results.length === 0) {
            return res.status(400).json({ message: "User does not exist", success: false });
        }

      const phone = results[0].phone; 
      console.log(phone, "this is phone number");


      // Validate required fields
     // stk-accsdt-ifsc-code
      if (!BankNumber || !BankName) {
          return res.status(400).json({ 
              message: "stk, name_bank, phone, name_user, and sdt are required", 
              success: false 
          });
      }

      const saveBank   =  await connection.query(`UPDATE user_bank SET  name_bank=? WHERE phone=? AND stk=?` , [
            BankName, phone ,BankNumber
           
        ])

      return res.status(200).json({
        success:true,
        message:"details update successfully"

      })

  } catch (error) {
      res.status(500).json({ 
          message: "Server error", 
          success: false, 
          error: error.message 
      });
  }
};




//-->Bank Modification 
exports.bankModification = async (req, res) => {
    try {
        const {
            BankName, OldBankName, OldBeneficiaryName, OldAccountNumber,
            OldIFSCCode, NewBankName, NewBeneficiaryName, NewAccountNumber, NewIFSCCode,auth
        } = req.body;

        const [results] = await connection.query("SELECT phone FROM users WHERE token = ?", [auth]);

        if (results.length === 0) {
            return res.status(400).json({ message: "User does not exist", success: false });
        }

        const phone = results[0].phone; 
        console.log(phone, "this is phone number");

        if (!BankName || !OldBankName || !OldBeneficiaryName || !OldAccountNumber || 
            !OldIFSCCode || !NewBankName || !NewBeneficiaryName || !NewAccountNumber || !NewIFSCCode) {
            return res.status(400).json({ message: "All required fields must be provided", success: false });
        }

        // Upload files using uploadImage function
        const identityCard = req.files?.IdentityCard ? await uploadImage(req.files.IdentityCard) : null;
        const oldPassbook = req.files?.OldPassbook ? await uploadImage(req.files.OldPassbook) : null;
        const newPassbook = req.files?.NewPassbook ? await uploadImage(req.files.NewPassbook) : null;
        const latestDeposit = req.files?.LatestDeposit ? await uploadImage(req.files.LatestDeposit) : null;


        const modifyBank =  await connection.query(` INSERT INTO BankModification (
                BankName, OldBankName, OldBeneficiaryName, OldAccountNumber, OldIFSCCode,
                NewBankName, NewBeneficiaryName, NewAccountNumber, NewIFSCCode,
                IdentityCard, OldPassbook, NewPassbook, LatestDeposit,phone
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)` ,  [
              BankName, OldBankName, OldBeneficiaryName, OldAccountNumber, OldIFSCCode,
              NewBankName, NewBeneficiaryName, NewAccountNumber, NewIFSCCode,
              identityCard, oldPassbook, newPassbook, latestDeposit,phone
          ])

        return res.status(200).json({
             success:true,
             message:"modify bank details successfully"
        })

       
       
    } catch (error) {
        res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
};



//USDT-Address

//Tiranga ID , USDT Address , Address Screenshot,Identity Card,Passbook ,LatestDeposit
exports.addUSDTAddress = async (req, res) => {
    try {
        const { TirangaID, USDTWalletAddress ,auth } = req.body;
        console.log(auth , "token");

        // const query1 =   `SELECT phone From  users  WHERE token = ?`

        const [results] = await connection.query("SELECT phone FROM users WHERE token = ?", [auth]);

        if (results.length === 0) {
            return res.status(400).json({ message: "User does not exist", success: false });
        }

        const phone = results[0].phone; 
        console.log(phone, "this is phone number");

        if (!TirangaID || !USDTWalletAddress) {
            return res.status(400).json({ message: "TirangaID and USDTWalletAddress are required", success: false });
        }

        // Upload images using uploadImage function
        const addressScreenshot = req.files?.AddressScreenshot ? await uploadImage(req.files.AddressScreenshot) : null;
        const identityCard = req.files?.IdentityCard ? await uploadImage(req.files.IdentityCard) : null;
        const passbook = req.files?.Passbook ? await uploadImage(req.files.Passbook) : null;
        const latestDeposit = req.files?.LatestDeposit ? await uploadImage(req.files.LatestDeposit) : null;

        // Insert into the database

         await connection.query( `
          INSERT INTO USDTAddress (
              TirangaID, USDTWalletAddress, AddressScreenshot, IdentityCard, Passbook, LatestDeposit ,phone
          ) VALUES (?, ?, ?, ?, ?, ? , ?)` , [
            TirangaID, USDTWalletAddress, addressScreenshot, identityCard, passbook, latestDeposit,phone
        ])


       

        return res.status(200).json({
             success:true,
             message:"details update successfully"

        })

    } catch (error) {
        res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
};



//activity-bonus 
//content , Tiranga ID , winningrecord

exports.addBonus = async (req, res) => {
    try {
        const { TirangaID, content,auth} = req.body;
        const [results] = await connection.query("SELECT phone FROM users WHERE token = ?", [auth]);

        if (results.length === 0) {
            return res.status(400).json({ message: "User does not exist", success: false });
        }

        const phone = results[0].phone; 
        console.log(phone, "this is phone number");

        if (!TirangaID || !content) {
            return res.status(400).json({ message: "TirangaID and content are required", success: false });
        }

        if (content.length > 500) {
            return res.status(400).json({ message: "Content cannot exceed 500 characters", success: false });
        }

        // Upload winning record image
        console.log(req.files?.winningRecord)
        const winningRecord = req.files?.winningRecord ? await uploadImage(req.files.winningRecord) : null;

        
        const saveBonus  =  await connection.query(` INSERT INTO bonus (TirangaID, content, winningRecord,phone) 
            VALUES (?, ?, ?,?)` ,[TirangaID, content, winningRecord,phone])

        return res.status(200).json({
          success:true,
          message:"details update successfully"

     })



    } catch (error) {
        res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
};


//Problems 
//Content , photo 
exports.addProblem = async (req, res) => {
    try {
        const { Content,auth } = req.body ;

        const [results] = await connection.query("SELECT phone FROM users WHERE token = ?", [auth]);

        if (results.length === 0) {
            return res.status(400).json({ message: "User does not exist", success: false });
        }

        const phone = results[0].phone; 
        // console.log(phone, "this is phone number");

        if (!Content) {
            return res.status(400).json({ message: "Content is required", success: false });
        }

        if (Content.length > 500) {
            return res.status(400).json({ message: "Content cannot exceed 500 characters", success: false });
        }

        // Upload Photo (if provided)
        console.log(req.files?.Photo )
        const Photo = req.files?.Photo ? await uploadImage(req.files.Photo) : null;

        if(!Photo)
        {
            return res.status(400).json({ message: "Photo is required", success: false }); 
        }

console.log("ddd",Content,Photo)
        // Insert into database

        const saveProblem  =  await connection.query(`INSERT INTO problems (Content,Photo,phone) VALUES (?, ?,?)`,[Content, Photo,phone])
       

        return res.status(200).json({
             success:true,
             message:"add problem successsfully"
        })

      

    } catch (error) {
        console.log("err",error)
        res.status(500).json({ message: "Server error", success: false, error: error.message });
    }
};



// update

//sendOtp , function 
let generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};


exports.sendOtp = async (req, res) => {              
    const { phone } = req.body;
    
    try {
    //   console.log(phone);
      
      if (!phone || typeof phone !== "string") {
        return res.status(400).json({
          message: "Phone number is required and must be a valid string",
        });
      }
  
      let otp = generateOTP();
  
      // Check if the user exists in the database
    const [results]=await connection.query("SELECT * FROM users WHERE phone = ?", [phone]);
    
    if(results.length===0){
           return res.status(200).json({
              message: "user not found,",
             success:false
            });
    }
   
           request(
    `https://www.fast2sms.com/dev/bulkV2?authorization=Q4IFYjEPAn39bXVudJRciN7sqozZvS2BK1kTl8GeHthMywgpUWO9fTUHPwtMzGCDlQuL6mW053qhNnS2&route=otp&variables_values=${otp}&flash=0&numbers=${phone}`,
    async (error, response, body) => {
      let data = JSON.parse(response.body);
      console.log("ss",data)
      if (data.return) {
        await connection.execute(
          "UPDATE users SET otp = ? WHERE phone = ? ",
          [otp, phone]
        );
        return res.status(200).json({
          message: "OTP sent successfully",
          status: true,
        });
      }else{
          return res.status(200).json({
          message: "Invalid api successfully",
          status: false,
        });  
      }
    }
  );
  
            
      
    
      
    } catch (error) {
      return res.status(500).json({
        message: "Failed to send OTP",
        error: error.message,
      });
    }
};



// - password 


exports.updatePassword = async (req, res) => {
  try {
    const { phone, otp, password } = req.body;

    if (!phone || !otp || !password) {
      return res.status(400).json({
        message: "Phone number, OTP, and password are required",
        success: false,
      });
    }

    // Check if user exists
   const [results]=await connection.query("SELECT * FROM users WHERE phone = ?", [phone])

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found", success: false });
      }

      const user = results[0];

      // Check if OTP matches
      if (user.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP", success: false });
      }

      // Hash password using md5
      const hashedPassword = md5(password);

      // Update password in the database
     await connection.query(
        "UPDATE users SET password = ?, plain_password = ? WHERE phone = ?",
        [hashedPassword, password, phone])
        
          return res.status(200).json({
            message: "Password updated successfully",
            success: true,
          });
   
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

//update password2
exports.updatePassword2 = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        message: "Phone number and password are required",
        success: false,
      });
    }

    // Check if user exists
   const [results]=await connection.query("SELECT * FROM users WHERE phone = ?", [phone])

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found", success: false });
      }

      // Hash password using md5
      const hashedPassword = md5(password);

      // Update password in the database
    await  connection.query(
        "UPDATE users SET password = ?, plain_password = ? WHERE phone = ?",
        [hashedPassword, password, phone])
          return res.status(200).json({
            message: "Password updated successfully",
            success: true
          });
    
    
    
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};




//get apis 
//deposit not received
exports.getDepositNotReceived = async (req, res) => {
  try {
      const query = `SELECT * FROM DepositNotReceived WHERE status=0`;

          const [results]= await connection.query(query)
          return res.status(200).json({
              message: "Deposit records retrieved successfully",
              success: true,
              data: results
          });

  } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ 
          message: "Server error", 
          success: false, 
          error: error.message 
      });
  }
};


exports.getifscModification   = async(req,res)=>{
   try{

        const query =  `SELECT * FROM IFSCModification  WHERE status=0`

      const [results]=await  connection.query(query )

           return res.status(200).json({
            message: " records retrieved successfully",
            success: true,
            data: results
          });

}
   catch(error)
   {   
      return res.status(500).json({ 
        message: "Server error", 
        success: false, 
        error: error.message 
      });  
   
   }
}






exports.getUserBank = async (req, res) => {
  try {
    const query = `SELECT * FROM user_bank WHERE status=0`;
    const [results] = await connection.query(query);

    return res.status(200).json({
      message: "Records retrieved successfully",
      success: true,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

exports.getBankModification = async (req, res) => {
  try {
    const query = `SELECT * FROM BankModification WHERE status=0`;
    const [results] = await connection.query(query);

    return res.status(200).json({
      message: "Records retrieved successfully",
      success: true,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

exports.bonusDetails = async (req, res) => {
  try {
    const query = `SELECT * FROM bonus WHERE status=0`;
    const [results] = await connection.query(query);

    return res.status(200).json({
      message: "Records retrieved successfully",
      success: true,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

exports.problemsDetails = async (req, res) => {
  try {
    const query = `SELECT * FROM problems WHERE status=0`;
    const [results] = await connection.query(query);

    return res.status(200).json({
      message: "Records retrieved successfully",
      success: true,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};




exports.getUsdtAddress = async (req, res) => {
  try {
    const query = "SELECT * FROM USDTAddress WHERE status=0";
    
    // Using async/await with connection.promise() to avoid callbacks
    const [results] = await connection.query(query);

    if (!results.length) {
      return res.status(404).json({
        message: "No USDT addresses found",
        success: false,
        data: [],
      });
    }

    return res.status(200).json({
      message: "Records retrieved successfully",
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};
























//depositAcceptOrReject
exports.depositAcceptOrReject = async (req, res) => {
  try {
    const { status, id } = req.params;

    console.log("jjoki",id)
    const validStatuses = ["accepted", "rejected"];
    const normalizedStatus = status.toLowerCase().trim();
    
    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message: "Invalid status. Use 'accepted' or 'rejected'",
        success: false,
      });
    }

  const [results]=await  connection.query(
      "SELECT * FROM DepositNotReceived WHERE id = ? AND status = 0",
      [id])

        if (results.length === 0) {
          return res.status(404).json({
            message: "Record not found or already processed",
            success: false,
          });
        }

        const newStatus = normalizedStatus === "accepted" ? 1 : 2;

     await   connection.query(
          "UPDATE DepositNotReceived SET status = ? WHERE id = ?",
          [newStatus, id])
          
      return res.status(200).json({
              message: `Record updated successfully to ${normalizedStatus}`,
              success: true,
            });
            
  } catch (error) {
    console.log("dddd",error)
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};


// problems
exports.problemAcceptOrReject = async (req, res) => {
  try {
    const { status, id } = req.params;
    const validStatuses = ["accepted", "rejected"];
    const normalizedStatus = status.toLowerCase().trim();

    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message: "Invalid status. Use 'accepted' or 'rejected'",
        success: false,
      });
    }

    const results = await connection.query(
      "SELECT * FROM problems WHERE id = ? AND status = 0",
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({
        message: "Record not found or already processed",
        success: false,
      });
    }

    const newStatus = normalizedStatus === "accepted" ? 1 : 2;

    await connection.query(
      "UPDATE problems SET status = ? WHERE id = ?",
      [newStatus, id]
    );

    return res.status(200).json({
      message: `Record updated successfully to ${normalizedStatus}`,
      success: true,
    });
  } catch (error) {
    console.log("Error in problemAcceptOrReject:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

// depositAcceptOrReject
exports.depositAcceptOrReject = async (req, res) => {
  try {
    const { status, id } = req.params;
    const validStatuses = ["accepted", "rejected"];
    const normalizedStatus = status.toLowerCase().trim();

    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message: "Invalid status. Use 'accepted' or 'rejected'",
        success: false,
      });
    }

    const results = await connection.query(
      "SELECT * FROM DepositNotReceived WHERE id = ? AND status = 0",
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({
        message: "Record not found or already processed",
        success: false,
      });
    }

    const newStatus = normalizedStatus === "accepted" ? 1 : 2;

    await connection.query(
      "UPDATE DepositNotReceived SET status = ? WHERE id = ?",
      [newStatus, id]
    );

    return res.status(200).json({
      message: `Record updated successfully to ${normalizedStatus}`,
      success: true,
    });
  } catch (error) {
    console.log("Error in depositAcceptOrReject:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

// modifyBankAcceptorReject
exports.modifyBankAcceptorReject = async (req, res) => {
  try {
    const { status, id } = req.params;
    const validStatuses = ["accepted", "rejected"];
    const normalizedStatus = status.toLowerCase().trim();

    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message: "Invalid status. Use 'accepted' or 'rejected'",
        success: false,
      });
    }

    const results = await connection.query(
      "SELECT * FROM BankModification WHERE id = ? AND status = 0",
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({
        message: "Record not found or already processed",
        success: false,
      });
    }

    const newStatus = normalizedStatus === "accepted" ? 1 : 2;

    await connection.query(
      "UPDATE BankModification SET status = ? WHERE id = ?",
      [newStatus, id]
    );

    return res.status(200).json({
      message: `Record updated successfully to ${normalizedStatus}`,
      success: true,
    });
  } catch (error) {
    console.log("Error in modifyBankAcceptorReject:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

// addressAcceptOrReject
exports.addressAcceptOrReject = async (req, res) => {
  try {
    const { status, id } = req.params;
    const normalizedStatus = status.toLowerCase().trim();

    const results = await connection.query(
      "SELECT * FROM USDTAddress WHERE id = ? AND status = 0",
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({
        message: "Record not found or already processed",
        success: false,
      });
    }

    const newStatus = normalizedStatus === "accepted" ? 1 : 2;

    await connection.query(
      "UPDATE USDTAddress SET status = ? WHERE id = ?",
      [newStatus, id]
    );

    return res.status(200).json({
      message: "Record updated successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error in addressAcceptOrReject:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

// bonusAcceptOrReject
exports.bonusAcceptOrReject = async (req, res) => {
  try {
    const { status, id } = req.params;
    const validStatuses = ["accepted", "rejected"];
    const normalizedStatus = status.toLowerCase().trim();

    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message: "Invalid status. Use 'accepted' or 'rejected'",
        success: false,
      });
    }

    const results = await connection.query(
      "SELECT * FROM bonus WHERE id = ? AND status = 0",
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({
        message: "Record not found or already processed",
        success: false,
      });
    }

    const newStatus = normalizedStatus === "accepted" ? 1 : 2;

    await connection.query(
      "UPDATE bonus SET status = ? WHERE id = ?",
      [newStatus, id]
    );

    return res.status(200).json({
      message: `Record updated successfully to ${normalizedStatus}`,
      success: true,
    });
  } catch (error) {
    console.log("Error in bonusAcceptOrReject:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};




exports.getwithdrawlProblems = async (req, res) => {
  try {
    const st = 0;
    const [problems] = await connection.query("SELECT * FROM withdrawlProblem WHERE IN (0, 3)");

    if (!problems || problems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No withdrawal problems found",
      });
    }

    return res.status(200).json({
      success: true,
      data: problems, // Returns all matching entries
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};





// withdrawlProblemsAcceptOrReject
exports.withdrawlProblemsAcceptOrReject = async (req, res) => {
  try {
    const { status, id } = req.params;
    const validStatuses = ["accepted", "rejected"];
    const normalizedStatus = status.toLowerCase().trim();

    if (!validStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        message: "Invalid status. Use 'accepted' or 'rejected'",
        success: false,
      });
    }

    // Validate ID (Ensure it's a valid number)
    if (!id || isNaN(id) || parseInt(id) <= 0) {
      return res.status(400).json({
        message: "Invalid ID parameter.",
        success: false,
      });
    }

    const results = await connection.query(
      "SELECT * FROM withdrawlProblem WHERE id = ? AND status = 0",
      [id]
    );

    if (!results || results.length === 0) {
      return res.status(404).json({
        message: "Record not found or already processed",
        success: false,
      });
    }

    const newStatus = normalizedStatus === "accepted" ? 1 : 2;

    await connection.query("UPDATE withdrawlProblem SET status = ? WHERE id = ?", [
      newStatus,
      id,
    ]);

    return res.status(200).json({
      message: `Record updated successfully to ${normalizedStatus}`,
      success: true,
    });
  } catch (error) {
    console.log("Error in withdrawlProblemsAcceptOrReject:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};


exports.getRecharge  = async(req,res)=>{
  try{   
        
        const {auth} = req.params ;
        console.log(auth)
       
 
        const [results] = await connection.query("SELECT phone FROM users WHERE `token` = ?",[auth]);

        if (results.length === 0) {
            return res.status(400).json({ message: "User does not exist", success: false });
        }

        const phone = results[0].phone;

        const [rechargeDetails] = await connection.query(`SELECT * FROM recharge where phone=?`,[phone]) 


        if(rechargeDetails.length === 0)
        {
          return res.status(404).json({
            success: false,
            message: "No withdrawal problems found",
          });
        }


        return res.status(200).json({
          success: true,
          data: rechargeDetails, // Returns all matching entries
        });



       

  }
  catch(error)
  { 
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });

  }
}



exports.getwithdrawl2  = async(req,res)=>{
  try{   
        
        const {auth} = req.params ;
 
        const [results] = await connection.query("SELECT phone FROM users WHERE `token` = ?",[auth]);

        if (results.length === 0) {
            return res.status(400).json({ message: "User does not exist", success: false });
        }

        const phone = results[0].phone;

        const st = 0 ;
        const [rechargeDetails] = await connection.query(`SELECT * FROM withdraw where phone=? AND status IN (0, 3)`,[phone]) 


        if(rechargeDetails.length === 0)
        {
          return res.status(404).json({
            success: false,
            message: "No withdrawal problems found",
          });
        }


        return res.status(200).json({
          success: true,
          data: rechargeDetails, // Returns all matching entries
        });

  }
  catch(error)
  { 
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });

  }
}

