"use strict";

const csv = require("csvtojson");
const fs = require('fs');
const path = require("path");
const Ean = require("ean-generator");

const csvFilePath = path.join(
  __dirname,
  `./data-set/ONDC_Sample_Product_Catalog.csv`
);
const ean = new Ean(["030", "031", "890"]);

module.exports.processSampleProductCatalog = () =>  {
  csv()
    .fromFile(csvFilePath)
    .then((productCatalogJsonArray) => {
      const eanCodes = ean.createMultiple({
        size: productCatalogJsonArray.length,
      });
      const consolidatedProductCatalogJsonArray = productCatalogJsonArray.map((productCatalogJson, index) => insertEAN(productCatalogJson, eanCodes[index]));
      transformToCSV(consolidatedProductCatalogJsonArray);
    });
};

function insertEAN(productCatalogJson, eanCode) {
    productCatalogJson.productCode = eanCode;
    return productCatalogJson;
}

function transformToCSV(consolidatedProductCatalogJsonArray) {
  let csv = `id,product_code,name,description,price,quantity,image_name\n`;
  consolidatedProductCatalogJsonArray.forEach((product) => {
    csv += `${product.id},${product.productCode},${product.name},${product.description},${product.price},${product.Qty},${product.image}\n`;
  });
  const csvFilePath = path.join(__dirname, `./processed/consolidated-product-catalog.csv`);
  fs.writeFileSync(csvFilePath, csv);
  console.log(`Successfully created file ${csvFilePath} !!!!`);
};
