
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
    get() { return this.#query; }
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

        if (!values) { Error("Not values provided"); return; }

        this.#query = this.#query + ` IN (${values.join(", ")})`;
        return new OperatorCombiner(this.#query);
    }
    NOTIN(...values) {

        if (!values) { Error("Not values provided"); return; }

        this.#query = this.#query + ` NOT IN (${values.join(", ")})`;
        return new OperatorCombiner(this.#query);
    }
    ANY(sub_query) {

        if (!sub_query) { Error("Not sub query provided"); return; }

        this.#query = this.#query + ` ANY (${sub_query})`;
        return new OperatorCombiner(this.#query);
    }

    ALL(sub_query) {

        if (!sub_query) { Error("Not sub query provided"); return; }

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
    get() { return this.#query; }
    WHERE(field) {
        this.#query = this.#query + ` WHERE ${field}`
        return new Operator(this.#query);
    }
    WHERENOT(field) {
        this.#query = this.#query + ` WHERE NOT ${field}`
        return new Operator(this.#query);
    }
}
class From {
    #query;
    constructor(query) {
        this.#query = query + " FROM";
    }
    FROM(tableName) {
        if (!tableName) { Error("Table Name not provided"); return; }
        this.#query = this.#query + ` ${tableName}`;
        return new WhereStatements(this.#query);
    }
}
class Query {
    #query;
    constructor() { }
    SELECT(...fields) {

        if (!fields) { Error("not fields provided"); return };
        this.#query = `SELECT ${fields.join(", ")}`;
        return new From(this.#query);

    }
    INSERT(tableName,...fields) {

        if(!tableName) {Error("tableName not provided"); return;}
        if (!fields) {Error("fields not provided"); return;}
        this.#query = `INSERT INTO ${tableName} (${fields.join(",")}) VALUES (${ ",?".repeat(fields.length).substring(1) })`;
        return this.#query;
    }

    UPDATE() { }
    DELETE() { }
    get(){
        return this.#query;
    }
}

function query() {
    return new Query();
}

module.exports = query;
