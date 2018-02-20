
module.exports = {
    "development": {
        "dialect": "sqlite",
        "storage": "db/db.development.sqlite"
    },
    "test": {
        "dialect": "sqlite",
        "storage": "db/db.test.sqlite"
    },
    "production": {
        "username": "DB_USER",
        "password": "DB_PASS",
        "database": "DB_NAME",
        "host": "DB_HOST",
        "dialect": "mysql"
    }
}

