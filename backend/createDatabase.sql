-- *download pgadmin
-- *when you open up pgadmin collapse servers
-- *there should be the current version of PostgreSQL that youre running, collapse that
-- *you should see databases right click and create a new one called "excursionexpert" or something similar
-- *right click on the db you just created and click query tool
-- *run this script and all the tables should be created on your computer :) 
drop table tags;
drop table landmark_type;
drop table landmarks;
drop table itineraries;
drop table users;
--drop table favtags;
--drop table favs;
DO $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
	  CREATE TYPE user_role AS ENUM ('user', 'admin');
	END IF;
END $$;

CREATE TABLE if not exists users(
username VARCHAR(50) PRIMARY KEY,
email VARCHAR(100) NOT NULL,
password VARCHAR(100) NOT NULL,
role user_role DEFAULT 'user'
);

CREATE TABLE if not exists itineraries(
iter_id UUID PRIMARY KEY NOT NULL,
iter_name VARCHAR(100),
loc VARCHAR(100) NOT NULL,
username VARCHAR(50) references users(username)
);

CREATE TABLE if not exists landmarks(
lm_name VARCHAR(100),
loc VARCHAR(100),
maplink VARCHAR(200) NOT NULL, 
rating VARCHAR(100) NOT NULL,
iter_id UUID references itineraries(iter_id),
PRIMARY KEY (lm_name, iter_id)
);

CREATE TABLE if not exists landmark_type(
lm_name VARCHAR(100),-- references landmarks(lm_name),
ltype VARCHAR(50), --CHECK (ltype in ('restaurant', 'cultural', 'nightlife', 'sights')) -- change according to data
PRIMARY KEY (lm_name, ltype)
);

-- allows us to store more than one filter per landmark, we dont need it but including it in case we want it
CREATE TABLE if not exists tags(
lm_name VARCHAR(100),-- references landmarks(lm_name),
lm_tag VARCHAR(100) NOT NULL,
PRIMARY KEY (lm_name, lm_tag)
);
--should work same as landmarks but no itinerary column
CREATE TABLE if not exists favs(
fav_name VARCHAR(100) PRIMARY KEY,
loc VARCHAR(100),
maplink VARCHAR(200) NOT NULL, 
rating VARCHAR(100) NOT NULL
);

CREATE TABLE if not exists favtags(
fav_name VARCHAR(100) references favs(fav_name),
fav_tag VARCHAR(100) NOT NULL,
PRIMARY KEY (fav_name, fav_tag)
);