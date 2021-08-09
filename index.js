//import required modules
const mysql = require('mysql2');
const inquirer = require('inquirer');
const showtable = require('console.table');
const util = require("util");

//create connection to employee_db database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'W@w00k13',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
  );

  //use util to turn db.query into promise based call, bind to db
  const query = util.promisify(db.query).bind(db);

  //create menu questions
  const questions = [
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role','Exit program'],
    }
  ];

//create menu function to perfrom action based on user selection
async function menu() {
 const answers = await inquirer.prompt(questions);

  switch(answers.action) {
    case 'View all departments': 
      viewDepartments();
      break;
    case 'View all roles': 
      viewRoles();
      break;
    case 'View all employees': 
      viewEmployees();
      break;
    case 'Add a department': 
      addDepartment();
      break;
    case 'Add a role': 
      addRole();
      break;
    case 'Add an employee': 
      addEmployee();
      break;
    case 'Update an employee role': 
      updateEmployeeRole();
      break;
    case 'Exit program':
      exitProgram();
      break;
    default:
      console.log("Exiting program");
      return "";
  }
}

//show all departments in employee_db, then call menu options
async function  viewDepartments() {
  const departments = await query('SELECT name AS Department, id AS Dept_ID FROM departments ORDER BY name;')
  console.table(departments);
  menu();
}

//show all roles in employee_db, then call menu options
async function  viewRoles() {
  const roles = await query('SELECT roles.title AS Role, roles.id AS Role_ID, roles.salary AS Salary, departments.name FROM roles JOIN departments ON roles.department_id = departments.id ORDER BY roles.title;');
  console.table(roles);
  menu();
}

//show all employees in employee_db, then call menu options
async function  viewEmployees() {
  const employees = await query(`SELECT CONCAT(employee_table.first_name, " ", employee_table.last_name) AS Employee, employee_table.id AS Employee_ID, roles.title AS Role, departments.name AS Department, roles.salary AS Salary, IFNULL(NULL, CONCAT(employee_table_2.first_name, " ", employee_table_2.last_name)) AS Manager
  FROM employees employee_table
  JOIN roles ON employee_table.role_id = roles.id
  JOIN departments ON roles.department_id = departments.id
  LEFT JOIN employees employee_table_2 ON employee_table_2.id = employee_table.manager_id
  ORDER BY employee_table.last_name;`);
  console.table(employees);
  menu();
}

//add new department to employee_db
async function addDepartment() {
  const selectDepartment = await inquirer.prompt(
    {
      type: 'input',
      name: 'deptName',
      message: 'What is the name of the new Department?'
    }
  );
  await query('INSERT INTO departments (name) VALUES (?);', selectDepartment.deptName);
  console.log(`New Department ${selectDepartment.deptName} has been added
  `);
  menu();
}

//add new role to employee_db, link to departments table to show list of dept names
async function addRole() {
  const selectRole = await inquirer.prompt(
    [
    {
      type: 'input',
      name: 'roleTitle',
      message: 'What is the name of the new role?'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary for this role?'
    },
    {
      type: 'list',
      name: 'deptList',
      message: 'Select from the following departments: ',
      choices: async function() {
        const departments = await query("SELECT name, id FROM departments");
        return departments.map(function (department) {
              return {
                name:department.name,
                value:department.id
              }
        });
      }
    }
  ]
  );
  await query('INSERT INTO roles (title, salary, department_id) VALUES (?,?,?);', [selectRole.roleTitle, selectRole.salary, selectRole.deptList]);
  console.log(`Your new Role ${selectRole.roleTitle} has been added
  `); 
  menu();
}

//add new employee to employee_db, link to roles and add a manager
async function addEmployee() {
  const newEmployeeInfo = await inquirer.prompt(
    [
    {
      type: 'input',
      name: 'firstName',
      message: 'What is the first name of the new employee?'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'What is the last name of the new employee?'
    },
    {
      type: 'list',
      name: 'roleList',
      message: 'Select from the following employee roles: ',
      choices: async function () {
        const roles = await query("SELECT title, id FROM roles");
        return roles.map(function (role) {
              return {
                name:role.title,
                value:role.id
              }
        })
      }
    },
  {
      type: 'list',
      name: 'managerList',
      message: 'Select manager for new employee: ',
      choices: async function () {
        const employees = await query(`SELECT CONCAT(first_name, " ", last_name) AS name, id FROM employees`);
        return employees.map(function (employee) {
              return {
                name:employee.name,
                value:employee.id
              }
        })
      }
    }
  ]
  );
  await query('INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);', [newEmployeeInfo.firstName, newEmployeeInfo.lastName, newEmployeeInfo.roleList, newEmployeeInfo.managerList]);
  console.log(`New employee ${newEmployeeInfo.firstName} ${newEmployeeInfo.lastName} has been added`);
  await menu();
}

async function updateEmployeeRole() {
  const updatedEmployee = await inquirer.prompt(
    [
      {
        type: 'list',
        name: 'employeeList',
        message: 'Select employee to update: ',
        choices: async function () {
          const employees = await query(`SELECT CONCAT(first_name, " ", last_name) AS name, id FROM employees`);
          return employees.map(function (employee) {
                return {
                  name:employee.name,
                  value:employee.id
                }
          })
        }
      },
      {
        type: 'list',
        name: 'roleList',
        message: 'Select the role to assign to the employee: ',
        choices: async function () {
          const roles = await query("SELECT title, id FROM roles");
          return roles.map(function (role) {
                return {
                  name:role.title,
                  value:role.id
                }
          })
        }
      }

    ]);
    // console.log(updatedEmployee.employeeList);
    await query(`UPDATE employees SET role_id = (?) WHERE id = (?)`, [updatedEmployee.roleList, updatedEmployee.employeeList]);
    console.log(`Role has been updated
    `);
    menu();
}

//exit program
function exitProgram() {
  console.log("Exiting program");
  process.kill(process.pid, 'SIGTERM');
}

//initialize program, ask first question
menu();
  
