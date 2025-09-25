/**
 * Initializes the "chatter" database and a readWrite user "chatter".
 * NOTE: This script runs in the Mongo shell, not Node.js.
 */
var dbName = "chatter";
var appUser = "chatter";
var appPwd = "abc123!!!"; // <-- keep in sync with your app's connection string

db = db.getSiblingDB(dbName);

if (!db.getUser(appUser)) {
  db.createUser({
    user: appUser,
    pwd: appPwd,
    roles: [{ role: "readWrite", db: dbName }],
  });
  print('Created user "' + appUser + '" on DB "' + dbName + '"');
} else {
  print('User "' + appUser + '" already exists on DB "' + dbName + '"');
}
