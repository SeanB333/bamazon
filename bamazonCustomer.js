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
  display();
});

function display() {
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
          message: "What is the item you would like to submit?",

        },
        {
          name: "quantity",
          type: "input",
          message: "how many would you like to buy?",

        }
      ])
      .then(function (answer) {
        console.log(chalk.red(`works for ${answer.item} and ${answer.quantity}`));
        const item = parseInt(answer.item) - 1;
        console.log(item);
        const quantity = parseInt(answer.quantity);
        console.log(quantity);
        const total = res[item].price * quantity;
        console.log(total);

        if (res[item].stock_quantity >= quantity) {
          connection.query("UPDATE products SET ? WHERE ?", [{
              stock_quantity: (res[item].stock_quantity - quantity)
            },
            {
              item_id: answer.item_id
            }
          ], function (err, res) {
            if (err) throw err;
            console.log("Success! Your total is $" + total.toFixed(2) + ". Your item(s) will be shipped to you in 3-5 business days.");
            connection.end();
          });
        } else {
          console.log("sorry there are not enough");
          connection.end();
        }
      });
  });
}