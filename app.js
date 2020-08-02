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

let existManager = false; // keep track if Manager has been added

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
            if (existManager) { // only one Manager per team
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

// async function to add employees to a "team" array.
const addEmployees = async (team) => {
    let employee = {};
    // wait for inquirer responses to employee questions.
    await inquirer.prompt(employeeQuestions)
    .then(({name, title, id, email, office, github, school, addEmployee}) => {
        if(title === "Manager") {
            employee = new Manager(name, id, email, office);
        } else if (title === "Engineer") {
            employee = new Engineer(name, id, email, github);
        } else {
            employee = new Intern(name, id, email, school);
        }
        team.push(employee);
        if(addEmployee) {
            return addEmployees(team);
        }
        else {
            return team;
        }
    });
};

// async function to render and write html to file
async function generateHTML() {
    try {
        const myTeam = [];
        await addEmployees(myTeam); // wait for myTeam to be populated
        const renderedHTML = render(myTeam); // generate HTML
        await fs.writeFile(outputPath, renderedHTML, err => {
            if (err) throw err;
            else console.log(`Sucessfully saved HTML to ${outputPath}`);
        });
    } catch(err) {
        console.log(err);
    }
};

generateHTML();
