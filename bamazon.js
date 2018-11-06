const customer = require("./bamazonCustomer.js");
const manager = require("./bamazonManager.js");
const command = process.argv[2];


switch(command){
    case "customer":
        customer;
        break;
    case "manager":
        manager;
        break;
    default:
        console.log("please enter a command.");
        
}