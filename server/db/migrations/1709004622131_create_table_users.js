module.exports = {
  up: "CREATE TABLE users(\
        id INTEGER PRIMARY KEY AUTO_INCREMENT,\
        username VARCHAR(28) NOT NULL UNIQUE,\
        password VARCHAR(255) NOT NULL)",
  down: "DROP TABLE users",
};
