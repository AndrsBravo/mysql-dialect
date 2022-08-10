
class OperatorCombiner {
    #query;
    constructor(query) { this.#query = query; }
    AND(condition = null) {

        let and = " AND ";
        if (condition) and = and + condition;
        this.#query = this.#query + and;
        return new Operator(this.#query);
    }
    ANDNOT(condition = null) {

        let andnot = " AND NOT ";
        if (condition) andnot = andnot + condition;
        this.#query = this.#query + andnot;
        return new Operator(this.#query);
    }
    OR(condition = null) {
        let or = " OR ";
        if (condition) or = or + condition;
        this.#query = this.#query + " OR ";
        return new Operator(this.#query);
    }
    get() { return this.#query.trim(); }
}
class Operator {
    #query;
    constructor(query) { this.#query = query; }
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
        return new Operator(this.#query);
    }
    get TRUE() {
        this.#query = this.#query + " TRUE ";
        return this;
    }

    IN(...values) {

        if (!values) { throw Error("Not values provided"); }

        this.#query = this.#query + ` IN (${values.join(", ")})`;
        return new OperatorCombiner(this.#query);
    }
    NOTIN(...values) {

        if (!values) { throw Error("Not values provided"); }

        this.#query = this.#query + ` NOT IN (${values.join(", ")})`;
        return new OperatorCombiner(this.#query);
    }
    ANY(sub_query) {

        if (!sub_query) { throw Error("Not sub query provided"); }

        this.#query = this.#query + ` ANY (${sub_query})`;
        return new OperatorCombiner(this.#query);
    }

    ALL(sub_query) {

        if (!sub_query) { throw Error("Not sub query provided"); }

        this.#query = this.#query + ` ALL (${sub_query})`;
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
        if (!field) { throw Error("field was not provided"); }
        this.#query = this.#query + ` WHERE ${field}`
        return new Operator(this.#query);
    }
    WHERENOT(field) {
        if (!field) { throw Error("field was not provided"); }
        this.#query = this.#query + ` WHERE NOT ${field}`
        return new Operator(this.#query);
    }
}
class From {
    #query;
    constructor(query) {
        if(!query) throw Error("query was not provided");
        this.#query = query + " FROM ";
    }
    FROM(tableName) {
        if (!tableName) { throw Error("Table Name not provided"); }
        this.#query = this.#query + ` ${tableName}`;
        return new WhereStatements(this.#query);
    }
}

class Query {
    #query;
    constructor() { }
    SELECT(...fields) {

        if (!fields) { throw Error("not fields provided"); return };
        this.#query = `SELECT ${fields.join(", ")}`;
        return new From(this.#query);

    }
    INSERT(tableName, ...fields) {

        if (!tableName) { throw Error("tableName not provided"); }
        if (!fields) { throw Error("fields not provided"); }
        this.#query = `INSERT INTO ${tableName} (${fields.join(",")}) VALUES (${",?".repeat(fields.length).substring(1)})`;
        return this.#query;
    }

    UPDATE(tableName,...fields) {
        if(!tableName) throw Error("tableName was not provided");
        if(!fields) throw Error("fields were not provided");
        let flds = fields.map(field => `${field} = ?` );
        this.#query = `UPDATE ${tableName} SET (${flds.join(", ")})`;
        
        return new WhereStatements(this.#query);

     }

    get DELETE() {
        this.#query = "DELETE ";
        return new From(this.#query);
    }
    get() {
        return this.#query.trim();
    }
}

function query() {
    return new Query();
}

module.exports = query;
