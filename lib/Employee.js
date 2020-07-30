function Employee (name, id, email) {
    this.name = name;
    this.id = id;
    this.email = email;

    this.getName = () => this.name;
    this.getId = () => this.id;
    this.getEmail = () => this.email;
    this.getRole = () => "Employee";
}

module.exports = Employee;
