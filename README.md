# mysql-dialect

Is a MySql Database easy query builder.

Provides a MySql Query Builder.
This version contains MySql CRUD operations.
Each function returns a sql query string ready to use with a MySql connection provider like [mysql2](https://www.npmjs.com/package/mysql2) Package.

CRUD operations examples supported:

````js
const { SELECT, INSERT, DELETE, UPDATE, SELECTALL } = require("mysql-dialect");`
**Getting started:**

```js

const { SELECT } = require("mysql-dialect");
//Return `SELECT user_name,email FROM users`
const query = SELECT("user_name,email).FROM("users").get();
````

Used with [mysql2](https://www.npmjs.com/package/mysql2):

```js
//Find mysql2 configuration at it own documentation.
const mysql = require("mysql2");
const pool = mysql.createPool(...);
```

```js
//Using a query string instead of a raw string.
const result = await pool.query(query);`
```
