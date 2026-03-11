const axios = require('axios');
const fs  =  require("fs");
const FormData = require('form-data');


exports.uploadImage  = async(file) =>{
      try
      {  
          const apiKey = "46d7314c6c6427f18889058afda6c7a3";
          const form = new FormData(); 
          form.append('image', fs.createReadStream(file.tempFilePath), file.name);

          const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, form, {
            headers: {
                ...form.getHeaders(),
            }
         });

         return response.data.data ? response.data.data.url : null;

      }
      catch(error)
      {
          console.error("Image upload failed:", error.response?.data || error.message);
           return null;
      }
}