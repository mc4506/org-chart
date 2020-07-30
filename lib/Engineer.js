const Employee  = require("./Employee")

class Engineer extends Employee {
    constructor (name, id, email, githubAcct) {
        super(name, id, email);
        this.github = githubAcct;
    }
    getGithub = () => this.github;
    getRole = () => "Engineer";
}

module.exports = Engineer;
