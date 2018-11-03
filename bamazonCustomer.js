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
            console.log(`----------------------------------------------------------------------------------------------------------------------`);
          }
          
      }
       connection.end();
       start();
    });
  }

  // function which prompts the user for what action they should take
function start() {
    inquirer
    .prompt([
        {
          name: "item",
          type: "list",
          message: "What is the item you would like to submit?",
          choices:["Item 1","Item 2","Item 3","Item 4","Item 5","Item 6","Item 7","Item 8","Item 9","Item 10",]
        },
        {
          name: "quantity",
          type: "input",
          message: "how many would you like to buy?",
         validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        console.log(chalk.red(`works for ${answer.item} and ${answer.quantity}`));
      });
  }