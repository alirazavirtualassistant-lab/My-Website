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

# LEVEL: Advanced

## Indexing & B-trees & hash indexes

A table with a million production orders and no index answers `WHERE file_no = 'TX-1001'` by reading every row. An **index** is a separate, ordered data structure that maps column values to row locations, so the engine can jump to the matching rows in a handful of page reads. Choosing indexes well is the single highest-leverage performance skill for anyone who writes SQL.

### Pages, not rows

Databases read and write **pages** (4 KB in SQLite by default, 8 KB in PostgreSQL and SQL Server, 16 KB in InnoDB), never individual rows. A million 200-byte rows occupy about 50,000 pages of 4 KB. A full scan reads all 50,000. The goal of an index is to reduce the number of pages touched to a few.

### B-trees and B+trees

Almost every relational index is a **B+tree**: a balanced tree whose internal nodes hold separator keys and whose leaf nodes hold the actual keys (plus row pointers or the rows themselves), linked left-to-right for range scans. With a fan-out of a few hundred keys per page, a tree of height 3 covers tens of millions of rows, so any lookup costs three or four page reads, and inserts keep the tree balanced by splitting full pages.

```text
                     [ 'M' ]                      root (height 1)
              /                 \
        [ 'F' | 'K' ]        [ 'S' | 'W' ]        internal nodes
       /     |     \        /     |     \
   [A..E] [F..J] [K..L]  [M..R] [S..V] [W..Z]     leaves, linked ->
```

Properties that follow from the structure: equality lookups, range scans (`BETWEEN`, `<`, `>`), prefix matches (`LIKE 'TX-%'`) and `ORDER BY` on the indexed columns are all efficient; leading-wildcard `LIKE '%001'` and functions on the column (`WHERE upper(state) = 'TX'`) are not, because the tree is ordered by the raw stored value.

### Clustered versus secondary indexes

A **clustered** index stores the table rows inside the leaf pages, in key order; a table can have only one. SQLite tables are B-trees keyed by `rowid` (or by the primary key for `WITHOUT ROWID` tables); InnoDB clusters by primary key; SQL Server lets you choose. A **secondary** (non-clustered) index stores the key plus a pointer (`rowid` or the primary key) and requires a second lookup into the table for any column not in the index. That second lookup is why a **covering index**, one that contains every column the query needs, is so much faster: the table is never touched.

```sql
CREATE INDEX idx_orders_state_status ON orders (state, status);
-- covers: SELECT status FROM orders WHERE state = 'TX'
-- does not cover: SELECT premium FROM orders WHERE state = 'TX'  (premium is not in the index)
CREATE INDEX idx_orders_state_status_prem ON orders (state, status, premium);   -- now it covers
```

PostgreSQL 11+ and SQL Server support `INCLUDE (premium)` to add columns to the leaf without making them part of the key.

### Composite indexes and the leftmost-prefix rule

An index on `(state, status, opened)` is sorted by state, then status within state, then opened within that. It serves queries filtering on `state`, on `state AND status`, and on all three, but not on `status` alone (the tree is not ordered by status globally). Column order matters: put equality columns first, the range column last, and the most selective equality column earliest when several are equalities.

### Hash indexes

A **hash index** maps `hash(value)` to a bucket of row pointers. Equality lookups are O(1) on average; range queries, ordering and prefix matches are impossible because hashing destroys order. PostgreSQL offers `CREATE INDEX ... USING hash`, MySQL's MEMORY engine uses them, and most engines build temporary hash tables for joins. SQLite has no hash indexes. In practice B-trees are the default because they handle equality nearly as well and everything else better.

| Index type | Equality | Range / ORDER BY | Prefix LIKE | Typical use |
|---|---|---|---|---|
| B+tree | yes | yes | yes | default for everything |
| Hash | yes (fastest) | no | no | exact-match lookups, in-memory tables |
| Bitmap | yes | limited | no | low-cardinality columns in warehouses |
| GIN / inverted | contains | no | no | full-text, JSON, arrays (PostgreSQL) |
| Partial (filtered) | yes | yes | yes | index only rows matching a predicate |

### Partial and expression indexes

```sql
CREATE INDEX idx_open_orders ON orders (state) WHERE status = 'Open';   -- small index for the hot subset
CREATE INDEX idx_orders_file_upper ON orders (upper(file_no));            -- makes WHERE upper(file_no) = ... indexable
```

Supported by SQLite, PostgreSQL and SQL Server (filtered indexes; computed-column indexes for expressions). MySQL 8 supports functional indexes.

### The cost of indexes

Every index is another B-tree that every `INSERT`, `UPDATE` of an indexed column and `DELETE` must maintain, and it occupies disk and cache. A weekly status-report table that is written once a day and read thousands of times can carry several; an audit log written thousands of times per hour should carry one. Unused indexes are pure cost: PostgreSQL's `pg_stat_user_indexes` and SQL Server's `sys.dm_db_index_usage_stats` reveal them.

> **Interview note:** "Why is my query slow even though the column is indexed?" Common answers: a function or type cast on the column, a leading wildcard, low selectivity (the planner rightly prefers a scan when 40% of rows match), stale statistics, a composite index whose leading column is not in the predicate, or an implicit conversion (`WHERE file_no = 1001` against a TEXT column).

### Try It Yourself

```sql
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY, file_no TEXT NOT NULL, state TEXT NOT NULL,
  status TEXT NOT NULL, premium REAL NOT NULL, opened TEXT NOT NULL
);
-- 2,000 synthetic rows via a recursive CTE
WITH RECURSIVE n(i) AS (SELECT 1 UNION ALL SELECT i + 1 FROM n WHERE i < 2000)
INSERT INTO orders (file_no, state, status, premium, opened)
SELECT printf('%s-%04d', substr('TXWYFLCA', 1 + (i % 4) * 2, 2), i),
       substr('TXWYFLCA', 1 + (i % 4) * 2, 2),
       CASE WHEN i % 5 = 0 THEN 'Open' ELSE 'Closed' END,
       500 + (i * 37) % 2500,
       date('2026-01-01', '+' || (i % 90) || ' days')
FROM n;

-- Before any index: full table scan
EXPLAIN QUERY PLAN SELECT * FROM orders WHERE file_no = 'TX-1000';

CREATE UNIQUE INDEX idx_orders_file ON orders (file_no);
CREATE INDEX idx_orders_state_status ON orders (state, status);
CREATE INDEX idx_open_by_state ON orders (state, opened) WHERE status = 'Open';

-- After: index searches
EXPLAIN QUERY PLAN SELECT * FROM orders WHERE file_no = 'TX-1000';
EXPLAIN QUERY PLAN SELECT status FROM orders WHERE state = 'TX';                 -- covering index
EXPLAIN QUERY PLAN SELECT * FROM orders WHERE status = 'Open';                   -- status alone cannot seek (state, status); SQLite scans the smaller partial index instead
EXPLAIN QUERY PLAN SELECT file_no FROM orders WHERE state = 'WY' AND status = 'Open' ORDER BY opened;  -- partial index
EXPLAIN QUERY PLAN SELECT * FROM orders WHERE upper(file_no) = 'TX-1000';        -- function defeats the index

SELECT state, status, COUNT(*) AS n, ROUND(AVG(premium), 2) AS avg_premium
FROM orders GROUP BY state, status ORDER BY state, status;
```

### Quiz

1. Why can a B+tree index serve `ORDER BY` and range queries while a hash index cannot?
- [x] B+tree leaves are kept in key order and linked; hashing destroys order
- [ ] Hash indexes are slower for everything
- [ ] B+trees store the whole row
> Ordered leaves allow sequential range scans; a hash bucket has no neighbours.

2. An index exists on `(state, status)`. Which query can use it?
- [ ] `WHERE status = 'Open'`
- [x] `WHERE state = 'TX'`
- [ ] `WHERE upper(state) = 'TX'`
> The leftmost prefix must appear as a plain equality or range predicate.

3. What is a covering index?
- [ ] An index on every column of the table
- [x] An index that contains all the columns a query needs, so the table is not read
- [ ] The clustered index
> It eliminates the secondary lookup into the table for each matching key.

4. What is the main cost of adding an index?
- [ ] Reads become slower
- [x] Every write must also update the index, and it uses disk and cache
- [ ] It locks the table permanently
> Indexes trade write cost and space for read speed.

### Exercises

1. **Design the index** — For `SELECT file_no, premium FROM orders WHERE state = 'TX' AND status = 'Open' AND opened >= '2026-03-01' ORDER BY opened`, write the best single index.
<details><summary>Solution</summary>

```sql
-- equality columns first, then the range/order column, then included columns for coverage
CREATE INDEX idx_orders_lookup ON orders (state, status, opened, file_no, premium);
```

</details>

2. **Find the scan** — Given an index on `(file_no)`, explain why `WHERE file_no LIKE '%-1000'` still scans, and rewrite so an index can help if the suffix is what users search for.
<details><summary>Solution</summary>

```sql
-- A leading wildcard cannot use an ordered index. Store a reversed copy (or an expression index) and search its prefix:
CREATE INDEX idx_orders_file_rev ON orders (reverse_file_no);   -- column maintained as reverse(file_no) via trigger/generated column
-- SELECT ... WHERE reverse_file_no LIKE '0001-%';
-- (SQLite has no reverse(); PostgreSQL: CREATE INDEX ON orders (reverse(file_no)).)
```

</details>

3. **Unused index audit** — Write the PostgreSQL query that lists indexes never used since statistics were reset.
<details><summary>Solution</summary>

```sql
SELECT schemaname, relname, indexrelname, pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND indexrelname NOT LIKE '%_pkey'
ORDER BY pg_relation_size(indexrelid) DESC;
```

</details>

### Interview Questions

**Q: Explain how a B+tree index answers a query and why it is the default index structure.**
The engine starts at the root page, uses the separator keys to choose a child, and repeats until it reaches a leaf; with hundreds of keys per page a tree of height three or four covers millions of rows, so an equality lookup costs three or four page reads instead of a scan of tens of thousands. Because the leaves are sorted and linked, the same structure serves range predicates, prefix `LIKE`, `ORDER BY`, `MIN`/`MAX` and merge joins by walking the leaf chain. Inserts split full pages and deletes merge them, keeping it balanced without rebuilds. Hash indexes win only for pure equality; bitmap and inverted indexes serve special cases. That breadth is why every mainstream engine uses B+trees for primary and secondary indexes by default.

**Q: A query on an indexed column is slow. How do you diagnose it?**
I read the plan first: `EXPLAIN (ANALYZE, BUFFERS)` in PostgreSQL, the actual execution plan in SQL Server, `EXPLAIN QUERY PLAN` in SQLite. If it shows a scan despite the index I check the usual suspects: a function or cast wrapping the column, an implicit type conversion (text column compared with a number), a leading wildcard, a composite index whose first column is missing from the predicate, or a predicate matching a large share of rows so the scan is genuinely cheaper. If the index is used but the query is still slow, it is often a secondary lookup per row on a wide result, fixed by a covering index, or stale statistics, fixed by `ANALYZE`. I confirm any change by comparing the measured buffers and time before and after, not by intuition.

**Q: How do you decide which indexes a table should have?**
From the workload, not the schema: I list the queries that run most often or hurt most, and for each identify the equality predicates, the range predicate, the sort and the selected columns, then design composite indexes with equality columns first, the range column next and, if the query is hot enough, included columns for coverage. I consolidate: an index on `(state, status, opened)` also serves queries on `state` alone, so a separate `(state)` index is redundant. I weigh write volume, keep the count small on heavily inserted tables, use partial indexes for hot subsets such as open orders, and drop indexes the usage statistics show are never scanned. Then I measure with the real data volume, because the planner's choices change with cardinality.

## Query processing & optimisation

Between the SQL you write and the pages the engine reads lies the **query processor**: a parser, a rewriter, a cost-based optimiser and an executor. Knowing what it does explains why two equivalent queries can differ a thousandfold in speed, and gives you the vocabulary to read an execution plan instead of guessing.

### The pipeline

1. **Parse**: the SQL text becomes a syntax tree; names are resolved against the catalog and permissions checked.
2. **Rewrite**: views are expanded, subqueries flattened where legal, `IN (subquery)` turned into a semi-join, constants folded, redundant predicates removed.
3. **Optimise**: for each logical operation the planner enumerates physical alternatives (scan versus index, nested loop versus hash versus merge join, join order) and picks the plan with the lowest estimated cost using table statistics.
4. **Execute**: the plan is a tree of operators; in the Volcano/iterator model each calls `next()` on its children, streaming rows upward. Some operators (sort, hash build, aggregate) are blocking and must consume all input before producing output.

### Reading a plan

```sql
EXPLAIN QUERY PLAN
SELECT a.name, COUNT(*) AS files
FROM orders o JOIN agents a ON a.agent_id = o.agent_id
WHERE o.state = 'TX' AND o.status = 'Open'
GROUP BY a.name;
```

SQLite prints lines such as `SEARCH o USING INDEX idx_orders_state_status (state=? AND status=?)`, `SEARCH a USING INTEGER PRIMARY KEY (rowid=?)` and `USE TEMP B-TREE FOR GROUP BY`. `SEARCH` means an index lookup; `SCAN` means every row. PostgreSQL's `EXPLAIN (ANALYZE, BUFFERS)` adds estimated versus actual row counts and pages touched; SQL Server's actual execution plan shows the same graphically. The number to compare is estimated rows against actual rows: a large gap means stale or missing statistics and a plan chosen on wrong assumptions.

### Access paths

| Path | When the planner picks it |
|---|---|
| Sequential (full) scan | small table, or predicate matches a large fraction of rows |
| Index seek + lookup | selective predicate on an indexed column |
| Index-only scan | covering index |
| Bitmap heap scan (PostgreSQL) | moderately selective; combine several indexes, then read pages in order |

### Join algorithms

**Nested loop**: for each outer row, look up matching inner rows; ideal when the outer side is small and the inner side has an index on the join key. **Hash join**: build a hash table on the smaller input, probe with the larger; the workhorse for large equality joins with no useful index, needs memory. **Merge join**: both inputs sorted on the join key, walk them together; excellent when indexes already provide the order or for very large inputs. SQLite implements only nested loops (with automatic transient indexes when it helps), which is why join order and indexes matter so much there.

### Statistics and cardinality estimation

The optimiser estimates how many rows each operator will output from histograms and distinct-value counts gathered by `ANALYZE` (PostgreSQL, SQLite), `UPDATE STATISTICS` (SQL Server) or `ANALYZE TABLE` (MySQL). Correlated columns (`state` and `county`) fool the independence assumption, producing underestimates that lead to nested loops over millions of rows. PostgreSQL's `CREATE STATISTICS (dependencies)` and SQL Server's multi-column statistics address exactly that.

### Rewrites that change plans

```sql
-- Sargable: index can seek
WHERE opened >= '2026-03-01' AND opened < '2026-04-01'
-- Not sargable: function on the column forces a scan
WHERE strftime('%Y-%m', opened) = '2026-03'

-- Correlated subquery evaluated per row...
SELECT * FROM orders o WHERE premium > (SELECT AVG(premium) FROM orders WHERE state = o.state);
-- ...versus one aggregate joined once
SELECT o.* FROM orders o JOIN (SELECT state, AVG(premium) AS avg_p FROM orders GROUP BY state) s
  ON s.state = o.state WHERE o.premium > s.avg_p;

-- EXISTS stops at the first match; COUNT(*) > 0 counts everything
WHERE EXISTS (SELECT 1 FROM audit a WHERE a.order_id = o.order_id)
```

**Sargable** ("search argument able") predicates compare a bare column with a value; keep functions and arithmetic on the constant side. `SELECT *` defeats covering indexes and moves more bytes; `DISTINCT` and `ORDER BY` add sorts; `OR` across different columns often forces a scan unless the engine can combine indexes; `OFFSET 100000` reads and discards 100,000 rows, so keyset pagination (`WHERE (opened, order_id) > (?, ?)`) is the scalable alternative.

### Materialised views and caching

When a weekly production report aggregates ten million rows, precompute it: a **materialised view** (PostgreSQL, Oracle; indexed views in SQL Server; a summary table maintained by triggers or a nightly job in MySQL and SQLite) stores the result and refreshes on a schedule. Power BI's import mode is the same idea one layer up.

### Hints and plan stability

Engines allow hints (`/*+ IndexScan(o idx) */` with pg_hint_plan, `WITH (INDEX(...))` in SQL Server, `INDEXED BY` in SQLite) to force a path. Use them as a last resort with a comment explaining why; a hint that was right at 10,000 rows is wrong at 10 million. Prefer fixing statistics, indexes or the query shape.

> **Tip:** Measure with realistic data volumes. A plan on 500 development rows is nearly meaningless; the optimiser's choices flip as tables grow. Load a production-sized sample before declaring a query fast.

### Try It Yourself

```sql
CREATE TABLE agents (agent_id INTEGER PRIMARY KEY, name TEXT NOT NULL, team TEXT NOT NULL);
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, file_no TEXT NOT NULL, state TEXT NOT NULL,
  status TEXT NOT NULL, premium REAL NOT NULL, opened TEXT NOT NULL, agent_id INTEGER NOT NULL REFERENCES agents(agent_id));
WITH RECURSIVE n(i) AS (SELECT 1 UNION ALL SELECT i + 1 FROM n WHERE i < 20)
INSERT INTO agents SELECT i, 'Agent ' || i, CASE WHEN i <= 10 THEN 'Search' ELSE 'Examination' END FROM n;
WITH RECURSIVE n(i) AS (SELECT 1 UNION ALL SELECT i + 1 FROM n WHERE i < 3000)
INSERT INTO orders (file_no, state, status, premium, opened, agent_id)
SELECT printf('%s-%04d', substr('TXWYFLCA', 1 + (i % 4) * 2, 2), i), substr('TXWYFLCA', 1 + (i % 4) * 2, 2),
       CASE WHEN i % 6 = 0 THEN 'Open' ELSE 'Closed' END, 400 + (i * 53) % 3000,
       date('2026-01-01', '+' || (i % 120) || ' days'), 1 + (i % 20) FROM n;
CREATE INDEX idx_orders_state_status ON orders (state, status);
CREATE INDEX idx_orders_opened ON orders (opened);
ANALYZE;

-- 1. Join plan: index seek on orders, primary-key lookup on agents, temp b-tree for the GROUP BY
EXPLAIN QUERY PLAN
SELECT a.name, COUNT(*) AS files FROM orders o JOIN agents a ON a.agent_id = o.agent_id
WHERE o.state = 'TX' AND o.status = 'Open' GROUP BY a.name;

-- 2. Sargable versus non-sargable date filter
EXPLAIN QUERY PLAN SELECT COUNT(*) FROM orders WHERE opened >= '2026-03-01' AND opened < '2026-04-01';
EXPLAIN QUERY PLAN SELECT COUNT(*) FROM orders WHERE strftime('%Y-%m', opened) = '2026-03';

-- 3. Correlated subquery versus a pre-aggregated join
EXPLAIN QUERY PLAN SELECT file_no FROM orders o WHERE premium > (SELECT AVG(premium) FROM orders x WHERE x.state = o.state);
EXPLAIN QUERY PLAN SELECT o.file_no FROM orders o JOIN (SELECT state, AVG(premium) AS avg_p FROM orders GROUP BY state) s ON s.state = o.state WHERE o.premium > s.avg_p;

-- 4. Keyset pagination: seek instead of OFFSET
EXPLAIN QUERY PLAN SELECT file_no, opened FROM orders WHERE (opened, order_id) > ('2026-02-15', 0) ORDER BY opened, order_id LIMIT 50;

-- The report itself
SELECT a.team, o.state, COUNT(*) AS files, ROUND(SUM(o.premium), 2) AS premium
FROM orders o JOIN agents a ON a.agent_id = o.agent_id
WHERE o.opened >= '2026-03-01' AND o.opened < '2026-04-01'
GROUP BY a.team, o.state ORDER BY a.team, o.state;
```

### Quiz

1. What does a cost-based optimiser use to choose between plans?
- [ ] The order of tables in the FROM clause
- [x] Statistics about table sizes and value distributions
- [ ] The length of the SQL text
> Estimates of rows and pages per operator drive the cost model.

2. Which predicate is sargable?
- [ ] `WHERE strftime('%Y', opened) = '2026'`
- [x] `WHERE opened >= '2026-01-01' AND opened < '2027-01-01'`
- [ ] `WHERE premium * 1.1 > 1000`
> A bare column compared with constants lets the engine seek an index.

3. Which join algorithm needs no index and no sorted input but does need memory?
- [ ] Nested loop
- [x] Hash join
- [ ] Merge join
> It builds a hash table on the smaller input and probes it with the larger.

4. Why is `OFFSET 100000` slow?
- [x] The engine still reads and discards the first 100,000 rows
- [ ] OFFSET disables indexes
- [ ] It sorts twice
> Keyset pagination seeks directly to the last seen key instead.

### Exercises

1. **Make it sargable** — Rewrite `WHERE substr(file_no, 1, 2) = 'TX'` so an index on `file_no` can be used.
<details><summary>Solution</summary>

```sql
WHERE file_no LIKE 'TX-%'      -- prefix match uses the index (with default case-sensitive LIKE or COLLATE handling)
-- or: WHERE file_no >= 'TX-' AND file_no < 'TX.'
```

</details>

2. **Estimate versus actual** — In PostgreSQL, write the command that shows estimated and actual rows with buffer counts for a query.
<details><summary>Solution</summary>

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT state, COUNT(*) FROM orders WHERE status = 'Open' GROUP BY state;
```

</details>

3. **Keyset page** — Write the query that returns the next 25 orders after `(opened = '2026-02-10', order_id = 431)` sorted by `opened, order_id`.
<details><summary>Solution</summary>

```sql
SELECT order_id, file_no, opened FROM orders
WHERE (opened, order_id) > ('2026-02-10', 431)
ORDER BY opened, order_id LIMIT 25;
```

</details>

### Interview Questions

**Q: Walk me through what happens when the database runs a SELECT with a join.**
The parser turns the text into a tree and resolves names against the catalog; the rewriter expands views, flattens subqueries and folds constants; the optimiser enumerates access paths for each table (scan, index seek, index-only), join algorithms (nested loop, hash, merge) and join orders, estimates the cost of each using statistics, and picks the cheapest; the executor runs the plan tree, typically pulling rows through iterators, with blocking operators such as sorts and hash builds materialising their input. The plan cache may skip the first three steps for repeated parameterised statements. I illustrate with a concrete plan, for example an index seek on `orders (state, status)` feeding a nested loop against `agents` by primary key, then a hash aggregate for the `GROUP BY`.

**Q: What is a sargable predicate and why does it matter?**
A predicate the engine can turn into an index seek: a bare column compared with a constant or parameter using `=`, `<`, `>`, `BETWEEN`, `IN` or a prefix `LIKE`. Wrapping the column in a function, casting it, doing arithmetic on it, or using a leading wildcard hides the value the index is ordered by, so the engine must evaluate the expression for every row. The fix is to move the computation to the other side (`opened >= '2026-03-01' AND opened < '2026-04-01'` instead of `strftime(...) = '2026-03'`), to store a computed column and index that, or to use an expression index. In reporting SQL this is the most common cause of a query taking minutes instead of milliseconds.

**Q: How would you optimise a weekly production report that takes twenty minutes?**
Get the actual plan with timings and find where the time goes; it is rarely spread evenly. Typical fixes in order of cheapness: add or adjust an index so the date range and status filters seek, remove non-sargable expressions, replace correlated subqueries with joins to pre-aggregated subqueries, select only needed columns so a covering index applies, and refresh statistics. If the report aggregates the whole history every week, precompute: a materialised view or a summary table maintained incrementally, refreshed nightly, so the report reads thousands of rows instead of millions. I verify each change against production-sized data and keep the before-and-after numbers, because "twenty minutes to nine seconds" is a story interviewers and managers both remember.

## Transactions & ACID

Closing a title order touches several rows: the order's status, a premium ledger entry, an audit row, and the agent's daily count. If the process dies after the second write, the database must not be left half-updated. A **transaction** is the unit of work the DBMS promises to apply completely or not at all, and **ACID** names the four guarantees that promise rests on.

### The four properties

| Property | Guarantee | Mechanism |
|---|---|---|
| **Atomicity** | all of the transaction's writes happen, or none | undo logging, rollback journal or WAL |
| **Consistency** | every committed state satisfies all constraints and triggers | constraint checking at statement or commit time |
| **Isolation** | concurrent transactions do not see each other's partial work | locks or multi-version concurrency (next chapter) |
| **Durability** | once committed, the data survives crashes and power loss | write-ahead log forced to disk before commit acknowledgement |

Consistency here is the database's definition (constraints hold), not the application's; the application must still write a correct transaction.

### Transaction syntax

```sql
BEGIN;                                                    -- START TRANSACTION in MySQL, BEGIN TRAN in SQL Server
UPDATE orders SET status = 'Closed', closed = '2026-03-04' WHERE file_no = 'TX-1001';
INSERT INTO ledger (file_no, amount, kind) VALUES ('TX-1001', 2150.00, 'premium');
INSERT INTO audit (file_no, event) VALUES ('TX-1001', 'closed');
COMMIT;                                                   -- or ROLLBACK
```

Without an explicit `BEGIN`, every statement is its own transaction (**autocommit**). A loop inserting 50,000 report rows in autocommit mode pays a disk sync per row and can take minutes; wrapping the loop in one transaction turns it into seconds, which is the first thing to check when a data load is slow.

### Savepoints

```sql
BEGIN;
INSERT INTO orders (...) VALUES (...);
SAVEPOINT before_ledger;
INSERT INTO ledger (...) VALUES (...);        -- suppose this fails a CHECK
ROLLBACK TO before_ledger;                    -- undo only the ledger insert; the order insert survives
INSERT INTO ledger (...) VALUES (...);        -- corrected
RELEASE before_ledger;
COMMIT;
```

Savepoints give partial rollback inside a transaction. They are how ORMs implement nested "transactions" and how a batch importer skips one bad row without abandoning the whole file.

### What happens at COMMIT

1. The engine checks deferred constraints.
2. Log records describing the changes (and enough to undo them) are appended to the write-ahead log and the log is **fsync**ed to disk. This is the durability point: even if the data pages are still only in memory, the log can replay them after a crash.
3. The client is told "committed".
4. Data pages are written to their final location later, by a background checkpoint.

Durability therefore costs one synchronous disk write per commit, which is why thousands of tiny transactions per second need fast storage or group commit, and why some systems offer relaxed modes (`synchronous_commit = off` in PostgreSQL, `PRAGMA synchronous = NORMAL` in SQLite WAL mode, `innodb_flush_log_at_trx_commit = 2` in MySQL) that trade a few milliseconds of possible loss for throughput.

### Errors inside a transaction

Engines differ, and interviewers know it. In PostgreSQL any error aborts the whole transaction: further statements fail with "current transaction is aborted" until you `ROLLBACK` (or `ROLLBACK TO` a savepoint). In SQLite and MySQL a failed statement is rolled back by itself and the transaction continues. In SQL Server behaviour depends on `XACT_ABORT`: `ON` aborts the transaction on most errors, which is the safer setting. Application code should therefore treat any error as "roll back and retry or report", never "ignore and commit".

### Transaction scope in application code

Keep transactions **short** and **free of user interaction**: begin as late as possible, do the writes, commit immediately. Never hold a transaction open while waiting for LibreOffice, an API call or a human, because every lock it holds blocks other users. Do the slow work first, then open the transaction to record the result. Retry on transient failures (deadlock victim, serialisation failure) with a fresh transaction, since the retry must re-read the data.

```python
# Python sqlite3: the connection is a context manager that commits or rolls back
with sqlite3.connect("titles.db") as con:
    con.execute("UPDATE orders SET status = 'Closed' WHERE file_no = ?", (file_no,))
    con.execute("INSERT INTO audit (file_no, event) VALUES (?, 'closed')", (file_no,))
# exception inside the block -> rollback; normal exit -> commit
```

### Idempotency and exactly-once

A commit acknowledgement can be lost in transit: the database committed, the client saw a timeout and retries, and the order is closed twice or a ledger entry duplicated. Design writes to be idempotent (a `UNIQUE (file_no, kind)` on the ledger, an `idempotency_key` column on requests) so a retry is harmless.

> **Warning:** A transaction guarantees atomicity within one database. A workflow that writes to the database and then sends an email or writes a file cannot be atomic; use an **outbox** table written in the same transaction and a separate worker that sends what it finds there.

### Try It Yourself

```sql
CREATE TABLE orders (file_no TEXT PRIMARY KEY, status TEXT NOT NULL DEFAULT 'Open', premium REAL NOT NULL CHECK (premium >= 0));
CREATE TABLE ledger (id INTEGER PRIMARY KEY, file_no TEXT NOT NULL REFERENCES orders(file_no), amount REAL NOT NULL CHECK (amount > 0), kind TEXT NOT NULL, UNIQUE (file_no, kind));
CREATE TABLE audit (id INTEGER PRIMARY KEY, file_no TEXT NOT NULL, event TEXT NOT NULL);
INSERT INTO orders VALUES ('TX-1001', 'Open', 2150), ('TX-1002', 'Open', 1180);

-- Transaction 1: close TX-1001 atomically
BEGIN;
UPDATE orders SET status = 'Closed' WHERE file_no = 'TX-1001';
INSERT INTO ledger (file_no, amount, kind) VALUES ('TX-1001', 2150, 'premium');
INSERT INTO audit (file_no, event) VALUES ('TX-1001', 'closed');
COMMIT;

-- Transaction 2: a savepoint lets us abandon part of the work
BEGIN;
UPDATE orders SET status = 'Closed' WHERE file_no = 'TX-1002';
SAVEPOINT ledger_step;
INSERT INTO ledger (file_no, amount, kind) VALUES ('TX-1002', 1180, 'premium');
INSERT INTO audit (file_no, event) VALUES ('TX-1002', 'ledger posted (will be undone)');
ROLLBACK TO ledger_step;                 -- undo the ledger + audit rows, keep the status update
INSERT INTO audit (file_no, event) VALUES ('TX-1002', 'closed without ledger');
RELEASE ledger_step;
COMMIT;

-- Transaction 3: rolled back entirely
BEGIN;
UPDATE orders SET premium = 0 WHERE file_no = 'TX-1001';
INSERT INTO audit (file_no, event) VALUES ('TX-1001', 'premium zeroed (rolled back)');
ROLLBACK;

SELECT * FROM orders;
SELECT * FROM ledger;
SELECT * FROM audit;
-- Idempotent retry: the UNIQUE (file_no, kind) makes a duplicate posting fail instead of double-charging.
-- Uncomment to see the constraint error:
-- INSERT INTO ledger (file_no, amount, kind) VALUES ('TX-1001', 2150, 'premium');
```

### Quiz

1. Which ACID property is provided by forcing the write-ahead log to disk before acknowledging COMMIT?
- [ ] Atomicity
- [ ] Isolation
- [x] Durability
> Once the log is on disk the change can be replayed after a crash.

2. What does `ROLLBACK TO savepoint_name` do?
- [x] Undoes work since the savepoint but keeps the transaction open
- [ ] Ends the transaction
- [ ] Commits work up to the savepoint
> Only `COMMIT` or a full `ROLLBACK` ends the transaction.

3. Why is inserting 50,000 rows in autocommit mode slow?
- [ ] Autocommit disables indexes
- [x] Each statement is its own transaction with its own disk sync
- [ ] The rows are inserted twice
> One enclosing transaction reduces 50,000 syncs to one.

4. In PostgreSQL, what happens after a statement errors inside a transaction?
- [ ] The statement is skipped and the transaction continues
- [x] The transaction is aborted until you roll back
- [ ] The transaction commits automatically
> SQLite and MySQL roll back only the failed statement; PostgreSQL aborts the whole transaction.

### Exercises

1. **Batch import** — Sketch pseudocode that imports rows from a CSV in one transaction but uses a savepoint per row so a bad row is skipped and logged.
<details><summary>Solution</summary>

```python
con.execute("BEGIN")
for row in rows:
    con.execute("SAVEPOINT r")
    try:
        con.execute("INSERT INTO orders VALUES (?, ?, ?)", row)
        con.execute("RELEASE r")
    except sqlite3.IntegrityError as e:
        con.execute("ROLLBACK TO r"); con.execute("RELEASE r"); log(row, e)
con.execute("COMMIT")
```

</details>

2. **Outbox** — Write DDL for an `outbox` table that records an email to send in the same transaction as the order close.
<details><summary>Solution</summary>

```sql
CREATE TABLE outbox (
  id INTEGER PRIMARY KEY, created_at TEXT NOT NULL DEFAULT (datetime('now')),
  kind TEXT NOT NULL, payload TEXT NOT NULL, sent_at TEXT
);
-- inside the close transaction:
-- INSERT INTO outbox (kind, payload) VALUES ('order_closed_email', json_object('file_no', 'TX-1001'));
```

</details>

3. **Durability trade-off** — Name the setting in PostgreSQL that makes commits faster at the risk of losing the last few milliseconds of transactions, and say when it is acceptable.
<details><summary>Solution</summary>

```text
synchronous_commit = off  (per session or globally)
Acceptable for bulk loads and non-critical logging where losing the last ~200 ms of commits after a crash is tolerable;
never for financial ledgers or anything the user was told was saved.
```

</details>

### Interview Questions

**Q: Explain ACID with an example from your work.**
Closing a title order updates the order status, posts the premium to a ledger, writes an audit row and increments a daily count. Atomicity means that if the process dies after the ledger insert, the status update is rolled back too, so we never have a closed order without a ledger entry or the reverse. Consistency means the `CHECK (premium >= 0)`, the foreign key from ledger to orders and the unique posting constraint all hold at commit. Isolation means the weekly report running at the same moment either sees the order fully closed or still open, never the halfway state. Durability means that once the client sees "closed", a power cut a millisecond later cannot lose it, because the write-ahead log was flushed before the acknowledgement. I then note the trade-off that durability costs an fsync per commit and how batching mitigates it.

**Q: Where should transaction boundaries be in an application?**
Around the smallest set of writes that must succeed or fail together, opened as late as possible and committed as early as possible, and never spanning user interaction, external API calls or document generation. Slow work happens first with no transaction open; the transaction then records the result. For batch jobs I use one transaction per reasonable chunk (say 1,000 rows) with savepoints per item to skip bad rows, which balances throughput against lock duration and undo size. Retries happen at the transaction level with a fresh read, and writes are designed to be idempotent so a lost commit acknowledgement cannot duplicate effects.

**Q: What is the difference between a rollback journal and a write-ahead log?**
A rollback journal (SQLite's default, "undo logging") copies the original page to a journal before modifying the database file, so a crash is recovered by copying pages back; readers and the writer contend for the same file, so writes block reads. A write-ahead log ("redo logging", SQLite WAL mode, PostgreSQL, SQL Server, InnoDB) appends the new content to a separate log first, leaves the main file untouched until a checkpoint, and recovers by replaying the log; readers keep reading the main file while a writer appends, giving much better concurrency and sequential write patterns. WAL costs a checkpoint process and slightly more disk, and in SQLite it needs a shared-memory file, so it is not suitable on some network file systems.

## Concurrency control (locks, MVCC, isolation levels)

Twenty agents update production orders while the weekly report reads them and a nightly job posts ledger entries. **Concurrency control** decides what each transaction is allowed to see and change while others are in flight. The theory is about schedules and serialisability; the practice is about isolation levels, locks versus versions, and the anomalies you get when you choose speed over strictness.

### Serialisability

A schedule of interleaved operations is **serialisable** if its result equals some serial execution of the same transactions. The engine cannot run everything serially (throughput would collapse), so it interleaves while guaranteeing, at the strictest level, that the outcome is indistinguishable from serial. **Conflict serialisability** is the checkable version: two operations conflict if they touch the same item and at least one writes; a schedule is conflict-serialisable if the precedence graph of conflicts has no cycle.

### The anomalies

| Anomaly | What happens | Example |
|---|---|---|
| Dirty read | T2 reads a value T1 later rolls back | report counts an order as closed that never closed |
| Non-repeatable read | T1 reads a row twice and sees different values | premium changes between the total and the detail |
| Phantom read | T1 re-runs a query and new rows appear | second count of open TX orders is higher |
| Lost update | T1 and T2 both read, both write; one write vanishes | two agents increment the same daily counter |
| Write skew | T1 and T2 each read a condition and write disjoint rows, jointly breaking an invariant | two examiners each take the last available slot |

### Isolation levels (SQL standard)

| Level | Dirty read | Non-repeatable | Phantom | Typical implementation |
|---|---|---|---|---|
| Read uncommitted | possible | possible | possible | no read locks |
| Read committed | no | possible | possible | short read locks, or read the latest committed version |
| Repeatable read | no | no | possible (standard) | long read locks, or a snapshot |
| Serializable | no | no | no | two-phase locking with range locks, or SSI |

Defaults: PostgreSQL and Oracle use read committed; MySQL InnoDB uses repeatable read (and its snapshot also prevents most phantoms); SQL Server uses read committed with locking unless `READ_COMMITTED_SNAPSHOT` is on; SQLite is effectively serializable because there is one writer at a time. Set per transaction: `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE` (PostgreSQL, SQL Server), `BEGIN ISOLATION LEVEL REPEATABLE READ` (PostgreSQL).

### Lock-based control: two-phase locking

A transaction acquires a **shared** (S) lock to read and an **exclusive** (X) lock to write; S locks are compatible with each other, X locks with nothing. In **strict two-phase locking** a transaction acquires locks as it goes and releases all of them only at commit, which guarantees serialisability but means readers block writers and writers block readers. Lock granularity ranges from row to page to table, with **intent locks** at the coarser levels so the engine can check compatibility cheaply. Locks are why a long report transaction can stall every update in a locking engine.

### Deadlocks

T1 holds order A and wants order B; T2 holds B and wants A. Engines detect the cycle (wait-for graph) or time out, and kill one transaction as the **victim**, which the application must retry. Prevention: touch rows in a consistent order (sort the keys you are about to update), keep transactions short, and avoid escalating from a read to a write on the same row (`SELECT ... FOR UPDATE` takes the X lock up front).

### Multi-version concurrency control (MVCC)

Instead of blocking, keep old versions. Each row carries the transaction id that created it and the one that deleted or replaced it; a transaction reads the version that was committed as of its **snapshot** and never blocks on writers, while writers never block readers. PostgreSQL stores versions in the table (hence `VACUUM` to reclaim dead tuples), InnoDB and Oracle keep them in undo segments, SQL Server in `tempdb` when snapshot isolation is on, SQLite WAL mode lets readers see the pre-write snapshot while one writer proceeds. Writers still conflict with writers: the second one to update the same row waits, then either continues (read committed) or aborts with a serialisation error (repeatable read/serializable).

**Snapshot isolation** prevents dirty, non-repeatable and phantom reads but allows write skew, so it is not full serialisability; PostgreSQL's `SERIALIZABLE` adds predicate tracking (Serializable Snapshot Isolation) to detect it and abort one transaction.

### Practical patterns

```sql
-- Pessimistic: lock the row while deciding
BEGIN;
SELECT status FROM orders WHERE file_no = 'TX-1001' FOR UPDATE;      -- PostgreSQL/MySQL/Oracle; SQL Server: WITH (UPDLOCK)
UPDATE orders SET status = 'Closed' WHERE file_no = 'TX-1001';
COMMIT;

-- Optimistic: no lock, detect a concurrent change with a version column
UPDATE orders SET status = 'Closed', version = version + 1
WHERE file_no = 'TX-1001' AND version = 7;                            -- 0 rows affected -> someone else changed it, reload and retry

-- Atomic increment: let the database do read-modify-write in one statement
UPDATE daily_counts SET closed = closed + 1 WHERE agent_id = 4 AND day = '2026-03-04';
```

Optimistic concurrency suits web forms where a user edits an order for minutes; pessimistic suits short back-end jobs; single-statement updates avoid the lost-update problem entirely.

> **Interview note:** Be ready to explain write skew with a concrete example and to say which isolation level prevents it (only true serializable, such as PostgreSQL's SSI or SQL Server's `SERIALIZABLE` with range locks).

### Try It Yourself

```sql
-- SQLite in the browser has one connection, so we simulate two transactions with a version column and a lock table.
CREATE TABLE orders (file_no TEXT PRIMARY KEY, status TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1);
CREATE TABLE daily_counts (agent_id INTEGER, day TEXT, closed INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (agent_id, day));
CREATE TABLE log (step INTEGER PRIMARY KEY, txn TEXT, action TEXT, result TEXT);
INSERT INTO orders VALUES ('TX-1001', 'Open', 1);
INSERT INTO daily_counts VALUES (4, '2026-03-04', 10);

-- Lost update with read-modify-write: both "transactions" read closed = 10, both write 11
INSERT INTO log (txn, action, result) VALUES ('T1', 'read daily_counts', (SELECT closed FROM daily_counts WHERE agent_id = 4));
INSERT INTO log (txn, action, result) VALUES ('T2', 'read daily_counts', (SELECT closed FROM daily_counts WHERE agent_id = 4));
UPDATE daily_counts SET closed = 10 + 1 WHERE agent_id = 4;     -- T1 writes what it computed
UPDATE daily_counts SET closed = 10 + 1 WHERE agent_id = 4;     -- T2 writes what it computed: one close is lost
INSERT INTO log (txn, action, result) VALUES ('both', 'after two closes (lost update)', (SELECT closed FROM daily_counts WHERE agent_id = 4));

-- Fix 1: atomic increment
UPDATE daily_counts SET closed = closed + 1 WHERE agent_id = 4;
UPDATE daily_counts SET closed = closed + 1 WHERE agent_id = 4;
INSERT INTO log (txn, action, result) VALUES ('both', 'after two atomic increments', (SELECT closed FROM daily_counts WHERE agent_id = 4));

-- Fix 2: optimistic concurrency with a version column
UPDATE orders SET status = 'Closed', version = version + 1 WHERE file_no = 'TX-1001' AND version = 1;   -- T1 wins
INSERT INTO log (txn, action, result) VALUES ('T1', 'optimistic update version=1', changes());
UPDATE orders SET status = 'Cancelled', version = version + 1 WHERE file_no = 'TX-1001' AND version = 1; -- T2 read stale version
INSERT INTO log (txn, action, result) VALUES ('T2', 'optimistic update version=1', changes() || ' rows (stale read, must retry)');

SELECT * FROM log ORDER BY step;
SELECT * FROM orders;
```

### Quiz

1. Which anomaly does READ COMMITTED prevent?
- [x] Dirty reads
- [ ] Phantom reads
- [ ] Write skew
> It only guarantees you never see uncommitted data.

2. Under MVCC, what happens when a reader and a writer touch the same row?
- [ ] The reader waits for the writer to commit
- [x] The reader sees the last committed version and does not block
- [ ] The writer is aborted
> Readers never block writers and vice versa; writers still conflict with writers.

3. What is write skew?
- [ ] Two transactions updating the same row
- [x] Two transactions reading overlapping data and writing disjoint rows that together break an invariant
- [ ] A disk write failing
> Snapshot isolation allows it; only true serializable isolation prevents it.

4. Which technique detects a concurrent edit without holding a lock?
- [ ] `SELECT ... FOR UPDATE`
- [x] A version column checked in the `WHERE` clause of the `UPDATE`
- [ ] Table locks
> Zero rows affected means the row changed since it was read.

### Exercises

1. **Deadlock avoidance** — Two jobs each update orders `A` and `B`. Show how to order the updates so they cannot deadlock.
<details><summary>Solution</summary>

```sql
-- Both jobs update in the same key order (sorted file_no), so neither can hold B while waiting for A.
BEGIN;
UPDATE orders SET status = 'Closed' WHERE file_no = 'A';
UPDATE orders SET status = 'Closed' WHERE file_no = 'B';
COMMIT;
```

</details>

2. **Choose an isolation level** — A month-end report must total premiums and then list them by state, and the two numbers must agree. Which level and why?
<details><summary>Solution</summary>

```text
REPEATABLE READ (or a snapshot / SERIALIZABLE) so both queries read the same snapshot;
under READ COMMITTED an order closed between the two queries makes the detail disagree with the total.
```

</details>

3. **Write skew example** — Describe a scenario in the title-production system where two transactions under snapshot isolation break a rule, and the fix.
<details><summary>Solution</summary>

```text
Rule: at least one examiner must be "on duty" per state. Examiners E1 and E2 (both TX) each check
"count on duty for TX >= 2" (true), then each sets themselves off duty. Both commit; TX has nobody.
Fix: SERIALIZABLE isolation (PostgreSQL SSI aborts one), or SELECT ... FOR UPDATE on the state row to serialise the check.
```

</details>

### Interview Questions

**Q: Compare lock-based concurrency control with MVCC.**
Two-phase locking makes transactions take shared locks to read and exclusive locks to write and hold them until commit, which is simple and gives serialisability but makes readers and writers block each other, so a long report stalls updates and vice versa. MVCC keeps multiple versions of each row and gives each transaction a consistent snapshot, so readers never block writers; the costs are storage for old versions, a cleanup process (PostgreSQL's VACUUM, InnoDB purge), and the subtlety that snapshot isolation is not fully serialisable because of write skew. Most modern engines are MVCC for reads with locks for write-write conflicts. In a reporting-heavy system like production tracking, MVCC is the practical choice, and I would still keep write transactions short.

**Q: Which isolation level would you use for a system that updates order status and produces reports, and why?**
Read committed (the PostgreSQL default) for the routine status updates, because they are single-row and idempotent by design, plus optimistic versioning on the edit form to catch two agents editing the same order. Repeatable read or a snapshot for the reports so totals and details agree. Serializable only for the few operations with cross-row invariants, such as assigning the last available examiner slot, accepting that the application must retry serialisation failures. Choosing one level globally is the usual mistake: serializable everywhere costs throughput and retries; read committed everywhere produces reports that do not add up.

**Q: How do you handle a deadlock in production?**
First accept that in a locking engine deadlocks are a normal outcome rather than a bug, so every write transaction has retry logic for the deadlock-victim error (SQL Server 1205, PostgreSQL 40P01, MySQL 1213) with a small random backoff. Then reduce their frequency: order updates consistently by key, keep transactions short and free of external calls, take the strongest lock needed up front with `SELECT ... FOR UPDATE` rather than upgrading from shared to exclusive, and index foreign keys so the engine locks rows, not scans. I read the deadlock graph the engine logs (SQL Server's XML graph, PostgreSQL's `DETAIL` line) to find the two statements involved, which usually points at one job touching rows in the reverse order of another.

## Recovery & logging

The power fails while a batch of 300 status updates is half-written. When the server restarts, the database must come back in a state that contains every committed transaction and none of the uncommitted ones. **Recovery** is the machinery that makes this possible, and it rests almost entirely on the **log**.

### Failure classes

- **Transaction failure**: a constraint violation or a deadlock abort; undo just that transaction.
- **System crash**: process or OS dies, memory is lost, disk survives; replay the log.
- **Media failure**: the disk is destroyed; restore from backup and roll forward with archived logs.

### The buffer pool and the two rules

Data pages live in a memory cache (the buffer pool) and are written to disk lazily. Two policies define what recovery must handle. **Steal**: a dirty page belonging to an uncommitted transaction may be written to disk (frees memory, requires undo). **No-force**: a committed transaction's pages need not be on disk at commit (fast commits, requires redo). Practical engines are steal/no-force, so they need both undo and redo information, which is exactly what the write-ahead log provides.

### Write-ahead logging (WAL)

The **WAL rule**: before a data page is written to disk, every log record describing changes to that page must already be on disk; and before a commit is acknowledged, all of the transaction's log records (including the commit record) must be on disk. Log records are appended sequentially, so commits cost one sequential write and one fsync instead of scattered random page writes.

```text
LSN  Txn  Record
100  T1   BEGIN
101  T1   UPDATE orders page 7, row 3: status Open -> Closed        (before image / after image)
102  T2   BEGIN
103  T2   INSERT ledger page 12, row 9: (TX-1002, 1180)
104  T1   COMMIT
105  T2   UPDATE daily_counts page 2, row 4: 10 -> 11
--- crash ---
```

Each record has a **log sequence number** (LSN); each data page stores the LSN of the last record applied to it (`pageLSN`), so recovery can tell whether a change is already on the page.

### ARIES-style recovery

The standard algorithm (ARIES, used in essentially this form by DB2, SQL Server and, in spirit, by PostgreSQL and InnoDB) has three passes:

1. **Analysis**: scan the log from the last checkpoint to find which transactions were active at the crash and which pages were dirty.
2. **Redo**: replay every logged change whose LSN is greater than the page's `pageLSN`, for committed and uncommitted transactions alike, reconstructing the exact pre-crash state ("repeating history").
3. **Undo**: walk backwards through the records of transactions that never committed (T2 above) and reverse them, writing **compensation log records** so that a crash during recovery is itself recoverable.

After the passes, T1's close is present and T2's ledger insert and counter increment are gone.

### Checkpoints

Without checkpoints the log grows forever and recovery replays everything since installation. A **checkpoint** writes dirty pages to disk (or at least records which ones are dirty and which transactions are active) and notes its position in the log, so recovery can start there. Fuzzy checkpoints run concurrently with normal work. In SQLite WAL mode `PRAGMA wal_checkpoint(TRUNCATE)` copies WAL pages back into the main file; PostgreSQL runs checkpoints every `checkpoint_timeout` (5 minutes by default) or when `max_wal_size` is reached; SQL Server has automatic and indirect checkpoints.

### Durability settings and what they risk

| Engine | Setting | Effect |
|---|---|---|
| SQLite | `PRAGMA synchronous = FULL / NORMAL / OFF` | NORMAL in WAL mode is durable across app crashes but may lose the last transactions on power loss |
| PostgreSQL | `synchronous_commit = on / off` | off returns before the WAL flush; up to `wal_writer_delay` × 3 of commits can be lost |
| MySQL InnoDB | `innodb_flush_log_at_trx_commit = 1 / 2 / 0` | 1 flushes per commit; 2 flushes per second |
| SQL Server | delayed durability | `COMMIT WITH (DELAYED_DURABILITY = ON)` |

`fsync` itself can lie when consumer SSDs or virtualised disks have write caches that ignore flush requests; production databases run on storage with battery-backed caches or verified flush semantics.

### Media recovery: backups plus log archiving

A full backup restores the database to the moment the backup was taken; **archived log** (PostgreSQL WAL archiving, SQL Server transaction-log backups, MySQL binary logs) lets you roll forward to any later instant. **Point-in-time recovery** (PITR) stops the replay just before the `DELETE FROM orders` that someone ran without a `WHERE`. The Expert level's security chapter covers backup strategy; the engine-level fact to remember is that log retention determines how far forward you can recover.

### Logical versus physical logging

Physical log records store page bytes before and after; logical records store the operation ("insert row X into table Y"). Physical logging is simpler to redo idempotently; logical logging is smaller and is what replication streams (PostgreSQL logical decoding, MySQL row-based binlog) and change-data-capture tools consume.

> **Warning:** Copying a live database file with the operating system while the engine is running produces a torn, unrecoverable copy unless the engine's backup API is used (`sqlite3 .backup`, `pg_basebackup`, SQL Server `BACKUP DATABASE`). A "backup" that was never test-restored is not a backup.

### Try It Yourself

```sql
-- A miniature write-ahead log with redo/undo recovery, simulated entirely in SQL.
CREATE TABLE pages (page_id INTEGER PRIMARY KEY, contents TEXT NOT NULL, page_lsn INTEGER NOT NULL DEFAULT 0);   -- "disk"
CREATE TABLE wal (lsn INTEGER PRIMARY KEY, txn TEXT NOT NULL, kind TEXT NOT NULL, page_id INTEGER, before TEXT, after TEXT);
INSERT INTO pages (page_id, contents) VALUES (7, 'TX-1001:Open'), (12, '(empty)'), (2, 'agent4:10');

-- Log records written before the crash (WAL rule: log first, data pages later)
INSERT INTO wal VALUES (100, 'T1', 'BEGIN',  NULL, NULL, NULL);
INSERT INTO wal VALUES (101, 'T1', 'UPDATE', 7,  'TX-1001:Open', 'TX-1001:Closed');
INSERT INTO wal VALUES (102, 'T2', 'BEGIN',  NULL, NULL, NULL);
INSERT INTO wal VALUES (103, 'T2', 'UPDATE', 12, '(empty)', 'TX-1002:1180');
INSERT INTO wal VALUES (104, 'T1', 'COMMIT', NULL, NULL, NULL);
INSERT INTO wal VALUES (105, 'T2', 'UPDATE', 2,  'agent4:10', 'agent4:11');
-- Steal policy: page 2 happened to be flushed before the crash, with T2's uncommitted change on it
UPDATE pages SET contents = 'agent4:11', page_lsn = 105 WHERE page_id = 2;

SELECT 'before recovery' AS phase, * FROM pages;

-- Pass 1, analysis: which transactions never committed?
CREATE TEMP TABLE losers AS
SELECT DISTINCT txn FROM wal WHERE txn NOT IN (SELECT txn FROM wal WHERE kind = 'COMMIT');

-- Pass 2, redo: repeat history for every update whose LSN is newer than the page
UPDATE pages SET contents = (SELECT after FROM wal w WHERE w.page_id = pages.page_id AND w.kind = 'UPDATE' ORDER BY lsn DESC LIMIT 1),
                 page_lsn = (SELECT MAX(lsn) FROM wal w WHERE w.page_id = pages.page_id AND w.kind = 'UPDATE')
WHERE page_id IN (SELECT page_id FROM wal w WHERE w.kind = 'UPDATE' AND w.lsn > pages.page_lsn);
SELECT 'after redo' AS phase, * FROM pages;

-- Pass 3, undo: reverse the losers' updates in reverse LSN order, writing compensation records
INSERT INTO wal (lsn, txn, kind, page_id, before, after)
SELECT 200 + row_number() OVER (ORDER BY lsn DESC), txn, 'CLR', page_id, after, before
FROM wal WHERE kind = 'UPDATE' AND txn IN (SELECT txn FROM losers);
UPDATE pages SET contents = (SELECT after FROM wal w WHERE w.page_id = pages.page_id AND w.kind = 'CLR' ORDER BY lsn DESC LIMIT 1),
                 page_lsn = (SELECT MAX(lsn) FROM wal w WHERE w.page_id = pages.page_id AND w.kind = 'CLR')
WHERE page_id IN (SELECT page_id FROM wal WHERE kind = 'CLR');
INSERT INTO wal SELECT MAX(lsn) + 1, txn, 'END', NULL, NULL, NULL FROM wal WHERE txn IN (SELECT txn FROM losers) GROUP BY txn;

SELECT 'after undo' AS phase, * FROM pages;
SELECT * FROM wal ORDER BY lsn;
```

### Quiz

1. What does the write-ahead rule require?
- [x] Log records reach disk before the data pages they describe, and before commit is acknowledged
- [ ] Data pages are written before the log
- [ ] The log is only written at checkpoints
> Without it a crash could leave a modified page with no record of how to undo or redo it.

2. Why does ARIES redo changes of uncommitted transactions too?
- [ ] To speed up recovery
- [x] To reconstruct the exact pre-crash state so undo can be applied correctly
- [ ] It does not; uncommitted changes are skipped
> "Repeating history" makes undo simple and correct even for partially flushed pages.

3. What is the purpose of a checkpoint?
- [ ] To back up the database
- [x] To bound how much log must be replayed after a crash
- [ ] To commit all open transactions
> It records a known-good starting point for recovery and lets old log be recycled.

4. What does `synchronous_commit = off` risk in PostgreSQL?
- [x] Losing the last few hundred milliseconds of committed transactions after a crash
- [ ] Corrupting the database
- [ ] Losing all uncommitted data
> The database stays consistent; only recently acknowledged commits may vanish.

### Exercises

1. **Trace recovery** — Given log records: T1 BEGIN, T1 write A, T2 BEGIN, T2 write B, T1 COMMIT, crash. State what redo and undo do to A and B.
<details><summary>Solution</summary>

```text
Redo: reapply T1's write to A and T2's write to B if the pages are older than those records.
Undo: T2 never committed, so B is restored to its before-image with a compensation record; A keeps T1's committed value.
```

</details>

2. **SQLite checkpoint** — Write the PRAGMA statements to enable WAL mode and force a full checkpoint.
<details><summary>Solution</summary>

```sql
PRAGMA journal_mode = WAL;
PRAGMA wal_checkpoint(TRUNCATE);
```

</details>

3. **Point-in-time recovery plan** — Someone ran `DELETE FROM orders` at 14:32 without a WHERE. Outline the PostgreSQL recovery steps.
<details><summary>Solution</summary>

```text
1. Stop writes; keep the current WAL files.
2. Restore the latest base backup (pg_basebackup) to a new data directory.
3. Configure recovery_target_time = '2026-03-04 14:31:50' with restore_command pointing at the WAL archive.
4. Start PostgreSQL; it replays WAL up to the target, then pauses/promotes.
5. Export the orders table from the recovered instance and reload it into production (or switch over).
```

</details>

### Interview Questions

**Q: How does a database guarantee durability without writing every data page at commit?**
It writes the log instead. Every change is first described in a sequential write-ahead log record, and at commit the log up to the commit record is forced to stable storage; the data pages stay dirty in the buffer pool and are flushed later by checkpoints. If the system crashes, recovery replays the log from the last checkpoint so committed changes reach their pages, and undoes the changes of transactions that had no commit record. This turns many random page writes into one sequential append plus an fsync per commit, which is what makes thousands of commits per second possible, and it is why the log must be on reliable storage that honours flushes.

**Q: Explain the ARIES recovery phases.**
Analysis reads the log from the last checkpoint forward to rebuild the transaction table (which transactions were active and their last LSN) and the dirty page table. Redo starts at the earliest LSN that could have dirtied a page and reapplies every update whose LSN is greater than the page's stored LSN, regardless of whether its transaction committed, restoring the exact state at the crash. Undo then rolls back the transactions with no commit record, newest record first, writing compensation log records so that if recovery itself crashes, the undo already done is not repeated. The elegance is that redo is idempotent thanks to page LSNs and undo is restartable thanks to CLRs. I mention that PostgreSQL differs by never needing undo, because MVCC leaves aborted tuples in place and simply treats them as invisible.

**Q: What is the difference between a backup and log archiving, and why do you need both?**
A backup is a copy of the database at one instant; alone it lets you recover to that instant and lose everything after. Log archiving continuously preserves the write-ahead log, so from a backup you can roll forward through every committed transaction up to the crash, or stop at any chosen moment before a destructive mistake. Backups without logs lose a day; logs without a backup cannot be applied to anything. The retention of each defines the recovery point objective, and the size of both plus restore speed defines the recovery time objective, which is why I test restores on a schedule rather than trusting that the files exist.

# LEVEL: Expert

## Distributed databases & CAP

One server holds all production orders until it cannot: the disk fills, the CPU saturates, or the business needs the data to survive a data-centre outage. **Distributed databases** spread data across machines through replication and partitioning, and in doing so trade away guarantees that a single node gives for free. The CAP theorem and its refinements are the vocabulary for those trade-offs.

### Replication

**Replication** keeps copies of the same data on several nodes for availability and read scaling.

- **Single-leader** (primary/replica): all writes go to the leader, which streams its log to followers. PostgreSQL streaming replication, MySQL replicas, SQL Server Always On availability groups. Simple; the leader is a write bottleneck and a failover point.
- **Multi-leader**: several nodes accept writes and exchange changes; needed for multi-region writes and offline clients. Requires conflict resolution (last-writer-wins, merge functions, CRDTs).
- **Leaderless** (Dynamo-style: Cassandra, Riak, DynamoDB): any node accepts writes; clients write to W replicas and read from R, and with W + R > N (quorum) a read overlaps the latest write.

**Synchronous** replication waits for a follower to acknowledge before committing, guaranteeing no data loss on failover at the cost of latency; **asynchronous** replication commits locally and streams later, so a failover can lose the last few seconds. Most deployments use one synchronous follower plus asynchronous others.

### Replication lag and read-your-writes

With asynchronous replicas, an agent who closes an order and immediately opens the report served by a replica may see it still open. Techniques: route a user's reads to the leader for a short window after their write, pass the leader's LSN with the request and wait until the replica has replayed it, or use monotonic reads (always the same replica per user).

### Partitioning (sharding)

**Partitioning** splits a large table across nodes so each holds a subset. **Range** partitioning by key (orders opened in 2025 on one node, 2026 on another) keeps ranges together but risks hot spots; **hash** partitioning spreads load evenly but destroys range locality; **consistent hashing** with virtual nodes lets you add machines while moving only a fraction of keys. Secondary indexes become either local (query all shards, "scatter-gather") or global (a second partitioned index that must be updated across shards). Cross-shard joins and transactions are expensive, so the partition key should be the one most queries filter on, for example `state` or `customer_id`, never something with only a few values.

### Distributed transactions

**Two-phase commit** (2PC): a coordinator asks every participant to prepare (write the transaction to their logs and promise to commit), and only if all vote yes sends commit. It gives atomicity across nodes but blocks if the coordinator dies after participants prepared. XA and SQL Server's MSDTC implement it. Modern systems prefer to avoid it: design so each transaction touches one shard, use idempotent sagas with compensating actions for cross-service workflows, or use a database with built-in distributed transactions (Spanner, CockroachDB, YugabyteDB) that combine 2PC with consensus-replicated logs.

### Consensus

Choosing a leader, or agreeing on the order of log entries, in the presence of failures requires a **consensus** protocol: Paxos or Raft. Raft elects a leader by majority vote; the leader appends entries to a replicated log and considers them committed when a majority acknowledge. etcd, CockroachDB, TiKV and Kafka's KRaft use Raft. Consensus needs a majority (3 of 5 nodes), tolerates minority failures, and cannot progress during a partition on the minority side.

### CAP and PACELC

CAP says a distributed system experiencing a **network partition** must choose between **consistency** (every read sees the latest write, linearisability) and **availability** (every request gets a non-error response). Partitions are not optional, so the real choice is CP (refuse or delay requests on the minority side: ZooKeeper, etcd, HBase, Spanner) or AP (serve possibly stale data: Cassandra, DynamoDB in eventually consistent mode, CouchDB). **PACELC** adds: even without a partition (Else), a system chooses between latency and consistency, which describes synchronous versus asynchronous replication.

| System | During partition | Normally | Consistency model |
|---|---|---|---|
| PostgreSQL with sync replica | CP | latency | linearisable on leader |
| Cassandra (QUORUM) | tunable | latency | eventual, per-request tunable |
| DynamoDB | AP default, CP option | latency | eventual or strongly consistent reads |
| Spanner / CockroachDB | CP | consistency | external consistency / serialisable |
| MongoDB replica set | CP (majority writes) | tunable | causal sessions available |

### Consistency models, briefly

**Linearisability**: operations appear instantaneous in a single global order. **Sequential consistency**: a global order consistent with each client's order, not necessarily real time. **Causal consistency**: operations that depend on each other are seen in order everywhere. **Eventual consistency**: replicas converge if writes stop. Stronger models cost coordination and latency; the application decides what it needs per operation, not globally.

> **Interview note:** Interviewers rarely want the CAP triangle recited. They want "which of these would you pick for X and why", with the honest observation that a well-run single PostgreSQL with replicas handles most businesses, and that sharding is a decision to postpone until measurements demand it.

### Try It Yourself

```sql
-- Sharding by hash of the partition key, quorum reads, and replication lag, simulated in one SQLite database.
CREATE TABLE orders_shard0 (file_no TEXT PRIMARY KEY, state TEXT, status TEXT);
CREATE TABLE orders_shard1 (file_no TEXT PRIMARY KEY, state TEXT, status TEXT);
CREATE TABLE orders_shard2 (file_no TEXT PRIMARY KEY, state TEXT, status TEXT);
CREATE TABLE incoming (file_no TEXT, state TEXT, status TEXT);
INSERT INTO incoming VALUES ('TX-1001','TX','Open'),('TX-1002','TX','Closed'),('WY-2001','WY','Open'),('FL-3001','FL','Open'),('CA-4001','CA','Closed'),('TX-1003','TX','Open'),('WY-2002','WY','Closed');
-- A cheap deterministic hash: sum of character codes modulo the shard count
CREATE VIEW routed AS
SELECT file_no, state, status,
  (unicode(substr(file_no,1,1)) + unicode(substr(file_no,2,1)) * 3 + CAST(substr(file_no,4) AS INTEGER) * 7) % 3 AS shard
FROM incoming;
INSERT INTO orders_shard0 SELECT file_no, state, status FROM routed WHERE shard = 0;
INSERT INTO orders_shard1 SELECT file_no, state, status FROM routed WHERE shard = 1;
INSERT INTO orders_shard2 SELECT file_no, state, status FROM routed WHERE shard = 2;
SELECT shard, COUNT(*) AS rows_on_shard, GROUP_CONCAT(file_no) AS keys FROM routed GROUP BY shard;

-- A query on the partition key hits one shard; a query on another column is scatter-gather across all shards
SELECT file_no, shard AS routed_to FROM routed WHERE file_no = 'WY-2001';           -- the router computes the shard from the key
SELECT 'single-shard lookup' AS kind, * FROM orders_shard0 WHERE file_no = 'WY-2001';
SELECT 'scatter-gather' AS kind, * FROM (SELECT * FROM orders_shard0 UNION ALL SELECT * FROM orders_shard1 UNION ALL SELECT * FROM orders_shard2) WHERE status = 'Open';

-- Leaderless quorum: N = 3 replicas, versions per replica; W = 2 and R = 2 overlap so a read sees the latest write
CREATE TABLE replica (node TEXT, file_no TEXT, status TEXT, version INTEGER, PRIMARY KEY (node, file_no));
INSERT INTO replica VALUES ('n1','TX-1001','Open',1),('n2','TX-1001','Open',1),('n3','TX-1001','Open',1);
UPDATE replica SET status = 'Closed', version = 2 WHERE file_no = 'TX-1001' AND node IN ('n1','n2');   -- write acknowledged by W = 2
SELECT 'R=2 read from n2,n3' AS read, status, version FROM replica WHERE file_no = 'TX-1001' AND node IN ('n2','n3') ORDER BY version DESC LIMIT 1;
SELECT 'R=1 read from n3 (stale)' AS read, status, version FROM replica WHERE file_no = 'TX-1001' AND node = 'n3';

-- Replication lag: the follower has applied the log only up to LSN 104
CREATE TABLE wal (lsn INTEGER PRIMARY KEY, file_no TEXT, new_status TEXT);
INSERT INTO wal VALUES (103,'FL-3001','Closed'),(104,'TX-1003','Closed'),(105,'WY-2001','Closed');
CREATE TABLE follower_state (applied_lsn INTEGER);
INSERT INTO follower_state VALUES (104);
SELECT w.lsn, w.file_no, w.new_status, CASE WHEN w.lsn <= f.applied_lsn THEN 'visible on replica' ELSE 'not yet replicated (read-your-writes needs the leader)' END AS on_replica
FROM wal w, follower_state f ORDER BY w.lsn;
```

### Quiz

1. In CAP, what does a CP system do during a network partition?
- [x] Refuses or delays some requests rather than return inconsistent data
- [ ] Serves stale data to stay available
- [ ] Shuts down entirely
> Consistency is preserved by sacrificing availability on the side that cannot reach a majority.

2. With N = 3 replicas, which W and R guarantee a read overlaps the latest write?
- [ ] W = 1, R = 1
- [x] W = 2, R = 2
- [ ] W = 1, R = 2
> Quorum requires W + R > N.

3. What is the main weakness of two-phase commit?
- [ ] It cannot guarantee atomicity
- [x] Participants block if the coordinator fails after they prepared
- [ ] It requires all nodes to use the same DBMS
> The prepared participants hold locks and cannot decide alone.

4. Which partitioning scheme spreads load evenly but loses range locality?
- [ ] Range partitioning
- [x] Hash partitioning
- [ ] List partitioning
> Hashing scatters adjacent keys across shards.

### Exercises

1. **Choose a partition key** — The orders table is queried by `file_no` (lookups), by `state` (reports) and by `customer_id` (portal). Pick a shard key and explain the trade-off.
<details><summary>Solution</summary>

```text
Shard by customer_id (hash): portal queries and most writes are per customer, so they hit one shard;
state reports become scatter-gather, acceptable for periodic reports; file_no lookups need a
global lookup index (file_no -> customer_id) or an encoded customer prefix in the file number.
```

</details>

2. **Read-your-writes** — Describe two ways to guarantee a user sees their own write when reads go to replicas.
<details><summary>Solution</summary>

```text
1. Route that user's reads to the leader for N seconds after a write (sticky session).
2. Return the commit LSN to the client; replicas serve the read only once they have replayed past it
   (PostgreSQL: compare pg_last_wal_replay_lsn() on the replica).
```

</details>

3. **Raft majority** — A 5-node Raft cluster is partitioned 3 versus 2. Which side keeps accepting writes and why?
<details><summary>Solution</summary>

```text
The 3-node side: it can still form a majority (3 of 5) to elect a leader and commit entries.
The 2-node side cannot reach a majority, so its leader (if any) steps down and it rejects writes.
```

</details>

### Interview Questions

**Q: Explain CAP and how you would apply it to a title-production system.**
Under a network partition a distributed store must choose between returning consistent data and returning any data at all. Order status, premium ledger and closing documents need consistency: an agent must not close an order twice or see a stale status, so those live in a CP configuration, in practice a PostgreSQL primary with a synchronous replica where a partition means brief unavailability rather than divergence. Dashboards, search indexes and notification feeds tolerate staleness, so they can be served from asynchronous replicas or an AP cache. I add the PACELC point: even without partitions, synchronous replication costs latency, so I choose per data class rather than picking one label for the whole system.

**Q: How would you scale a relational database that is running out of capacity?**
In order of cost: tune queries and indexes (usually the real problem); add read replicas and move reports and dashboards to them, handling replication lag with read-your-writes routing; add caching for hot read paths; move cold history to partitioned or archived tables; scale the machine vertically, which today goes surprisingly far; and only then shard, choosing a partition key that keeps most transactions on one shard and accepting scatter-gather for analytics. Sharding is a one-way door that complicates joins, transactions, migrations and backups, so I want measurements showing the earlier steps are exhausted before taking it, and I would consider a distributed SQL engine that shards transparently if the team is small.

**Q: What is replication lag and what problems does it cause?**
The delay between a commit on the leader and its visibility on an asynchronous follower, typically milliseconds but seconds or minutes under load or during large transactions. Problems: a user updates an order and the next page, served by a replica, shows the old value; a report totals a mix of old and new rows across queries; a failover to a lagging replica loses the unreplicated commits. Mitigations are monitoring lag as a metric, routing a user's reads to the leader after their writes or waiting for the replica to reach the write's LSN, using a synchronous replica for the failover candidate, and keeping transactions small so replay does not fall behind.

## NoSQL (document/key-value/column/graph)

"NoSQL" is a family label for databases that drop parts of the relational model, usually the fixed schema, joins or multi-row transactions, to gain flexibility, horizontal scale or a data model closer to the application. Each family suits a shape of data; the interview skill is matching the shape to the store and knowing what you give up.

### Key-value stores

The simplest model: a key maps to an opaque value. Redis, Memcached, DynamoDB (at its core), RocksDB. Operations are get, put, delete, sometimes atomic increments and TTL expiry. Use for sessions, caches, rate-limit counters, feature flags and job queues. Redis adds data structures (lists, sets, sorted sets, streams) that make it a lightweight queue and leaderboard engine. No queries by value, no joins, no transactions across keys (Redis has MULTI for atomic batches on one node).

```text
SET session:8f3a '{"user":"ali","role":"analyst"}' EX 3600
INCR ratelimit:api-key-123:2026-03-04T14
```

### Document stores

Values are structured documents (JSON/BSON) that the database can index and query by field: MongoDB, CouchDB, Firestore, PostgreSQL's `jsonb`, SQLite's JSON functions. The unit of atomicity is the document, so you model an aggregate (an order with its embedded endorsements and status history) as one document and read or write it in one operation.

```js
// MongoDB
db.orders.insertOne({ file_no: "TX-1001", state: "TX", status: "Open", liability: 350000,
  endorsements: [{ code: "T-19", fee: 50 }, { code: "T-36", fee: 75 }],
  history: [{ status: "Open", at: ISODate("2026-03-01") }] });
db.orders.find({ state: "TX", "endorsements.code": "T-19" }, { file_no: 1, liability: 1 });
db.orders.updateOne({ file_no: "TX-1001" }, { $set: { status: "Closed" }, $push: { history: { status: "Closed", at: new Date() } } });
db.orders.aggregate([{ $match: { state: "TX" } }, { $group: { _id: "$status", n: { $sum: 1 }, liability: { $sum: "$liability" } } }]);
```

Embedding versus referencing is the core design decision: embed data that is read with the parent and bounded in size (endorsements); reference data that is shared or unbounded (the agent, an audit log with thousands of entries). Schema-on-read means the application must handle old document shapes or run migrations. MongoDB 4.0+ supports multi-document transactions, at a cost.

### Wide-column stores

Cassandra, HBase, ScyllaDB, Bigtable. Data is organised by a partition key that determines the node, and a clustering key that orders rows within the partition; each row can have its own set of columns. Designed for write-heavy, append-style workloads at massive scale (time series, event logs, IoT), with tunable consistency. The rule is **query-first modelling**: you design one table per query pattern, denormalising as needed, because there are no joins and no ad-hoc secondary access without an index.

```sql
-- Cassandra CQL: one table per access pattern
CREATE TABLE status_events_by_order (file_no text, at timestamp, status text, agent text,
  PRIMARY KEY (file_no, at)) WITH CLUSTERING ORDER BY (at DESC);
SELECT * FROM status_events_by_order WHERE file_no = 'TX-1001' LIMIT 20;
```

### Graph databases

Neo4j, Amazon Neptune, JanusGraph, and graph extensions in SQL Server and PostgreSQL (Apache AGE). Nodes and edges both carry properties; queries traverse relationships. Use when the questions are about paths and connections: chain-of-title ("who conveyed this parcel to whom, across 12 deeds"), fraud rings, org charts, recommendations. Relational databases can express graphs with recursive CTEs, and for shallow, fixed-depth traversals they are fine; graph engines win on deep, variable-length traversals.

```cypher
// Neo4j Cypher: chain of title for a parcel
MATCH (p:Parcel {apn: '123-45-678'})<-[:CONVEYS]-(d:Deed)-[:FROM]->(grantor:Party), (d)-[:TO]->(grantee:Party)
RETURN d.recorded, grantor.name, grantee.name ORDER BY d.recorded;
MATCH path = (a:Party {name: 'Smith'})-[:TO|FROM*1..6]-(b:Party {name: 'Jones'}) RETURN path LIMIT 1;
```

### Search engines and time-series

Elasticsearch/OpenSearch (inverted indexes for full-text and log analytics) and TimescaleDB/InfluxDB (time-partitioned, compressed series) are specialised stores usually fed from the system of record rather than replacing it.

### Choosing

| Need | Fit |
|---|---|
| Transactions across entities, ad-hoc reporting, constraints | Relational |
| Cache, session, counters, queues | Key-value (Redis) |
| Aggregates with flexible, nested shape; rapid iteration | Document |
| Huge write volume, time-ordered, known queries | Wide-column |
| Path and relationship queries | Graph |
| Full-text search, log analytics | Search engine |

Polyglot persistence (PostgreSQL for orders, Redis for sessions, Elasticsearch for document search) is normal; the discipline is a single system of record and clear ownership of each store.

### JSON inside relational engines

PostgreSQL `jsonb` with GIN indexes, SQL Server `JSON_VALUE`/`OPENJSON`, MySQL JSON columns and SQLite's JSON functions let you keep a relational core and add document flexibility for sparse or evolving attributes such as per-state endorsement details, without a second database. `->` returns JSON, `->>` returns text, `json_each` unnests arrays, and `json_extract` paths use `$.key[0]`.

> **Tip:** When a client asks for "a NoSQL database because it scales", ask what the queries are. Most document-shaped workloads under a few hundred gigabytes run beautifully on PostgreSQL with `jsonb`, keeping transactions and reporting intact.

### Try It Yourself

```sql
-- Document, key-value and graph patterns inside SQLite using its JSON functions and recursive CTEs.
CREATE TABLE orders_doc (id INTEGER PRIMARY KEY, doc TEXT NOT NULL CHECK (json_valid(doc)));
INSERT INTO orders_doc (doc) VALUES
 ('{"file_no":"TX-1001","state":"TX","status":"Open","liability":350000,"endorsements":[{"code":"T-19","fee":50},{"code":"T-36","fee":75}],"history":[{"status":"Open","at":"2026-03-01"}]}'),
 ('{"file_no":"TX-1002","state":"TX","status":"Closed","liability":280000,"endorsements":[{"code":"T-19","fee":50}],"history":[{"status":"Open","at":"2026-02-20"},{"status":"Closed","at":"2026-03-02"}]}'),
 ('{"file_no":"WY-2001","state":"WY","status":"Open","liability":410000,"endorsements":[],"history":[{"status":"Open","at":"2026-03-03"}]}');
-- Query by field, project fields, index an extracted path
CREATE INDEX idx_doc_state ON orders_doc (json_extract(doc, '$.state'));
SELECT doc ->> '$.file_no' AS file_no, doc ->> '$.status' AS status, doc ->> '$.liability' AS liability
FROM orders_doc WHERE doc ->> '$.state' = 'TX';
-- Unnest the embedded array (like MongoDB $unwind) and aggregate
SELECT o.doc ->> '$.file_no' AS file_no, e.value ->> '$.code' AS code, e.value ->> '$.fee' AS fee
FROM orders_doc o, json_each(o.doc, '$.endorsements') e;
SELECT doc ->> '$.state' AS state, COUNT(*) AS n, SUM(doc ->> '$.liability') AS liability FROM orders_doc GROUP BY 1;
-- Update inside the document ($set + $push)
UPDATE orders_doc SET doc = json_set(doc, '$.status', 'Closed', '$.history[#]', json('{"status":"Closed","at":"2026-03-05"}'))
WHERE doc ->> '$.file_no' = 'TX-1001';
SELECT doc ->> '$.file_no' AS file_no, json_array_length(doc, '$.history') AS history_len, doc -> '$.history' AS history FROM orders_doc;

-- Key-value with TTL
CREATE TABLE kv (k TEXT PRIMARY KEY, v TEXT NOT NULL, expires_at TEXT);
INSERT INTO kv VALUES ('session:8f3a', '{"user":"ali"}', datetime('now', '+1 hour')), ('session:old', '{"user":"x"}', datetime('now', '-1 minute'));
SELECT k, v FROM kv WHERE expires_at IS NULL OR expires_at > datetime('now');

-- Graph: chain of title as edges, traversed with a recursive CTE
CREATE TABLE conveyance (deed_id INTEGER PRIMARY KEY, grantor TEXT, grantee TEXT, recorded TEXT);
INSERT INTO conveyance VALUES (1,'State of Texas','Alvarez','1952-04-01'),(2,'Alvarez','Baker Trust','1978-09-12'),(3,'Baker Trust','Chen','2004-06-30'),(4,'Chen','Dunn LLC','2019-11-05');
WITH RECURSIVE chain(step, owner, via_deed, recorded) AS (
  SELECT 0, 'Dunn LLC', NULL, NULL
  UNION ALL
  SELECT step + 1, c.grantor, c.deed_id, c.recorded FROM conveyance c JOIN chain ON c.grantee = chain.owner
)
SELECT step, owner, via_deed, recorded FROM chain ORDER BY step;
```

### Quiz

1. Which NoSQL family fits "who conveyed this parcel to whom over the last 70 years" best?
- [ ] Key-value
- [ ] Wide-column
- [x] Graph
> Variable-length path traversal is the graph database's core operation.

2. What is the unit of atomicity in a classic document store?
- [x] A single document
- [ ] A collection
- [ ] The whole database
> Embed the data that must change together; multi-document transactions are a newer, costlier addition.

3. In Cassandra, how do you support a new query pattern?
- [ ] Add a join
- [x] Create another table (or materialised view) keyed for that query
- [ ] Add a WHERE clause on any column
> Wide-column stores are modelled query-first with denormalised tables.

4. What does `doc ->> '$.state'` return in SQLite or PostgreSQL?
- [ ] A JSON object
- [x] The value as text
- [ ] A boolean
> `->` returns JSON; `->>` returns the SQL text value, which is what you compare and index.

### Exercises

1. **Embed or reference** — For an order document, decide for each: endorsements (2 to 5 per order), audit events (thousands), the responsible agent (shared by many orders).
<details><summary>Solution</summary>

```text
Endorsements: embed (small, bounded, read with the order).
Audit events: reference (unbounded growth would bloat the document; store in their own collection keyed by file_no).
Agent: reference by id, optionally embed a denormalised name for display and accept updating it on rename.
```

</details>

2. **Redis rate limit** — Write the Redis commands to allow 100 requests per API key per minute.
<details><summary>Solution</summary>

```text
INCR ratelimit:key123:202603041432
EXPIRE ratelimit:key123:202603041432 60     (only when INCR returned 1)
-- reject when the INCR result exceeds 100
```

</details>

3. **JSON index in PostgreSQL** — Write the DDL for a `jsonb` column with a GIN index and a query that uses containment.
<details><summary>Solution</summary>

```sql
CREATE TABLE orders_doc (id serial PRIMARY KEY, doc jsonb NOT NULL);
CREATE INDEX idx_orders_doc ON orders_doc USING gin (doc jsonb_path_ops);
SELECT doc->>'file_no' FROM orders_doc WHERE doc @> '{"state": "TX", "status": "Open"}';
```

</details>

### Interview Questions

**Q: When would you choose a document database over a relational one?**
When the data is naturally an aggregate that is read and written as a unit, its shape varies per record or evolves quickly, and cross-aggregate transactions and ad-hoc reporting are secondary: product catalogues, user profiles, content, form submissions with different field sets per template. I would not choose it for a title-production ledger, where constraints, multi-row transactions and reporting across entities are the core, though I might store the per-order intake form as `jsonb` inside PostgreSQL to get both. The honest framing is that document stores trade integrity guarantees and query flexibility for development speed and horizontal scale, and that PostgreSQL's `jsonb` covers a large share of document use cases without a second system.

**Q: How do you model data in a wide-column store like Cassandra?**
Start from the queries, not the entities. For each access pattern, design a table whose partition key is exactly what the query filters on, so a read touches one partition, and whose clustering columns give the sort order the query needs; duplicate data across tables freely because storage is cheap and writes are fast, and keep partitions bounded (bucket time series by day or month) so no partition grows without limit. Updates that affect several tables are done by the application or batch statements, accepting eventual consistency between them. The anti-patterns are trying to join, filtering on non-key columns with ALLOW FILTERING, and unbounded partitions.

**Q: What are the trade-offs of polyglot persistence?**
It lets each workload use the best-fit store: PostgreSQL for transactions, Redis for sessions and queues, Elasticsearch for search, perhaps a graph store for chain-of-title analysis. The costs are operational (each store needs backups, monitoring, upgrades and expertise), consistency (data copied between stores is eventually consistent, so search results can lag the source of truth), and complexity in the application (multiple clients, no cross-store transactions). I mitigate by keeping one system of record, feeding the others through change data capture or an outbox so they can be rebuilt from it, and by resisting a new store until a measured need exists.

## Data warehousing & star schema (Power BI models)

The production database is designed for writes: normalised, many narrow tables, current state. A **data warehouse** is designed for questions: "premium by state by month by product, compared with last year", "average turnaround by examiner", "open files by age bucket". Those questions want wide, denormalised, history-preserving structures, and the **star schema** is the standard shape. Power BI, Tableau and every OLAP engine are built around it.

### OLTP versus OLAP

| | OLTP (operational) | OLAP (analytical) |
|---|---|---|
| Typical query | one order by key | aggregate millions of rows |
| Writes | many small transactions | periodic bulk loads |
| Schema | 3NF, current state | star, history kept |
| Storage | row-oriented, B-trees | columnar, compressed, bitmap/zone maps |
| Examples | PostgreSQL, SQL Server, MySQL | Synapse, BigQuery, Snowflake, Redshift, ClickHouse, Power BI's VertiPaq |

**Columnar storage** stores each column contiguously, so a query summing `premium` reads only that column, and compression on repetitive values (state codes, statuses) is dramatic. VertiPaq, the in-memory engine inside Power BI and Analysis Services, is columnar, which is why a 10-million-row fact table can fit in a few hundred megabytes and filter instantly.

### Facts and dimensions

A **fact table** holds measurements at a declared **grain** (one row per order-status-change, or one row per order per day): numeric measures (premium, liability, days in stage) plus foreign keys to dimensions. A **dimension** describes the context: date, agent, state/county, product, status. Dimensions are wide and descriptive (agent name, team, hire date, office); facts are narrow and long.

```text
              dim_date                       dim_agent
           (date_key, date, month,        (agent_key, agent_id, name,
            quarter, year, is_weekend)     team, office, valid_from, valid_to)
                     \                         /
                      \                       /
                        fact_order_events
                (date_key, agent_key, state_key, product_key, status_key,
                 file_no, premium, liability, days_in_stage, event_count)
                      /                       \
             dim_state (state_key,        dim_product (product_key,
              state, region)               product, policy_type)
```

The star has one join hop from fact to any dimension, which is what makes slicing fast and models understandable. A **snowflake** normalises dimensions further (state to region table); Kimball practice is to keep dimensions flat unless size forces otherwise, and Power BI performs best with a pure star.

### Surrogate keys and slowly changing dimensions

Dimensions get integer **surrogate keys** independent of business keys, so that when an agent moves from the Search team to Examination you can keep history. **Type 1** overwrites (no history); **Type 2** adds a new row with `valid_from`/`valid_to` and a current flag, and facts point at the version that was current at the event. Type 2 is what makes "premium by team as it was at the time" answerable.

### Fact table types

- **Transaction fact**: one row per event (status change, endorsement added). Additive measures, unbounded growth.
- **Periodic snapshot**: one row per order per day or week, with state at that instant (open, days open, stage). Perfect for "open files trend" and the weekly status report; semi-additive measures (balances) must not be summed across time.
- **Accumulating snapshot**: one row per order with milestone dates (opened, search complete, examined, closed) updated as they occur; ideal for turnaround analysis.

### The date dimension

Every model needs one: a row per calendar day with year, quarter, month, week, fiscal period, weekday flag and holiday flag. It enables period comparisons and is what Power BI's time-intelligence DAX (`TOTALYTD`, `SAMEPERIODLASTYEAR`, `DATEADD`) requires, marked as the date table.

### ETL / ELT

Loading follows extract, transform, load: pull from the operational system (full or incremental by `updated_at` or change data capture), conform keys, look up or insert dimension rows, then insert facts. Modern warehouses often load raw first and transform in SQL (ELT) with tools like dbt. Power Query is Power BI's transformation layer; a large model should push transformations upstream into views or a warehouse so refreshes stay fast and **query folding** (Power Query translating steps back into source SQL) is preserved.

### Power BI modelling rules

1. One fact table per grain; do not merge different grains into one table.
2. Single-direction one-to-many relationships from dimension to fact; avoid many-to-many and bidirectional filters unless necessary.
3. Hide surrogate keys, create measures in DAX (`Total Premium = SUM(fact[premium])`) rather than calculated columns where possible.
4. Import mode for speed; DirectQuery only when data must be live or is too large; composite models and aggregations for the middle.
5. Use a star even when the source is one flat export: split out dimensions so slicers are small and relationships are clean.

> **Interview note:** Be ready to define grain in one sentence and to explain why a Type 2 dimension exists. "One row per order per status change, and agents are Type 2 so team moves do not rewrite history" is the kind of answer that ends the question.

### Try It Yourself

```sql
-- A star schema for title production with a generated date dimension, a Type 2 agent dimension and a transaction fact.
CREATE TABLE dim_date (date_key INTEGER PRIMARY KEY, date TEXT NOT NULL, year INTEGER, quarter INTEGER, month INTEGER, month_name TEXT, weekday INTEGER, is_weekend INTEGER);
WITH RECURSIVE d(dt) AS (SELECT '2026-01-01' UNION ALL SELECT date(dt, '+1 day') FROM d WHERE dt < '2026-03-31')
INSERT INTO dim_date SELECT CAST(strftime('%Y%m%d', dt) AS INTEGER), dt, CAST(strftime('%Y', dt) AS INTEGER), (CAST(strftime('%m', dt) AS INTEGER) + 2) / 3,
  CAST(strftime('%m', dt) AS INTEGER), substr('JanFebMarAprMayJunJulAugSepOctNovDec', 1 + 3 * (CAST(strftime('%m', dt) AS INTEGER) - 1), 3),
  CAST(strftime('%w', dt) AS INTEGER), CASE WHEN strftime('%w', dt) IN ('0','6') THEN 1 ELSE 0 END FROM d;

CREATE TABLE dim_agent (agent_key INTEGER PRIMARY KEY, agent_id INTEGER, name TEXT, team TEXT, valid_from TEXT, valid_to TEXT, is_current INTEGER);
INSERT INTO dim_agent VALUES (1, 101, 'Sana', 'Search', '2025-01-01', '2026-02-14', 0), (2, 101, 'Sana', 'Examination', '2026-02-15', '9999-12-31', 1), (3, 102, 'Bilal', 'Search', '2025-01-01', '9999-12-31', 1);
CREATE TABLE dim_state (state_key INTEGER PRIMARY KEY, state TEXT, region TEXT);
INSERT INTO dim_state VALUES (1, 'TX', 'South'), (2, 'WY', 'Mountain'), (3, 'FL', 'South');
CREATE TABLE dim_product (product_key INTEGER PRIMARY KEY, product TEXT);
INSERT INTO dim_product VALUES (1, 'Owner'), (2, 'Lender');

CREATE TABLE fact_closings (date_key INTEGER REFERENCES dim_date, agent_key INTEGER REFERENCES dim_agent, state_key INTEGER REFERENCES dim_state,
  product_key INTEGER REFERENCES dim_product, file_no TEXT, premium REAL, liability REAL, turnaround_days INTEGER);
-- Type 2 lookup: the fact points at the agent row valid on the closing date
CREATE TABLE staging (file_no TEXT, closed TEXT, agent_id INTEGER, state TEXT, product TEXT, premium REAL, liability REAL, turnaround_days INTEGER);
INSERT INTO staging VALUES ('TX-1001','2026-01-20',101,'TX','Owner',2150,350000,12),('TX-1002','2026-02-03',102,'TX','Lender',1180,280000,9),
 ('WY-2001','2026-02-25',101,'WY','Owner',1890,410000,15),('FL-3001','2026-03-10',101,'FL','Owner',2410,455000,11),('TX-1003','2026-03-12',102,'TX','Owner',1725,300000,7);
INSERT INTO fact_closings
SELECT d.date_key, a.agent_key, s.state_key, p.product_key, st.file_no, st.premium, st.liability, st.turnaround_days
FROM staging st
JOIN dim_date d ON d.date = st.closed
JOIN dim_agent a ON a.agent_id = st.agent_id AND st.closed BETWEEN a.valid_from AND a.valid_to
JOIN dim_state s ON s.state = st.state
JOIN dim_product p ON p.product = st.product;

-- Premium by month and team, as the team was at the time (Type 2 in action: Sana counts as Search in January, Examination in March)
SELECT d.year, d.month_name, a.team, COUNT(*) AS closings, ROUND(SUM(f.premium), 2) AS premium, ROUND(AVG(f.turnaround_days), 1) AS avg_turnaround
FROM fact_closings f JOIN dim_date d ON d.date_key = f.date_key JOIN dim_agent a ON a.agent_key = f.agent_key
GROUP BY d.year, d.month, a.team ORDER BY d.month, a.team;
-- Region by product (two dimensions, one hop each)
SELECT s.region, p.product, COUNT(*) AS closings, ROUND(SUM(f.liability) / 1000.0, 1) AS liability_k
FROM fact_closings f JOIN dim_state s ON s.state_key = f.state_key JOIN dim_product p ON p.product_key = f.product_key
GROUP BY s.region, p.product ORDER BY s.region, p.product;
-- Weekday closings only, using a date-dimension attribute instead of date arithmetic
SELECT COUNT(*) AS weekday_closings FROM fact_closings f JOIN dim_date d ON d.date_key = f.date_key WHERE d.is_weekend = 0;
```

### Quiz

1. What is the "grain" of a fact table?
- [x] What one row represents (for example, one closing, or one order per day)
- [ ] The number of columns
- [ ] The size of the table
> Declare the grain first; every measure and key must make sense at that grain.

2. Why do dimensions use surrogate keys?
- [ ] Because business keys are always text
- [x] To allow multiple versions of the same entity (Type 2 history) and decouple from source systems
- [ ] To make joins slower
> A surrogate key identifies a version of an agent, not just the agent.

3. Which fact type best answers "how many files were open at the end of each week"?
- [ ] Transaction fact
- [x] Periodic snapshot fact
- [ ] Accumulating snapshot fact
> A snapshot captures state at intervals; transaction facts would need reconstruction.

4. Why does Power BI prefer a star over a single flat table?
- [x] Small dimensions make slicers and relationships efficient and the model understandable
- [ ] Flat tables are not supported
- [ ] Stars use less DAX
> VertiPaq compresses facts well and filters through one-hop relationships quickly.

### Exercises

1. **Declare a grain** — For the weekly status report (open files by stage per state), specify the fact grain, measures and dimensions.
<details><summary>Solution</summary>

```text
Grain: one row per order per week-ending date (periodic snapshot).
Measures: days_open, is_open (0/1), premium (semi-additive across time).
Dimensions: dim_date (week end), dim_state, dim_stage, dim_agent (current owner), dim_product.
```

</details>

2. **Type 2 update** — Write the SQL that closes the current row for agent 102 and inserts a new version with team 'Examination' effective 2026-04-01.
<details><summary>Solution</summary>

```sql
UPDATE dim_agent SET valid_to = '2026-03-31', is_current = 0 WHERE agent_id = 102 AND is_current = 1;
INSERT INTO dim_agent (agent_key, agent_id, name, team, valid_from, valid_to, is_current)
VALUES (4, 102, 'Bilal', 'Examination', '2026-04-01', '9999-12-31', 1);
```

</details>

3. **DAX measures** — Write measures for total premium, closings count and year-to-date premium using the date table.
<details><summary>Solution</summary>

```dax
Total Premium = SUM ( fact_closings[premium] )
Closings = COUNTROWS ( fact_closings )
Premium YTD = TOTALYTD ( [Total Premium], dim_date[date] )
```

</details>

### Interview Questions

**Q: Explain a star schema and why analytics tools prefer it.**
A central fact table holds numeric measures at a declared grain with foreign keys to surrounding dimension tables that hold descriptive attributes; every dimension is one join away, so any question is "filter some dimensions, aggregate the fact". It is preferred because the join pattern is predictable and cheap, dimensions are small and compress well, columnar engines such as VertiPaq scan only the measure columns needed, and business users can read the model. Compared with a normalised schema it duplicates descriptive data and needs an ETL process to maintain, and compared with one flat table it needs relationships but avoids a huge repeated-text table that slicers cannot handle. In a Power BI model for production reporting I would have a closings fact, a weekly snapshot fact, and shared date, agent, state and product dimensions.

**Q: How do you handle an agent moving teams without rewriting history?**
With a Type 2 slowly changing dimension: the agent dimension has a surrogate key per version, `valid_from`, `valid_to` and a current flag; when Sana moves from Search to Examination, the old row is closed with an end date and a new row inserted, and facts loaded after that date point at the new key. Reports by team then attribute January closings to Search and March closings to Examination, which matches reality, while a "current team" attribute can be added for reports that want the present-day view. The cost is a more complex load (lookup by business key and date) and a larger dimension, which is negligible for a few dozen agents.

**Q: Import or DirectQuery in Power BI, and how do you keep a large model fast?**
Import by default: VertiPaq compresses and answers interactively, refreshes can be scheduled and incremental. DirectQuery when data must be live or exceeds memory, accepting slower visuals and source load. For a large model I reduce cardinality (no high-precision timestamps or free text in facts), remove unused columns, keep a proper star, push transformations to source views so query folding holds, set up incremental refresh on the fact by date, and use aggregation tables or composite models so common summaries are imported while detail stays in DirectQuery. I measure with Performance Analyzer and DAX Studio rather than guessing which visual is slow.

## Security & backups

Databases hold the most valuable and most regulated data a business has: personal information on title-insurance customers, premiums, agent performance. **Security** limits who can read or change what, and proves who did; **backups** make loss recoverable. Both are judged by the same standard: not whether the controls exist, but whether they were tested.

### Authentication and roles

Users authenticate to the DBMS (password, certificate, Kerberos or Active Directory, cloud IAM). Privileges are then granted to **roles**, and users are added to roles, so permissions are managed by job function rather than person.

```sql
-- PostgreSQL (SQL Server and MySQL are similar in spirit)
CREATE ROLE reporting NOLOGIN;
GRANT USAGE ON SCHEMA prod TO reporting;
GRANT SELECT ON ALL TABLES IN SCHEMA prod TO reporting;
ALTER DEFAULT PRIVILEGES IN SCHEMA prod GRANT SELECT ON TABLES TO reporting;   -- future tables too
CREATE ROLE agent_app LOGIN PASSWORD '...';
GRANT SELECT, INSERT, UPDATE ON prod.orders, prod.status_events TO agent_app;   -- no DELETE, no DDL
GRANT reporting TO powerbi_reader;
REVOKE ALL ON prod.customers FROM reporting;                                   -- PII stays out of the reporting role
```

**Least privilege**: the application account cannot drop tables, the report reader cannot write, and nobody uses the superuser for daily work. Separate accounts per application make audit logs meaningful.

### Row- and column-level security

Views restrict columns (`CREATE VIEW orders_public AS SELECT file_no, state, status FROM orders`) and rows (`WHERE state = current_setting('app.state')`). **Row-level security** policies (PostgreSQL `CREATE POLICY`, SQL Server security predicates) enforce row filters inside the engine for every query, so a Texas office account physically cannot read Wyoming rows. **Dynamic data masking** (SQL Server, Azure SQL) shows `XXX-XX-1234` to unprivileged users while storing the full value. Power BI implements row-level security with DAX filters on roles, applied per viewer.

### SQL injection

The most common database attack, and entirely preventable: never build SQL by concatenating user input.

```python
# Vulnerable: file_no = "' OR 1=1 --" returns every order
cur.execute(f"SELECT * FROM orders WHERE file_no = '{file_no}'")
# Safe: parameter binding; the value can never become SQL
cur.execute("SELECT * FROM orders WHERE file_no = ?", (file_no,))
```

Identifiers (table or column names chosen by the user, as in a report builder) cannot be bound as parameters; whitelist them against a fixed list. ORMs parameterise automatically unless you use their raw-SQL escape hatches. Stored procedures do not protect you if they build dynamic SQL inside.

### Encryption

**In transit**: TLS between application and database (`sslmode=verify-full` in PostgreSQL, `Encrypt=True;TrustServerCertificate=False` in SQL Server). **At rest**: transparent data encryption (SQL Server TDE, Oracle TDE, cloud disk encryption, SQLCipher for SQLite) protects stolen disks and backups but not a logged-in attacker. **Column-level**: hash passwords with argon2 or bcrypt (never reversible encryption), encrypt sensitive fields with keys held outside the database (`pgcrypto`, SQL Server Always Encrypted, application-level envelope encryption with a KMS). Backups must be encrypted with the same seriousness as the database.

### Auditing

Know who did what: SQL Server Audit, PostgreSQL `pgaudit`, MySQL Enterprise Audit, or application-level audit tables written by triggers (as in the Integrity Constraints chapter). Log logins, privilege changes, schema changes and access to sensitive tables; ship logs off the database host so an attacker cannot erase them. Retention follows regulation (GLBA for US financial data, GDPR for EU personal data).

### Backup strategy

| Type | What | Restore granularity |
|---|---|---|
| Full | entire database | to the backup time |
| Differential / incremental | changes since last full | to the last differential |
| Log / WAL archive | every committed transaction | to any point in time |
| Logical dump (`pg_dump`, `mysqldump`, `.dump`) | SQL or custom format | portable, slower to restore, per table possible |
| Snapshot (storage or cloud) | disk image | fast, must be crash-consistent |

Define **RPO** (how much data you may lose: "15 minutes" means log backups every 15 minutes) and **RTO** (how long restore may take: drives whether you need a standby replica). Follow 3-2-1: three copies, two media, one off-site, and make one copy immutable or offline so ransomware cannot encrypt it too.

```bash
# PostgreSQL: base backup plus continuous WAL archiving
pg_basebackup -D /backups/base-2026-03-04 -Ft -z -X stream
# postgresql.conf: archive_mode = on; archive_command = 'cp %p /backups/wal/%f'
# SQLite: consistent online backup, never a plain file copy of a live database
sqlite3 titles.db ".backup '/backups/titles-2026-03-04.db'"
# SQL Server
BACKUP DATABASE Titles TO DISK = 'D:\bak\Titles_full.bak' WITH COMPRESSION, CHECKSUM;
BACKUP LOG Titles TO DISK = 'D:\bak\Titles_log_1432.trn';
```

### Testing restores

A backup that has never been restored is a hypothesis. Automate a periodic restore to a scratch server, run integrity checks (`PRAGMA integrity_check`, `DBCC CHECKDB`, `pg_amcheck`), run a row-count comparison against production, and record the time it took, which is your real RTO. Practise point-in-time recovery once so the runbook is proven before the day the `DELETE` without a `WHERE` runs.

> **Warning:** Backups contain everything the database contains, including PII. Encrypt them, restrict access to the backup location as tightly as the database itself, and include backup files in the retention and deletion policy; a five-year-old backup with customer SSNs is a liability, not an asset.

### Try It Yourself

```sql
-- Security patterns that work in SQLite: column/row restriction through views, masking, an append-only audit trail, and injection shown safely.
CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, name TEXT NOT NULL, ssn TEXT NOT NULL, email TEXT NOT NULL, state TEXT NOT NULL);
CREATE TABLE orders (file_no TEXT PRIMARY KEY, customer_id INTEGER REFERENCES customers(customer_id), state TEXT NOT NULL, status TEXT NOT NULL, premium REAL NOT NULL);
INSERT INTO customers VALUES (1, 'Maria Alvarez', '123-45-6789', 'maria@example.com', 'TX'), (2, 'John Baker', '987-65-4321', 'john@example.com', 'WY');
INSERT INTO orders VALUES ('TX-1001', 1, 'TX', 'Open', 2150), ('WY-2001', 2, 'WY', 'Closed', 1890), ('TX-1002', 1, 'TX', 'Closed', 1180);

-- Column-level security + dynamic masking through a view (reporting role would be granted SELECT on the view only)
CREATE VIEW v_customers_masked AS
SELECT customer_id, name, 'XXX-XX-' || substr(ssn, -4) AS ssn_masked,
       substr(email, 1, 1) || '***' || substr(email, instr(email, '@')) AS email_masked, state FROM customers;
SELECT * FROM v_customers_masked;

-- Row-level security: a per-session setting emulated with a one-row table (PostgreSQL: CREATE POLICY ... USING (state = current_setting('app.state')))
CREATE TABLE session_ctx (allowed_state TEXT);
INSERT INTO session_ctx VALUES ('TX');
CREATE VIEW v_orders_rls AS SELECT o.* FROM orders o WHERE o.state = (SELECT allowed_state FROM session_ctx);
SELECT 'TX office sees' AS who, * FROM v_orders_rls;

-- Append-only audit trail: triggers record changes and block deletes from the audit table
CREATE TABLE audit (id INTEGER PRIMARY KEY, at TEXT DEFAULT (datetime('now')), actor TEXT, file_no TEXT, old_status TEXT, new_status TEXT);
CREATE TRIGGER trg_orders_status AFTER UPDATE OF status ON orders
BEGIN INSERT INTO audit (actor, file_no, old_status, new_status) VALUES ((SELECT allowed_state FROM session_ctx) || '-office', NEW.file_no, OLD.status, NEW.status); END;
CREATE TRIGGER trg_audit_immutable BEFORE DELETE ON audit BEGIN SELECT RAISE(ABORT, 'audit rows cannot be deleted'); END;
UPDATE orders SET status = 'Closed' WHERE file_no = 'TX-1001';
SELECT * FROM audit;

-- SQL injection, demonstrated with a stored "user input" string instead of string concatenation in code
CREATE TABLE user_input (value TEXT);
INSERT INTO user_input VALUES ('TX-1001'), (''' OR 1=1 --');
-- Concatenated query text an unsafe application would have built for each input:
SELECT value AS input, 'SELECT * FROM orders WHERE file_no = ''' || value || '''' AS sql_built FROM user_input;
-- Parameter binding compares the whole string as a value: the malicious input matches nothing
SELECT u.value AS bound_parameter, COUNT(o.file_no) AS rows_returned FROM user_input u LEFT JOIN orders o ON o.file_no = u.value GROUP BY u.value;
-- Uncomment to prove the audit table is append-only:
-- DELETE FROM audit;
```

### Quiz

1. What is the correct defence against SQL injection?
- [ ] Escaping quotes with a regular expression
- [x] Parameterised queries, with identifiers whitelisted
- [ ] Stored procedures
> Binding keeps data and SQL separate; procedures that build dynamic SQL are still vulnerable.

2. What does transparent data encryption protect against?
- [x] Theft of disks or backup files
- [ ] A user with SELECT privilege reading data
- [ ] SQL injection
> TDE decrypts for any authenticated session; access control still governs who reads what.

3. RPO of 15 minutes implies which backup practice?
- [ ] A full backup every 15 minutes
- [x] Log or WAL backups at least every 15 minutes
- [ ] Weekly backups
> Log backups let you roll forward to within the RPO window.

4. Why keep one backup copy immutable or offline?
- [x] So ransomware or a compromised account cannot destroy the backups too
- [ ] To save space
- [ ] Because tapes are faster
> The 3-2-1 rule plus an immutable copy protects against attackers, not only disk failure.

### Exercises

1. **Least privilege** — Write the grants for a Power BI reader that may read all tables in schema `prod` except `customers`, and may never write.
<details><summary>Solution</summary>

```sql
CREATE ROLE powerbi_reader LOGIN PASSWORD '...';
GRANT USAGE ON SCHEMA prod TO powerbi_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA prod TO powerbi_reader;
REVOKE SELECT ON prod.customers FROM powerbi_reader;
ALTER DEFAULT PRIVILEGES IN SCHEMA prod GRANT SELECT ON TABLES TO powerbi_reader;
```

</details>

2. **Row-level policy** — Write a PostgreSQL policy so users in role `tx_office` see only rows where `state = 'TX'`.
<details><summary>Solution</summary>

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY tx_only ON orders FOR ALL TO tx_office USING (state = 'TX') WITH CHECK (state = 'TX');
```

</details>

3. **Restore drill** — Write a checklist for a monthly restore test of a SQL Server database.
<details><summary>Solution</summary>

```text
1. Restore latest full + differential + logs to a scratch instance with a new name (WITH MOVE, NORECOVERY then RECOVERY).
2. Run DBCC CHECKDB WITH NO_INFOMSGS.
3. Compare row counts of key tables with production; spot-check recent orders.
4. Record elapsed time (RTO evidence) and the newest transaction time (RPO evidence).
5. Drop the scratch database; file the report; fix anything that failed.
```

</details>

### Interview Questions

**Q: How do you secure a production database?**
Layered: network (no public endpoint, TLS enforced, firewall to application hosts), authentication (per-application accounts, no shared superuser, integrated auth where possible), authorisation (roles with least privilege, row- and column-level security for multi-office data, views for reporting), code (parameterised queries everywhere, identifiers whitelisted), data (hashed passwords, encrypted sensitive columns with keys outside the database, TDE for disks and backups), and detection (audit logging shipped off-host, alerts on privilege changes and failed logins). Then patching and periodic review of who holds which role. I would give a concrete example such as a Power BI reader role that cannot see the customers table and an application account without DELETE or DDL rights.

**Q: Design a backup and recovery plan for a production-tracking database.**
Start from the business numbers: say RPO 15 minutes and RTO 2 hours. Nightly full backup, differential every 6 hours if the engine supports it, transaction-log or WAL backups every 15 minutes, all compressed, checksummed and encrypted, copied to a second location and to an immutable off-site bucket with retention matching regulation. A warm standby replica for fast failover covers the RTO for hardware failure; point-in-time restore from backups covers human error. Monthly automated restore tests to a scratch server with integrity checks and row-count comparisons, with the elapsed time recorded as the real RTO, and a written runbook for PITR that someone other than me has executed. Backups are treated as sensitive data with the same access control as production.

**Q: A developer says stored procedures make SQL injection impossible. Do you agree?**
No. A stored procedure that uses its parameters as values in static SQL is safe, but one that concatenates them into a dynamic string and executes it (`EXEC(@sql)`, `EXECUTE IMMEDIATE`) is just as injectable as application code. The defence is parameter binding at every layer where SQL text is formed, whitelisting when an identifier must vary, least-privilege accounts so a successful injection cannot drop tables or read unrelated data, and testing with hostile inputs. I would also point out that ORMs have raw-query escape hatches that developers reach for in report builders, which is exactly where injection appears in practice.

## Database design case study (title-insurance production tracking) & interview questions

This chapter applies the whole course to one realistic system: tracking title-insurance orders from intake to policy issuance across several states, with agents, tasks, rate calculation, documents and management reporting. It is the kind of design exercise interviewers set ("design the database for X") and the kind of system a production-support analyst lives inside. Work through it as a method, not a fixed answer.

### Step 1: requirements as questions

Gather what the system must answer and do:

- Intake: create an order (file number, state, county, product, liability amount, customer, lender), assign it to an agent.
- Workflow: every order passes through stages (Open, Search, Examination, Commitment, Closing, Policy Issued, Closed) and may be put on hold or cancelled; every change must be attributable and timestamped.
- Rates: premium is computed from a state rate matrix by liability band, product and effective date; endorsements add fees.
- Documents: each order accumulates documents (commitment, policy, deeds) with versions.
- QA: a checker reviews a sample of completed searches and records errors by category.
- Reporting: weekly status by state and stage, turnaround per stage, agent productivity and error rates, premium by month and product, ageing of open files.

### Step 2: entities and relationships

```text
customers 1---* orders *---1 agents            (current owner)
orders 1---* status_events *---1 agents         (who changed it)
orders 1---* order_endorsements *---1 endorsements
orders 1---* documents (versioned)
orders 1---* qa_reviews *---1 agents (reviewer);  qa_reviews 1---* qa_findings *---1 error_categories
rate_bands: (state, product, band_from, band_to, effective_from) -> rate_per_thousand
```

Decisions with reasons: status lives in `orders.status` for fast filtering **and** in `status_events` for history (a controlled denormalisation kept consistent by a trigger); premium is stored on the order at the time of quoting, because rates change and the historical premium must not; agents are referenced by surrogate `agent_id`, with name changes and team moves handled in the warehouse as Type 2.

### Step 3: schema

```sql
CREATE TABLE agents (agent_id INTEGER PRIMARY KEY, name TEXT NOT NULL, team TEXT NOT NULL CHECK (team IN ('Search','Examination','Closing','QA')), active INTEGER NOT NULL DEFAULT 1);
CREATE TABLE customers (customer_id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE);
CREATE TABLE stages (stage_id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL, seq INTEGER NOT NULL);
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY, file_no TEXT NOT NULL UNIQUE CHECK (file_no GLOB '[A-Z][A-Z]-[0-9]*'),
  state TEXT NOT NULL CHECK (length(state) = 2), county TEXT NOT NULL,
  product TEXT NOT NULL CHECK (product IN ('Owner','Lender','Both')),
  liability REAL NOT NULL CHECK (liability > 0), premium REAL CHECK (premium >= 0),
  customer_id INTEGER NOT NULL REFERENCES customers, agent_id INTEGER NOT NULL REFERENCES agents,
  stage_id INTEGER NOT NULL REFERENCES stages, opened TEXT NOT NULL, closed TEXT, CHECK (closed IS NULL OR closed >= opened)
);
CREATE TABLE status_events (event_id INTEGER PRIMARY KEY, order_id INTEGER NOT NULL REFERENCES orders, from_stage INTEGER REFERENCES stages,
  to_stage INTEGER NOT NULL REFERENCES stages, agent_id INTEGER NOT NULL REFERENCES agents, at TEXT NOT NULL, note TEXT);
CREATE TABLE rate_bands (state TEXT, product TEXT, band_from REAL, band_to REAL, rate_per_k REAL NOT NULL CHECK (rate_per_k > 0),
  effective_from TEXT NOT NULL, PRIMARY KEY (state, product, band_from, effective_from), CHECK (band_to > band_from));
CREATE TABLE endorsements (code TEXT PRIMARY KEY, description TEXT NOT NULL, fee REAL NOT NULL CHECK (fee >= 0));
CREATE TABLE order_endorsements (order_id INTEGER REFERENCES orders, code TEXT REFERENCES endorsements, PRIMARY KEY (order_id, code));
CREATE TABLE qa_reviews (review_id INTEGER PRIMARY KEY, order_id INTEGER NOT NULL REFERENCES orders, reviewer_id INTEGER NOT NULL REFERENCES agents,
  reviewed_at TEXT NOT NULL, passed INTEGER NOT NULL CHECK (passed IN (0,1)));
CREATE TABLE qa_findings (finding_id INTEGER PRIMARY KEY, review_id INTEGER NOT NULL REFERENCES qa_reviews, category TEXT NOT NULL, severity TEXT NOT NULL CHECK (severity IN ('Minor','Major','Critical')));
```

Indexes follow the queries: `orders (state, stage_id)`, `orders (agent_id) WHERE closed IS NULL`, `status_events (order_id, at)`, `qa_reviews (reviewer_id, reviewed_at)`.

### Step 4: the hard queries

**Turnaround per stage** comes from pairing each status event with the next one for the same order using the `LEAD` window function. **Ageing** buckets open orders by `julianday('now') - julianday(opened)`. **Rate lookup** joins the order to the band that contains its liability and is the latest effective on the opening date. **Agent productivity** counts closings and QA error rates per agent per week, joining sparse QA data with `LEFT JOIN` so agents without reviews still appear. The Try It block implements all four.

### Step 5: operations

Transactions wrap "advance stage": update `orders.stage_id` and insert the `status_events` row together, with the trigger guaranteeing the pair. Constraints enforce the domain; a nightly job snapshots open orders into the warehouse's periodic snapshot fact; role-based access keeps PII in `customers` away from reporting; backups follow the previous chapter. When volume grows, `status_events` is the table to partition by date, and reporting moves to replicas or the warehouse.

> **Interview note:** In a design interview, narrate the method: questions, entities, keys, the one or two deliberate denormalisations and why, indexes from the queries, and how history is kept. Then invite the interviewer to add a requirement; changing your design gracefully is what they are scoring.

### Database interview questions: the recurring set

1. Explain normalisation up to BCNF and when you would denormalise.
2. Primary versus unique versus foreign keys; natural versus surrogate keys.
3. How does a B+tree index work; composite index column order; covering indexes.
4. Read an execution plan; sargable predicates; why is this query slow?
5. ACID with a concrete example; what happens at COMMIT.
6. Isolation levels and the anomalies each allows; MVCC versus locking; deadlocks.
7. Write-ahead logging and crash recovery; checkpoints; point-in-time recovery.
8. Joins (inner, left, semi, anti), window functions, CTEs, `GROUP BY` versus `HAVING`.
9. CAP, replication, sharding, and when not to shard.
10. SQL versus NoSQL: choose for a given workload.
11. Star schema, grain, slowly changing dimensions.
12. SQL injection, least privilege, encryption, backup strategy with RPO/RTO.
13. Design the database for X (this chapter's method).

### Try It Yourself

```sql
-- The production-tracking schema in miniature, with the four hard queries: turnaround per stage, ageing, rate lookup, agent productivity.
CREATE TABLE agents (agent_id INTEGER PRIMARY KEY, name TEXT NOT NULL, team TEXT NOT NULL);
CREATE TABLE stages (stage_id INTEGER PRIMARY KEY, name TEXT UNIQUE NOT NULL, seq INTEGER NOT NULL);
CREATE TABLE orders (order_id INTEGER PRIMARY KEY, file_no TEXT NOT NULL UNIQUE, state TEXT NOT NULL, product TEXT NOT NULL,
  liability REAL NOT NULL CHECK (liability > 0), premium REAL, agent_id INTEGER NOT NULL REFERENCES agents, stage_id INTEGER NOT NULL REFERENCES stages,
  opened TEXT NOT NULL, closed TEXT, CHECK (closed IS NULL OR closed >= opened));
CREATE TABLE status_events (event_id INTEGER PRIMARY KEY, order_id INTEGER NOT NULL REFERENCES orders, to_stage INTEGER NOT NULL REFERENCES stages,
  agent_id INTEGER NOT NULL REFERENCES agents, at TEXT NOT NULL);
CREATE TABLE rate_bands (state TEXT, product TEXT, band_from REAL, band_to REAL, rate_per_k REAL NOT NULL, effective_from TEXT NOT NULL,
  PRIMARY KEY (state, product, band_from, effective_from));
CREATE TABLE qa_reviews (review_id INTEGER PRIMARY KEY, order_id INTEGER REFERENCES orders, reviewer_id INTEGER REFERENCES agents, passed INTEGER NOT NULL);
-- Trigger keeps orders.stage_id and the event history consistent
CREATE TRIGGER trg_stage_history AFTER UPDATE OF stage_id ON orders
BEGIN INSERT INTO status_events (order_id, to_stage, agent_id, at) VALUES (NEW.order_id, NEW.stage_id, NEW.agent_id, '2026-03-' || printf('%02d', 10 + NEW.order_id)); END;

INSERT INTO agents VALUES (1,'Sana','Search'),(2,'Bilal','Examination'),(3,'Hira','QA');
INSERT INTO stages VALUES (1,'Open',1),(2,'Search',2),(3,'Examination',3),(4,'Commitment',4),(5,'Closed',5);
INSERT INTO rate_bands VALUES ('TX','Owner',0,100000,5.75,'2025-01-01'),('TX','Owner',100000,500000,4.25,'2025-01-01'),('TX','Owner',100000,500000,4.50,'2026-02-01'),
  ('WY','Owner',0,250000,3.90,'2025-01-01'),('WY','Owner',250000,1000000,3.10,'2025-01-01');
INSERT INTO orders (file_no,state,product,liability,agent_id,stage_id,opened) VALUES
  ('TX-1001','TX','Owner',350000,1,1,'2026-02-20'),('TX-1002','TX','Owner',80000,1,1,'2026-01-15'),('WY-2001','WY','Owner',410000,2,1,'2026-03-01'),('TX-1003','TX','Owner',300000,2,1,'2026-03-06');
INSERT INTO status_events (order_id,to_stage,agent_id,at) SELECT order_id, 1, agent_id, opened FROM orders;
-- Rate lookup: band containing the liability, latest effective on or before the opening date, premium stored on the order
UPDATE orders SET premium = (
  SELECT ROUND(orders.liability / 1000.0 * rb.rate_per_k, 2) FROM rate_bands rb
  WHERE rb.state = orders.state AND rb.product = orders.product AND orders.liability > rb.band_from AND orders.liability <= rb.band_to AND rb.effective_from <= orders.opened
  ORDER BY rb.effective_from DESC LIMIT 1);
-- Advance stages (each UPDATE fires the trigger)
UPDATE orders SET stage_id = 2 WHERE file_no IN ('TX-1001','TX-1002','WY-2001');
UPDATE orders SET stage_id = 3 WHERE file_no IN ('TX-1001','TX-1002');
UPDATE orders SET stage_id = 5, closed = '2026-03-14' WHERE file_no = 'TX-1002';
INSERT INTO qa_reviews VALUES (1, 2, 3, 0), (2, 1, 3, 1);

SELECT o.file_no, o.state, s.name AS stage, o.liability, o.premium, o.opened FROM orders o JOIN stages s ON s.stage_id = o.stage_id ORDER BY o.file_no;
-- 1. Turnaround per stage: days between consecutive events (LEAD window function)
SELECT o.file_no, s.name AS stage, e.at AS entered, LEAD(e.at) OVER (PARTITION BY e.order_id ORDER BY e.at) AS left_at,
       julianday(COALESCE(LEAD(e.at) OVER (PARTITION BY e.order_id ORDER BY e.at), '2026-03-20')) - julianday(e.at) AS days_in_stage
FROM status_events e JOIN orders o ON o.order_id = e.order_id JOIN stages s ON s.stage_id = e.to_stage ORDER BY o.file_no, e.at;
-- 2. Ageing of open files as of 2026-03-20
SELECT CASE WHEN julianday('2026-03-20') - julianday(opened) <= 7 THEN '0-7 days' WHEN julianday('2026-03-20') - julianday(opened) <= 21 THEN '8-21 days' ELSE '22+ days' END AS age_bucket,
       COUNT(*) AS open_files, ROUND(SUM(premium), 2) AS premium_at_risk FROM orders WHERE closed IS NULL GROUP BY 1 ORDER BY 1;
-- 3. Agent productivity with QA error rate (LEFT JOIN keeps agents with no reviews)
SELECT a.name, a.team, COUNT(DISTINCT o.order_id) AS files, SUM(o.closed IS NOT NULL) AS closed_files,
       COUNT(q.review_id) AS reviews, ROUND(100.0 * SUM(CASE WHEN q.passed = 0 THEN 1 ELSE 0 END) / NULLIF(COUNT(q.review_id), 0), 1) AS error_rate_pct
FROM agents a LEFT JOIN orders o ON o.agent_id = a.agent_id LEFT JOIN qa_reviews q ON q.order_id = o.order_id GROUP BY a.agent_id ORDER BY a.name;
```

### Quiz

1. Why store `premium` on the order when it can be computed from the rate matrix?
- [x] Rates change over time; the quoted premium must remain what it was
- [ ] Computed columns are not allowed
- [ ] To avoid joins in every query
> This is a deliberate denormalisation justified by history, not convenience.

2. Which window function pairs each status event with the next one for the same order?
- [ ] `ROW_NUMBER()`
- [x] `LEAD()`
- [ ] `SUM() OVER`
> `LEAD(at) OVER (PARTITION BY order_id ORDER BY at)` gives the next event's time.

3. Why is `orders.stage_id` kept alongside `status_events`?
- [x] Fast filtering on current stage, with history preserved in the events table
- [ ] The events table is optional
- [ ] To avoid triggers
> Current state and history serve different queries; a trigger keeps them consistent.

4. In a design interview, what should you do first?
- [ ] Draw every table
- [x] Clarify the questions and operations the system must support
- [ ] Choose the database vendor
> Requirements decide the grain, the keys and the denormalisations.

### Exercises

1. **Add a requirement** — Orders can be reassigned between agents, and reports need "who owned the file during each stage". Change the design.
<details><summary>Solution</summary>

```sql
-- status_events already records the acting agent per transition; add an explicit assignment history for ownership changes:
CREATE TABLE assignments (assignment_id INTEGER PRIMARY KEY, order_id INTEGER NOT NULL REFERENCES orders,
  agent_id INTEGER NOT NULL REFERENCES agents, from_at TEXT NOT NULL, to_at TEXT);
-- Stage ownership = assignment active at the stage's entered time (join on from_at <= entered < COALESCE(to_at, '9999'))
```

</details>

2. **Non-overlapping bands** — Write a query that finds overlapping liability bands for the same state, product and effective date.
<details><summary>Solution</summary>

```sql
SELECT a.state, a.product, a.effective_from, a.band_from AS a_from, a.band_to AS a_to, b.band_from AS b_from, b.band_to AS b_to
FROM rate_bands a JOIN rate_bands b
  ON a.state = b.state AND a.product = b.product AND a.effective_from = b.effective_from AND a.band_from < b.band_from
WHERE a.band_to > b.band_from;
```

</details>

3. **Weekly snapshot** — Write the INSERT that captures every open order into `snapshot_open(week_end, order_id, stage_id, days_open)` for 2026-03-20.
<details><summary>Solution</summary>

```sql
INSERT INTO snapshot_open (week_end, order_id, stage_id, days_open)
SELECT '2026-03-20', order_id, stage_id, CAST(julianday('2026-03-20') - julianday(opened) AS INTEGER)
FROM orders WHERE closed IS NULL;
```

</details>

### Interview Questions

**Q: Design the database for a title-insurance production tracking system.**
I start with the questions it must answer and the operations it must support: intake, stage transitions with attribution, premium calculation from a versioned rate matrix, endorsements, QA reviews, and weekly reporting on status, turnaround, productivity and premium. Entities: customers, agents, orders, stages, status_events, rate_bands, endorsements, order_endorsements, qa_reviews, qa_findings. Keys: surrogate integer ids with unique business keys such as file number; composite keys where natural, as in order_endorsements and rate_bands by state, product, band and effective date. Deliberate denormalisations: current stage on the order for filtering, with full history in status_events kept consistent by a trigger, and premium stored at quote time because rates change. Indexes from the queries: state plus stage, open orders per agent, events by order and time. Then transactions around stage advances, role-based access keeping customer PII out of reporting, and a star-schema warehouse fed nightly for Power BI.

**Q: How would you compute turnaround per stage and why not store it directly?**
From the event history: each status event has the time the order entered a stage, and `LEAD(at) OVER (PARTITION BY order_id ORDER BY at)` gives the time it left, so the difference is the days in that stage, with open stages measured to the report date. Storing a duration column would duplicate derivable data, go stale when an event is corrected, and force every transition to update the previous row; computing it from events keeps one source of truth. For a very large history I would materialise the computed durations into the warehouse's accumulating snapshot fact nightly, which gives fast reporting without compromising the operational schema.

**Q: What would you change in this design at ten times the volume?**
Partition `status_events` and the QA tables by date so old partitions can be archived and indexes stay small; move all reporting to a read replica or the warehouse so the operational database only serves intake and transitions; add the covering indexes that the top five report queries need and drop any the usage statistics show are idle; batch the nightly snapshot loads in transactions of a few thousand rows; and review the rate lookup, replacing the correlated subquery with a set-based join if it appears in the profile. I would not shard: an orders table growing by tens of thousands of rows a month fits a single well-indexed PostgreSQL for years, and sharding would complicate the joins that this workload is built on.
