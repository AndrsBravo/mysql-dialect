class WhereStatements {
    #query;
    constructor(query) { this.#query = query; }
    get() { return this.#query; }
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

        if (!fields) {Error(""); return};
        if (typeof (fields) == "array") fields = fields.join(", ");
        this.#query = `SELECT ${fields}`;
        return new From(this.#query);

    }
    INSERT() { }
    UPDATE() { }
    DELETE() { }
}

module.exports = new Query();
