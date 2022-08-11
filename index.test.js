const query = require("./index.js");

describe("Declaration", () => {
    it("Query object reference", () => { expect(query).toBeDefined() });
    it("Query.SELECT function reference", () => { expect(query.SELECT).toBeDefined() });
    it("Query.SELECTALL function reference", () => { expect(query.SELECTALL).toBeDefined() });
    it("Query.INSERT function reference", () => { expect(query.INSERT).toBeDefined() });
    it("Query.UPDATE function reference", () => { expect(query.UPDATE).toBeDefined() });
    it("Query.DELETE function reference", () => { expect(query.DELETE).toBeDefined() });
});

describe("SELECT Statement", () => {

    it("Not Function's Param exception managed", () => {
        expect(() => query.SELECT()).toThrow();
    });
    it("return FROM reference", () => { expect(() => query.SELECT("*")).toBeDefined() });
    it("FROM Not Function's Param exception managed", () => { expect(() => query.SELECT("*").FROM()).toThrow() });
    it("Asterisk select all query return", () => { expect(query.SELECT("*").FROM("users").get()).toBe("SELECT * FROM users") });
    it("WHERE Not Function's Param exception managed", () => { () => expect(query.SELECT("*").FROM("users").WHERE()).toThrow() });
    it("'WHERE TRUE' true statement", () => {
        expect(query.SELECT("*").FROM("users").WHERETRUE.get()).toBe("SELECT * FROM users WHERE TRUE")
    });
    it("'WHERE field = ?' equality statement", () => {
        expect(query.SELECT("*").FROM("users").WHERE("name").equ.get()).toBe("SELECT * FROM users WHERE name = ?")
    });
    it("'WHERE field > ?' greater than operator statement", () => {
        expect(query.SELECT("*").FROM("users").WHERE("name").gthn.get()).toBe("SELECT * FROM users WHERE name > ?")
    });
    it("'WHERE field < ?' lower than operator statement", () => {
        expect(query.SELECT("*").FROM("users").WHERE("name").lthn.get()).toBe("SELECT * FROM users WHERE name < ?")
    });
    it("'WHERE field <> ?' not equal operator statement", () => {
        expect(query.SELECT("*").FROM("users").WHERE("name").nequ.get()).toBe("SELECT * FROM users WHERE name <> ?")
    });
    it("'WHERE field >= ?' greater or equal than operator statement", () => {
        expect(query.SELECT("*").FROM("users").WHERE("name").gtrOrequ.get()).toBe("SELECT * FROM users WHERE name >= ?")
    });
    it("'WHERE field <= ?' lower or equal than operator statement", () => {
        expect(query.SELECT("*").FROM("users").WHERE("name").lwrOrequ.get()).toBe("SELECT * FROM users WHERE name <= ?")
    });
    it("'WHERE field LIKE ?' like operator statement", () => {
        expect(query.SELECT("*").FROM("users").WHERE("name").LIKE.get()).toBe("SELECT * FROM users WHERE name LIKE ?")
    });
    it("'WHERE field BETWEEN ? AND ?' like operator statement", () => {
        expect(query.SELECT("*").FROM("users").WHERE("name").BETWEEN.get()).toBe("SELECT * FROM users WHERE name BETWEEN ? AND ?")
    });
    it("'WHERE field NOT BETWEEN ? AND ?' like operator statement", () => {
        expect(query.SELECT("*").FROM("users").WHERE("name").NOTBETWEEN.get()).toBe("SELECT * FROM users WHERE name NOT BETWEEN ? AND ?")
    });
    it("'WHERE field IN ('name1', 'name2')' like operator statement", () => {
        expect(query.SELECT("*").FROM("users").WHERE("name").IN("'name1'", "'name2'").get()).toBe("SELECT * FROM users WHERE name IN ('name1', 'name2')")
    });
    it("'WHERE field NOT IN ('name1', 'name2')' like operator statement", () => {
        expect(query.SELECT("*").FROM("users").WHERE("name").NOTIN("'name1'", "'name2'").get()).toBe("SELECT * FROM users WHERE name NOT IN ('name1', 'name2')")
    });

    it("AND Not Function's Param exception managed", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.AND()).toThrow();
    });
    it("return AND reference", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.AND("lastName")).toBeDefined();
    });

    it("'WHERE field = ? AND field2 = ?' AND operator statement", () => {
        expect(query.SELECT("*").FROM("users").WHERE("name").equ.AND("lastName").equ.get()).toBe("SELECT * FROM users WHERE name = ? AND lastName = ?");
    });

    it("AND NOT, Not Function's Param exception managed", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.ANDNOT()).toThrow();
    });
    it("return ANDNOT reference", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.AND("lastName")).toBeDefined();
    });

    it("'WHERE field = ? AND NOT field2 = ?' AND operator statement", () => {
        expect(query.SELECT("*").FROM("users").WHERE("name").equ.ANDNOT("lastName").equ.get()).toBe("SELECT * FROM users WHERE name = ? AND NOT lastName = ?");
    });

    it("OR, Not Function's Param exception managed", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.OR()).toThrow();
    });
    it("return OR reference", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.RO("lastName")).toBeDefined();
    });

    it("'WHERE field = ? OR field2 = ?' OR operator statement", () => {
        expect(query.SELECT("*").FROM("users").WHERE("name").equ.OR("lastName").equ.get()).toBe("SELECT * FROM users WHERE name = ? OR lastName = ?");
    });

    it("WHERE ALL, Not Function's Param exception managed", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.ALL()).toThrow();
    });

    it("Return ALL reference", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.ALL("")).toBeDefined();
    });

    it("Return ALL reference", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.ALL("")).toBeDefined();
    });

    it("WHERE field = ALL (sub-query)", () => {
        const session = query.SELECT("userid").FROM("sessions").WHERE("name").equ.get();
        expect(query.SELECT("*").FROM("users").WHERE("userid").equ.ALL(session).get())
        .toBe("SELECT * FROM users WHERE userid = ALL (SELECT userid FROM sessions WHERE name = ?)");
    });

    it("WHERE ANY, Not Function's Param exception managed", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.ANY()).toThrow();
    });

});

describe("SELECT ALL Statement", () => {
    it("SELECT ALL, Not Function's Param exception managed", () => {
        expect(() => query.SELECTALL()).toThrow();
    });
    it("SELECT ALL, return a From", () => {
        expect(() => query.SELECTALL("name")).toBeDefined();
    });
    it("SELECT ALL FROM, Not Function's Param exception managed", () => {
        expect(() => query.SELECTALL("name").FROM()).toThrow();
    });
    it("'SELECT ALL' for all values of a column, TRUE combine", () => {
        expect(query.SELECTALL("name").FROM("users").WHERETRUE.get()).toBe("SELECT ALL name FROM users WHERE TRUE")
    });
});
