-- to create a table, we should have a database first.
-- to create a database 
-- to run single query :  ctrl+enter
-- create database dbname;
-- after creating the database, we need to open/
-- activate the db -  use dbname;
-- to create a table:  
-- create table tablename(field1 datatype constraint,
-- field1 datatype constraint,field1 datatype constraint,...);
-- to view a table :-  select * from tablename;
create database sqlpractice;
use sqlpractice;
create table employee(empid int primary key, empname varchar(50) not null,
age int, email varchar(30), city varchar(60));
select * from employee;
-- to insert a new record into the table, sql provides us 
-- two ways:-
-- to insert all the values into the table
-- insert into tablename values(value1, value2,value3,....);
-- to insert some specific values into the table
-- insert into tablename(field1, field2,...) values(value1, value2,...);

insert into employee values(101, 'Ajay', 23, 'ajay@gmail.com', 'delhi');
select * from employee;
insert into employee(empid, empname, city) values(102, 'sam singh','luknow');

create database studentmanagementsystem;
use studentmanagementsystem;
create table Student(studentid int primary key , FirstName varchar(50), Lastname varchar(50), DateofBirth datetime, gender varchar(12), email varchar(40), phone bigint);
create table Course(CourseId varchar(40) primary key, CourseTitle varchar(60), Credits int);
create table Instructor(InstructorId varchar(50) primary key, FirstName varchar(50), LastName varchar(50), Email varchar(50));

INSERT INTO student (studentid, FirstName, Lastname, DateofBirth, gender, email, phone)
VALUES (1, 'Rahul', 'Sharma', '2002-05-14', 'Male', 'rahul.sharma@email.com', '9876543210');

INSERT INTO student (studentid, FirstName, Lastname, DateofBirth, gender, email, phone)
VALUES (2, 'Ananya', 'Verma', '2001-11-22', 'Female', 'ananya.verma@email.com', '9123456780');

INSERT INTO student (studentid, FirstName, Lastname, DateofBirth, gender, email, phone)
VALUES (3, 'Amit', 'Patel', '2003-02-10', 'Male', 'amit.patel@email.com', '9988776655');

INSERT INTO student (studentid, FirstName, Lastname, DateofBirth, gender, email, phone)
VALUES (4, 'Priya', 'Singh', '2002-08-30', 'Female', 'priya.singh@email.com', '9090909090');

INSERT INTO student (studentid, FirstName, Lastname, DateofBirth, gender, email, phone)
VALUES (5, 'Karan', 'Mehta', '2001-12-05', 'Male', 'karan.mehta@email.com', '9871234567');

INSERT INTO course (CourseId, CourseTitle, Credits)
VALUES
(101, 'Database Management Systems', 4),
(102, 'Java Programming', 3),
(103, 'Data Structures', 4),
(104, 'Web Development', 3),
(105, 'Operating Systems', 4);

INSERT INTO instructor (InstructorId, FirstName, LastName, Email)
VALUES
(201, 'Rajesh', 'Kumar', 'rajesh.kumar@university.com'),
(202, 'Neha', 'Gupta', 'neha.gupta@university.com'),
(203, 'Arjun', 'Reddy', 'arjun.reddy@university.com'),
(204, 'Sneha', 'Iyer', 'sneha.iyer@university.com'),
(205, 'Vikram', 'Malhotra', 'vikram.malhotra@university.com');

-- create a table with foreign key constraint
-- Create a table with named Enrollment with attributes:
-- ● EnrollmentID (Primary Key)
-- ● EnrollmentDate
-- ● StudentID(Foreign key)
-- ● CourseID(Foreign Key)
-- ● InstructorID(Foreign key)
create table Enrollment(EnrollmentID varchar(50) primary key,
EnrollmentDate datetime, StudentID int, CourseID varchar(40),
InstructorID varchar(50), 
foreign key(StudentID) references student(studentid),
foreign key(CourseID) references course(CourseId),
foreign key(InstructorID) references instructor(InstructorId));

