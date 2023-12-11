class OperatorCombiner {
    #query;
    constructor(query) { this.#query = query; }
    get() { return this.#query.trim(); }
    AND(condition = null) {

        if (!condition) throw new Error("Not condition provided");

        let and = " AND ";
        and = and + condition;
        this.#query = this.#query + and;
        return new Operator(this.#query);
    }
    ANDNOT(condition = null) {

        if (!condition) throw new Error("Not condition provided");
        let andnot = " AND NOT ";
        andnot = andnot + condition;
        this.#query = this.#query + andnot;
        return new Operator(this.#query);
    }
    OR(condition = null) {
        if (!condition) throw new Error("Not condition provided");
        let or = " OR ";
        or = or + condition;
        this.#query = this.#query + or;
        return new Operator(this.#query);
    }
    ANY(sub_query) {

        if (!sub_query) { throw new Error("Not sub query provided"); }

        // if (this.#query.endsWith("?")) { this.#query = this.#query.substring(0, this.#query.length - 1); }

        this.#query = this.#query.substring(0, this.#query.length - 1) + `ANY (${sub_query})`;

        return this;
    }
    ALL(sub_query) {

        if (!sub_query) { throw new Error("Not sub query provided"); }

        // this.#query =  this.#query.endsWith("?") ? this.#query.substring(0, this.#query.length - 1):  this.#query  ; 

        this.#query = this.#query.substring(0, this.#query.length - 1) + `ALL (${sub_query})`;
        return this;
    }
    ORDERBY(field) {
        if (!field) { throw new Error("field was not provided"); }
        this.#query = this.#query + ` ORDER BY ${field}`;
        return new Order(this.#query);
    }
    GROUPBY(...fields) {
        if (fields.length < 1) { throw new Error("fields was not provided"); }
        this.#query = this.#query + ` GROUP BY ${fields.join(", ")}`;
        return new Group(this.#query);
    }
    LIMIT(row_count = 1, offset = 0) {

        if (isNaN(row_count) || isNaN(offset)) throw new Error("Row Count and Offset have to be a Number");
        if (row_count < 1) throw new Error("Row Count can't be lower than 1");
        if (offset < 0) throw new Error("Offset can't be lower than 0");

        this.#query = this.#query + ` LIMIT ${offset},${row_count}`;

        return new Defaults(this.#query);

    }
}
class Operator {
    #query;
    constructor(query) { this.#query = query; }
    get() { return this.#query.trim(); }
    get equ() {
        this.#query = this.#query + " = ?";
        return new OperatorCombiner(this.#query);
    }
    get nequ() {
        this.#query = this.#query + " <> ?";
        return new OperatorCombiner(this.#query);
    }
    get gthn() {
        this.#query = this.#query + " > ?";
        return new OperatorCombiner(this.#query);
    }
    get gtrOrequ() {
        this.#query = this.#query + " >= ?";
        return new OperatorCombiner(this.#query);
    }
    get lthn() {
        this.#query = this.#query + " < ?";
        return new OperatorCombiner(this.#query);
    }
    get lwrOrequ() {
        this.#query = this.#query + " <= ?";
        return new OperatorCombiner(this.#query);
    }
    get LIKE() {
        this.#query = this.#query + " LIKE ? ";
        return new OperatorCombiner(this.#query);
    }
    IN(...values) {

        if (values.length < 1) { throw new Error("Not values provided"); }

        this.#query = this.#query + ` IN (${values.join(", ")})`;
        return new OperatorCombiner(this.#query);
    }
    NOTIN(...values) {

        if (values.length < 1) { throw new Error("Not values provided"); }

        this.#query = this.#query + ` NOT IN (${values.join(", ")})`;
        return new OperatorCombiner(this.#query);
    }

    get BETWEEN() {

        this.#query = this.#query + ` BETWEEN ? AND ?`;
        return new OperatorCombiner(this.#query);

    }
    get NOTBETWEEN() {

        this.#query = this.#query + ` NOT BETWEEN ? AND ?`;
        return new OperatorCombiner(this.#query);

    }
    get ISNULL() {

        this.#query = this.#query + ` IS NULL`;
        return new OperatorCombiner(this.#query);

    }

}
class Defaults {
    _query;
    constructor(query) { this._query = query; }
    get() { return this._query.trim(); }
}
class Limit extends Defaults {

    constructor(query) { super(query); }
    LIMIT(row_count = 1, offset = 0) {

        if (isNaN(row_count) || isNaN(offset)) throw new Error("Row Count and Offset have to be a Number");
        if (row_count < 1) throw new Error("Row Count can't be lower than 1");
        if (offset < 0) throw new Error("Offset can't be lower than 0");

        this._query = this._query + ` LIMIT ${offset},${row_count}`;

        return new Defaults(this._query);

    }
}
class Order {
    #query;
    constructor(query) { this.#query = query; }
    get ASC() {
        this.#query = this.#query + " ASC";
        return new Limit(this.#query);
    }
    get DESC() {
        this.#query = this.#query + " DESC";
        return new Limit(this.#query);
    }
    get() { return this.#query.trim(); }
    LIMIT(row_count = 1, offset = 0) {

        if (isNaN(row_count) || isNaN(offset)) throw new Error("Row Count and Offset have to be a Number");
        if (row_count < 1) throw new Error("Row Count can't be lower than 1");
        if (offset < 0) throw new Error("Offset can't be lower than 0");

        this.#query = this.#query + ` LIMIT ${offset},${row_count}`;

        return new Defaults(this.#query);

    }
}
class Having extends Defaults {
    constructor(query) { super(query); }
    ORDERBY(field) {
        if (!field) { throw new Error("field was not provided"); }
        this._query = this._query + ` ORDER BY ${field}`;
        return new Order(this._query);
    }
    LIMIT(row_count = 1, offset = 0) {

        if (isNaN(row_count) || isNaN(offset)) throw new Error("Row Count and Offset have to be a Number");
        if (row_count < 1) throw new Error("Row Count can't be lower than 1");
        if (offset < 0) throw new Error("Offset can't be lower than 0");

        this._query = this._query + ` LIMIT ${offset},${row_count}`;

        return new Defaults(this._query);

    }
}
class Group extends Defaults {

    constructor(query) { super(query); }
    HAVING(expression) {
        if (!expression) { throw new Error("expression was not provided"); }
        this._query = this._query + ` HAVING ${expression}`;
        return new Having(this._query);
    }
    ORDERBY(field) {
        if (!field) { throw new Error("field was not provided"); }
        this._query = this._query + ` ORDER BY ${field}`;
        return new Order(this._query);
    }
    LIMIT(row_count = 1, offset = 0) {

        if (isNaN(row_count) || isNaN(offset)) throw new Error("Row Count and Offset have to be a Number");
        if (row_count < 1) throw new Error("Row Count can't be lower than 1");
        if (offset < 0) throw new Error("Offset can't be lower than 0");

        this._query = this._query + ` LIMIT ${offset},${row_count}`;

        return new Defaults(this._query);

    }

}
class WhereStatements {
    _query;
    constructor(query) { this._query = query; }
    get() { return this._query.trim(); }
    WHERE(field) {
        if (!field) { throw new Error("field was not provided"); }
        this._query = this._query + ` WHERE ${field}`
        return new Operator(this._query);
    }
    WHERENOT(field) {
        if (!field) { throw new Error("field was not provided"); }
        this._query = this._query + ` WHERE NOT ${field}`
        return new Operator(this._query);
    }
    get WHERETRUE() {
        this._query = this._query + " WHERE TRUE ";
        return new Operator(this._query);
    }
    GROUPBY(...fields) {
        if (fields.length < 1) { throw new Error("fields was not provided"); }
        this._query = this._query + ` GROUP BY ${fields.join(", ")}`;
        return new Group(this._query);
    }
    ORDERBY(field) {
        if (!field) { throw new Error("field was not provided"); }
        this._query = this._query + ` ORDER BY ${field}`;
        return new Order(this._query);
    }
    LIMIT(row_count = 1, offset = 0) {

        if (isNaN(row_count) || isNaN(offset)) throw new Error("Row Count and Offset have to be a Number");
        if (row_count < 1) throw new Error("Row Count can't be lower than 1");
        if (offset < 0) throw new Error("Offset can't be lower than 0");

        this._query = this._query + ` LIMIT ${offset},${row_count}`;

        return new Defaults(this._query);

    }
}
class OnStatement {
    #query;
    constructor(query) { this.#query = query; }
    ON(field1, field2) {

        if (!field1) { throw new Error("first field was not provided"); }
        if (!field2) { throw new Error("second field was not provided"); }

        this.#query = this.#query + ` ON ${field1} = ${field2}`;
        return new WhereWithJoins(this.#query);
    }
}
class WhereWithJoins extends WhereStatements {
    constructor(query) { super(query); }
    INNERJOIN(tableName = null) {

        if (!tableName) throw new Error("tableName was not provided");

        this._query = this._query + ` INNER JOIN ${tableName}`;
        return new OnStatement(this._query);
    }
    LEFTJOIN(tableName = null) {
        if (!tableName) throw new Error("tableName was not provided");

        this._query = this._query + ` LEFT JOIN ${tableName}`;
        return new OnStatement(this._query);
    }
    RIGHTJOIN(tableName = null) {
        if (!tableName) throw new Error("tableName was not provided");

        this._query = this._query + ` RIGHT JOIN ${tableName}`;
        return new OnStatement(this._query);
    }
    CROSSJOIN(tableName = null) {
        if (!tableName) throw new Error("tableName was not provided");

        this._query = this._query + ` CROSS JOIN ${tableName}`;
        return new OnStatement(this._query);
    }
}
class From {
    _query;
    constructor(query) {
        this._query = query;
    }
    /**
     * 
     * @param {string} tableName 
     * @returns WhereStatements
     */
    FROM(tableName) {
        if (!tableName) { throw new Error("Table Name not provided"); }
        this._query = this._query + ` FROM ${tableName}`;
        return new WhereWithJoins(this._query);
    }
}

class FromWithAggregation extends From {
    constructor(query) { super(query); }

    SUM(field, alias) {

        if (!field) throw new Error("field was not provided");

        this._query = this._query + ` SUM(${field}) AS ${alias}`;

        return new From(this._query);

    }
    AVG(field, alias) {

        if (!field) throw new Error("field was not provided");

        this._query = this._query + ` AVG(${field}) AS ${alias}`;

        return new From(this._query);

    }
    COUNT(field, alias) {

        if (!field) throw new Error("field was not provided");

        this._query = this._query + ` COUNT(${field}) AS ${alias}`;

        return new From(this._query);

    }
    MAX(field, alias) {

        if (!field) throw new Error("field was not provided");

        this._query = this._query + ` MAX(${field}) AS ${alias}`;

        return new From(this._query);

    }
    MIN(field, alias) {

        if (!field) throw new Error("field was not provided");

        this._query = this._query + ` MIN(${field}) AS ${alias}`;

        return new From(this._query);

    }
    STDEV(field, alias) {
        if (!field) throw new Error("field was not provided");

        this._query = this._query + ` STDEV(${field}) AS ${alias}`;

        return new From(this._query);
    }

}

function SELECT(...fields) {

    if (fields.length < 1) { throw new Error("not fields provided"); }
    this.query = `SELECT ${fields.join(", ")}`;
    return new FromWithAggregation(this.query)


}

function SELECTALL(...fields) {

    if (fields.length < 1) { throw new Error("not fields provided"); }
    this.query = `SELECT ALL ${fields.join(", ")}`;
    return new FromWithAggregation(this.query);

}

function INSERT(tableName = null, ...fields) {

    if (fields.length < 1) { throw new Error("fields not provided"); }
    if (!tableName) { throw new Error("tableName not provided"); }
    this.query = `INSERT INTO ${tableName} (${fields.join(",")}) VALUES(${",?".repeat(fields.length).substring(1)})`;
    return this.query;
}

function UPDATE(tableName, ...fields) {
    if (!tableName) throw new Error("tableName was not provided");
    if (fields.length < 1) throw new Error("fields were not provided");
    let flds = fields.map(field => `${field} = ?`);
    this.query = `UPDATE ${tableName} SET ${flds.join(", ")}`;

    return new WhereStatements(this.query);
}

function DELETE(tableName) {
    if (!tableName) throw new Error('tableName was not provided');

    this.query = "DELETE";
    return new From(this.query).FROM(tableName);
}

module.exports = { DELETE, UPDATE, INSERT, SELECT, SELECTALL };
