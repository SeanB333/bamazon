const customerProg = require("./bamazonCustomer.js");
const managerProg = require("./bamazonManager.js");
const command = process.argv[2];


switch(command){
    case "customer":
        customerProg;
        break;
    case "manager":
        managerProg;
        break;
    default:
        console.log("please enter a command.");
        
}