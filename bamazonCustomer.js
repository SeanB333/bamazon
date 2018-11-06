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

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  customer();
});

function customer() {
  console.log("Listing all products...\n");
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    let count = 0
    for (i = 0; i < res.length; i++) {
      count += 1;
      if (count <= 9) {
        console.log(chalk.red(`Item ${res[i].item_id}`) + ` | ` + chalk.blue(`Product Name: ${res[i].product_name}`) + ` --- ` + chalk.green(`Department ${res[i].department_name}`) + ` ---` + chalk.yellow(` Price: ${res[i].price}`) + ` --- Quantity: ${res[i].stock_quantity}`);
        console.log(`----------------------------------------------------------------------------------------------------------------------`);
      } else {
        console.log(chalk.red(`Item ${res[i].item_id}`) + `| ` + chalk.blue(`Product Name: ${res[i].product_name}`) + ` --- ` + chalk.green(`Department ${res[i].department_name}`) + ` ---` + chalk.yellow(` Price: ${res[i].price}`) + ` --- Quantity: ${res[i].stock_quantity}`);
        console.log(`----------------------------------------------------------------------------------------------------------------------`);
      }
    }
    inquirer
      .prompt([{
          name: "item",
          type: "input",
          message: "What is the number of the item you would like to buy ?",

        },
        {
          name: "quantity",
          type: "input",
          message: "how many would you like to buy?",

        }
      ])
      .then(function (answer) {
        
        const item = parseInt(answer.item) - 1;
        const quantity = parseInt(answer.quantity);
        const order = res[item].product_name; 
        const total = res[item].price * quantity;

        if (res[item].stock_quantity >= quantity) {
          connection.query("UPDATE products SET ? WHERE ?", [{
              stock_quantity: (res[item].stock_quantity - quantity)
            },
            {
              item_id: answer.item_id
            }
          ], function (err, res) {
            if (err) throw err;
            console.log(`Thank you for your order to ${chalk.blue('BAMAZON')} 

Your total is $"${chalk.yellow(total)}". 
-----------------------------------------------------------------------------
Your order of ${chalk.red(quantity)} : ${chalk.blue(order)}  will be shipped to you in 3-5 business days.
-----------------------------------------------------------------------------`);
            connection.end();
          });
        } else {
          console.log(`Im Sorry we only have ${chalk.red(res[item].stock_quantity)} left of ${chalk.blue(order)}`);
          connection.end();
        }
      });
  });
}