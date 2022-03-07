Developers frequently have to create interfaces that allow non-developers to easily view and interact with information stored in databases. 
These interfaces are called content management systems (CMS).

Your Task this week is to build a command-line application from scratch to manage a company's employee database, using Node.js, Inquirer, and MySQL.

I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business

READ CAREFULLY

1.WHEN I start the application, I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

WHEN I choose to view all departments, I am presented with a formatted table showing department names and department ids
3.WHEN I choose to view all roles, I am presented with the job title, role id, the department that role belongs to, and the salary for that role

WHEN I choose to view all employees, I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

WHEN I choose to add a department, I am prompted to enter the name of the department and that department is added to the database

WHEN I choose to add a role, I am prompted to enter the name, salary, and department for the role and that role is added to the database

7.WHEN I choose to add an employee, I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

8.WHEN I choose to update an employee role, I am prompted to select an employee to update and their new role and this information is updated in the database

As the image illustrates, your schema should contain the following three tables:

* `department`

    * `id`: `INT PRIMARY KEY`

    * `name`: `VARCHAR(30)` to hold department name

* `role`

    * `id`: `INT PRIMARY KEY`

    * `title`: `VARCHAR(30)` to hold role title

    * `salary`: `DECIMAL` to hold role salary

    * `department_id`: `INT` to hold reference to department role belongs to

* `employee`

    * `id`: `INT PRIMARY KEY`

    * `first_name`: `VARCHAR(30)` to hold employee first name

    * `last_name`: `VARCHAR(30)` to hold employee last name

    * `role_id`: `INT` to hold reference to employee role

    * `manager_id`: `INT` to hold reference to another employee that is the manager of the current employee (`null` if the employee has no manager)

You might want to use a separate file that contains functions for performing specific SQL queries you'll need to use. A constructor function or class could be helpful for organizing these. 
You might also want to include a `seeds.sql` file to pre-populate your database, making the development of individual features much easier.
You’ll need to use the [MySQL2 package](https://www.npmjs.com/package/mysql2) to connect to your MySQL database and perform queries, 
the [Inquirer package](https://www.npmjs.com/package/inquirer) to interact with the user via the command line, 
and the [console.table package](https://www.npmjs.com/package/console.table) to print MySQL rows to the console.
You might also want to make your queries asynchronous. MySQL2 exposes a `.promise()` function on Connections to upgrade an existing non-Promise connection to use Promises.