INSERT INTO departments (id, name)
VALUES (001, "Administration"),
       (002, "R&D"),
       (003, "Accounting"),
       (004, "HR"),
       (005, "IT"),
       (006, "Engineering"),
       (007, "Operations"),
       (008, "Maintenance");

INSERT INTO roles (id, title, salary, department_id)
VALUES (001, "CEO", 180000, 001),
       (002, "Engineer", 90000, 002),
       (003, "Accountant", 60000, 003),
       (004, "HR Manager", 70000, 004),
       (005, "Systems Administrator", 75000, 005),
       (006, "Web Developer", 75000, 005),
       (007, "Payroll Clerk", 48000, 003),
       (008, "VP of Sales", 145000, 001),
       (009, "VP of R&D and Engineering", 175000, 006);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (001, "John", "Smith", 001, NULL),
       (002, "Amy", "Anderson", 002, 001),
       (003, "Anthony", "Burke", 003, 001),
       (004, "Simon", "Archer", 004, 002),
       (005, "Cheryl", "Fisher", 005, 001),  
       (006, "Alexander", "Missal", 005, 005), 
       (007, "George", "Olson", 007, 003),  
       (008, "Randall", "West", 009, 001);
