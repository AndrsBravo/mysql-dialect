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

    it("Not Function's Param exception throw", () => {
        expect(() => query.SELECT()).toThrow();
    });
    it("return FROM reference", () => { expect(() => query.SELECT("*")).toBeDefined() });
    it("FROM Not Function's Param exception throw", () => {
        expect(() => query.SELECT("*").FROM()).toThrow();
    });
    it("Asterisk select all query return", () => { expect(query.SELECT("*").FROM("users").get()).toBe("SELECT * FROM users") });
    it("WHERE Not Function's Param exception throw", () => { () => expect(query.SELECT("*").FROM("users").WHERE()).toThrow() });
    it("'WHERE TRUE' true statement", () => {
        expect(query.SELECT("*").FROM("users").WHERETRUE.get()).toBe("SELECT * FROM users WHERE TRUE")
    });
    it("'WHERE NOT field = ?' equality statement", () => {
        expect(() => query.SELECT("*").FROM("users").WHERENOT()).toThrow();
        expect(query.SELECT("*").FROM("users").WHERENOT("name").equ.get()).toBe("SELECT * FROM users WHERE NOT name = ?")
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
        expect(() => query.SELECT("*").FROM("users").WHERE("name").IN()).toThrow();
        expect(query.SELECT("*").FROM("users").WHERE("name").IN("'name1'", "'name2'").get()).toBe("SELECT * FROM users WHERE name IN ('name1', 'name2')")
    });
    it("'WHERE field NOT IN ('name1', 'name2')' like operator statement", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").NOTIN()).toThrow();
        expect(query.SELECT("*").FROM("users").WHERE("name").NOTIN("'name1'", "'name2'").get()).toBe("SELECT * FROM users WHERE name NOT IN ('name1', 'name2')")
    });

    it("AND Not Function's Param exception throw", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.AND()).toThrow();
    });
    it("return AND reference", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.AND("lastName")).toBeDefined();
    });

    it("'WHERE field = ? AND field2 = ?' AND operator statement", () => {
        expect(query.SELECT("*").FROM("users").WHERE("name").equ.AND("lastName").equ.get()).toBe("SELECT * FROM users WHERE name = ? AND lastName = ?");
    });

    it("AND NOT, Not Function's Param exception throw", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.ANDNOT()).toThrow();
    });
    it("return ANDNOT reference", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.AND("lastName")).toBeDefined();
    });

    it("'WHERE field = ? AND NOT field2 = ?' AND operator statement", () => {
        expect(query.SELECT("*").FROM("users").WHERE("name").equ.ANDNOT("lastName").equ.get()).toBe("SELECT * FROM users WHERE name = ? AND NOT lastName = ?");
    });

    it("OR, Not Function's Param exception throw", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.OR()).toThrow();
    });
    it("return OR reference", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.RO("lastName")).toBeDefined();
    });

    it("'WHERE field = ? OR field2 = ?' OR operator statement", () => {
        expect(query.SELECT("*").FROM("users").WHERE("name").equ.OR("lastName").equ.get()).toBe("SELECT * FROM users WHERE name = ? OR lastName = ?");
    });

    it("WHERE ALL, Not Function's Param exception throw", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.ALL()).toThrow();
    });

    it("Return ALL reference", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.ALL("")).toBeDefined();
    });

    it("WHERE field = ALL (sub-query)", () => {
        const session = query.SELECT("userid").FROM("sessions").WHERE("name").equ.get();
        expect(query.SELECT("*").FROM("users").WHERE("userid").equ.ALL(session).get())
            .toBe("SELECT * FROM users WHERE userid = ALL (SELECT userid FROM sessions WHERE name = ?)");
    });

    it("WHERE ANY, Not Function's Param exception throw", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.ANY()).toThrow();
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.ANY()).toBeTruthy();
    });

    it("Return ANY reference", () => {
        expect(() => query.SELECT("*").FROM("users").WHERE("name").equ.ANY("")).toBeDefined();
    });

    it("WHERE field = ANY (sub-query)", () => {
        const session = query.SELECT("userid").FROM("sessions").WHERE("name").equ.get();
        expect(query.SELECT("*").FROM("users").WHERE("userid").equ.ANY(session).get())
            .toBe("SELECT * FROM users WHERE userid = ANY (SELECT userid FROM sessions WHERE name = ?)");
    });

});

describe("SELECT ALL Statement", () => {
    it("SELECT ALL, Not Function's Param exception throw", () => {
        expect(() => query.SELECTALL()).toThrow();
    });
    it("SELECT ALL, return a From", () => {
        expect(() => query.SELECTALL("name")).toBeDefined();
    });
    it("SELECT ALL FROM, Not Function's Param exception throw", () => {
        expect(() => query.SELECTALL("name").FROM()).toThrow();
    });
    it("'SELECT ALL' for all values of a column, TRUE combine", () => {
        expect(query.SELECTALL("name").FROM("users").WHERETRUE.get()).toBe("SELECT ALL name FROM users WHERE TRUE")
    });
});

describe("SELECT Statements with JOIN", () => {

    test("INNER JOIN, Not Function's Param exception throw'", () => {
        expect(() => query.SELECT("u.user", "r.role").FROM("users u").INNERJOIN()).toThrow();
    });

    test("Return INNERJOIN reference", () => {
        expect(() => query.SELECT("u.user", "r.role").FROM("users u").INNERJOIN("roles r")).toBeDefined();
    });

    test("INNER JOIN ON, Not Function's Param exception throw'", () => {
        expect(() => query.SELECT("u.user", "r.role").FROM("users u").INNERJOIN("roles r").ON("u.roleid")).toThrow();
        expect(() => query.SELECT("u.user", "r.role").FROM("users u").INNERJOIN("roles r").ON(null, "r.roleid")).toThrow();
    });
    test("return INNER JOIN ON reference", () => {
        expect(() => query.SELECT("u.user", "r.role").FROM("users u").INNERJOIN("roles r").ON("u.roleid", "r.roleid")).toBeDefined();
    });
    test("INNER JOIN Statement", () => {
        const INNERJOIN = query.SELECT("u.user", "r.role").FROM("users u").INNERJOIN("roles r").ON("u.roleid", "r.roleid").get();
        expect(INNERJOIN).toBe("SELECT u.user, r.role FROM users u INNER JOIN roles r ON u.roleid = r.roleid");
    });

    test("LEFT JOIN Statement", () => {

        expect(() => query.SELECT("u.user", "r.role").FROM("users u").LEFTJOIN()).toThrow();
        expect(() => query.SELECT("u.user", "r.role").FROM("users u").LEFTJOIN("roles r")).toBeDefined();
        expect(() => query.SELECT("u.user", "r.role").FROM("users u").LEFTJOIN("roles r").ON("u.roleid")).toThrow();
        expect(() => query.SELECT("u.user", "r.role").FROM("users u").LEFTJOIN("roles r").ON(null, "r.roleid")).toThrow();
        expect(() => query.SELECT("u.user", "r.role").FROM("users u").LEFTJOIN("roles r").ON("u.roleid", "r.roleid")).toBeDefined();
        const LEFTJOIN = query.SELECT("u.user", "r.role").FROM("users u").LEFTJOIN("roles r").ON("u.roleid", "r.roleid").get();
        expect(LEFTJOIN).toBe("SELECT u.user, r.role FROM users u LEFT JOIN roles r ON u.roleid = r.roleid");

    });
    test("'LEFT JOIN WHERE' Statement", () => {
        const LEFTJOIN = query.SELECT("u.user", "r.role").FROM("users u").LEFTJOIN("roles r").ON("u.roleid", "r.roleid").WHERE("u.roleid").equ.get();
        expect(LEFTJOIN).toBe("SELECT u.user, r.role FROM users u LEFT JOIN roles r ON u.roleid = r.roleid WHERE u.roleid = ?");
    });

    test("RIGHT JOIN Statement", () => {

        expect(() => query.SELECT("u.user", "r.role").FROM("users u").RIGHTJOIN()).toThrow();
        expect(() => query.SELECT("u.user", "r.role").FROM("users u").RIGHTJOIN("roles r")).toBeDefined();
        expect(() => query.SELECT("u.user", "r.role").FROM("users u").RIGHTJOIN("roles r").ON("u.roleid")).toThrow();
        expect(() => query.SELECT("u.user", "r.role").FROM("users u").RIGHTJOIN("roles r").ON(null, "r.roleid")).toThrow();
        expect(() => query.SELECT("u.user", "r.role").FROM("users u").RIGHTJOIN("roles r").ON("u.roleid", "r.roleid")).toBeDefined();
        const RIGHTJOIN = query.SELECT("u.user", "r.role").FROM("users u").RIGHTJOIN("roles r").ON("u.roleid", "r.roleid").get();
        expect(RIGHTJOIN).toBe("SELECT u.user, r.role FROM users u RIGHT JOIN roles r ON u.roleid = r.roleid");

    });
    test("'RIGHT JOIN WHERE' Statement", () => {
        const RIGHTJOIN = query.SELECT("u.user", "r.role").FROM("users u").RIGHTJOIN("roles r").ON("u.roleid", "r.roleid").WHERE("u.roleid").equ.get();
        expect(RIGHTJOIN).toBe("SELECT u.user, r.role FROM users u RIGHT JOIN roles r ON u.roleid = r.roleid WHERE u.roleid = ?");
    });
    test("CROSS JOIN Statement", () => {

        expect(() => query.SELECT("u.user", "r.role").FROM("users u").CROSSJOIN()).toThrow();
        expect(() => query.SELECT("u.user", "r.role").FROM("users u").CROSSJOIN("roles r")).toBeDefined();
        expect(() => query.SELECT("u.user", "r.role").FROM("users u").CROSSJOIN("roles r").ON("u.roleid")).toThrow();
        expect(() => query.SELECT("u.user", "r.role").FROM("users u").CROSSJOIN("roles r").ON(null, "r.roleid")).toThrow();
        expect(() => query.SELECT("u.user", "r.role").FROM("users u").CROSSJOIN("roles r").ON("u.roleid", "r.roleid")).toBeDefined();
        const CROSSJOIN = query.SELECT("u.user", "r.role").FROM("users u").CROSSJOIN("roles r").ON("u.roleid", "r.roleid").get();
        expect(CROSSJOIN).toBe("SELECT u.user, r.role FROM users u CROSS JOIN roles r ON u.roleid = r.roleid");
    });
    test("'CROSS JOIN WHERE' Statement", () => {
        const CROSSJOIN = query.SELECT("u.user", "r.role").FROM("users u").CROSSJOIN("roles r").ON("u.roleid", "r.roleid").WHERE("u.roleid").equ.get();
        expect(CROSSJOIN).toBe("SELECT u.user, r.role FROM users u CROSS JOIN roles r ON u.roleid = r.roleid WHERE u.roleid = ?");
    });

});

describe("ORDER BY Stament", () => {

    test("ORDER BY, Not Function's Param exception throw'", () => {
        expect(() => query.SELECT("name", "email").FROM("users").ORDERBY()).toThrow();
    });
    test("ORDER BY return a reference", () => {
        expect(query.SELECT("name", "email").FROM("users").ORDERBY("name")).toBeDefined();
    });
    test("ORDER BY query statement", () => {

        const qstring = query.SELECT("name", "email").FROM("users").ORDERBY("name").get();
        const qstringasc = query.SELECT("name", "email").FROM("users").ORDERBY("name").ASC.get();
        const qstringdesc = query.SELECT("name", "email").FROM("users").ORDERBY("name").DESC.get();
        expect(qstring).toBe("SELECT name, email FROM users ORDER BY name");
        expect(qstringasc).toBe("SELECT name, email FROM users ORDER BY name ASC");
        expect(qstringdesc).toBe("SELECT name, email FROM users ORDER BY name DESC");

    });
    test("WHERE ORDER BY return a reference", () => {
        expect(()=>query.SELECT("name", "email").FROM("users").WHERE("name").equ.ORDERBY()).toThrow();
    });
    test("'WHERE field = ? ORDER BY' query statement", () => {

        const qstring = query.SELECT("name", "email").FROM("users").WHERE("name").equ.ORDERBY("name").get();
        const qstringasc = query.SELECT("name", "email").FROM("users").WHERE("name").equ.ORDERBY("name").ASC.get();
        const qstringdesc = query.SELECT("name", "email").FROM("users").WHERE("name").equ.ORDERBY("name").DESC.get();
        expect(qstring).toBe("SELECT name, email FROM users WHERE name = ? ORDER BY name");
        expect(qstringasc).toBe("SELECT name, email FROM users WHERE name = ? ORDER BY name ASC");
        expect(qstringdesc).toBe("SELECT name, email FROM users WHERE name = ? ORDER BY name DESC");

    });

});

describe("INSERT Statement", () => {
    test("INSERT, Not Function's Param exception throw", () => {
        expect(() => query.INSERT()).toThrow()
        expect(() => query.INSERT("users")).toThrow()
        expect(() => query.INSERT(null, "userName", "email")).toThrow()
    });
    test("'INSERT INTO' Statement", () => {
        expect(query.INSERT("users", "userName", "email", "password")).toBe("INSERT INTO users (userName,email,password) VALUES (?,?,?)")
    });
});

describe("DELETE Statement", () => {

    test("DELETE, Not Function's Param exception throw", () => {
        expect(() => query.DELETE()).toThrow()
    });

    test("DELETE, return a WHERE instance", () => {
        expect(query.DELETE("users")).toBeDefined();
    });

    test("'DELETE FROM table', statement", () => {
        expect(query.DELETE("users").get()).toBe("DELETE FROM users");
    });

    test("'DELETE FROM table WHERE', delete with condition statement", () => {
        expect(query.DELETE("users").WHERE("email").equ.get()).toBe("DELETE FROM users WHERE email = ?");
    });

});

describe("UPDATE statement", () => {
    test("UPDATE, Not Function's Param exception throw", () => {
        expect(() => query.UPDATE()).toThrow()
        expect(() => query.UPDATE(null, "unserName", "email")).toThrow()
        expect(() => query.UPDATE("tableName")).toThrow()
    });

    test("UPDATE, return WHERE statement", () => {
        expect(() => query.UPDATE("users", "email", "userName", "password")).toBeDefined()
    });

    test("UPDATE WHERE, Not Function's Param exception throw", () => {
        expect(() => query.UPDATE("users", "email", "userName", "password").WHERE()).toThrow()
    });

    test("'UPDATE table SET () WHERE condition', UPDATE Statement", () => {
        expect(query.UPDATE("users", "email", "userName", "password").WHERE("userid").equ.get())
            .toBe("UPDATE users SET (email = ?, userName = ?, password = ?) WHERE userid = ?")
    });
})
