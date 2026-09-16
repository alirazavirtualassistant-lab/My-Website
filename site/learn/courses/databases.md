---
id: databases
title: Database Systems
icon: 🏛️
track: Computer Science
color: #1A5276
runner: sql
tagline: Design, normalise, index and protect the data behind every application.
description: The university database-systems course, taught for interviews: data models, ER diagrams, relational algebra, normalisation (1NF–BCNF), keys, schema design, indexing and B-trees, transactions and ACID, concurrency control, recovery, NoSQL, and database design case studies.
---

# LEVEL: Beginner

## What Is a DBMS

A **database** is an organised collection of related data. A **Database Management System** (DBMS) is the software that stores that data, lets many users and programs read and change it safely at the same time, and keeps it correct and available even when programs crash or disks fail. SQLite, MySQL, PostgreSQL, Oracle, SQL Server and MongoDB are all DBMSs.

### Why not just use files?

Before databases, every application kept its own files. A title-production office might have one spreadsheet per state, a Word document of rates and an email trail of status changes. The problems are predictable:

| Problem with files | What a DBMS provides |
|---|---|
| Same fact stored in many files, drifting out of sync | one copy, shared by all programs (**data independence**) |
| Every program must parse the file format | a query language (SQL) and a catalogue describing the data |
| Two people editing at once corrupt the file | **concurrency control** |
| A crash mid-write leaves half a change | **transactions** and **recovery** |
| Anyone with the file can read everything | **security** and permissions |
| Finding one record means reading the whole file | **indexes** |

### The three-schema architecture

The ANSI/SPARC model separates what users see from how bytes are stored:

1. **External level** – views tailored to each user group (the closing team sees premium; the mailroom sees only addresses).
2. **Conceptual level** – the logical schema: tables, columns, keys, constraints.
3. **Internal level** – files, pages, indexes, storage layout.

**Data independence** is the payoff: you can add an index (internal change) or a column (conceptual change) without rewriting every application that uses a view.

### Inside a DBMS

```text
SQL text
  -> Parser (syntax, catalogue lookup)
  -> Optimiser (chooses a plan)
  -> Executor (runs the plan operators)
  -> Buffer manager (pages in memory)  <->  Storage manager (files on disk)
  with Transaction manager, Lock manager and Log manager around everything
```

Each box is a later chapter. For now the key idea is that the query you type is *declarative*: you say what you want and the optimiser decides how.

### Languages inside SQL

| Sub-language | Statements | Purpose |
|---|---|---|
| DDL (definition) | `CREATE`, `ALTER`, `DROP` | define schema |
| DML (manipulation) | `SELECT`, `INSERT`, `UPDATE`, `DELETE` | read and change data |
| DCL (control) | `GRANT`, `REVOKE` | permissions |
| TCL (transaction) | `BEGIN`, `COMMIT`, `ROLLBACK` | group changes |

### The system catalogue

The DBMS describes itself in tables. In SQLite it is `sqlite_master` (also called `sqlite_schema`); PostgreSQL has `information_schema` and `pg_catalog`; SQL Server has `sys.tables` and friends. Querying the catalogue is how tools generate documentation and how you find out what exists on an unfamiliar server.

```sql
SELECT type, name, sql FROM sqlite_master;
```

### Kinds of DBMS

- **Relational** (RDBMS): data in tables, queried with SQL. The default for business systems.
- **Document, key-value, column-family, graph** (NoSQL): different models for specific workloads, covered in the Expert level.
- **Embedded** (SQLite) versus **client-server** (PostgreSQL, SQL Server): SQLite is a library inside your program reading one file; a server accepts network connections from many clients.

> **Interview note:** "What is a DBMS and why use one instead of files?" is a warm-up question. Answer with the table above: redundancy, concurrency, recovery, security, querying. Then name the architecture layers to show you know what is inside.

### Try It Yourself

```sql
-- A tiny production database and a look at its catalogue
CREATE TABLE states (code TEXT PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  file_no  TEXT NOT NULL UNIQUE,
  state    TEXT NOT NULL REFERENCES states(code),
  premium  REAL NOT NULL DEFAULT 0
);
CREATE INDEX idx_orders_state ON orders(state);
CREATE VIEW v_state_totals AS
  SELECT s.name, COUNT(o.order_id) AS files, SUM(o.premium) AS premium
  FROM states s LEFT JOIN orders o ON o.state = s.code GROUP BY s.code;
INSERT INTO states VALUES ('TX','Texas'),('FL','Florida');
INSERT INTO orders (file_no,state,premium) VALUES ('TX-1001','TX',2150),('FL-2001','FL',2645.5);

-- the DBMS describes itself: every object we just created
SELECT type, name, tbl_name FROM sqlite_master ORDER BY type, name;
```

### Quiz

1. Which of these is NOT a benefit a DBMS provides over flat files?
- [ ] Concurrency control
- [ ] Crash recovery
- [x] Guaranteed faster storage of every record
- [ ] Declarative querying
> A DBMS adds overhead per write; its benefits are correctness, sharing and querying, not raw write speed.

2. What does data independence mean?
- [x] Applications are insulated from changes to storage or schema details
- [ ] Data is stored on independent disks
- [ ] Each application owns its own data
> The three-schema architecture lets the internal level change without touching external views.

3. Which sub-language contains `CREATE TABLE`?
- [x] DDL
- [ ] DML
- [ ] DCL
> Data Definition Language defines schema objects.

### Exercises

1. **Catalogue query** — Write a query that lists only the indexes in a SQLite database and the table each belongs to.
<details><summary>Solution</summary>

```sql
SELECT name, tbl_name FROM sqlite_master WHERE type = 'index';
```

</details>

2. **Classify statements** — Classify each as DDL, DML, DCL or TCL: `GRANT SELECT ON orders TO analyst`, `ROLLBACK`, `ALTER TABLE orders ADD county TEXT`, `DELETE FROM orders WHERE status='Cancelled'`.
<details><summary>Solution</summary>

DCL, TCL, DDL, DML.

</details>

### Interview Questions

**Q: What is the difference between a database and a DBMS?**
The database is the data itself, organised and stored; the DBMS is the software that manages it: parsing queries, planning execution, enforcing constraints, controlling concurrent access, logging changes for recovery and enforcing permissions. When someone says "the database is slow", the fix might be in the data (missing index, bad schema) or the DBMS configuration (memory, settings), and separating the two is the first diagnostic step. SQLite blurs the line because the DBMS is a library and the database is one file, but the distinction still holds.

**Q: Explain the three-schema architecture and why it matters.**
The external level is the set of views different users see, the conceptual level is the single logical schema of tables and constraints, and the internal level is physical storage: files, pages and indexes. Mappings between the levels give logical data independence (change the conceptual schema, keep views working) and physical data independence (change indexes or storage, keep queries working). It matters because it is what lets a DBA add an index at 2 a.m. without any application redeploy, and lets a reporting team be given a view without exposing the raw tables.

**Q: When would you choose SQLite over a client-server database?**
SQLite is ideal when there is one application process accessing local data: desktop tools, mobile apps, embedded devices, test fixtures and analysis notebooks. It needs no server, no configuration and the whole database is one portable file; it handles databases of many gigabytes and thousands of reads per second comfortably. I would move to PostgreSQL or SQL Server when many processes on different machines need concurrent writes, when fine-grained user permissions are required, or when the write load exceeds what a single-writer file lock can serve.

## Data Models & the Relational Model

A **data model** is the set of concepts you use to describe data: what the pieces are, how they relate and what rules they obey. The model decides how you think about a problem before a single table exists.

### Historical models

| Model | Structure | Where you meet it |
|---|---|---|
| Hierarchical | tree; each record has one parent | IBM IMS, XML documents, file systems |
| Network | graph; records with many parents via sets | CODASYL (1970s) |
| Relational | tables (relations) linked by values | every SQL database |
| Object-oriented | objects with identity and methods | ORMs, some niche engines |
| Document / key-value / graph | JSON documents, pairs, nodes and edges | MongoDB, Redis, Neo4j |

The relational model, proposed by E. F. Codd in 1970, won because it separates the logical view of data from physical pointers. In the hierarchical model, "which orders does agent 7 handle?" depends on how the tree was built; in the relational model you simply match values.

### Relations, tuples, attributes

The formal vocabulary maps onto everyday words:

| Formal | Everyday | Example |
|---|---|---|
| Relation | table | `orders` |
| Tuple | row | one order |
| Attribute | column | `premium` |
| Domain | set of allowed values (type) | positive decimals |
| Degree | number of columns | 8 |
| Cardinality | number of rows | 5,214 |
| Schema | the heading: name plus attributes and domains | `orders(order_id, file_no, ...)` |
| Instance | the rows at one moment | today's data |

A relation is mathematically a **set** of tuples, which has consequences:

- Rows have **no inherent order**. Order comes only from `ORDER BY`.
- There are **no duplicate rows** in a true relation. SQL tables relax this (hence `DISTINCT`), but a well-designed table has a primary key that makes duplicates impossible.
- Each cell holds one **atomic** value from its domain. A cell holding `'T-19, T-36, T-42'` violates the model; that list belongs in a separate table.

### The relational model's rules

Codd's model comes with **integrity rules**:

1. **Entity integrity** – every relation has a primary key, and no part of it may be NULL.
2. **Referential integrity** – a foreign key value must match an existing primary key value in the referenced relation, or be NULL.

And **NULL** is defined as "value missing or not applicable", a marker rather than a value, which is why SQL has three-valued logic. In DDL the two rules and the domains look like this:

```sql
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,                       -- entity integrity
  state    TEXT NOT NULL REFERENCES states(code),     -- referential integrity
  premium  REAL NOT NULL CHECK (premium >= 0)         -- domain constraint
);
```

### Schema versus instance

```sql
-- schema: describes structure, changes rarely
CREATE TABLE agents (agent_id INTEGER PRIMARY KEY, name TEXT NOT NULL, office TEXT);

-- instance: the data, changes constantly
INSERT INTO agents VALUES (1, 'Sana', 'Lahore'), (2, 'Bilal', 'Lahore');
```

Designing the schema well is the subject of the ER and normalisation chapters. A schema that stores the office name in every agent row is legal but repeats the fact "Lahore" hundreds of times; renaming the office means updating every row, and that redundancy is exactly what normalisation removes.

### Why relations and values beat pointers

In older models a record physically pointed at its children; deleting or moving a record meant fixing pointers. In the relational model the link between an order and its agent is the *value* `agent_id`, which can be indexed, joined in any direction and validated with a foreign key. The same value-based linking is what makes ad-hoc queries possible: nobody had to anticipate that you would want "orders per office" when the schema was designed.

> **Tip:** When you inherit a spreadsheet with comma-separated lists in a cell, merged headers, or colour used as data, you are looking at a non-relational structure. Converting it to atomic columns and separate tables is the first step of any migration.

### Try It Yourself

```sql
-- Non-atomic design (a list in a cell) versus a relational design
CREATE TABLE orders_bad (file_no TEXT PRIMARY KEY, endorsements TEXT);
INSERT INTO orders_bad VALUES ('TX-1001','T-19,T-36'),('TX-1002','T-19'),('FL-2001','');

CREATE TABLE orders (file_no TEXT PRIMARY KEY);
CREATE TABLE order_endorsements (file_no TEXT REFERENCES orders(file_no), code TEXT, PRIMARY KEY (file_no, code));
INSERT INTO orders VALUES ('TX-1001'),('TX-1002'),('FL-2001');
INSERT INTO order_endorsements VALUES ('TX-1001','T-19'),('TX-1001','T-36'),('TX-1002','T-19');

-- The question "how many files carry T-19?" is a LIKE hack on the bad table
SELECT 'bad' AS design, COUNT(*) AS files_with_T19 FROM orders_bad WHERE ',' || endorsements || ',' LIKE '%,T-19,%'
UNION ALL
-- and a plain, indexable query on the relational one
SELECT 'relational', COUNT(*) FROM order_endorsements WHERE code = 'T-19';
```

### Quiz

1. In relational terminology, what is a tuple?
- [ ] A column
- [x] A row
- [ ] A table
> Relation = table, tuple = row, attribute = column.

2. Which statement about a true relation is correct?
- [x] Its rows are unordered and unique
- [ ] Its rows are stored in insertion order
- [ ] It may contain duplicate rows
> A relation is a set of tuples; SQL tables relax uniqueness only if no key is defined.

3. What does entity integrity require?
- [x] The primary key of every row is present and non-NULL
- [ ] Every foreign key matches a primary key
- [ ] Every column has a default
> Referential integrity is the foreign-key rule; entity integrity is the primary-key rule.

### Exercises

1. **Identify the model** — A file system where each folder has exactly one parent is an example of which data model? A LinkedIn-style "people you may know" dataset fits which?
<details><summary>Solution</summary>

Hierarchical (tree) for the file system; graph for the social connections, though it can be modelled relationally as a `connections(person_a, person_b)` table.

</details>

2. **Atomic redesign** — A `policies` table has a column `insured_names` containing "John Smith; Jane Smith". Redesign it.
<details><summary>Solution</summary>

```sql
CREATE TABLE policies (policy_id INTEGER PRIMARY KEY, policy_no TEXT UNIQUE);
CREATE TABLE policy_insureds (
  policy_id INTEGER REFERENCES policies(policy_id),
  seq INTEGER, full_name TEXT NOT NULL,
  PRIMARY KEY (policy_id, seq)
);
```

</details>

### Interview Questions

**Q: What are the main components of the relational model?**
Structure: relations made of tuples over named attributes drawn from domains. Integrity: entity integrity (primary keys exist and are non-NULL), referential integrity (foreign keys match), and domain constraints. Manipulation: relational algebra and calculus, which SQL implements. In practice I describe a relation as a table with a heading and a set of unique, unordered rows of atomic values, and I point out that each of those adjectives has a consequence in SQL: `ORDER BY` for order, keys for uniqueness, and separate tables instead of lists for atomicity.

**Q: Why did the relational model replace hierarchical and network databases?**
Because it decoupled the logical structure from physical access paths. In IMS or CODASYL, programs navigated pointers, so every new question needed new navigation code and any storage change broke programs. Codd's model let users ask questions by matching values, which a query optimiser could translate into whatever access path existed, giving data independence and ad-hoc querying. Hierarchical ideas survive in XML, JSON documents and file systems, and document databases deliberately re-introduce nesting for cases where a record is always read whole.

**Q: What is the difference between a schema and an instance?**
The schema is the structure: table names, columns, types, keys and constraints, declared with DDL and changed rarely through migrations. The instance is the actual content at one moment, changed constantly through DML. Constraints are stated on the schema and enforced on every instance, which is how a rule like "premium is positive" holds for rows that do not exist yet. In interviews I add that schema changes need versioning and testing precisely because every existing instance must remain valid after the change.

## Keys: Primary, Foreign, Candidate & Composite

A **key** is a set of one or more columns whose values identify a row. Keys are how the relational model expresses identity and relationships without pointers, and getting them right is most of schema design.

### Superkey, candidate key, primary key

- A **superkey** is any set of columns that uniquely identifies rows. `{order_id}` is one; so is `{order_id, state}`, but the extra column is useless.
- A **candidate key** is a *minimal* superkey: remove any column and it stops being unique. `orders` may have two candidate keys: `{order_id}` and `{file_no}`.
- The **primary key** is the candidate key you choose as the official identifier. Other candidate keys become **alternate keys** and are declared `UNIQUE`.

```sql
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,          -- chosen primary key
  file_no  TEXT NOT NULL UNIQUE,         -- alternate (candidate) key
  state    TEXT NOT NULL,
  premium  REAL NOT NULL
);
```

Properties of a good primary key: unique, never NULL, stable (never changes), and preferably compact.

### Natural versus surrogate keys

| Key type | Example | Pros | Cons |
|---|---|---|---|
| Natural | `file_no`, ISO state code, email | meaningful, no extra column | may change, may be long, uniqueness depends on business |
| Surrogate | auto-increment `order_id`, UUID | stable, compact, engine-generated | meaningless, needs a join to display |

The common practice is a surrogate primary key plus a `UNIQUE` constraint on the natural key, so foreign keys stay stable while the business rule is still enforced.

### Composite keys

A key made of several columns. Junction tables that resolve many-to-many relationships usually have one:

```sql
CREATE TABLE order_endorsements (
  order_id INTEGER NOT NULL REFERENCES orders(order_id),
  code     TEXT    NOT NULL REFERENCES endorsement_types(code),
  fee      REAL    NOT NULL DEFAULT 0,
  PRIMARY KEY (order_id, code)
);
```

The pair identifies a row; either column alone does not.

### Foreign keys

A **foreign key** is a column (or columns) in one table whose values must appear as a primary or unique key in another table. It is the relational way to say "this order belongs to that agent".

```sql
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  agent_id INTEGER REFERENCES agents(agent_id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);
```

The referencing table is the **child**; the referenced table is the **parent**. Referential actions decide what happens to children when a parent key changes or disappears:

| Action | Effect on child rows |
|---|---|
| `NO ACTION` / `RESTRICT` | refuse the parent change (default) |
| `CASCADE` | change or delete children too |
| `SET NULL` | set the child's foreign key to NULL |
| `SET DEFAULT` | set it to the column default |

Use `CASCADE` for true composition (an order's endorsements die with the order), `RESTRICT` when the child has independent meaning (do not delete an agent who has files), and `SET NULL` for optional links.

A foreign key can be NULL when the relationship is optional (an order not yet assigned). It can also reference its own table (`agents.lead_id REFERENCES agents(agent_id)`), which models hierarchies.

### Keys in SQLite specifically

`INTEGER PRIMARY KEY` in SQLite becomes an alias for the internal `rowid`, which makes it the fastest possible lookup. Foreign keys are only enforced after `PRAGMA foreign_keys = ON;`. Composite primary keys are supported but do not alias the rowid.

> **Warning:** Choosing a natural key that later turns out not to be unique (customer email shared by a couple, a file number reused after a merger) is one of the most expensive mistakes in schema design, because every foreign key that references it must be rebuilt. When in doubt, use a surrogate.

### Try It Yourself

```sql
PRAGMA foreign_keys = ON;
CREATE TABLE agents (agent_id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, lead_id INTEGER REFERENCES agents(agent_id));
CREATE TABLE endorsement_types (code TEXT PRIMARY KEY, description TEXT NOT NULL);
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  file_no  TEXT NOT NULL UNIQUE,                       -- alternate key
  agent_id INTEGER REFERENCES agents(agent_id) ON DELETE SET NULL
);
CREATE TABLE order_endorsements (
  order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  code     TEXT NOT NULL REFERENCES endorsement_types(code),
  PRIMARY KEY (order_id, code)                         -- composite key
);
INSERT INTO agents VALUES (1,'Ali',NULL),(2,'Sana',1);
INSERT INTO endorsement_types VALUES ('T-19','Restrictions/Encroachments'),('T-36','Environmental');
INSERT INTO orders (file_no,agent_id) VALUES ('TX-1001',2),('TX-1002',2);
INSERT INTO order_endorsements VALUES (1,'T-19'),(1,'T-36'),(2,'T-19');

DELETE FROM agents WHERE agent_id = 2;   -- SET NULL: orders keep existing, agent_id cleared
DELETE FROM orders WHERE order_id = 1;   -- CASCADE: its two endorsements vanish

SELECT (SELECT COUNT(*) FROM orders) AS orders_left,
       (SELECT COUNT(*) FROM orders WHERE agent_id IS NULL) AS unassigned,
       (SELECT COUNT(*) FROM order_endorsements) AS endorsements_left;
-- Try: INSERT INTO order_endorsements VALUES (2,'T-99');  -> FOREIGN KEY constraint failed
```

### Quiz

1. What distinguishes a candidate key from a superkey?
- [x] A candidate key is minimal; no column can be removed
- [ ] A candidate key can contain NULLs
- [ ] A candidate key must be numeric
> Every candidate key is a superkey, but only minimal superkeys are candidates.

2. What does `ON DELETE CASCADE` do?
- [ ] Prevents deleting the parent
- [x] Deletes child rows when the parent row is deleted
- [ ] Sets the child's foreign key to NULL
> Cascade propagates the delete; use it only for owned/composed children.

3. When is a composite primary key most typical?
- [ ] On every table
- [x] On a junction table resolving a many-to-many relationship
- [ ] Only in SQLite
> `(order_id, code)` identifies one order–endorsement pairing.

### Exercises

1. **Find the keys** — For `qa_reviews(review_id, order_id, reviewer_id, reviewed_at, errors)` where each order is reviewed at most once per reviewer, list the candidate keys and choose a primary key.
<details><summary>Solution</summary>

Candidate keys: `{review_id}` and `{order_id, reviewer_id}`. Choose `review_id` as the surrogate primary key and declare `UNIQUE (order_id, reviewer_id)` as the alternate key.

</details>

2. **Self-referencing key** — Write DDL for a `counties` table where each county belongs to a state and each state row is in the same table as a parent region (single table of regions).
<details><summary>Solution</summary>

```sql
CREATE TABLE regions (
  region_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('state','county')),
  parent_id INTEGER REFERENCES regions(region_id),
  UNIQUE (name, parent_id)
);
```

</details>

### Interview Questions

**Q: Explain the difference between primary key, candidate key and foreign key.**
A candidate key is any minimal set of columns that uniquely identifies rows; a table can have several, such as `order_id` and `file_no`. The primary key is the one candidate key chosen as the identifier, which must be non-NULL and is what foreign keys normally reference; the others are enforced as unique constraints. A foreign key is a column in a child table whose values must exist as a key in the parent, expressing a relationship and enforcing referential integrity. I usually give the concrete example of `orders.agent_id` referencing `agents.agent_id` with `ON DELETE SET NULL` so an agent leaving does not delete production history.

**Q: Surrogate or natural primary key: which do you prefer and why?**
My default is a surrogate integer key with a unique constraint on the natural key. The surrogate never changes, is small for indexes and foreign keys, and survives business changes such as a file-number format change after an acquisition. The natural key still needs to be enforced for correctness. Exceptions where I use the natural key directly are small, stable reference tables such as ISO state codes, where the code is the thing everyone joins and displays, and a surrogate would only add a join.

**Q: What are the referential actions and how do you choose between them?**
`RESTRICT`/`NO ACTION` refuses a delete or key update if children exist; `CASCADE` propagates it; `SET NULL` and `SET DEFAULT` detach the children. I choose `CASCADE` for composition, where the child has no meaning without the parent, for example line items of an invoice or endorsements of an order. I choose `RESTRICT` when the child must be handled deliberately, such as orders belonging to an agent, so nobody deletes a year of production by removing a user. `SET NULL` fits optional associations like an order's current reviewer. I also mention that cascades can fan out unexpectedly, so they need to be documented in the schema.

## ER Diagrams: Entities, Attributes & Relationships

Before writing `CREATE TABLE`, you model the business. The **Entity-Relationship (ER) model**, introduced by Peter Chen in 1976, describes a domain as **entities** (things), their **attributes** (facts about them) and **relationships** (how they connect). An **ER diagram** is the picture; interviewers often ask you to draw one on a whiteboard for a familiar domain.

### Entities and attributes

An **entity type** is a category of thing with an independent existence: `Agent`, `Order`, `Policy`, `County`. Each entity type has attributes; one or more form its **key**.

| Attribute kind | Example | In tables becomes |
|---|---|---|
| Simple | `premium` | one column |
| Composite | `address` = street + city + zip | several columns |
| Multi-valued | `phone_numbers` | a separate table |
| Derived | `age` from `date_of_birth` | usually not stored; computed |
| Key | `order_id` | primary key |

### Relationships and cardinality

A **relationship type** connects entity types. The **cardinality ratio** says how many of each may participate:

| Ratio | Meaning | Example |
|---|---|---|
| 1:1 | one A relates to at most one B and vice versa | Order – Closing statement |
| 1:N | one A relates to many B; each B to one A | Agent – Orders |
| M:N | many to many | Order – Endorsement types |

**Participation** says whether every instance must take part: *total* (every Order must have an Agent) or *partial* (some Agents have no Orders). In crow's-foot notation the line ends encode both: a circle for optional, a bar for mandatory, a "crow's foot" for many.

```text
AGENT ||--o{ ORDER : handles          (one agent, zero or more orders)
ORDER ||--|| CLOSING_STATEMENT : has  (exactly one each way)
ORDER }o--o{ ENDORSEMENT_TYPE : carries (many to many)
```

That is Mermaid's ER syntax; drawing tools such as draw.io, Lucidchart and dbdiagram.io use the same shapes.

### Relationship attributes

A relationship can carry its own attributes. In *Order carries EndorsementType*, the `fee` charged belongs to the pairing, not to the order or the type alone. Such attributes end up in the junction table.

### Weak entities

A **weak entity** cannot be identified by its own attributes; it depends on an owner. A `PolicyPage` numbered 1, 2, 3 is only meaningful together with its `Policy`. Its key is the owner's key plus a *partial key* (`policy_id, page_no`), and its participation in the identifying relationship is always total. In diagrams it is drawn with a double border, and in SQL it becomes a table whose primary key includes the owner's key:

```sql
CREATE TABLE policy_page (
  policy_id INTEGER NOT NULL REFERENCES policy(policy_id) ON DELETE CASCADE,
  page_no   INTEGER NOT NULL,          -- partial key
  content   TEXT,
  PRIMARY KEY (policy_id, page_no)
);
```

### Recursive and n-ary relationships

An entity can relate to itself: `Agent reports to Agent`. Three-way relationships exist (Agent files Order under Underwriter) but are usually broken into binary ones or made into an entity of their own once they carry attributes.

### Enhanced ER: specialisation

`Person` may be specialised into `Agent` and `Reviewer`, sharing common attributes. This is inheritance; the "From ER to Tables" chapter shows the three ways to store it.

### Reading a diagram in an interview

Practise saying a diagram aloud: *"An agent handles zero or more orders; each order is handled by exactly one agent. An order carries zero or more endorsements; each endorsement type may appear on many orders; the fee is an attribute of the relationship."* If you can narrate it, you can turn it into tables.

> **Tip:** Start every design by listing the nouns in the requirements (candidates for entities), then the verbs between them (relationships), then ask "how many?" in both directions for every verb. Only after that decide keys and attributes.

### Try It Yourself

```sql
-- The diagram AGENT ||--o{ ORDER }o--o{ ENDORSEMENT_TYPE as tables, then a query that
-- reads the relationships back: every agent, their orders, and endorsement fees.
CREATE TABLE agent (agent_id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE endorsement_type (code TEXT PRIMARY KEY, description TEXT NOT NULL);
CREATE TABLE "order" (order_id INTEGER PRIMARY KEY, file_no TEXT UNIQUE NOT NULL,
                      agent_id INTEGER NOT NULL REFERENCES agent(agent_id));   -- 1:N, total on order side
CREATE TABLE carries (order_id INTEGER REFERENCES "order"(order_id),
                      code TEXT REFERENCES endorsement_type(code),
                      fee REAL NOT NULL,                                        -- relationship attribute
                      PRIMARY KEY (order_id, code));                            -- M:N junction
INSERT INTO agent VALUES (1,'Sana'),(2,'Bilal');
INSERT INTO endorsement_type VALUES ('T-19','Restrictions'),('T-36','Environmental');
INSERT INTO "order" (file_no,agent_id) VALUES ('TX-1001',1),('TX-1002',1);
INSERT INTO carries VALUES (1,'T-19',75),(1,'T-36',50),(2,'T-19',75);

SELECT a.name, o.file_no, GROUP_CONCAT(c.code) AS endorsements, COALESCE(SUM(c.fee),0) AS fees
FROM agent a
LEFT JOIN "order" o ON o.agent_id = a.agent_id
LEFT JOIN carries c ON c.order_id = o.order_id
GROUP BY a.agent_id, o.order_id
ORDER BY a.name, o.file_no;
```

### Quiz

1. An order has exactly one closing statement and a closing statement belongs to exactly one order. What is the cardinality?
- [x] 1:1
- [ ] 1:N
- [ ] M:N
> Both directions are "at most one".

2. Which attribute type becomes its own table?
- [ ] Composite
- [x] Multi-valued
- [ ] Derived
> A multi-valued attribute (several phone numbers) needs one row per value.

3. What identifies a weak entity?
- [ ] Its own surrogate key
- [x] The owner entity's key plus a partial key
- [ ] Nothing; weak entities have no key
> A policy page is identified by (policy_id, page_no).

### Exercises

1. **Model it** — In words, list the entities, relationships and cardinalities for: "A client orders documents; each document goes through several revisions; each revision is produced by one designer."
<details><summary>Solution</summary>

Entities: Client, Document, Revision (weak, owned by Document), Designer. Relationships: Client orders Document (1:N, total on Document); Document has Revision (1:N identifying, total on Revision); Designer produces Revision (1:N, total on Revision). Revision key: (document_id, revision_no).

</details>

2. **Relationship attribute** — Where does "hours spent" belong in "Designer works on Document"? What if the same designer can work on the same document in several sessions?
<details><summary>Solution</summary>

"Hours spent" is an attribute of the M:N relationship, stored in a `works_on(designer_id, document_id, hours)` junction table. If several sessions must be recorded, the relationship becomes an entity `WorkSession(session_id, designer_id, document_id, started_at, hours)` because the pair is no longer unique.

</details>

### Interview Questions

**Q: Walk me through designing an ER diagram for a title-order tracking system.**
I start with the nouns: Agent, Order, County, State, Product type, Endorsement type, Policy, QA review. Then the verbs with cardinalities: an agent handles many orders, each order has one agent (1:N); an order is in one county, a county in one state (1:N twice); an order carries many endorsement types and each type appears on many orders (M:N with a fee attribute); an order produces zero or one owner policy and zero or one lender policy (1:1 optional, or 1:N if policies are a generic entity with a type); a reviewer reviews an order many times (1:N with review date and error count). I mark participation: an order must have an agent (total), an agent need not have orders (partial). Then I choose keys: surrogate ids everywhere, with `file_no` and `policy_no` as unique natural keys.

**Q: What is a weak entity and can you give an example?**
A weak entity has no key of its own and is identified through its owner entity plus a partial key. Pages of a policy document, line items of an invoice, or revisions of a client deliverable are typical: revision 3 means nothing without knowing which document. In tables, the weak entity's primary key is composite (owner key plus partial key) and the owner key is a foreign key with `ON DELETE CASCADE`, because the weak entity cannot outlive its owner. If the item is ever referenced independently (line items that ship separately), it is better promoted to a strong entity with its own surrogate key.

**Q: How do you decide whether something is an attribute or an entity?**
If it has attributes of its own, is referenced by more than one other thing, or can exist independently, it is an entity. "County" starts as a text attribute of Order, but as soon as you need a county's recording fees, its state, or a list of all counties, it becomes an entity with a key. The same test applies to relationships: "carries" between Order and Endorsement becomes an entity if you need a history of when each endorsement was added and by whom. I mention that promoting an attribute to an entity late is a migration, so I err on the side of entities for anything the business talks about as a thing.

## From ER Diagram to Tables

Once the ER diagram is agreed, converting it into relational tables follows mechanical rules. Knowing them means you can go from whiteboard to `CREATE TABLE` in minutes and, equally, read a schema and recover the diagram.

### The seven mapping steps

1. **Strong entity** → a table with all simple attributes; composite attributes are flattened into their parts; choose the primary key.
2. **Weak entity** → a table with its attributes plus the owner's primary key as a foreign key; primary key = owner key + partial key; `ON DELETE CASCADE`.
3. **1:1 relationship** → put the primary key of one side as a foreign key in the other (choose the side with total participation so the column is `NOT NULL`), and make it `UNIQUE`.
4. **1:N relationship** → put the primary key of the "one" side as a foreign key in the "many" side, with any relationship attributes.
5. **M:N relationship** → a new junction table with both primary keys as foreign keys, composite primary key of the pair, plus relationship attributes.
6. **Multi-valued attribute** → a new table with the owner's key and one column for the value; primary key of both.
7. **N-ary relationship** → a table with foreign keys to every participant.

### Worked example

Diagram: *Agent (1) handles (N) Order; Order (1) has (1) ClosingStatement (total on statement side); Order (M) carries (N) EndorsementType with fee; Agent has multi-valued phone; PolicyPage is weak on Policy.*

```text
AGENT ||--o{ ORDER : handles
ORDER ||--o| CLOSING_STATEMENT : has
ORDER }o--o{ ENDORSEMENT_TYPE : carries (fee)
AGENT ||--o{ AGENT_PHONE : multi-valued
POLICY ||--|{ POLICY_PAGE : weak, identified by (policy_id, page_no)
```

```sql
CREATE TABLE agent (agent_id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE agent_phone (agent_id INTEGER REFERENCES agent(agent_id) ON DELETE CASCADE,
                          phone TEXT, PRIMARY KEY (agent_id, phone));          -- step 6
CREATE TABLE "order" (order_id INTEGER PRIMARY KEY, file_no TEXT NOT NULL UNIQUE,
                      agent_id INTEGER NOT NULL REFERENCES agent(agent_id));    -- step 4
CREATE TABLE closing_statement (statement_id INTEGER PRIMARY KEY,
                      order_id INTEGER NOT NULL UNIQUE REFERENCES "order"(order_id),  -- step 3
                      total REAL NOT NULL);
CREATE TABLE endorsement_type (code TEXT PRIMARY KEY, description TEXT);
CREATE TABLE carries (order_id INTEGER REFERENCES "order"(order_id),
                      code TEXT REFERENCES endorsement_type(code),
                      fee REAL NOT NULL, PRIMARY KEY (order_id, code));         -- step 5
CREATE TABLE policy (policy_id INTEGER PRIMARY KEY, policy_no TEXT UNIQUE);
CREATE TABLE policy_page (policy_id INTEGER REFERENCES policy(policy_id) ON DELETE CASCADE,
                          page_no INTEGER, content TEXT, PRIMARY KEY (policy_id, page_no)); -- step 2
```

### Mapping specialisation (inheritance)

`Person` specialised into `Agent` and `Reviewer` has three standard options:

| Option | Tables | Best when |
|---|---|---|
| One table per class (joined) | `person` + `agent(person_id, ...)` + `reviewer(person_id, ...)` | subclasses have many distinct attributes |
| One table per concrete class | `agent(all attrs)`, `reviewer(all attrs)` | never need to query all persons together |
| Single table with a type column | `person(kind, agent_attrs NULLable, reviewer_attrs NULLable)` | few subclass attributes; simplest queries |

ORMs call these *joined*, *table-per-concrete-class* and *single-table inheritance*. The single-table option is the most common in practice, with a `CHECK` that the right columns are filled for each `kind`.

### Choosing where the foreign key goes

For 1:N the answer is forced: the many side holds the key. For 1:1 you choose; put it on the side that is *total* (must always exist) so the column can be `NOT NULL`, and add `UNIQUE` so the relationship stays one-to-one. If both sides are optional, consider merging the entities.

### Naming and conventions

- Singular or plural table names, but be consistent (`order`/`orders`). Note that `order` is a reserved word; many teams use `orders` or `title_order` to avoid quoting.
- Foreign key columns named `<parent>_id`.
- Junction tables named after both parents (`order_endorsement`) or after the verb (`carries`).
- Every table gets a primary key; every foreign key gets an index.

> **Interview note:** The classic follow-up is "how would you model a many-to-many relationship?" Answer with the junction table, the composite primary key, the two foreign keys, and where the relationship attributes go. Then mention that if the pair can repeat over time you promote the junction to an entity with its own id.

### Try It Yourself

```sql
-- Single-table inheritance for Person -> Agent / Reviewer, with a CHECK per kind
PRAGMA foreign_keys = ON;
CREATE TABLE person (
  person_id INTEGER PRIMARY KEY,
  kind      TEXT NOT NULL CHECK (kind IN ('agent','reviewer')),
  name      TEXT NOT NULL,
  team      TEXT,            -- agents only
  cert_no   TEXT,            -- reviewers only
  CHECK ( (kind = 'agent'    AND team IS NOT NULL AND cert_no IS NULL)
       OR (kind = 'reviewer' AND cert_no IS NOT NULL AND team IS NULL) )
);
CREATE TABLE "order" (order_id INTEGER PRIMARY KEY, file_no TEXT UNIQUE,
                      agent_id INTEGER NOT NULL REFERENCES person(person_id));
CREATE TABLE qa_review (order_id INTEGER REFERENCES "order"(order_id),
                        reviewer_id INTEGER REFERENCES person(person_id),
                        errors INTEGER NOT NULL DEFAULT 0,
                        PRIMARY KEY (order_id, reviewer_id));
INSERT INTO person (kind,name,team,cert_no) VALUES ('agent','Sana','Team A',NULL),('reviewer','Hira',NULL,'QC-17');
INSERT INTO "order" (file_no,agent_id) VALUES ('TX-1001',1);
INSERT INTO qa_review VALUES (1,2,0);
-- Try: INSERT INTO person (kind,name,team) VALUES ('reviewer','Bad',NULL);  -> CHECK constraint failed

SELECT o.file_no, a.name AS agent, r.name AS reviewer, q.errors
FROM "order" o JOIN person a ON a.person_id = o.agent_id
LEFT JOIN qa_review q ON q.order_id = o.order_id
LEFT JOIN person r ON r.person_id = q.reviewer_id;
```

### Quiz

1. Where does the foreign key go in a 1:N relationship?
- [ ] In the "one" side
- [x] In the "many" side
- [ ] In a new junction table
> Each "many" row points at its single parent.

2. How is an M:N relationship represented?
- [x] A junction table with both keys and a composite primary key
- [ ] A foreign key on either side
- [ ] An array column
> Neither side can hold a single foreign key when both directions are "many".

3. A weak entity's table has which primary key?
- [ ] Its own auto-increment id only
- [x] The owner's key combined with its partial key
- [ ] No primary key
> For example `(policy_id, page_no)`.

### Exercises

1. **Map a 1:1** — Order and ClosingStatement are 1:1, and every closing statement must have an order, but an open order has no statement yet. Which table gets the foreign key, and with what constraints?
<details><summary>Solution</summary>

`closing_statement.order_id INTEGER NOT NULL UNIQUE REFERENCES "order"(order_id)`. The statement side is total, so the column is `NOT NULL`; `UNIQUE` keeps it one-to-one; orders remain free to have no statement.

</details>

2. **Joined inheritance** — Write the joined-table version of Person / Agent / Reviewer.
<details><summary>Solution</summary>

```sql
CREATE TABLE person (person_id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE agent (person_id INTEGER PRIMARY KEY REFERENCES person(person_id) ON DELETE CASCADE, team TEXT NOT NULL);
CREATE TABLE reviewer (person_id INTEGER PRIMARY KEY REFERENCES person(person_id) ON DELETE CASCADE, cert_no TEXT NOT NULL);
```

</details>

### Interview Questions

**Q: How do you convert a many-to-many relationship with attributes into tables?**
Create a junction table holding the primary keys of both entities as foreign keys, make the pair the composite primary key, and put the relationship's attributes in that table. For orders carrying endorsements with a fee, that is `carries(order_id, code, fee)` with `PRIMARY KEY (order_id, code)`. I add an index on the second column (`code`) because the composite key only serves lookups starting with `order_id`. If the same pair can occur more than once over time, the junction becomes an entity with its own surrogate key and a timestamp.

**Q: What are the options for mapping inheritance, and how do you choose?**
Joined tables (parent plus one child table per subclass) keep data normalised and support subclass-specific constraints but need joins for every read. Table per concrete class duplicates parent columns and makes "all persons" queries a `UNION`. Single table with a discriminator column is fastest and simplest but forces nullable subclass columns and needs `CHECK` constraints to keep each kind consistent. I choose single-table when subclasses differ by a handful of columns, and joined tables when subclasses have many attributes or their own relationships, such as reviewers having certifications and agents having territories.

**Q: Given an existing schema, how would you recover the ER diagram?**
Each table with a single-column primary key is a strong entity; a table whose primary key is entirely foreign keys is either a junction (M:N) or a weak entity, distinguished by whether it has a partial key column. Foreign keys with `UNIQUE` are 1:1 relationships; plain foreign keys are 1:N pointing to the parent. Tables with just an owner key and one value column are multi-valued attributes. I would also read `CHECK` constraints and discriminator columns to spot inheritance, then confirm cardinalities against real data, because a missing `UNIQUE` constraint often hides a relationship the business believes is one-to-one.

# LEVEL: Intermediate

## Functional Dependencies

Normalisation is built on one idea: **functional dependency** (FD). Understanding FDs lets you *prove* that a table design has redundancy instead of guessing, and it is the vocabulary every normalisation question in an exam or interview uses.

### Definition

In a relation R, attribute set X **functionally determines** attribute set Y, written **X → Y**, if whenever two rows agree on X they must also agree on Y. Equivalently: knowing X tells you Y.

In an orders table:

- `order_id → file_no, state, county, premium` (the key determines everything)
- `county → state` (a county belongs to one state)
- `file_no → order_id` (file numbers are unique)
- `state, product, liability_band → rate_per_k` (the rate matrix)

An FD is a statement about the *business rules*, not about the current rows. `premium → state` might happen to hold in a five-row sample and still be false.

### Trivial, full and partial, transitive

| Kind | Meaning | Example |
|---|---|---|
| Trivial | Y is a subset of X | `state, county → state` |
| Full | Y depends on all of X, not on a proper subset | `order_id, code → fee` in `carries` |
| Partial | Y depends on part of a composite key | `order_id, code → file_no` (file_no depends on `order_id` alone) |
| Transitive | X → Y and Y → Z, with Y not a key | `order_id → county`, `county → state`, so `order_id → state` transitively |

Partial and transitive dependencies are exactly what 2NF and 3NF remove.

### Armstrong's axioms

From a given set of FDs you can derive others using three sound and complete rules:

1. **Reflexivity**: if Y ⊆ X then X → Y.
2. **Augmentation**: if X → Y then XZ → YZ.
3. **Transitivity**: if X → Y and Y → Z then X → Z.

Derived rules: **union** (X → Y and X → Z give X → YZ), **decomposition** (X → YZ gives X → Y and X → Z), and **pseudo-transitivity**.

### Attribute closure and finding keys

The **closure** of X, written X⁺, is the set of all attributes X determines. Compute it by starting with X and repeatedly adding the right side of any FD whose left side is already inside. X is a superkey if X⁺ contains every attribute; it is a candidate key if no proper subset does.

```text
R(order_id, file_no, county, state, agent_id, agent_name)
FDs: order_id -> file_no, county, agent_id
     file_no  -> order_id
     county   -> state
     agent_id -> agent_name

{order_id}+ = {order_id, file_no, county, agent_id, state, agent_name}  = all  -> candidate key
{file_no}+  = same via file_no -> order_id                                        -> candidate key
{county}+   = {county, state}                                                     -> not a key
```

Closure is the tool used in every normalisation proof: to check whether a table is in BCNF you test, for each FD X → Y, whether X⁺ contains all attributes.

### Detecting FDs in real data

You can *test* whether an FD holds in an instance with SQL: if any X value maps to more than one Y value, the FD is violated.

```sql
SELECT county, COUNT(DISTINCT state) AS states
FROM orders
GROUP BY county
HAVING COUNT(DISTINCT state) > 1;     -- rows here break county -> state
```

An empty result does not prove the rule; it only fails to disprove it. Confirm with the business ("Washington County" exists in many states, so `county → state` is actually false and the real FD is `state, county → county_fips`).

### Minimal (canonical) cover

A set of FDs can be simplified to a **minimal cover**: single attributes on every right side, no redundant FDs, no extra attributes on left sides. Decomposition algorithms for 3NF start from a minimal cover, so exam questions often ask for it.

> **Interview note:** "What is a functional dependency?" is answered best with the two-row test ("if two rows agree on X they agree on Y") plus a business example and the observation that FDs come from rules, not from data.

### Try It Yourself

```sql
-- Test candidate FDs against an instance. Rows returned = violations.
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, file_no TEXT, county TEXT, state TEXT,
                     agent_id INTEGER, agent_name TEXT);
INSERT INTO orders VALUES
 (1,'TX-1001','Harris','TX',2,'Sana'),
 (2,'TX-1002','Dallas','TX',2,'Sana'),
 (3,'FL-2001','Orange','FL',3,'Bilal'),
 (4,'FL-2002','Washington','FL',3,'Bilal'),
 (5,'AR-4001','Washington','AR',4,'Hira'),
 (6,'TX-1003','Harris','TX',2,'Sana Q.');   -- a typo breaks agent_id -> agent_name

SELECT 'county -> state' AS fd, county AS x, GROUP_CONCAT(DISTINCT state) AS y_values
FROM orders GROUP BY county HAVING COUNT(DISTINCT state) > 1
UNION ALL
SELECT 'agent_id -> agent_name', agent_id, GROUP_CONCAT(DISTINCT agent_name)
FROM orders GROUP BY agent_id HAVING COUNT(DISTINCT agent_name) > 1
UNION ALL
SELECT 'file_no -> order_id', file_no, GROUP_CONCAT(DISTINCT order_id)
FROM orders GROUP BY file_no HAVING COUNT(DISTINCT order_id) > 1;
```

### Quiz

1. X → Y means…
- [x] Rows that agree on X always agree on Y
- [ ] X and Y are both keys
- [ ] Y is a foreign key to X
> That is the two-row definition of a functional dependency.

2. Which is a transitive dependency in `orders(order_id, county, state)` with `county → state`?
- [ ] `order_id → county`
- [x] `order_id → state` via county
- [ ] `state → county`
> `state` depends on the key only through the non-key attribute `county`.

3. How do you show that X is a superkey?
- [x] Compute X⁺ and check it contains every attribute
- [ ] Check X has no NULLs
- [ ] Count distinct values of X
> Attribute closure under the FDs is the formal test.

### Exercises

1. **Compute a closure** — Given `R(A,B,C,D)` with `A → B`, `B → C`, `C → D`, compute {A}⁺ and {B}⁺. Which is a candidate key?
<details><summary>Solution</summary>

{A}⁺ = {A,B,C,D} (all attributes), so A is a candidate key. {B}⁺ = {B,C,D}, missing A, so B is not a key.

</details>

2. **Write the FDs** — For a rate matrix `rate(state, product, band_from, band_to, rate_per_k, effective)`, write the FDs that hold if each state/product/band/effective-date combination has one rate.
<details><summary>Solution</summary>

`state, product, band_from, effective → band_to, rate_per_k`. Possibly also `state, product, band_to, effective → band_from` if bands do not overlap, making both composite sets candidate keys.

</details>

3. **Find a violation** — Write SQL to check whether `file_no → premium` holds in an `orders` table.
<details><summary>Solution</summary>

```sql
SELECT file_no FROM orders GROUP BY file_no HAVING COUNT(DISTINCT premium) > 1;
```

</details>

### Interview Questions

**Q: What is a functional dependency and why does it matter for design?**
X → Y holds when any two rows with the same X values have the same Y values; it encodes a business rule such as "an agent id determines the agent's name". FDs matter because a dependency whose left side is not a key means the right-side value is repeated for every row sharing that left side, which is redundancy and leads to update, insert and delete anomalies. Normal forms are defined in terms of which kinds of FDs are allowed, so identifying the FDs is the first step of any normalisation, and I always source them from the business rules, not from whatever the current data happens to show.

**Q: How do you find the candidate keys of a relation given its FDs?**
Compute attribute closures. Attributes that never appear on any right-hand side must be in every key; start from that set, compute its closure, and add attributes until the closure covers the relation, then check minimality by removing each attribute in turn. For `R(order_id, file_no, county, state)` with `order_id → file_no, county`, `file_no → order_id`, and `county → state`, both `{order_id}` and `{file_no}` close to everything, so both are candidate keys and `county` is not. In practice I confirm the derived keys against real data with a `GROUP BY ... HAVING COUNT(*) > 1` uniqueness check.

**Q: Explain Armstrong's axioms and what "sound and complete" means.**
Reflexivity (a set determines its subsets), augmentation (adding the same attributes to both sides preserves a dependency) and transitivity (X → Y and Y → Z give X → Z). Sound means every FD derived by the axioms genuinely holds; complete means every FD that logically follows from the given set can be derived with them. Together they let you compute the closure of an FD set mechanically, which is what makes normal-form checks and decomposition algorithms possible rather than a matter of intuition.

## Normalisation: 1NF, 2NF & 3NF

**Normalisation** is the process of organising tables to remove redundancy and the **anomalies** it causes. Each **normal form** forbids one kind of problematic dependency. Most business schemas aim for third normal form (3NF) and stop there.

### The anomalies

Start with one wide table a spreadsheet user might build:

| order_id | file_no | agent_id | agent_name | agent_phone | county | state | codes |
|---|---|---|---|---|---|---|---|
| 1 | TX-1001 | 2 | Sana | 0300-1 | Harris | TX | T-19, T-36 |
| 2 | TX-1002 | 2 | Sana | 0300-1 | Dallas | TX | T-19 |
| 3 | FL-2001 | 3 | Bilal | 0301-2 | Orange | FL | |

- **Update anomaly**: Sana changes her phone; you must edit every one of her orders, and missing one leaves the data contradictory.
- **Insert anomaly**: you cannot record a new agent until they have an order.
- **Delete anomaly**: deleting Bilal's only order deletes the fact that Bilal exists.

### First normal form (1NF)

Every cell holds a single atomic value; there are no repeating groups; every row is unique (has a key). The `codes` column with "T-19, T-36" violates 1NF. Fix: move endorsement codes to their own table with one row per (order, code).

```sql
CREATE TABLE order_endorsements (order_id INTEGER, code TEXT, PRIMARY KEY (order_id, code));
```

Also 1NF violations: columns `code1, code2, code3` (a repeating group in disguise) and JSON arrays used for data you need to query.

### Second normal form (2NF)

1NF plus: **no partial dependency**, meaning every non-key attribute depends on the *whole* primary key. This only matters when the key is composite.

Suppose `order_endorsements(order_id, code, fee, description)` where `description` describes the endorsement type. `code → description` is a partial dependency: `description` depends on part of the key. Fix: split.

```sql
CREATE TABLE endorsement_types (code TEXT PRIMARY KEY, description TEXT NOT NULL);
CREATE TABLE order_endorsements (order_id INTEGER, code TEXT REFERENCES endorsement_types(code),
                                 fee REAL, PRIMARY KEY (order_id, code));
```

`fee` stays, because a fee can vary per order (`order_id, code → fee` is a full dependency).

### Third normal form (3NF)

2NF plus: **no transitive dependency**, meaning no non-key attribute depends on another non-key attribute. In the wide table, `order_id → agent_id` and `agent_id → agent_name, agent_phone`, so agent details are transitively dependent. Fix: an `agents` table.

```sql
CREATE TABLE agents (agent_id INTEGER PRIMARY KEY, name TEXT NOT NULL, phone TEXT);
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, file_no TEXT UNIQUE NOT NULL,
                     agent_id INTEGER REFERENCES agents(agent_id), county TEXT, state TEXT);
```

The formal 3NF test: for every non-trivial FD X → A, either X is a superkey or A is part of some candidate key (a *prime* attribute).

### The mnemonic

*Every non-key attribute must depend on the key (1NF), the whole key (2NF), and nothing but the key (3NF).*

### Lossless and dependency-preserving

A good decomposition is **lossless**: joining the pieces back gives exactly the original rows, never extra ones. This holds when the shared attributes form a key of at least one of the pieces (`agent_id` is the key of `agents`). It should also be **dependency-preserving**: every original FD can be checked inside a single table. 3NF decomposition can always achieve both, which is why 3NF is the practical target.

### What normalisation does to queries

The normalised design needs joins to reproduce the wide view. That is fine: joins on indexed keys are cheap, and a view can present the wide shape to report writers. What you gain is one place for each fact, so updates are single-row and consistency is guaranteed by the schema rather than by discipline.

> **Warning:** "Normalise until it hurts, then denormalise until it works" is the folk rule. Denormalise only for measured performance needs and only in read-heavy reporting structures, never in the system of record.

### Try It Yourself

```sql
-- From one anomaly-prone wide table to 3NF, then a view that gives the wide shape back
CREATE TABLE wide (order_id INTEGER, file_no TEXT, agent_id INTEGER, agent_name TEXT, agent_phone TEXT, county TEXT, state TEXT);
INSERT INTO wide VALUES (1,'TX-1001',2,'Sana','0300-1','Harris','TX'),(2,'TX-1002',2,'Sana','0300-1','Dallas','TX'),
                        (3,'FL-2001',3,'Bilal','0301-2','Orange','FL');

CREATE TABLE agents (agent_id INTEGER PRIMARY KEY, name TEXT NOT NULL, phone TEXT);
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, file_no TEXT UNIQUE NOT NULL,
                     agent_id INTEGER REFERENCES agents(agent_id), county TEXT, state TEXT);
INSERT INTO agents SELECT DISTINCT agent_id, agent_name, agent_phone FROM wide;
INSERT INTO orders SELECT order_id, file_no, agent_id, county, state FROM wide;

UPDATE agents SET phone = '0300-9' WHERE agent_id = 2;   -- one row, every order sees it

CREATE VIEW v_wide AS
  SELECT o.order_id, o.file_no, a.agent_id, a.name AS agent_name, a.phone AS agent_phone, o.county, o.state
  FROM orders o JOIN agents a ON a.agent_id = o.agent_id;
SELECT * FROM v_wide ORDER BY order_id;
```

### Quiz

1. Which normal form forbids a comma-separated list in a cell?
- [x] 1NF
- [ ] 2NF
- [ ] 3NF
> 1NF requires atomic values and no repeating groups.

2. A partial dependency can only occur when…
- [ ] there are no foreign keys
- [x] the primary key is composite
- [ ] the table has more than five columns
> Partial means "depends on part of the key", which needs a multi-column key.

3. `order_id → agent_id` and `agent_id → agent_phone` in one table is which violation?
- [ ] 1NF
- [ ] 2NF
- [x] 3NF (transitive dependency)
> A non-key attribute depends on another non-key attribute.

### Exercises

1. **Normalise** — `qa_log(review_id, order_id, file_no, reviewer_id, reviewer_name, errors)` has `order_id → file_no` and `reviewer_id → reviewer_name`. Give the 3NF tables.
<details><summary>Solution</summary>

`orders(order_id PK, file_no UNIQUE)`, `reviewers(reviewer_id PK, reviewer_name)`, `qa_log(review_id PK, order_id FK, reviewer_id FK, errors)`.

</details>

2. **Spot the anomaly** — In a table `rates(state, product, band_from, rate_per_k, state_manager)`, describe the anomaly that occurs when a state gets a new manager.
<details><summary>Solution</summary>

Update anomaly: `state → state_manager` is transitive through the non-key attribute `state`, so every rate row for that state must be updated; missing one leaves two managers. Move `state_manager` to a `states` table.

</details>

### Interview Questions

**Q: Explain 1NF, 2NF and 3NF with an example.**
1NF: atomic values and a key; a cell containing "T-19, T-36" must become two rows in an endorsements table. 2NF: no non-key attribute depends on only part of a composite key; in `order_endorsements(order_id, code, fee, description)`, description depends on code alone, so it moves to an endorsement-types table. 3NF: no non-key attribute depends on another non-key attribute; agent name stored on each order depends on agent_id, not on the order, so it moves to an agents table. The mnemonic is "the key, the whole key, and nothing but the key", and the payoff is that each fact lives in one row, so updates cannot create contradictions.

**Q: What are the anomalies normalisation prevents?**
Update anomalies, where one fact stored in many rows must be changed everywhere and inconsistencies appear if any row is missed; insertion anomalies, where you cannot record a fact (a new agent) without an unrelated fact (an order) existing; and deletion anomalies, where removing the last row about something erases unrelated information. I illustrate with a weekly production spreadsheet where the agent's phone appears on every row: after a phone change, half the rows show the old number, and the report that groups by phone splits one agent into two.

**Q: What does lossless decomposition mean and how do you check it?**
A decomposition is lossless if the natural join of the pieces returns exactly the original relation, with no spurious rows. For a split into two tables it holds when the common attributes are a superkey of at least one side; splitting orders into `orders(order_id, agent_id)` and `agents(agent_id, name)` is lossless because `agent_id` is the key of `agents`. Splitting on a non-key attribute, such as `(order_id, county)` and `(county, agent_id)`, would create bogus combinations on rejoin. I check with SQL by joining the pieces and comparing row counts and an `EXCEPT` against the original.

## BCNF & Denormalisation

Third normal form still allows one kind of redundancy. **Boyce–Codd normal form (BCNF)** closes that gap, and knowing when to stop, or deliberately step back, is the practical skill.

### The BCNF rule

A relation is in BCNF if, for every non-trivial functional dependency X → Y, **X is a superkey**. Compare 3NF, which also allows X → Y when Y is a prime attribute (part of a candidate key). BCNF drops that exception.

### A 3NF table that is not BCNF

Suppose each reviewer checks files for exactly one state, and each order can be reviewed once per state:

```text
review(order_id, state, reviewer_id)
FDs: order_id, state -> reviewer_id     (one reviewer per order per state)
     reviewer_id     -> state           (a reviewer works one state)
Candidate keys: {order_id, state} and {order_id, reviewer_id}
```

It is in 3NF: in `reviewer_id → state`, the right side `state` is prime (part of a candidate key). But `reviewer_id` is not a superkey, so it violates BCNF, and the redundancy is real: the reviewer's state is repeated on every review they do. Decompose on the violating FD:

```sql
CREATE TABLE reviewer_state (reviewer_id INTEGER PRIMARY KEY, state TEXT NOT NULL);
CREATE TABLE review (order_id INTEGER, reviewer_id INTEGER REFERENCES reviewer_state(reviewer_id),
                     PRIMARY KEY (order_id, reviewer_id));
```

The decomposition is lossless (`reviewer_id` is the key of `reviewer_state`), but the FD `order_id, state → reviewer_id` can no longer be checked within one table. That is the BCNF trade-off: **BCNF is always achievable losslessly, but not always dependency-preserving**; 3NF is always both.

### Beyond BCNF

- **4NF** removes multi-valued dependencies: if an agent has independent sets of phones and of languages, storing them in one table `(agent, phone, language)` creates every combination. Split into two tables.
- **5NF** deals with join dependencies that can only be reconstructed from three or more projections. Rare in practice.

Almost every production schema is designed to 3NF/BCNF and stops.

### Denormalisation: deliberate redundancy

**Denormalisation** adds redundant data to a normalised design to make reads faster or simpler. It is a performance decision, taken after measuring, and it must come with a mechanism that keeps the copies consistent.

| Technique | Example | Keeps it consistent |
|---|---|---|
| Copied column | `orders.state` copied from `counties` | trigger or application code |
| Pre-computed aggregate | `agents.open_file_count` | trigger, or nightly rebuild |
| Summary table | `monthly_state_totals` | ETL job, reconciled against detail |
| Materialized view | PostgreSQL `REFRESH MATERIALIZED VIEW` | refresh schedule |
| Wide reporting table / star schema | Power BI fact table with dimensions | ETL from the normalised source |

The system of record (OLTP) stays normalised; reporting copies (OLAP) are denormalised. That split is the subject of the data-warehousing chapter.

### Generated columns as safe denormalisation

Many engines let you store a derived value that the engine maintains, so the redundancy cannot drift:

```sql
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  liability REAL NOT NULL,
  rate_per_k REAL NOT NULL,
  premium REAL GENERATED ALWAYS AS (round(liability / 1000.0 * rate_per_k, 2)) STORED   -- SQLite 3.31+
);
```

PostgreSQL 12+, MySQL 5.7+ and SQL Server (computed columns) support the same idea; it is the safest form of denormalisation because there is nothing to keep in sync.

> **Interview note:** When asked "is 3NF enough?", the expected answer is: 3NF removes almost all redundancy, BCNF removes the last case involving overlapping candidate keys at the cost of possibly losing dependency preservation, and beyond that you normalise only when a real multi-valued dependency shows up.

### Try It Yourself

```sql
-- BCNF fix plus a generated column: redundancy the engine maintains for you
CREATE TABLE reviewer_state (reviewer_id INTEGER PRIMARY KEY, name TEXT, state TEXT NOT NULL);
CREATE TABLE review (order_id INTEGER, reviewer_id INTEGER REFERENCES reviewer_state(reviewer_id),
                     errors INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (order_id, reviewer_id));
INSERT INTO reviewer_state VALUES (10,'Hira','TX'),(11,'Usman','FL');
INSERT INTO review VALUES (1,10,0),(2,10,2),(3,11,1);

CREATE TABLE orders (
  order_id  INTEGER PRIMARY KEY,
  liability REAL NOT NULL,
  rate_per_k REAL NOT NULL,
  premium   REAL GENERATED ALWAYS AS (round(liability / 1000.0 * rate_per_k, 2)) STORED
);
INSERT INTO orders (order_id, liability, rate_per_k) VALUES (1,350000,4.55),(2,280000,4.10),(3,510000,5.00);
UPDATE orders SET rate_per_k = 4.75 WHERE order_id = 2;    -- premium follows automatically

SELECT o.order_id, o.liability, o.rate_per_k, o.premium, rs.name AS reviewer, rs.state, r.errors
FROM orders o JOIN review r ON r.order_id = o.order_id
JOIN reviewer_state rs ON rs.reviewer_id = r.reviewer_id;
```

### Quiz

1. BCNF requires that for every non-trivial FD X → Y…
- [x] X is a superkey
- [ ] Y is a prime attribute
- [ ] X is a single attribute
> 3NF allows Y to be prime as an exception; BCNF does not.

2. What can be lost when decomposing to BCNF?
- [ ] Losslessness
- [x] Dependency preservation
- [ ] The primary key
> BCNF decomposition is always lossless but may split an FD across tables.

3. Which is the safest kind of denormalisation?
- [ ] A copied column updated by application code
- [x] A generated (computed) column maintained by the engine
- [ ] A summary table refreshed manually
> The engine recomputes it on every write, so it cannot drift.

### Exercises

1. **Is it BCNF?** — `assignment(agent_id, state, lead_id)` with `agent_id, state → lead_id` and `lead_id → state`. Determine the normal form and decompose if needed.
<details><summary>Solution</summary>

Candidate keys: {agent_id, state} and {agent_id, lead_id}. `lead_id → state` has a non-superkey left side but a prime right side, so it is 3NF but not BCNF. Decompose into `lead(lead_id PK, state)` and `assignment(agent_id, lead_id, PK(agent_id, lead_id))`.

</details>

2. **4NF** — `agent_skill_lang(agent_id, skill, language)` records each agent's independent skills and languages. Why is it wrong and what is the fix?
<details><summary>Solution</summary>

Skills and languages are independent multi-valued facts, so the table must hold every skill×language combination for each agent (a multi-valued dependency). Split into `agent_skill(agent_id, skill)` and `agent_language(agent_id, language)`.

</details>

### Interview Questions

**Q: What is the difference between 3NF and BCNF?**
Both require that for every non-trivial FD X → A the left side X is a superkey, but 3NF adds an exception: the FD is allowed if A is a prime attribute, part of some candidate key. BCNF has no exception. The difference only shows up with overlapping composite candidate keys, such as reviews where `reviewer_id → state` and `(order_id, state)` is a key. BCNF removes the last redundancy but may lose the ability to enforce some FD within a single table, whereas 3NF is always achievable both losslessly and dependency-preservingly, which is why 3NF is the usual practical target.

**Q: When would you denormalise, and how do you keep it safe?**
When a read pattern is hot and measured to be too slow on the normalised schema, typically dashboards and reports that aggregate millions of rows, or an API that would otherwise need a six-table join on every request. I prefer forms the engine maintains: generated columns, materialized views, or indexed views in SQL Server. If I must copy data, I write the trigger or ETL that maintains it, add a reconciliation query that compares the copy to the source on a schedule, and document that the normalised tables are the source of truth. I never denormalise the transactional system just to avoid writing a join.

**Q: What is a multi-valued dependency and which normal form addresses it?**
A multi-valued dependency X →→ Y means that for each X the set of Y values is independent of the other attributes; storing two such independent sets in one table forces a Cartesian product of combinations. An agent with three phone numbers and two languages would need six rows, and adding a language means adding three rows. 4NF requires that every non-trivial multi-valued dependency has a superkey on the left, which in practice means one table per independent multi-valued attribute. It is rare to hit it deliberately, but it appears in badly imported spreadsheets.

## Relational Algebra

**Relational algebra** is the formal query language underneath SQL. Each operator takes one or two relations and returns a relation, so operators compose. Optimisers work on algebra trees, and interview questions about "what does the database actually do with this query" are answered in these terms.

### The core operators

| Operator | Symbol | SQL equivalent | Meaning |
|---|---|---|---|
| Selection | σ<sub>condition</sub>(R) | `WHERE` | choose rows |
| Projection | π<sub>attrs</sub>(R) | `SELECT` column list (with `DISTINCT`) | choose columns |
| Cartesian product | R × S | `CROSS JOIN` | all pairs |
| Union | R ∪ S | `UNION` | rows in either |
| Difference | R − S | `EXCEPT` | rows in R not in S |
| Rename | ρ<sub>new</sub>(R) | `AS` | rename relation or attributes |

These six are complete: every other operator can be expressed with them. Derived operators make common tasks readable:

| Operator | Symbol | Defined as | SQL |
|---|---|---|---|
| Intersection | R ∩ S | R − (R − S) | `INTERSECT` |
| Theta join | R ⋈<sub>θ</sub> S | σ<sub>θ</sub>(R × S) | `JOIN ... ON θ` |
| Natural join | R ⋈ S | join on all same-named attributes, drop duplicates | `NATURAL JOIN` |
| Division | R ÷ S | rows of R paired with *every* row of S | no direct keyword |
| Aggregation | γ<sub>group; agg</sub>(R) | extended algebra | `GROUP BY` |

### Reading and writing expressions

*Names of agents who closed a Texas file:*

```text
π agent.name ( σ orders.state = 'TX' ∧ orders.status = 'Closed' ( agents ⋈ agents.agent_id = orders.agent_id orders ) )
```

```sql
SELECT DISTINCT a.name
FROM agents a JOIN orders o ON o.agent_id = a.agent_id
WHERE o.state = 'TX' AND o.status = 'Closed';
```

Note `DISTINCT`: projection in pure algebra removes duplicates because relations are sets; SQL keeps them unless told otherwise (bag semantics).

### Division: the "for all" query

Division answers *which X are related to every Y*: agents who have handled a file in **every** state. There is no `DIVIDE` in SQL; the standard translation is a double `NOT EXISTS`, or a count comparison:

```sql
-- agents with at least one order in every state listed in states
SELECT a.name FROM agents a
WHERE NOT EXISTS (
  SELECT 1 FROM states s
  WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.agent_id = a.agent_id AND o.state = s.code)
);
```

Read: *there is no state for which the agent has no order*. The count form is `GROUP BY agent HAVING COUNT(DISTINCT state) = (SELECT COUNT(*) FROM states)`.

### Why algebra matters: equivalence rules

The optimiser rewrites an expression into an equivalent, cheaper one using algebraic laws:

- **Push selections down**: σ<sub>state='TX'</sub>(A ⋈ B) = A ⋈ σ<sub>state='TX'</sub>(B) when the condition only involves B. Filtering before joining shrinks the join input.
- **Push projections down**: drop unneeded columns early to reduce row width.
- **Join commutativity and associativity**: (A ⋈ B) ⋈ C = A ⋈ (B ⋈ C), so the optimiser can choose any join order.
- **Selection cascade**: σ<sub>a∧b</sub>(R) = σ<sub>a</sub>(σ<sub>b</sub>(R)).

When you see `EXPLAIN` apply a `WHERE` condition to the first table scanned rather than after the join, that is selection push-down.

### Relational calculus, briefly

Tuple relational calculus expresses the same queries declaratively ("the set of t such that…"). Codd's theorem says algebra and safe calculus are equally expressive; SQL's `WHERE ... EXISTS` style is calculus-flavoured while the execution plan is algebra. Neither can express transitive closure, which is why recursive CTEs were added to SQL.

> **Tip:** In an interview, translating a SQL query into an algebra tree and then explaining which selections you would push down is a compact way to demonstrate that you understand query optimisation, not just syntax.

### Try It Yourself

```sql
-- Division (for-all) two ways: agents who have an order in EVERY state in states
CREATE TABLE states (code TEXT PRIMARY KEY);
CREATE TABLE agents (agent_id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, agent_id INTEGER, state TEXT);
INSERT INTO states VALUES ('TX'),('FL');
INSERT INTO agents VALUES (1,'Sana'),(2,'Bilal'),(3,'Hira');
INSERT INTO orders (agent_id,state) VALUES (1,'TX'),(1,'FL'),(1,'TX'),(2,'TX'),(3,'FL'),(3,'FL');

SELECT 'double NOT EXISTS' AS method, a.name
FROM agents a
WHERE NOT EXISTS (SELECT 1 FROM states s
                  WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.agent_id = a.agent_id AND o.state = s.code))
UNION ALL
SELECT 'count comparison', a.name
FROM agents a JOIN orders o ON o.agent_id = a.agent_id
GROUP BY a.agent_id
HAVING COUNT(DISTINCT o.state) = (SELECT COUNT(*) FROM states);
```

### Quiz

1. Which operator corresponds to the SQL `WHERE` clause?
- [x] Selection σ
- [ ] Projection π
- [ ] Rename ρ
> Selection chooses rows by a predicate; projection chooses columns.

2. Which operation expresses "agents who handled a file in every state"?
- [ ] Natural join
- [x] Division
- [ ] Union
> Division finds tuples related to all tuples of another relation.

3. Why does pushing a selection below a join help?
- [x] The join processes fewer rows
- [ ] It removes the need for an index
- [ ] It changes the result
> It is an equivalence rule that reduces intermediate result size without changing the answer.

### Exercises

1. **Translate to SQL** — π<sub>file_no</sub>(σ<sub>premium > 2000</sub>(orders)) − π<sub>file_no</sub>(σ<sub>errors > 0</sub>(orders ⋈ qa_reviews)).
<details><summary>Solution</summary>

```sql
SELECT DISTINCT file_no FROM orders WHERE premium > 2000
EXCEPT
SELECT DISTINCT o.file_no FROM orders o JOIN qa_reviews q ON q.order_id = o.order_id WHERE q.errors > 0;
```

</details>

2. **Express intersection** — Show how R ∩ S is built from the six core operators.
<details><summary>Solution</summary>

R ∩ S = R − (R − S). Rows of R minus the rows of R that are not in S leaves exactly the rows in both.

</details>

### Interview Questions

**Q: What is relational algebra and why should a developer care?**
It is the set of operators (selection, projection, product, union, difference, rename, plus derived joins and aggregation) that take relations and return relations, giving SQL its formal meaning. Developers should care because the optimiser turns every SQL statement into an algebra tree and then rewrites it using equivalence rules, so understanding that a `WHERE` on one table can be pushed below a join, or that join order is free, explains why two syntactically different queries get the same plan and why a function on a column blocks a rewrite. It also gives precise vocabulary in design reviews: "this is a division query, so expect a double `NOT EXISTS`".

**Q: How do you write a "for all" query in SQL?**
SQL has no division operator, so I express "no counterexample exists" with nested `NOT EXISTS`: select agents for whom there is no state without an order by that agent. The alternative is counting: join agents to orders, group by agent, and require `COUNT(DISTINCT state)` to equal the total number of states, which is shorter but silently wrong if the orders table contains states not in the states table. I choose the `NOT EXISTS` form when correctness against the reference table matters and the count form for quick analysis.

**Q: What is the difference between set semantics and bag semantics?**
Relational algebra works on sets, so a projection automatically removes duplicates and union is set union. SQL works on bags (multisets): `SELECT state FROM orders` returns one row per order with repeats, `UNION ALL` keeps duplicates, and only `DISTINCT`, `UNION`, `INTERSECT` and `EXCEPT` apply set semantics. This is why an aggregate over a projected column can be wrong if you forget that duplicates are still there, and why the engine can skip the expensive de-duplication step whenever you do not ask for it.

## Integrity Constraints

A constraint is a rule the DBMS enforces on every write. Constraints are the cheapest, most reliable validation you will ever get: they run inside the engine, cannot be bypassed by a forgotten `if` in application code, and they document the business rules next to the data.

### The constraint toolbox

| Constraint | Rule enforced | Example |
|---|---|---|
| `NOT NULL` | a value is required | `file_no TEXT NOT NULL` |
| `UNIQUE` | no duplicates (NULLs usually exempt) | `UNIQUE (state, county)` |
| `PRIMARY KEY` | unique and not null; row identity | `order_id INTEGER PRIMARY KEY` |
| `FOREIGN KEY` | value exists in parent | `REFERENCES agents(agent_id)` |
| `CHECK` | arbitrary row-level predicate | `CHECK (closed IS NULL OR closed >= opened)` |
| `DEFAULT` | value when omitted | `DEFAULT 'Open'` |
| Domain / type | value has the right type | `STRICT` tables, `NUMERIC(12,2)` |
| Assertion (SQL standard) | cross-table predicate | not implemented by mainstream engines |
| Trigger | procedural rule on insert/update/delete | audit rows, derived totals |

### CHECK constraints

`CHECK` accepts any boolean expression over the row. It is evaluated on `INSERT` and `UPDATE`; a `NULL` result passes (unknown is not a violation), so pair with `NOT NULL` when needed.

```sql
CREATE TABLE orders (
  order_id  INTEGER PRIMARY KEY,
  product   TEXT NOT NULL CHECK (product IN ('Owner','Lender','Both')),
  liability REAL NOT NULL CHECK (liability > 0),
  premium   REAL NOT NULL CHECK (premium >= 0),
  opened    TEXT NOT NULL,
  closed    TEXT,
  CHECK (closed IS NULL OR closed >= opened),
  CHECK (premium <= liability)
);
```

`CHECK` cannot look at other rows or tables (no subqueries in SQLite and most engines). For cross-row rules such as "bands for a state must not overlap" you need a trigger or application logic.

### Foreign keys revisited: deferred checking

Sometimes two rows reference each other and neither can be inserted first. The SQL standard lets a constraint be **deferrable**, checked at `COMMIT` instead of per statement:

```sql
-- PostgreSQL / SQLite syntax
FOREIGN KEY (lead_id) REFERENCES agents(agent_id) DEFERRABLE INITIALLY DEFERRED
```

SQL Server and MySQL do not support deferrable constraints; you order the inserts or temporarily allow NULL.

### Triggers

A **trigger** runs a block of SQL automatically before or after an insert, update or delete. Uses: audit trails, maintaining denormalised totals, enforcing cross-row rules, and setting `updated_at`.

```sql
CREATE TRIGGER trg_orders_audit AFTER UPDATE OF status ON orders
BEGIN
  INSERT INTO audit (order_id, old_status, new_status, changed_at)
  VALUES (NEW.order_id, OLD.status, NEW.status, datetime('now'));
END;

CREATE TRIGGER trg_no_reopen BEFORE UPDATE OF status ON orders
WHEN OLD.status = 'Closed' AND NEW.status <> 'Closed'
BEGIN
  SELECT RAISE(ABORT, 'closed orders cannot be reopened');
END;
```

`OLD` and `NEW` are the row before and after. `RAISE(ABORT, msg)` in SQLite cancels the statement; PostgreSQL uses `RAISE EXCEPTION` inside a function, SQL Server uses `THROW` or `ROLLBACK` inside the trigger body. Triggers are powerful and invisible; keep them few, small and documented.

### Constraint violations and error handling

When a constraint fails, the statement is rolled back (not the whole transaction, unless the engine or driver is configured that way) and an error is raised: SQLite `SQLITE_CONSTRAINT`, PostgreSQL SQLSTATE `23505` (unique) and `23503` (foreign key), SQL Server error 2627/547. Applications should catch these and translate them into user messages ("file number already exists") rather than pre-checking with a `SELECT`, which has a race condition.

### Constraints versus application validation

Do both, but for different reasons. Application validation gives immediate, friendly feedback; database constraints guarantee integrity no matter which application, script, import job or DBA touches the table. A rate-matrix upload script written in a hurry should still be unable to insert a negative rate.

> **Warning:** Adding a constraint to an existing table fails if current data violates it. Query for violations first (`SELECT ... WHERE NOT (condition)`), clean up, then add the constraint. In PostgreSQL, `ADD CONSTRAINT ... NOT VALID` followed by `VALIDATE CONSTRAINT` avoids a long table lock.

### Try It Yourself

```sql
PRAGMA foreign_keys = ON;
CREATE TABLE orders (
  order_id  INTEGER PRIMARY KEY,
  file_no   TEXT NOT NULL UNIQUE,
  product   TEXT NOT NULL CHECK (product IN ('Owner','Lender','Both')),
  liability REAL NOT NULL CHECK (liability > 0),
  premium   REAL NOT NULL DEFAULT 0 CHECK (premium >= 0 AND premium <= liability),
  status    TEXT NOT NULL DEFAULT 'Open',
  opened    TEXT NOT NULL DEFAULT '2026-03-01',
  closed    TEXT,
  CHECK (closed IS NULL OR closed >= opened)
);
CREATE TABLE audit (id INTEGER PRIMARY KEY, order_id INTEGER, old_status TEXT, new_status TEXT);
CREATE TRIGGER trg_audit AFTER UPDATE OF status ON orders
BEGIN INSERT INTO audit (order_id, old_status, new_status) VALUES (NEW.order_id, OLD.status, NEW.status); END;
CREATE TRIGGER trg_no_reopen BEFORE UPDATE OF status ON orders
WHEN OLD.status = 'Closed' AND NEW.status <> 'Closed'
BEGIN SELECT RAISE(ABORT, 'closed orders cannot be reopened'); END;

INSERT INTO orders (file_no,product,liability,premium) VALUES ('TX-1001','Owner',350000,2150),('TX-1002','Lender',280000,1180);
UPDATE orders SET status = 'Closed', closed = '2026-03-04' WHERE file_no = 'TX-1001';
-- Each of these fails; uncomment one at a time to see the message:
-- INSERT INTO orders (file_no,product,liability) VALUES ('TX-1001','Owner',1);          -- UNIQUE
-- INSERT INTO orders (file_no,product,liability) VALUES ('TX-1003','Title',1);          -- CHECK product
-- UPDATE orders SET closed = '2026-02-01' WHERE file_no = 'TX-1002';                     -- CHECK closed >= opened
-- UPDATE orders SET status = 'Open' WHERE file_no = 'TX-1001';                           -- trigger RAISE
SELECT o.file_no, o.status, o.closed, a.old_status, a.new_status
FROM orders o LEFT JOIN audit a ON a.order_id = o.order_id;
```

### Quiz

1. What happens when a CHECK expression evaluates to NULL?
- [x] The row is accepted
- [ ] The row is rejected
- [ ] An error is raised
> Only FALSE violates a CHECK; unknown passes, so combine with NOT NULL when required.

2. Which rule cannot be expressed with a CHECK constraint?
- [ ] Premium must be non-negative
- [ ] Closed date must not precede opened date
- [x] Rate bands for a state must not overlap other rows
> CHECK sees only the current row; cross-row rules need triggers or application logic.

3. What does a deferrable constraint allow?
- [x] Checking at COMMIT instead of after each statement
- [ ] Skipping the constraint permanently
- [ ] Checking only on INSERT
> Useful for mutually referencing rows; supported by PostgreSQL and SQLite, not SQL Server.

### Exercises

1. **Add constraints** — Write DDL for `rate_matrix(state, product, band_from, band_to, rate_per_k)` enforcing: two-letter state, band_to greater than band_from, positive rate, and uniqueness of (state, product, band_from).
<details><summary>Solution</summary>

```sql
CREATE TABLE rate_matrix (
  state TEXT NOT NULL CHECK (length(state) = 2),
  product TEXT NOT NULL,
  band_from INTEGER NOT NULL CHECK (band_from >= 0),
  band_to INTEGER NOT NULL,
  rate_per_k REAL NOT NULL CHECK (rate_per_k > 0),
  PRIMARY KEY (state, product, band_from),
  CHECK (band_to > band_from)
);
```

</details>

2. **Audit trigger** — Write a SQLite trigger that records every deleted order into `orders_deleted(order_id, file_no, deleted_at)`.
<details><summary>Solution</summary>

```sql
CREATE TRIGGER trg_orders_delete BEFORE DELETE ON orders
BEGIN
  INSERT INTO orders_deleted (order_id, file_no, deleted_at) VALUES (OLD.order_id, OLD.file_no, datetime('now'));
END;
```

</details>

### Interview Questions

**Q: Should business rules live in the database or the application?**
Both, with different responsibilities. Rules about data integrity that must hold regardless of which program writes the data belong in the database as constraints: keys, foreign keys, domains, and row-level checks such as a positive premium. Rules that need context, friendly messages or external systems (credit checks, workflow approvals) belong in the application. The database is the last line of defence: when an import script, a DBA hot-fix or a second application touches the table, only the constraints still apply. I mention that duplicating a simple rule in both layers is fine; the failure mode to avoid is having it only in one application.

**Q: When would you use a trigger, and what are the risks?**
For audit trails, keeping a denormalised total in sync, enforcing cross-row rules a CHECK cannot express, and stamping `updated_at`. The risks are invisibility (a developer updating a row does not see that three other tables change), performance (a trigger runs per row or per statement on every write), ordering surprises when several triggers exist, and recursion when triggers write to tables that have triggers. I keep triggers small, name them by purpose, document them in the schema repository, and prefer generated columns or application code where either would do.

**Q: How do you add a NOT NULL or CHECK constraint to a large existing table safely?**
First find the violating rows with the negation of the rule and fix or quarantine them, otherwise the `ALTER` fails. Then add the constraint in a way that avoids a long exclusive lock: in PostgreSQL `ADD CONSTRAINT ... NOT VALID` then `VALIDATE CONSTRAINT`, which validates with a weaker lock; in SQL Server `WITH NOCHECK` followed by `CHECK CONSTRAINT`; in SQLite, which cannot add constraints in place, rebuild the table inside a transaction. I schedule it in a maintenance window anyway, take a backup first, and script the rollback.
