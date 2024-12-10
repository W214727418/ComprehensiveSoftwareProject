--FILE TO CREATE THE DATABASE - DO NOT ALTER THE DATABASE STRUCTURE
-- Create the "store" database
CREATE DATABASE IF NOT EXISTS patients;

-- Create the "devices" table
CREATE TABLE IF NOT EXISTS patient_info(
    patient_id int primary key auto_increment,
    name varchar(255),
    DOB varchar(255),
    sex varchar(255),
    gender varchar(255),
    race varchar(255),
    latin boolean,
    weight varchar(255),
    height varchar(255),
    reason_for_visit varchar(1024),
    drivers_license boolean,
    primary_physician varchar(255),
    insurance varchar(255),
    secondary_insurance varchar(255));

