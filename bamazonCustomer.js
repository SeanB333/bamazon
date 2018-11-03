require('dotenv');
const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require('chalk');
const PASS = process.env.PASS;


const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    display();
  });

  function display(){
    console.log("Listing all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      let count=0
      for(i=0;i<res.length;i++){
          count+=1;
          if(count<=9){
            console.log(chalk.red(`Item ${res[i].item_id}`) + ` | `+ chalk.blue(`Product Name: ${res[i].product_name}`) + ` --- `+ chalk.green(`Department ${res[i].department_name}`) + ` ---` + chalk.yellow(` Price: ${res[i].price}`) + ` --- Quantity: ${res[i].stock_quantity}`);
            console.log(`----------------------------------------------------------------------------------------------------------------------`);
          } else {
            console.log(chalk.red(`Item ${res[i].item_id}`) + `| `+ chalk.blue(`Product Name: ${res[i].product_name}`) + ` --- `+ chalk.green(`Department ${res[i].department_name}`) + ` ---` + chalk.yellow(` Price: ${res[i].price}`) + ` --- Quantity: ${res[i].stock_quantity}`);
            console.log(`----------------------------------------------------------------------------------------------------------------------git `);
          }
          
      }
       connection.end();
    });
  }