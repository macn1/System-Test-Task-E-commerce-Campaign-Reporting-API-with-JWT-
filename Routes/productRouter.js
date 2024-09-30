const express = require('express')

const router = express.Router()

const  { uploadFile,getCampaignReport,getAdGroupReport,getFSNReport,getProductReport}    = require('../Controllers/productController')

const multer = require('multer');

const {authenticateToken} = require('../middleware/authMiddleware')


const upload = multer({ dest: 'uploads/' }); // 'uploads/' is the directory where files will be temporarily stored


router.post('/upload',upload.single('file'),uploadFile)

router.post('/report/campaign',authenticateToken,getCampaignReport)

router.post('/report/adgroupid',authenticateToken,getAdGroupReport)

router.post('/report/fsn',authenticateToken,getFSNReport)

router.post('/report/product',authenticateToken,getProductReport)







module.exports =router