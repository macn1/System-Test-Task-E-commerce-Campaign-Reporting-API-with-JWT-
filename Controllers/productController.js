const multer = require('multer');

const csv = require('csv-parser');

const fs = require('fs');
const { Op } = require('sequelize');


const Product = require('../models/productModel');
const { log } = require('console');




const uploadFile = async(req,res)=>{

    if (!req.file) {
    return res.status(400).json({ error: 'Please upload a CSV file' });
  }

  const filePath = req.file.path; 

  const products = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      products.push({
        campaignName: row['Campaign Name'],
        adGroupId: row['Ad Group ID'],
        fsnId: row['FSN ID'],
        productName: row['Product Name'],
        adSpend: parseFloat(row['Ad Spend']),
        views: parseInt(row['Views']),
        clicks: parseInt(row['Clicks']),
        directRevenue: parseFloat(row['Direct Revenue']),
        indirectRevenue: parseFloat(row['Indirect Revenue']),
        directUnits: parseInt(row['Direct Units']),
        indirectUnits: parseInt(row['Indirect Units']),
      });
    })
    .on('end', async () => {
      try {
      
        
        await Product.bulkCreate(products);
        res.status(200).json({ message: 'CSV file data inserted successfully' });
      } catch (error) {
       

        res.status(500).json({ error: 'Error inserting data into database', details: error.message });
      }

      fs.unlinkSync(filePath);
    })
    .on('error', (err) => {
      res.status(500).json({ error: 'Error processing the CSV file', details: err.message });
    });
}

const calculateFields = (product) => {
  const ctr = (product.clicks / product.views) * 100 || 0;
  const totalRevenue = product.directRevenue + product.indirectRevenue;
  const totalOrders = product.directUnits + product.indirectUnits;
  const roas = totalRevenue / product.adSpend || 0;

  return {
      ...product.toJSON(),
      CTR: ctr.toFixed(2),
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders,
      ROAS: roas.toFixed(2),
  };
};

const getCampaignReport = async (req, res) => {
  const { campaignName, adGroupId, fsnId, productName } = req.body;
  
 
  const whereClause = {
    campaignName: { [Op.like]: `%${campaignName}%` }  
  };

  if (adGroupId) whereClause.adGroupId = { [Op.like]: `%${adGroupId}%` };
  if (fsnId) whereClause.fsnId = { [Op.like]: `%${fsnId}%` };
  if (productName) whereClause.productName = { [Op.like]: `%${productName}%` };

  try {

    const products = await Product.findAll({ where: whereClause });

    console.log(whereClause,products,"hell");
    

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for the specified criteria.' });
    }

    const result = products.map(calculateFields);


    res.status(200).json({
      campaign: campaignName,
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving product statistics', details: error.message });
  }
};


const getAdGroupReport = async (req, res) => {
  const { adGroupId, campaignName, fsnId, productName } = req.body;

  console.log(req.body,"hell");
  


  const whereClause = {
    adGroupId: { [Op.like]: `%${adGroupId}%` } 
  };

  
  if (campaignName) whereClause.campaignName = { [Op.like]: `%${campaignName}%` };
  if (fsnId) whereClause.fsnId = { [Op.like]: `%${fsnId}%` };
  if (productName) whereClause.productName = { [Op.like]: `%${productName}%` };

  try {
    
    const products = await Product.findAll({ where: whereClause });

    console.log(products);
    

    
    if (!products.length) {
      return res.status(404).json({ message: 'No products found for the specified criteria.' });
    }

    
    const result = products.map(calculateFields);

    
    res.status(200).json({
      adGroupId: adGroupId,
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving product statistics', details: error.message });
  }
};

const getFSNReport = async (req, res) => {
  const { fsnId, campaignName, adGroupId, productName } = req.body;

  const whereClause = {
    fsnId: { [Op.like]: `%${fsnId}%` } 
  };

  if (campaignName) whereClause.campaignName = { [Op.like]: `%${campaignName}%` };
  if (adGroupId) whereClause.adGroupId = { [Op.like]: `%${adGroupId}%` };
  if (productName) whereClause.productName = { [Op.like]: `%${productName}%` };

  try {
    const products = await Product.findAll({ where: whereClause });

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for the specified criteria.' });
    }

    const result = products.map(calculateFields);

    res.status(200).json({
      fsnId: fsnId,
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving product statistics', details: error.message });
  }
};

const getProductReport = async (req, res) => {
  const { productName, campaignName, adGroupId, fsnId } = req.body;

  const whereClause = {
    productName: { [Op.like]: `%${productName}%` } 
  };

  if (campaignName) whereClause.campaignName = { [Op.like]: `%${campaignName}%` };
  if (adGroupId) whereClause.adGroupId = { [Op.like]: `%${adGroupId}%` };
  if (fsnId) whereClause.fsnId = { [Op.like]: `%${fsnId}%` };

  try {
    const products = await Product.findAll({ where: whereClause });

    if (!products.length) {
      return res.status(404).json({ message: 'No products found for the specified criteria.' });
    }

    const result = products.map(calculateFields);

    res.status(200).json({
      productName: productName,
      data: result
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving product statistics', details: error.message });
  }
};



module.exports ={uploadFile,getCampaignReport,getAdGroupReport,getFSNReport,getProductReport}