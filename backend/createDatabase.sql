

-- *download pgadmin
-- *when you open up pgadmin collapse servers
-- *there should be the current version of PostgreSQL that youre running, collapse that
-- *you should see databases right click and create a new one called "excursionexpert" or something similar
-- *right click on the db you just created and click query tool
-- *run this script and all the tables should be created on your computer :) 

-- drop table users;
-- drop table itineraries;
-- drop table landmarks;
-- drop table landmark_type;
-- drop table filters;
CREATE TABLE if not exists users(
username VARCHAR(50) PRIMARY KEY,
email VARCHAR(100) NOT NULL,
password VARCHAR(100) NOT NULL
);

CREATE TABLE if not exists itineraries(
iter_name VARCHAR(100) NOT NULL PRIMARY KEY,
loc VARCHAR(100) NOT NULL,
username VARCHAR(50) references users(username)
);

CREATE TABLE if not exists landmarks(
lm_name VARCHAR(100) PRIMARY KEY,
loc VARCHAR(100),
maplink VARCHAR(200) NOT NULL, 
iter_name VARCHAR(100) references itineraries(iter_name)
);

CREATE TABLE if not exists landmark_type(
lm_name VARCHAR(100) PRIMARY KEY references landmarks(lm_name),
ltype VARCHAR(50) CHECK (ltype in ('restaurant', 'cultural', 'nightlife', 'sights')) -- change according to data
);

-- allows us to store more than one filter per landmark, we dont need it but including it in case we want it
CREATE TABLE if not exists filters(
lm_name VARCHAR(100) PRIMARY KEY references landmarks(lm_name),
lm_filter VARCHAR(100) NOT NULL
);