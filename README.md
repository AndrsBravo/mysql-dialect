# mysql-dialect

Is a MySql Database ease query builder.
Provides a MySql Query Builder. This version contains MySql CRUD operations. Each function returns a query string ready to use with a MySql connection provider like [mysql2](https://www.npmjs.com/package/mysql2) Package.

CRUD operations examples supported:

```js
const { SELECT, INSERT, DELETE, UPDATE, SELECTALL } = require("mysql-dialect");
```

**Getting started:**

```js

const { SELECT } = require("mysql-dialect");

//Return `SELECT user_name,email FROM users`
const query = SELECT("user_name,email).FROM("users").get();

```

Use with [mysql2](https://www.npmjs.com/package/mysql2):

```js
//Find mysql2 configuration at own documentation.
const mysql = require("mysql2");

const pool = mysql.createPool(...);

```

```js
//Use a query string instead raw string.
const result = await pool.query(query);
```
