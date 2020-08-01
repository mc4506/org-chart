const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

console.log("=================================");
console.log("Enter Employee Info to generate");
console.log("an HTML page of Employee Contacts");
console.log("=================================");

let existManager = false;

const employeeQuestions = [{
        type: "input",
        message: "Enter name of Employee.",
        name: "name",
        validate: input => {
            const validName = /^[a-zA-Z]+([\ A-Za-z\'\-]+)*/i;
            if (validName.test(input)) return true;
            return "Please enter a valid name.";
        },
    },
    {
        type: "list",
        message: "Select employee title.",
        choices: response => {
            if (existManager) {
                return ["Engineer", "Intern"];
            } else {
                existManager = true;
                return ["Manager", "Engineer", "Intern"];
            };
        },
        name: "title",
    },
    {
        type: "input",
        message: "Enter employee ID number.",
        name: "id",
        validate: input => {
            const validID = /^[\d]+/;
            if (validID.test(input)) return true;
            return "Please enter a valid ID number (0...9).";
        },
    },
    {
        type: "input",
        message: "Enter employee's email address.",
        name: "email",
        validate: input => {
            const validEmail = /^[a-zA-Z\d\-_.]+@[a-zA-Z\d]+\.[a-zA-Z\d]{2,}$/i;
            if (validEmail.test(input)) return true;
            return "Please enter a valid email address.";
        }
    },
    {
        type: "input",
        message: "Enter the office number.",
        name: "office",
        validate: input => {
            const validOffice = /^[\da-zA-Z\-._]+/;
            if (validOffice.test(input)) return true;
            return "Please enter a valid office number.";
        },
        when: response => (response.title === "Manager") ? true : false,
    },
    {
        type: "input",
        message: "Enter employee's Github username.",
        name: "github",
        validate: input => {
            const validStr = /^[a-zA-Z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
            if (validStr.test(input)) return true;
            return "Please enter a valid Github username";
        },
        when: response => (response.title === "Engineer") ? true : false,
    },
    {
        type: "input",
        message: "Enter intern's school name.",
        name: "school",
        validate: input => {
            const validStr = /^[a-zA-Z]+([\ A-Za-z\'\-]+)*/;
            if (validStr.test(input)) return true;
            return "Please enter a valid name";
        },
        when: response => (response.title === "Intern") ? true : false,
    },
    {
        type: "confirm",
        message: "Do you want to enter another employee?",
        name: "addEmployee",
    }
];

const employees = [];

const addEmployees = function() {
    let employee = {};
    inquirer.prompt(employeeQuestions).then(({name, title, id, email, office, github, school, addEmployee}) => {
        if(title === "Manager") {
            employee = new Manager(name, id, email, office);
        } else if (title === "Engineer") {
            employee = new Engineer(name, id, email, github);
        } else {
            employee = new Intern(name, id, email, school);
        }
        employees.push(employee);
        addEmployee ? addEmployees() : console.log(employees);
    });
};

addEmployees();


// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
