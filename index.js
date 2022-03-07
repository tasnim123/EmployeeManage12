const mysql = require("mysql2");
var inquirer = require('inquirer');
require("console.table");

var conn = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employeesDB"
});

// connect to the mysql server
conn.connect(function (error) {
    if (error) throw error;
    showMenu();
});


function showMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'reptile',
                message: 'What would you like to do?',
                choices: [
                    'View All Employees',
                    'Add Employee',
                    'Update Employee Role',
                    'View All Roles',
                    'Add Role',
                    'View All Departments',
                    'Add Department',
                    'Quit'
                ],
            },
        ])
        .then(answers => {
            processMenu(answers.reptile);
        });
}

function processMenu(answer) {
    switch (answer) {
        case 'View All Employees':
            viewAllEmployees();
            break;
        case 'View All Roles':
            viewAllRoles();
            break;
        case 'View All Departments':
            viewAllDepartments();
            break;

        case 'Add Department':
            showMenuForDepartment();
            break;
        case 'Add Role':
            showMenuForRole();
            break;

        case 'Add Employee':
            showMenuForEmployee();
            break;

        case 'Update Employee Role':
            showMenuForUpdateRole();
            break;
        case 'Quit':
            process.exit();
            break;
        default:
            showMenu();
            break;
    }

}

function viewAllEmployees() {
    var query =
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r
        ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
        ON m.id = e.manager_id`

    conn.query(query, function (err, res) {
        if (err) throw err;

        console.log("");
        console.table(res);

        showMenu();
    });
}



function viewAllRoles() {
    var query =
        `SELECT r.id, r.title, d.name AS department, r.salary
            FROM role r
            LEFT JOIN department d
            ON d.id = r.department_id
            `

    conn.query(query, function (err, res) {
        if (err) throw err;

        console.log("");
        console.table(res);

        showMenu();
    });
}

function viewAllDepartments() {
    var query =
        `SELECT d.*
            FROM department d ORDER BY d.name       
            `

    conn.query(query, function (err, res) {
        if (err) throw err;

        console.log("");
        console.table(res);

        showMenu();
    });
}

function showMenuForDepartment() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "name",
                message: "What is the name of the department?"
            }
        ])
        .then(function (answer) {

            var query = `INSERT INTO department SET ?`

            conn.query(query, {
                name: answer.name
            },
                function (err, res) {
                    if (err) throw err;

                    console.log(`Added ${answer.name} to the database!`);

                    showMenu();
                });

        });
}

async function showMenuForRole() {
    var query =
        `SELECT * FROM department`

    const [rows, fields] = await conn.promise().query(query);

    const departmentChoices = rows.map(({ id, name }) => ({
        value: id, name: `${name}`
    }));

    promptAddRole(departmentChoices);
}

function promptAddRole(departmentChoices) {

    inquirer
        .prompt([
            {
                type: "input",
                name: "title",
                message: "What is the name of the role?"
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of the role?"
            },
            {
                type: "list",
                name: "department_id",
                message: "Which department does the role belong to?",
                choices: departmentChoices
            },
        ])
        .then(function (answer) {

            var query = `INSERT INTO role SET ?`

            conn.query(query, {
                title: answer.title,
                salary: answer.salary,
                department_id: answer.department_id
            },
                function (err, res) {
                    if (err) throw err;

                    showMenu();
                });

        });
}

async function showMenuForEmployee() {
    const [rows1, fields1] = await conn.promise().query(`SELECT * FROM role`);
    const [rows2, fields2] = await conn.promise().query(`SELECT * FROM employee`);

    const roleChoices = rows1.map(({ id, title }) => ({
        value: id, name: `${title}`
    }));

    const managerChoices = rows2.map(({ id, first_name, last_name }) => ({
        value: id, name: `${first_name} ${last_name}`
    }));

    managerChoices.unshift({ value: 0, name: 'None' })

    inquirer
        .prompt([
            {
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?"
            },
            {
                type: "list",
                name: "role_id",
                message: "What is the employee's role?",
                choices: roleChoices
            },
            {
                type: "list",
                name: "manager_id",
                message: "What is the employee's manager?",
                choices: managerChoices
            },
        ])
        .then(function (answer) {

            var query = `INSERT INTO employee SET ?`

            conn.query(query, {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role_id,
                manager_id: answer.manager_id,
            },
                function (err, res) {
                    if (err) throw err;

                    console.log(`Added ${answer.first_name} ${answer.last_name} to the database!`);

                    showMenu();
                });

        });
}

async function showMenuForUpdateRole() {
    const [rows1, fields1] = await conn.promise().query(`SELECT * FROM role`);
    const [rows2, fields2] = await conn.promise().query(`SELECT * FROM employee`);

    const roleChoices = rows1.map(({ id, title }) => ({
        value: id, name: `${title}`
    }));

    const employeeChoices = rows2.map(({ id, first_name, last_name }) => ({
        value: id, name: `${first_name} ${last_name}`
    }));

    inquirer
        .prompt([
            {
                type: "list",
                name: "id",
                message: "Which employee's role do you want to update?",
                choices: employeeChoices
            },
            {
                type: "list",
                name: "role_id",
                message: "Which role do you want to assign the selected employee?",
                choices: roleChoices
            },

        ])
        .then(function (answer) {

            var query = `UPDATE employee SET role_id = ? WHERE id = ?`
            // when finished prompting, insert a new item into the db with that info
            conn.query(query,
                [answer.role_id,
                answer.id
                ],
                function (err, res) {
                    if (err) throw err;


                    console.log("Updatede employee's role");

                    showMenu();
                });

        });



}