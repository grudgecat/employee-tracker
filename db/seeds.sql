INSERT INTO department (id, name)
VALUES (001, "Administration"),
       (002, "R&D"),
       (003, "Accounting"),
       (004, "HR"),
       (005, "IT");

INSERT INTO role (id, title, salary, department_id)
VALUES (001, "Executive Manager"),
       (002, "Engineer"),
       (003, "Accountant"),
       (004, "HR Manager"),
       (005, "Systems Administrator");

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (001, "John", "Smith", "001", "NULL"),
       (002, "Amy", "Anderson", "002", "001"),
       (003, "Anthony", "Burke", "003", "001"),
       (004, "Simon", "Archer", "004", "002"),
       (005, "Cheryl", "Fisher", "005", "001");  
       (006, "Alexander", "Missal", "005", "005");  
       (007, "George", "Olson", "003", "003");  
