SHOW TABLES;
create TABLE `user` (
    id int primary key ,
    username varchar(50) unique,
    email varchar(50) not null unique,
    password varchar(50) not null
);

alter table user
modify id init not null AUTO_INCREMENT PRIMARY KEY;