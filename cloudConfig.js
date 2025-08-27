const cloudinary = require('cloudinary').v2;//from documentation of multer-storage-cloudinary of npm package
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({//for configuring cloudinary with same cloud_name:  , api_key:  and api_secret:   process.env after installing dotenv pacakge
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

const storage = new CloudinaryStorage({//from documentation of cloudinary 
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',//with what name of folder , you want to store files
        /*allowedFormats:[array] is feature of cloudinary*/
        allowedFormats: ["png","jpg","jpeg"], // supports promises as well
    },
});

module.exports={
    cloudinary,
    storage
}