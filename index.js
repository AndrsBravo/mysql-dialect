class Query {
    #query;
    constructor() { }
    get() { return this.#query; }
    SELECT() { }
    INSERT() { }
    UPDATE() { }
    DELETE() { }
}

module.exports = new Query();
