
class OperatorCombiner {
    #query;
    constructor(query) { this.#query = query; }
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

        if(this.#query.endsWith("?"))  {this.#query = this.#query.substring(0,this.#query.length-1);}

        this.#query = this.#query + `ANY (${sub_query})`;

        return this;
    }

    ALL(sub_query) {

        if (!sub_query) { throw new Error("Not sub query provided"); }

        if(this.#query.endsWith("?"))  {this.#query = this.#query.substring(0,this.#query.length - 1);}

        this.#query = this.#query + `ALL (${sub_query})`;
        return this;
    }
    get() { return this.#query.trim(); }
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
    get TRUE() {
        this.#query = this.#query + " TRUE ";
        return this;
    }

    IN(...values) {

        if (!values) { throw new Error("Not values provided"); }

        this.#query = this.#query + ` IN (${values.join(", ")})`;
        return new OperatorCombiner(this.#query);
    }
    NOTIN(...values) {

        if (!values) { throw new Error("Not values provided"); }

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

}
class WhereStatements {
    #query;
    constructor(query) { this.#query = query; }
    get() { return this.#query.trim(); }
    WHERE(field) {
        if (!field) { throw new Error("field was not provided"); }
        this.#query = this.#query + ` WHERE ${field}`
        return new Operator(this.#query);
    }
    WHERENOT(field) {
        if (!field) { throw new Error("field was not provided"); }
        this.#query = this.#query + ` WHERE NOT ${field}`
        return new Operator(this.#query);
    }
    get WHERETRUE() {
        this.#query = this.#query + " WHERE TRUE ";
        return new Operator(this.#query);
    }
}
class From {
    #query;
    constructor(query) {
        if (!query) throw new Error("query was not provided");
        this.#query = query + " FROM ";
    }
    FROM(tableName) {
        if (!tableName) { throw new Error("Table Name not provided"); }
        this.#query = this.#query + `${tableName}`;
        return new WhereStatements(this.#query);
    }
}

function SELECT(...fields) {

    if (fields.length < 1) { throw new Error("not fields provided"); }
    this.query = `SELECT ${fields.join(", ")}`;
    return new From(this.query);

}

function SELECTALL(...fields) {

    if (fields.length < 1) { throw new Error("not fields provided"); }
    this.query = `SELECT ALL ${fields.join(", ")}`;
    return new From(this.query);

}

function INSERT(tableName, ...fields) {

    if (!tableName) { throw new Error("tableName not provided"); }
    if (!fields) { throw new Error("fields not provided"); }
    this.query = `INSERT INTO ${tableName} (${fields.join(",")}) VALUES (${",?".repeat(fields.length).substring(1)})`;
    return this.query;
}

function UPDATE(tableName, ...fields) {

    if (!tableName) throw new Error("tableName was not provided");
    if (!fields) throw new Error("fields were not provided");
    let flds = fields.map(field => `${field} = ?`);
    this.query = `UPDATE ${tableName} SET (${flds.join(", ")})`;

    return new WhereStatements(this.query);
}

function DELETE() {
    this.query = "DELETE ";
    return new From(this.query);
}

module.exports = { DELETE: DELETE(), UPDATE, INSERT, SELECT, SELECTALL };
