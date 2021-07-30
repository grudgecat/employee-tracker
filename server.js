const mysql = require('mysql2');
const inquirer = require('inquirer');
const showtable = require('console.table');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'W@w00k13',
      database: 'employee_db'
    },
    console.log(`Connected to the classlist_db database.`)
  );
