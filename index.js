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
    query;
    constructor(query) { this.query = query; }
    get() { return this.query.trim(); }
}
class Limit extends Defaults {

    constructor(query) { super(query); }
    LIMIT(row_count = 1, offset = 0) {

        if (isNaN(row_count) || isNaN(offset)) throw new Error("Row Count and Offset have to be a Number");
        if (row_count < 1) throw new Error("Row Count can't be lower than 1");
        if (offset < 0) throw new Error("Offset can't be lower than 0");

        this.query = this.query + ` LIMIT ${offset},${row_count}`;

        return new Defaults(this.query);

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
        this.query = this.query + ` ORDER BY ${field}`;
        return new Order(this.query);
    }
    LIMIT(row_count = 1, offset = 0) {

        if (isNaN(row_count) || isNaN(offset)) throw new Error("Row Count and Offset have to be a Number");
        if (row_count < 1) throw new Error("Row Count can't be lower than 1");
        if (offset < 0) throw new Error("Offset can't be lower than 0");

        this.query = this.query + ` LIMIT ${offset},${row_count}`;

        return new Defaults(this.query);

    }
}
class Group extends Defaults {

    constructor(query) { super(query); }
    HAVING(expression) {
        if (!expression) { throw new Error("expression was not provided"); }
        this.query = this.query + ` HAVING ${expression}`;
        return new Having(this.query);
    }
    ORDERBY(field) {
        if (!field) { throw new Error("field was not provided"); }
        this.query = this.query + ` ORDER BY ${field}`;
        return new Order(this.query);
    }
    LIMIT(row_count = 1, offset = 0) {

        if (isNaN(row_count) || isNaN(offset)) throw new Error("Row Count and Offset have to be a Number");
        if (row_count < 1) throw new Error("Row Count can't be lower than 1");
        if (offset < 0) throw new Error("Offset can't be lower than 0");

        this.query = this.query + ` LIMIT ${offset},${row_count}`;

        return new Defaults(this.query);

    }

}
class WhereStatements {
    query;
    constructor(query) { this.query = query; }
    get() { return this.query.trim(); }
    WHERE(field) {
        if (!field) { throw new Error("field was not provided"); }
        this.query = this.query + ` WHERE ${field}`
        return new Operator(this.query);
    }
    WHERENOT(field) {
        if (!field) { throw new Error("field was not provided"); }
        this.query = this.query + ` WHERE NOT ${field}`
        return new Operator(this.query);
    }
    get WHERETRUE() {
        this.query = this.query + " WHERE TRUE ";
        return new Operator(this.query);
    }
    GROUPBY(...fields) {
        if (fields.length < 1) { throw new Error("fields was not provided"); }
        this.query = this.query + ` GROUP BY ${fields.join(", ")}`;
        return new Group(this.query);
    }
    ORDERBY(field) {
        if (!field) { throw new Error("field was not provided"); }
        this.query = this.query + ` ORDER BY ${field}`;
        return new Order(this.query);
    }
    LIMIT(row_count = 1, offset = 0) {

        if (isNaN(row_count) || isNaN(offset)) throw new Error("Row Count and Offset have to be a Number");
        if (row_count < 1) throw new Error("Row Count can't be lower than 1");
        if (offset < 0) throw new Error("Offset can't be lower than 0");

        this.query = this.query + ` LIMIT ${offset},${row_count}`;

        return new Defaults(this.query);

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

        this.query = this.query + ` INNER JOIN ${tableName}`;
        return new OnStatement(this.query);
    }
    LEFTJOIN(tableName = null) {
        if (!tableName) throw new Error("tableName was not provided");

        this.query = this.query + ` LEFT JOIN ${tableName}`;
        return new OnStatement(this.query);
    }
    RIGHTJOIN(tableName = null) {
        if (!tableName) throw new Error("tableName was not provided");

        this.query = this.query + ` RIGHT JOIN ${tableName}`;
        return new OnStatement(this.query);
    }
    CROSSJOIN(tableName = null) {
        if (!tableName) throw new Error("tableName was not provided");

        this.query = this.query + ` CROSS JOIN ${tableName}`;
        return new OnStatement(this.query);
    }
}
class From {
    query;
    constructor(query) {
        this.query = query;
    }
    /**
     * 
     * @param {string} tableName 
     * @returns WhereStatements
     */
    FROM(tableName) {
        if (!tableName) { throw new Error("Table Name not provided"); }
        this.query = this.query + ` FROM ${tableName}`;
        return new WhereWithJoins(this.query);
    }
}

class FromWithAggregation extends From {
    constructor(query) { super(query); }

    SUM(field, alias) {

        if (!field) throw new Error("field was not provided");

        this.query = this.query + ` SUM(${field}) AS ${alias}`;

        return new From(this.query);

    }
    AVG(field, alias) {

        if (!field) throw new Error("field was not provided");

        this.query = this.query + ` AVG(${field}) AS ${alias}`;

        return new From(this.query);

    }
    COUNT(field, alias) {

        if (!field) throw new Error("field was not provided");

        this.query = this.query + ` COUNT(${field}) AS ${alias}`;

        return new From(this.query);

    }
    MAX(field, alias) {

        if (!field) throw new Error("field was not provided");

        this.query = this.query + ` MAX(${field}) AS ${alias}`;

        return new From(this.query);

    }
    MIN(field, alias) {

        if (!field) throw new Error("field was not provided");

        this.query = this.query + ` MIN(${field}) AS ${alias}`;

        return new From(this.query);

    }
    STDEV(field, alias) {
        if (!field) throw new Error("field was not provided");

        this.query = this.query + ` STDEV(${field}) AS ${alias}`;

        return new From(this.query);
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
    this.query = `INSERT INTO ${tableName} (${fields.join(",")}) VALUES (${",?".repeat(fields.length).substring(1)})`;
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
