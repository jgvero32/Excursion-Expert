CREATE DATABASE smartgrocery;

\c smartgrocery;

CREATE TABLE users (
    id UUID PRIMARY KEY NOT NULL,
    username VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    account_type VARCHAR(1) NOT NULL
);