const query = require("./index.js");

describe("Declaration", () => {
    it("Query object reference", () => { expect(query).toBeDefined() });
    it("Query.SELECT function reference", () => { expect(query.SELECT).toBeDefined() });
    it("Query.INSERT function reference", () => { expect(query.INSERT).toBeDefined() });
    it("Query.UPDATE function reference", () => { expect(query.UPDATE).toBeDefined() });
    it("Query.DELETE function reference", () => { expect(query.DELETE).toBeDefined() });
});

