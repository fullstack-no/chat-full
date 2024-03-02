module.exports = {
  up: "ALTER TABLE users ADD userid VARCHAR(255) UNIQUE",
  down: "ALTER TABLE users DROP COLUMN userid",
};
