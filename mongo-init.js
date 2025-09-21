db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE || "chatter");
db.createUser({
  user: process.env.MONGO_APP_USER || "chatter",
  pwd: process.env.MONGO_APP_PASSWORD || "abc123!!!",
  roles: [
    { role: "readWrite", db: process.env.MONGO_INITDB_DATABASE || "chatter" },
  ],
});
