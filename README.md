# mysql-dialect

Is a MySql Database ease query builder.
Provides a MySql Query Builder. This version contains MySql CRUD operations. Each function returns a query string ready to use with a MySql connection provider like [mysql2](https://www.npmjs.com/package/mysql2) Package.

This are CRUD operation examples:

```js
const { SELECT, INSERT, DELETE, UPDATE, SELECTALL } = require("mysql-dialect");
```
