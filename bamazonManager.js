require('dotenv');
const mysql = require("mysql");
const inquirer = require("inquirer");
const chalk = require('chalk');



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
    manager();
});

function manager() {
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
                name: "inventory",
                type: "list",
                message: "Menu Options -->",
                choices: ["View Low Invetory", "Add to Inventory", "Add New Product"]
            }])
            .then(function (answer) {
                console.log("");
                console.log("");
                console.log(answer.inventory);
                console.log("");
                console.log("");
                if (answer.inventory === "View Low Invetory") {
                    console.log("Items with inventory less than 20");
                    console.log("");
                    for (i = 0; i < res.length; i++) {
                        if (res[i].stock_quantity < 20) {

                            console.log(chalk.red(`Item ${res[i].item_id}`) + ` | ` + chalk.blue(`Product Name: ${res[i].product_name}`) + ` --- ` + chalk.green(`Department ${res[i].department_name}`) + ` ---` + chalk.yellow(` Price: ${res[i].price}`) + ` --- Quantity: ${res[i].stock_quantity}`);
                            console.log(`----------------------------------------------------------------------------------------------------------------------`);
                        }
                    }
                    connection.end();
                }
                if (answer.inventory === "Add to Inventory") {
                    inquirer
                        .prompt([{
                                name: "addItem",
                                type: "input",
                                message: "What Item would you like to CHANGE INVENTORY to..."
                            },
                            {
                                name: "addInv",
                                type: "input",
                                message: "What is the QUANTITY you want to CHANGE"
                            }
                        ]).then(function (answer) {
                            answer.addInv = parseInt(answer.addInv)
                            connection.query(
                                "UPDATE products SET ? WHERE ?",
                                [{
                                        stock_quantity: answer.addInv
                                    },
                                    {
                                        item_id: answer.addItem
                                    }
                                ],
                                function (err) {
                                    if (err) throw err
                                    console.log("You have successfully added to your inventory");
                                    connection.end()
                                }
                            )
                        });
                }
                if (answer === "Add New Product") {
                    console.log("add p")
                }


            });
    });
}