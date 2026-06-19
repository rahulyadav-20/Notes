# SQL Interview Notes
## From Beginner to Advanced | Senior Data Engineer Edition

> **Covers:** SQL Fundamentals · DDL/DML · Joins · Aggregations · Window Functions · CTEs · Subqueries · Indexes · Query Optimization · Transactions · Schema Design · PySpark SQL · Real-World Patterns  
> **Target:** 3–15 Years Experienced Data Engineers · Senior DE · Data Analyst · SQL Developer · Big Data Architect  
> **Prepared by:** Senior Data Engineer (15+ years SQL experience across OLTP, OLAP, Data Warehouses)

---

## Table of Contents

1. [SQL Fundamentals](#1-sql-fundamentals)
2. [DDL — Data Definition Language](#2-ddl--data-definition-language)
3. [DML — Data Manipulation Language](#3-dml--data-manipulation-language)
4. [SELECT and Filtering](#4-select-and-filtering)
5. [Joins](#5-joins)
6. [Aggregations and GROUP BY](#6-aggregations-and-group-by)
7. [Subqueries and CTEs](#7-subqueries-and-ctes)
8. [Window Functions](#8-window-functions)
9. [Set Operations](#9-set-operations)
10. [String Functions](#10-string-functions)
11. [Date and Time Functions](#11-date-and-time-functions)
12. [Conditional Expressions](#12-conditional-expressions)
13. [NULL Handling](#13-null-handling)
14. [Indexes and Performance](#14-indexes-and-performance)
15. [Query Optimization](#15-query-optimization)
16. [Transactions and ACID](#16-transactions-and-acid)
17. [Schema Design and Normalization](#17-schema-design-and-normalization)
18. [Data Warehouse SQL Patterns](#18-data-warehouse-sql-patterns)
19. [Analytical Patterns](#19-analytical-patterns)
20. [Advanced SQL Patterns](#20-advanced-sql-patterns)
21. [SQL in Big Data (Spark SQL, Hive, Presto)](#21-sql-in-big-data)
22. [Scenario-Based Questions (100 Q&A)](#22-scenario-based-questions)
23. [Coding Questions (50 Problems)](#23-coding-questions)
24. [SQL Interview Cheat Sheet](#24-sql-interview-cheat-sheet)

---

# 1. SQL Fundamentals

## What is it?

SQL (Structured Query Language) is the standard language for managing and querying relational databases. It was developed at IBM in the 1970s based on Edgar Codd's relational model. SQL is declarative — you describe *what* you want, not *how* to get it.

## Why do we use it?

- **Universal standard:** Works across MySQL, PostgreSQL, Oracle, SQL Server, Snowflake, BigQuery, Redshift, Spark SQL
- **Data engineering:** ETL pipelines, data transformations, aggregations
- **Analytics:** Business intelligence, reporting, ad-hoc analysis
- **Data warehousing:** Dimensional modeling, fact/dimension table queries
- **Ad-Tech:** Campaign performance metrics, CTR computation, audience segmentation

## SQL Categories

```
┌─────────────────────────────────────────────────────────────────┐
│                        SQL CATEGORIES                           │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│     DDL      │     DML      │     DCL      │       TCL         │
│  (Define)    │ (Manipulate) │  (Control)   │  (Transaction)    │
├──────────────┼──────────────┼──────────────┼───────────────────┤
│ CREATE TABLE │ SELECT       │ GRANT        │ BEGIN             │
│ ALTER TABLE  │ INSERT       │ REVOKE       │ COMMIT            │
│ DROP TABLE   │ UPDATE       │ DENY         │ ROLLBACK          │
│ TRUNCATE     │ DELETE       │              │ SAVEPOINT         │
│ RENAME       │ MERGE/UPSERT │              │                   │
└──────────────┴──────────────┴──────────────┴───────────────────┘
```

## SQL Execution Order

This is one of the most asked interview questions — SQL does NOT execute in the order you write it:

```
WRITTEN ORDER:           EXECUTION ORDER:
1. SELECT                1. FROM         ← identify tables
2. FROM                  2. JOIN         ← combine tables
3. JOIN                  3. WHERE        ← filter rows
4. WHERE                 4. GROUP BY     ← group rows
5. GROUP BY              5. HAVING       ← filter groups
6. HAVING                6. SELECT       ← select columns
7. ORDER BY              7. DISTINCT     ← remove duplicates
8. LIMIT/OFFSET          8. ORDER BY     ← sort results
                         9. LIMIT/OFFSET ← paginate
```

Why this matters:
- You CANNOT use a SELECT alias in WHERE (WHERE runs before SELECT)
- You CAN use a SELECT alias in ORDER BY (ORDER BY runs after SELECT)
- You CANNOT use aggregate aliases in HAVING without a subquery
- Window functions run after GROUP BY but before ORDER BY

## Data Types

```sql
-- Numeric
INT / INTEGER          -- 4 bytes, -2.1B to 2.1B
BIGINT                 -- 8 bytes, large integers
DECIMAL(p, s)          -- exact precision (use for money)
FLOAT / DOUBLE         -- approximate (avoid for money)
NUMERIC(p, s)          -- same as DECIMAL

-- String
VARCHAR(n)             -- variable length, max n chars
CHAR(n)                -- fixed length, padded with spaces
TEXT                   -- unlimited length
NVARCHAR(n)            -- Unicode variable length

-- Date/Time
DATE                   -- 'YYYY-MM-DD'
TIME                   -- 'HH:MM:SS'
TIMESTAMP              -- 'YYYY-MM-DD HH:MM:SS'
TIMESTAMP WITH TIME ZONE  -- includes timezone

-- Boolean
BOOLEAN / BOOL         -- TRUE / FALSE / NULL

-- Other
JSON / JSONB           -- semi-structured (PostgreSQL)
ARRAY                  -- array of values (PostgreSQL)
UUID                   -- universally unique identifier
```

## Interview Questions and Answers

**Q1. What is SQL and what are its main categories?**

Answer: SQL (Structured Query Language) is the standard language for relational databases. Its four main categories are:
1. **DDL (Data Definition Language):** Defines database structure — CREATE, ALTER, DROP, TRUNCATE
2. **DML (Data Manipulation Language):** Manipulates data — SELECT, INSERT, UPDATE, DELETE, MERGE
3. **DCL (Data Control Language):** Controls access — GRANT, REVOKE
4. **TCL (Transaction Control Language):** Manages transactions — COMMIT, ROLLBACK, SAVEPOINT

**Q2. What is the SQL execution order and why does it matter?**

Answer: SQL executes in this order: FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT. This matters because:
- Column aliases defined in SELECT cannot be used in WHERE (WHERE runs before SELECT)
- Aggregate functions cannot be used in WHERE — use HAVING instead
- Window functions execute after GROUP BY but before HAVING/ORDER BY

**Q3. What is the difference between DELETE, TRUNCATE, and DROP?**

Answer:
| | DELETE | TRUNCATE | DROP |
|---|---|---|---|
| What | Removes rows | Removes all rows | Removes table |
| WHERE clause | Yes | No | No |
| Rollback | Yes (DML) | No (DDL in most DBs) | No |
| Triggers fired | Yes | No | No |
| Speed | Slow (row-by-row) | Fast (deallocates pages) | Instant |
| Keeps structure | Yes | Yes | No |
| Identity reset | No | Yes | N/A |

**Q4. What is the difference between CHAR and VARCHAR?**

Answer: CHAR(n) is fixed-length — always stores exactly n characters (pads with spaces). VARCHAR(n) is variable-length — stores only as many characters as needed (up to n). CHAR is slightly faster for fixed-length data (like country codes, fixed IDs) because no length overhead. VARCHAR saves space for variable data. Use CHAR for fixed-length codes, VARCHAR for names and descriptions.

**Q5. What is the difference between FLOAT and DECIMAL?**

Answer: FLOAT/DOUBLE uses binary floating-point representation — fast but imprecise (0.1 + 0.2 ≠ 0.3 exactly). DECIMAL(p,s) uses exact decimal arithmetic — slower but precise. Always use DECIMAL for monetary values to avoid rounding errors. Use FLOAT for scientific computations where approximate values are acceptable.

---

## SQL Syntax Basics

```sql
-- Basic query structure
SELECT column1, column2, aggregate_function(column3)
FROM table_name
JOIN other_table ON condition
WHERE filter_condition
GROUP BY column1, column2
HAVING aggregate_condition
ORDER BY column1 ASC, column2 DESC
LIMIT 100 OFFSET 0;

-- Comments
-- Single line comment
/* Multi-line
   comment */

-- Aliases
SELECT emp_id AS id, first_name || ' ' || last_name AS full_name
FROM employees e  -- table alias
```

---

# 2. DDL — Data Definition Language

## What is it?

DDL statements define and modify database schema — tables, indexes, views, sequences, and constraints.

## CREATE TABLE

```sql
-- Basic table creation
CREATE TABLE employees (
    emp_id        SERIAL PRIMARY KEY,           -- auto-increment
    first_name    VARCHAR(50)  NOT NULL,
    last_name     VARCHAR(50)  NOT NULL,
    email         VARCHAR(100) NOT NULL UNIQUE,
    dept_id       INT          REFERENCES departments(dept_id),
    salary        DECIMAL(12, 2) CHECK (salary > 0),
    hire_date     DATE         NOT NULL DEFAULT CURRENT_DATE,
    is_active     BOOLEAN      DEFAULT TRUE,
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Create table with composite primary key
CREATE TABLE order_items (
    order_id    INT NOT NULL,
    product_id  INT NOT NULL,
    quantity    INT NOT NULL CHECK (quantity > 0),
    unit_price  DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id)   REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Create table from SELECT
CREATE TABLE high_salary_employees AS
SELECT * FROM employees WHERE salary > 100000;

-- Create table if not exists
CREATE TABLE IF NOT EXISTS audit_log (
    log_id      BIGSERIAL PRIMARY KEY,
    table_name  VARCHAR(100),
    operation   VARCHAR(10),
    changed_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Constraints

```sql
-- Types of constraints:
-- PRIMARY KEY: Unique + NOT NULL; identifies each row
-- FOREIGN KEY: References primary key in another table
-- UNIQUE: All values in column must be distinct
-- NOT NULL: Column cannot have NULL values
-- CHECK: Values must satisfy a condition
-- DEFAULT: Default value when none specified

-- Add constraint to existing table
ALTER TABLE employees ADD CONSTRAINT chk_salary CHECK (salary BETWEEN 1000 AND 10000000);
ALTER TABLE employees ADD CONSTRAINT uq_email UNIQUE (email);

-- Drop constraint
ALTER TABLE employees DROP CONSTRAINT chk_salary;

-- Composite unique constraint
ALTER TABLE user_roles ADD CONSTRAINT uq_user_role UNIQUE (user_id, role_id);
```

## ALTER TABLE

```sql
-- Add column
ALTER TABLE employees ADD COLUMN phone VARCHAR(20);

-- Add column with default
ALTER TABLE employees ADD COLUMN status VARCHAR(20) DEFAULT 'active' NOT NULL;

-- Drop column
ALTER TABLE employees DROP COLUMN phone;

-- Rename column
ALTER TABLE employees RENAME COLUMN first_name TO fname;

-- Change data type
ALTER TABLE employees ALTER COLUMN salary TYPE NUMERIC(15, 2);

-- Set/drop default
ALTER TABLE employees ALTER COLUMN status SET DEFAULT 'active';
ALTER TABLE employees ALTER COLUMN status DROP DEFAULT;

-- Set/drop NOT NULL
ALTER TABLE employees ALTER COLUMN phone SET NOT NULL;
ALTER TABLE employees ALTER COLUMN phone DROP NOT NULL;

-- Rename table
ALTER TABLE employees RENAME TO staff;
```

## Indexes

```sql
-- Create basic index
CREATE INDEX idx_emp_dept ON employees(dept_id);

-- Unique index
CREATE UNIQUE INDEX idx_emp_email ON employees(email);

-- Composite index (order matters!)
CREATE INDEX idx_emp_dept_salary ON employees(dept_id, salary DESC);

-- Partial index (only index subset of rows)
CREATE INDEX idx_active_emp ON employees(dept_id) WHERE is_active = TRUE;

-- Expression index
CREATE INDEX idx_emp_lower_email ON employees(LOWER(email));

-- Drop index
DROP INDEX idx_emp_dept;

-- Index on foreign key (always recommended to avoid slow JOINs)
CREATE INDEX idx_orders_customer ON orders(customer_id);
```

## Views

```sql
-- Create view
CREATE VIEW v_employee_dept AS
SELECT e.emp_id, e.first_name, e.last_name, e.salary,
       d.dept_name, d.location
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id
WHERE e.is_active = TRUE;

-- Query the view
SELECT * FROM v_employee_dept WHERE dept_name = 'Engineering';

-- Updatable view (simple views only)
UPDATE v_employee_dept SET salary = salary * 1.1 WHERE emp_id = 101;

-- Materialized view (pre-computed, must be refreshed)
CREATE MATERIALIZED VIEW mv_dept_summary AS
SELECT dept_id, COUNT(*) AS emp_count, AVG(salary) AS avg_salary
FROM employees
GROUP BY dept_id;

REFRESH MATERIALIZED VIEW mv_dept_summary;

-- Drop view
DROP VIEW v_employee_dept;
DROP MATERIALIZED VIEW mv_dept_summary;
```

## Interview Questions and Answers

**Q1. What is a PRIMARY KEY and how is it different from UNIQUE?**

Answer:
- **PRIMARY KEY:** Uniquely identifies each row. Automatically NOT NULL. Only ONE per table. Creates a clustered index (in most DBs). Cannot contain NULLs.
- **UNIQUE:** Ensures all values are distinct. Can allow ONE NULL (in most DBs). Multiple UNIQUE constraints allowed per table. Creates a non-clustered index.

Both enforce uniqueness, but PRIMARY KEY also enforces NOT NULL and serves as the main row identifier that other tables reference via FOREIGN KEY.

**Q2. What is a FOREIGN KEY and what does ON DELETE CASCADE mean?**

Answer: A FOREIGN KEY enforces referential integrity — the value in the child table must exist in the referenced parent table. `ON DELETE CASCADE` means: when a parent row is deleted, all child rows referencing it are automatically deleted. Options:
- `ON DELETE CASCADE:` Delete child rows
- `ON DELETE SET NULL:` Set FK column to NULL
- `ON DELETE SET DEFAULT:` Set FK column to default value
- `ON DELETE RESTRICT/NO ACTION:` Prevent deletion if child rows exist (default)

**Q3. What is the difference between a View and a Materialized View?**

Answer:
- **View:** A stored query (virtual table). Executes the underlying query every time it's accessed. Always reflects current data. No storage for data itself.
- **Materialized View:** Pre-computed and stored physically. Must be refreshed to reflect new data (`REFRESH MATERIALIZED VIEW`). Faster to query (no re-execution). Uses storage. Use for complex, slow queries accessed frequently (reports, dashboards).

**Q4. What are the different types of constraints?**

Answer: Five main constraint types:
1. **PRIMARY KEY:** Row identifier, unique + NOT NULL
2. **FOREIGN KEY:** Referential integrity between tables
3. **UNIQUE:** No duplicate values (NULL is usually allowed once)
4. **NOT NULL:** Column must have a value
5. **CHECK:** Custom condition (e.g., salary > 0, age BETWEEN 18 AND 65)
6. **DEFAULT:** Automatic value when none provided (not strictly a constraint but enforces a rule)

---

# 3. DML — Data Manipulation Language

## INSERT

```sql
-- Insert single row
INSERT INTO employees (first_name, last_name, email, dept_id, salary)
VALUES ('Alice', 'Smith', 'alice@co.com', 1, 90000.00);

-- Insert multiple rows (more efficient than single inserts in a loop)
INSERT INTO employees (first_name, last_name, email, dept_id, salary) VALUES
    ('Bob',     'Jones', 'bob@co.com',   2, 75000.00),
    ('Charlie', 'Brown', 'charlie@co.com', 1, 85000.00),
    ('Diana',   'Prince','diana@co.com', 3, 70000.00);

-- Insert from SELECT
INSERT INTO employee_archive
SELECT * FROM employees WHERE hire_date < '2020-01-01';

-- Insert or update (UPSERT) — PostgreSQL
INSERT INTO employees (emp_id, first_name, salary)
VALUES (101, 'Alice', 95000)
ON CONFLICT (emp_id)
DO UPDATE SET salary = EXCLUDED.salary, updated_at = NOW();

-- Insert or ignore (MySQL)
INSERT IGNORE INTO employees (emp_id, first_name, salary)
VALUES (101, 'Alice', 95000);

-- Insert with RETURNING (PostgreSQL)
INSERT INTO employees (first_name, last_name, email)
VALUES ('Eve', 'Davis', 'eve@co.com')
RETURNING emp_id, created_at;
```

## UPDATE

```sql
-- Basic update
UPDATE employees
SET salary = 95000
WHERE emp_id = 101;

-- Update multiple columns
UPDATE employees
SET salary     = salary * 1.1,
    updated_at = NOW(),
    is_active  = TRUE
WHERE dept_id = 1 AND hire_date < '2022-01-01';

-- Update with JOIN (SQL Server / PostgreSQL style)
UPDATE e
SET e.dept_name_cache = d.dept_name
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id
WHERE d.location = 'Mumbai';

-- Update using subquery
UPDATE employees
SET salary = (SELECT AVG(salary) FROM employees WHERE dept_id = 1)
WHERE dept_id = 1 AND salary < (SELECT AVG(salary) * 0.8 FROM employees WHERE dept_id = 1);

-- Update with CASE
UPDATE employees
SET salary = CASE
    WHEN dept_id = 1 THEN salary * 1.15
    WHEN dept_id = 2 THEN salary * 1.10
    ELSE salary * 1.05
END
WHERE is_active = TRUE;
```

## DELETE

```sql
-- Delete specific rows
DELETE FROM employees WHERE emp_id = 101;

-- Delete with condition
DELETE FROM employees
WHERE is_active = FALSE AND last_login < NOW() - INTERVAL '365 days';

-- Delete with subquery (employees in closed departments)
DELETE FROM employees
WHERE dept_id IN (SELECT dept_id FROM departments WHERE is_active = FALSE);

-- Delete with JOIN (PostgreSQL)
DELETE FROM order_items oi
USING orders o
WHERE oi.order_id = o.order_id
AND o.status = 'cancelled';

-- Delete all rows (use TRUNCATE instead for speed)
DELETE FROM temp_table;

-- TRUNCATE (faster, no logging, resets identity)
TRUNCATE TABLE temp_table;
TRUNCATE TABLE temp_table RESTART IDENTITY CASCADE;
```

## MERGE (UPSERT)

```sql
-- Standard MERGE (SQL:2003, supported by Oracle, SQL Server, BigQuery, Spark SQL)
MERGE INTO target_table AS target
USING source_table AS source
ON target.id = source.id
WHEN MATCHED AND source.updated_at > target.updated_at THEN
    UPDATE SET
        target.name       = source.name,
        target.value      = source.value,
        target.updated_at = source.updated_at
WHEN NOT MATCHED THEN
    INSERT (id, name, value, updated_at)
    VALUES (source.id, source.name, source.value, source.updated_at)
WHEN NOT MATCHED BY SOURCE THEN
    DELETE;  -- optional: delete rows in target not in source

-- PostgreSQL UPSERT (INSERT ... ON CONFLICT)
INSERT INTO products (product_id, name, price, stock)
VALUES (100, 'Widget', 9.99, 500)
ON CONFLICT (product_id)
DO UPDATE SET
    price  = EXCLUDED.price,
    stock  = products.stock + EXCLUDED.stock;
```

## Interview Questions and Answers

**Q1. What is the difference between UPDATE and MERGE?**

Answer:
- **UPDATE:** Modifies existing rows in a single table based on a condition. Simple, single-table operation.
- **MERGE (UPSERT):** Combines INSERT, UPDATE, and DELETE in one statement based on matching a source against a target. When matched: UPDATE or DELETE. When not matched: INSERT. Ideal for slowly changing dimensions (SCD), incremental loads, and data reconciliation.

**Q2. How would you copy data from one table to another?**

Answer:
```sql
-- If target table already exists
INSERT INTO table_b SELECT * FROM table_a WHERE condition;

-- Create new table from existing data
CREATE TABLE table_b AS SELECT * FROM table_a;

-- Copy structure only (no data)
CREATE TABLE table_b AS SELECT * FROM table_a WHERE 1=0;

-- Copy with SELECT INTO (SQL Server/PostgreSQL)
SELECT * INTO table_b FROM table_a;
```

**Q3. How do you update a table using values from another table?**

Answer: Use UPDATE with JOIN or a correlated subquery:
```sql
-- Using JOIN (PostgreSQL)
UPDATE employees e
SET salary = d.budget_per_head
FROM dept_salary_budget d
WHERE e.dept_id = d.dept_id;

-- Using correlated subquery (standard SQL)
UPDATE employees
SET salary = (
    SELECT budget_per_head
    FROM dept_salary_budget
    WHERE dept_id = employees.dept_id
)
WHERE EXISTS (
    SELECT 1 FROM dept_salary_budget WHERE dept_id = employees.dept_id
);
```

**Q4. What is RETURNING in PostgreSQL and when is it useful?**

Answer: `RETURNING` in PostgreSQL returns data from rows affected by INSERT, UPDATE, or DELETE — without a separate SELECT. Useful for:
1. Getting auto-generated IDs after INSERT
2. Confirming what was updated/deleted
3. Chaining results into CTEs

```sql
-- Get inserted ID
INSERT INTO orders (customer_id, total) VALUES (5, 199.99)
RETURNING order_id;

-- Get deleted rows for archiving
WITH deleted AS (
    DELETE FROM expired_sessions RETURNING *
)
INSERT INTO session_archive SELECT * FROM deleted;
```

---

# 4. SELECT and Filtering

## Basic SELECT

```sql
-- Select all columns (avoid * in production)
SELECT * FROM employees;

-- Select specific columns
SELECT emp_id, first_name, last_name, salary FROM employees;

-- Select with expressions
SELECT
    emp_id,
    first_name || ' ' || last_name         AS full_name,
    salary / 12                             AS monthly_salary,
    salary * 0.1                            AS bonus_estimate,
    EXTRACT(YEAR FROM hire_date)            AS hire_year,
    CURRENT_DATE - hire_date                AS days_employed
FROM employees;

-- Select distinct values
SELECT DISTINCT dept_id FROM employees;
SELECT DISTINCT dept_id, job_title FROM employees;  -- distinct combination

-- Select with LIMIT / OFFSET (pagination)
SELECT emp_id, full_name, salary
FROM employees
ORDER BY salary DESC
LIMIT 10 OFFSET 20;  -- page 3 (items 21-30)
```

## WHERE Clause

```sql
-- Comparison operators
WHERE salary > 80000
WHERE salary >= 80000 AND salary <= 120000
WHERE salary BETWEEN 80000 AND 120000  -- inclusive
WHERE dept_id IN (1, 2, 3)
WHERE dept_id NOT IN (4, 5)
WHERE first_name = 'Alice'
WHERE first_name != 'Alice'   -- or <> 'Alice'

-- Pattern matching
WHERE email LIKE '%@gmail.com'     -- ends with @gmail.com
WHERE first_name LIKE 'A%'        -- starts with A
WHERE phone LIKE '___-___-____'   -- exactly 3-3-4 digits
WHERE name ILIKE '%alice%'        -- case-insensitive (PostgreSQL)
WHERE name NOT LIKE '%test%'

-- NULL checks
WHERE manager_id IS NULL
WHERE manager_id IS NOT NULL

-- Multiple conditions
WHERE dept_id = 1 AND salary > 80000
WHERE dept_id = 1 OR dept_id = 2
WHERE NOT (dept_id = 3)
WHERE dept_id IN (1, 2) AND salary BETWEEN 70000 AND 120000

-- EXISTS (correlated, often faster than IN for large sets)
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
)
```

## ORDER BY

```sql
-- Basic sort
SELECT * FROM employees ORDER BY salary;              -- ASC default
SELECT * FROM employees ORDER BY salary DESC;         -- descending
SELECT * FROM employees ORDER BY dept_id, salary DESC; -- multi-column

-- NULL sorting (PostgreSQL)
SELECT * FROM employees ORDER BY manager_id NULLS LAST;
SELECT * FROM employees ORDER BY manager_id NULLS FIRST;

-- Order by expression
SELECT *, EXTRACT(YEAR FROM hire_date) AS hire_year
FROM employees
ORDER BY hire_year DESC, last_name;

-- Order by column position (avoid in production — fragile)
SELECT first_name, last_name, salary FROM employees ORDER BY 3 DESC;
```

## Interview Questions and Answers

**Q1. What is the difference between WHERE and HAVING?**

Answer:
- **WHERE:** Filters individual rows BEFORE grouping. Cannot use aggregate functions.
- **HAVING:** Filters groups AFTER GROUP BY. Can use aggregate functions.

```sql
-- WHERE: filter rows before grouping
SELECT dept_id, AVG(salary)
FROM employees
WHERE is_active = TRUE          -- filter rows first
GROUP BY dept_id
HAVING AVG(salary) > 80000;     -- then filter groups
```

**Q2. What is the difference between IN and EXISTS?**

Answer:
- **IN:** Evaluates the subquery once, builds a list, checks membership. Slow for large subquery results. Fails if subquery returns NULL.
- **EXISTS:** Checks if subquery returns ANY row (short-circuits on first match). Faster for large tables. Not affected by NULLs.

```sql
-- IN: executes once, returns list
SELECT * FROM customers
WHERE customer_id IN (SELECT customer_id FROM orders WHERE status = 'premium');

-- EXISTS: short-circuits, generally faster for large result sets
SELECT * FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.customer_id = c.customer_id AND o.status = 'premium'
);
```
Use EXISTS when the subquery returns many rows, or when checking for existence without needing the values.

**Q3. Explain the LIKE operator and its wildcards.**

Answer: LIKE matches string patterns with two wildcards:
- `%`: Matches zero or more characters (`'A%'` matches 'Alice', 'Amazon', 'A')
- `_`: Matches exactly one character (`'A_'` matches 'AB', 'AC' but not 'Alice')

Performance note: `LIKE '%pattern%'` cannot use standard B-tree indexes (leading wildcard). `LIKE 'pattern%'` (no leading wildcard) CAN use an index. For full-text search, use FTS indexes or dedicated tools.

**Q4. What is the difference between BETWEEN and >= / <=?**

Answer: `BETWEEN a AND b` is equivalent to `>= a AND <= b` — both endpoints are inclusive. They produce identical results. BETWEEN is more readable; use it for ranges. Note: for dates, `BETWEEN '2024-01-01' AND '2024-01-31'` includes all of Jan 31 only up to midnight (00:00:00). For date ranges with timestamps, use `>= '2024-01-01' AND < '2024-02-01'` instead.

---

# 5. Joins

## What is it?

Joins combine rows from two or more tables based on a related column. Understanding join types and strategies is one of the most critical SQL interview topics.

## Join Types

```
┌─────────────────────────────────────────────────────────────────┐
│                        JOIN TYPES                               │
│                                                                 │
│  INNER JOIN:  Only matching rows from BOTH tables              │
│  LEFT JOIN:   All rows from LEFT + matching from right         │
│  RIGHT JOIN:  All rows from RIGHT + matching from left         │
│  FULL JOIN:   All rows from BOTH (NULLs for non-matching)      │
│  CROSS JOIN:  Every row × every row (Cartesian product)        │
│  SELF JOIN:   Table joined with itself                         │
│                                                                 │
│  INNER:  [  A ∩ B  ]                                           │
│  LEFT:   [A ∪ (A ∩ B)]                                         │
│  RIGHT:  [(A ∩ B) ∪ B]                                         │
│  FULL:   [A ∪ B]                                               │
└─────────────────────────────────────────────────────────────────┘
```

## INNER JOIN

```sql
-- Returns only rows where condition matches in BOTH tables
SELECT e.emp_id, e.first_name, e.last_name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id;

-- Equivalent (old syntax — avoid in production)
SELECT e.emp_id, d.dept_name
FROM employees e, departments d
WHERE e.dept_id = d.dept_id;

-- Multiple joins
SELECT o.order_id, c.customer_name, p.product_name, oi.quantity
FROM orders o
JOIN customers c  ON o.customer_id  = c.customer_id
JOIN order_items oi ON o.order_id   = oi.order_id
JOIN products p  ON oi.product_id   = p.product_id
WHERE o.order_date >= '2024-01-01';
```

## LEFT JOIN

```sql
-- All rows from left table; NULL for right columns when no match
SELECT e.emp_id, e.first_name, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id;
-- Employees with no department will show dept_name = NULL

-- Find employees WITHOUT a department
SELECT e.emp_id, e.first_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id
WHERE d.dept_id IS NULL;  -- NULL in right table = no match

-- Find customers who never placed an order
SELECT c.customer_id, c.customer_name
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
```

## RIGHT JOIN

```sql
-- All rows from right table; NULL for left columns when no match
-- Usually rewritten as LEFT JOIN (easier to reason about)
SELECT e.first_name, d.dept_name
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.dept_id;
-- Departments with no employees will show first_name = NULL

-- Equivalent LEFT JOIN (preferred)
SELECT e.first_name, d.dept_name
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.dept_id;
```

## FULL OUTER JOIN

```sql
-- All rows from both tables; NULL where no match
SELECT e.first_name, d.dept_name
FROM employees e
FULL OUTER JOIN departments d ON e.dept_id = d.dept_id;

-- Simulate FULL JOIN (for DBs without FULL JOIN support)
SELECT e.first_name, d.dept_name
FROM employees e LEFT JOIN departments d ON e.dept_id = d.dept_id
UNION
SELECT e.first_name, d.dept_name
FROM employees e RIGHT JOIN departments d ON e.dept_id = d.dept_id;
```

## CROSS JOIN

```sql
-- Every row from left × every row from right
-- 100 rows × 50 rows = 5,000 rows
SELECT c.color, s.size
FROM colors c
CROSS JOIN sizes s;

-- Generate date ranges, combinations
SELECT d.date, p.product_id
FROM date_spine d
CROSS JOIN products p;  -- all product-date combinations
```

## SELF JOIN

```sql
-- Join table with itself — common for hierarchies, comparisons
-- Find employee and their manager
SELECT e.first_name AS employee, m.first_name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id;

-- Find employees with the same salary
SELECT a.first_name, b.first_name, a.salary
FROM employees a
JOIN employees b ON a.salary = b.salary AND a.emp_id < b.emp_id;
-- a.emp_id < b.emp_id prevents (Alice, Alice) and duplicates (Alice, Bob) & (Bob, Alice)
```

## Non-Equi Joins

```sql
-- Join on a range condition (not equality)
-- Assign salary grade based on salary range
SELECT e.first_name, e.salary, sg.grade
FROM employees e
JOIN salary_grades sg ON e.salary BETWEEN sg.min_salary AND sg.max_salary;

-- Latest record per group using non-equi join
SELECT e.*
FROM employees e
LEFT JOIN employees e2
    ON e.emp_id = e2.emp_id AND e.updated_at < e2.updated_at
WHERE e2.emp_id IS NULL;  -- no newer record exists
```

## Interview Questions and Answers

**Q1. What is the difference between INNER JOIN and LEFT JOIN?**

Answer: INNER JOIN returns only rows where the join condition is satisfied in BOTH tables — non-matching rows are excluded. LEFT JOIN returns ALL rows from the left table; if no match exists in the right table, the right columns are NULL. Use INNER JOIN when you only want matching data; use LEFT JOIN when you want all left-side records regardless of whether a match exists.

**Q2. How do you find rows in one table that don't exist in another?**

Answer: Three approaches:
```sql
-- 1. LEFT JOIN + WHERE NULL (most common)
SELECT a.* FROM table_a a
LEFT JOIN table_b b ON a.id = b.id
WHERE b.id IS NULL;

-- 2. NOT EXISTS (efficient, handles NULLs correctly)
SELECT * FROM table_a a
WHERE NOT EXISTS (SELECT 1 FROM table_b b WHERE b.id = a.id);

-- 3. NOT IN (careful with NULLs! If table_b has NULL id, returns nothing)
SELECT * FROM table_a
WHERE id NOT IN (SELECT id FROM table_b WHERE id IS NOT NULL);
```
Prefer NOT EXISTS or LEFT JOIN for NULL safety.

**Q3. What is a CROSS JOIN and when would you use it?**

Answer: A CROSS JOIN produces the Cartesian product — every row from the left table paired with every row from the right table. Result size = left_rows × right_rows. Use cases:
1. Generate all combinations (colors × sizes, products × dates)
2. Build date spines (CROSS JOIN a date series)
3. Generate test data
4. Reporting: show all possible category-region combinations even if no sales

Danger: 1M × 1M = 1 trillion rows. Always filter or limit.

**Q4. What is a self join? Give a real example.**

Answer: A self join joins a table with itself, typically aliased differently. Classic use cases:
1. **Employee-Manager hierarchy:** Find each employee's manager (both in the same table)
2. **Compare rows:** Find products with the same price
3. **Consecutive events:** Find events that happened within N minutes of each other
4. **Organizational trees:** All levels of management chain

**Q5. Explain the difference between JOIN conditions in ON vs WHERE.**

Answer: Functionally equivalent for INNER JOINs, but different for OUTER JOINs:
```sql
-- These produce different results for LEFT JOIN:

-- Filter in ON: keeps all left rows; only right rows matching both conditions
SELECT c.*, o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
    AND o.status = 'completed';  -- filters right side only

-- Filter in WHERE: effectively converts LEFT JOIN to INNER JOIN
SELECT c.*, o.order_id
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'completed';  -- filters entire result (excludes NULL right rows)
```
Rule: For LEFT JOIN filtering of the right table → use ON. For filtering the final result → use WHERE.

---

# 6. Aggregations and GROUP BY

## Aggregate Functions

```sql
-- Core aggregate functions
SELECT
    COUNT(*)                    AS total_rows,      -- count all rows
    COUNT(salary)               AS non_null_count,  -- count non-NULL values
    COUNT(DISTINCT dept_id)     AS unique_depts,    -- count distinct values
    SUM(salary)                 AS total_salary,
    AVG(salary)                 AS avg_salary,
    MIN(salary)                 AS min_salary,
    MAX(salary)                 AS max_salary,
    STDDEV(salary)              AS salary_stddev,   -- standard deviation
    VARIANCE(salary)            AS salary_variance
FROM employees;

-- COUNT(*) vs COUNT(column) vs COUNT(DISTINCT col)
SELECT
    COUNT(*)            AS all_rows,         -- 100 (includes NULLs)
    COUNT(manager_id)   AS has_manager,      -- 85 (excludes NULL manager_id)
    COUNT(DISTINCT dept_id) AS unique_depts  -- 5 (distinct non-NULL values)
FROM employees;
```

## GROUP BY

```sql
-- Group and aggregate
SELECT
    dept_id,
    COUNT(*)         AS emp_count,
    AVG(salary)      AS avg_salary,
    SUM(salary)      AS total_salary,
    MIN(salary)      AS min_salary,
    MAX(salary)      AS max_salary
FROM employees
WHERE is_active = TRUE          -- filter rows BEFORE grouping
GROUP BY dept_id
HAVING COUNT(*) >= 5            -- filter groups AFTER grouping
ORDER BY avg_salary DESC;

-- GROUP BY multiple columns
SELECT
    dept_id,
    EXTRACT(YEAR FROM hire_date) AS hire_year,
    COUNT(*) AS headcount
FROM employees
GROUP BY dept_id, EXTRACT(YEAR FROM hire_date)
ORDER BY dept_id, hire_year;

-- GROUP BY with expressions
SELECT
    CASE
        WHEN salary < 50000  THEN 'Low'
        WHEN salary < 100000 THEN 'Mid'
        ELSE 'High'
    END AS salary_band,
    COUNT(*) AS emp_count
FROM employees
GROUP BY salary_band;  -- can use alias in GROUP BY in some DBs

-- GROUP BY ALL columns in SELECT (PostgreSQL shorthand)
-- SELECT col1, col2, COUNT(*) FROM t GROUP BY 1, 2
```

## HAVING

```sql
-- HAVING filters groups (not rows)
SELECT dept_id, AVG(salary) AS avg_sal
FROM employees
GROUP BY dept_id
HAVING AVG(salary) > 80000;

-- HAVING with COUNT
SELECT customer_id, COUNT(order_id) AS order_count
FROM orders
GROUP BY customer_id
HAVING COUNT(order_id) >= 5;     -- customers with 5+ orders

-- Combined WHERE + HAVING
SELECT dept_id, COUNT(*) AS active_count
FROM employees
WHERE hire_date >= '2020-01-01'  -- filter rows
GROUP BY dept_id
HAVING COUNT(*) >= 3;            -- filter groups
```

## ROLLUP, CUBE, GROUPING SETS

```sql
-- ROLLUP: subtotals and grand total (hierarchical)
SELECT dept_id, job_title, SUM(salary) AS total
FROM employees
GROUP BY ROLLUP(dept_id, job_title);
-- Produces: (dept, job), (dept, NULL), (NULL, NULL)
-- NULL = subtotal row

-- CUBE: all combinations of subtotals
SELECT dept_id, job_title, SUM(salary) AS total
FROM employees
GROUP BY CUBE(dept_id, job_title);
-- Produces: (dept, job), (dept, NULL), (NULL, job), (NULL, NULL)

-- GROUPING SETS: specific combinations
SELECT dept_id, job_title, SUM(salary)
FROM employees
GROUP BY GROUPING SETS (
    (dept_id, job_title),  -- by dept and job
    (dept_id),             -- by dept only
    ()                     -- grand total
);

-- GROUPING() function: identify which rows are subtotals
SELECT
    dept_id,
    GROUPING(dept_id) AS is_subtotal,  -- 1 if this is a subtotal row
    SUM(salary)
FROM employees
GROUP BY ROLLUP(dept_id);
```

## Interview Questions and Answers

**Q1. What is the difference between COUNT(*), COUNT(col), and COUNT(DISTINCT col)?**

Answer:
- `COUNT(*)`: Counts ALL rows including NULLs — total row count.
- `COUNT(column)`: Counts rows where column is NOT NULL — ignores NULLs.
- `COUNT(DISTINCT column)`: Counts distinct non-NULL values.

```sql
-- Table: [1, 2, 2, NULL, NULL]
COUNT(*)          -- 5
COUNT(val)        -- 3 (excludes 2 NULLs)
COUNT(DISTINCT val) -- 2 (distinct values: 1 and 2)
```

**Q2. What is the difference between WHERE and HAVING?**

Answer: WHERE filters individual rows before grouping — cannot use aggregate functions. HAVING filters groups after GROUP BY — can use aggregate functions. Example: WHERE salary > 50000 filters employees before counting. HAVING COUNT(*) > 5 filters departments that have more than 5 employees after counting.

**Q3. Can you use a column alias in HAVING?**

Answer: Depends on the database. In standard SQL, you cannot use a SELECT alias in HAVING because HAVING executes before SELECT. In some databases (MySQL, BigQuery), you can. The safe approach is to use a CTE or subquery:
```sql
-- Standard SQL (always works)
SELECT dept_id, AVG(salary) AS avg_sal
FROM employees
GROUP BY dept_id
HAVING AVG(salary) > 80000;  -- repeat the expression

-- Or use CTE
WITH dept_stats AS (
    SELECT dept_id, AVG(salary) AS avg_sal
    FROM employees
    GROUP BY dept_id
)
SELECT * FROM dept_stats WHERE avg_sal > 80000;
```

**Q4. Explain ROLLUP vs CUBE.**

Answer:
- **ROLLUP:** Creates subtotals along a hierarchy. `GROUP BY ROLLUP(a, b, c)` produces (a,b,c), (a,b), (a), () — moving right to left.
- **CUBE:** Creates subtotals for ALL combinations. `GROUP BY CUBE(a, b)` produces (a,b), (a), (b), ().
- **GROUPING SETS:** Custom combinations — specify exactly which groupings you want.

Use ROLLUP for hierarchical reporting (year → quarter → month). Use CUBE for cross-dimensional analysis (region × product × time).

---

# 7. Subqueries and CTEs

## Subqueries

```sql
-- Scalar subquery: returns single value
SELECT first_name, salary,
    (SELECT AVG(salary) FROM employees) AS company_avg,
    salary - (SELECT AVG(salary) FROM employees) AS diff_from_avg
FROM employees;

-- Row subquery: returns single row
SELECT * FROM employees
WHERE (dept_id, salary) = (SELECT dept_id, MAX(salary) FROM employees GROUP BY dept_id LIMIT 1);

-- Table subquery (derived table): used in FROM
SELECT dept_id, avg_sal
FROM (
    SELECT dept_id, AVG(salary) AS avg_sal
    FROM employees
    GROUP BY dept_id
) dept_avgs
WHERE avg_sal > 80000;

-- Correlated subquery: references outer query
-- Find employees earning more than their department average
SELECT e.first_name, e.salary, e.dept_id
FROM employees e
WHERE e.salary > (
    SELECT AVG(salary)
    FROM employees
    WHERE dept_id = e.dept_id  -- references outer query's dept_id
);

-- Subquery in WHERE with IN
SELECT * FROM products
WHERE category_id IN (
    SELECT category_id FROM categories WHERE is_active = TRUE
);

-- Subquery with EXISTS (faster for large datasets)
SELECT c.customer_name
FROM customers c
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = c.customer_id
    AND o.total > 1000
);
```

## CTEs (Common Table Expressions)

```sql
-- Basic CTE
WITH dept_summary AS (
    SELECT dept_id,
           COUNT(*) AS emp_count,
           AVG(salary) AS avg_salary
    FROM employees
    GROUP BY dept_id
)
SELECT d.dept_name, ds.emp_count, ds.avg_salary
FROM dept_summary ds
JOIN departments d ON ds.dept_id = d.dept_id
WHERE ds.avg_salary > 75000
ORDER BY ds.avg_salary DESC;

-- Multiple CTEs
WITH
high_earners AS (
    SELECT emp_id, first_name, salary, dept_id
    FROM employees
    WHERE salary > 100000
),
dept_counts AS (
    SELECT dept_id, COUNT(*) AS total_emp
    FROM employees
    GROUP BY dept_id
)
SELECT he.first_name, he.salary, dc.total_emp
FROM high_earners he
JOIN dept_counts dc ON he.dept_id = dc.dept_id;

-- CTE reused multiple times (computed once)
WITH expensive_orders AS (
    SELECT order_id, customer_id, total
    FROM orders
    WHERE total > 5000
)
SELECT
    (SELECT COUNT(*) FROM expensive_orders) AS count,
    (SELECT AVG(total) FROM expensive_orders) AS avg_total,
    (SELECT MAX(total) FROM expensive_orders) AS max_total;
```

## Recursive CTEs

```sql
-- Recursive CTE — standard structure:
WITH RECURSIVE cte_name AS (
    -- Anchor: base case (non-recursive)
    SELECT ...
    UNION ALL
    -- Recursive: references the CTE itself
    SELECT ... FROM cte_name WHERE termination_condition
)
SELECT * FROM cte_name;

-- Example 1: Generate number sequence
WITH RECURSIVE numbers AS (
    SELECT 1 AS n                           -- anchor
    UNION ALL
    SELECT n + 1 FROM numbers WHERE n < 10  -- recursive
)
SELECT n FROM numbers;
-- Output: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

-- Example 2: Generate date series
WITH RECURSIVE date_series AS (
    SELECT '2024-01-01'::DATE AS dt
    UNION ALL
    SELECT dt + INTERVAL '1 day' FROM date_series WHERE dt < '2024-01-31'
)
SELECT dt FROM date_series;

-- Example 3: Employee hierarchy (find all subordinates)
WITH RECURSIVE emp_hierarchy AS (
    -- Anchor: start from the CEO (no manager)
    SELECT emp_id, first_name, manager_id, 0 AS level
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive: find each employee's direct reports
    SELECT e.emp_id, e.first_name, e.manager_id, eh.level + 1
    FROM employees e
    JOIN emp_hierarchy eh ON e.manager_id = eh.emp_id
)
SELECT emp_id, first_name, level
FROM emp_hierarchy
ORDER BY level, first_name;

-- Example 4: Find all ancestors (go UP the tree)
WITH RECURSIVE ancestors AS (
    SELECT emp_id, first_name, manager_id, 0 AS level
    FROM employees
    WHERE emp_id = 42  -- start from specific employee

    UNION ALL

    SELECT e.emp_id, e.first_name, e.manager_id, a.level - 1
    FROM employees e
    JOIN ancestors a ON e.emp_id = a.manager_id
)
SELECT * FROM ancestors ORDER BY level;
```

## Interview Questions and Answers

**Q1. What is a CTE and how is it different from a subquery?**

Answer:
- **Subquery:** Inline query embedded inside another query. Executed each time it's referenced. Less readable for complex queries.
- **CTE:** Named temporary result set defined with WITH clause. Executes once (usually), can be referenced multiple times in the same query, supports recursion, and is much more readable.

When to use CTE: Complex multi-step transformations, recursive queries, when the same intermediate result is needed in multiple places.

**Q2. What is a correlated subquery and when is it slow?**

Answer: A correlated subquery references a column from the outer query — it re-executes for every row in the outer query. If the outer query has 1 million rows, the subquery runs 1 million times → O(n²) complexity. Often rewritable as a JOIN or window function which is faster:
```sql
-- Slow: correlated subquery (runs once per employee row)
SELECT e.first_name, e.salary
FROM employees e
WHERE e.salary = (SELECT MAX(salary) FROM employees WHERE dept_id = e.dept_id);

-- Fast: window function (single pass)
SELECT first_name, salary
FROM (
    SELECT first_name, salary,
           MAX(salary) OVER (PARTITION BY dept_id) AS dept_max
    FROM employees
) t
WHERE salary = dept_max;
```

**Q3. What is a recursive CTE and when do you use it?**

Answer: A recursive CTE references itself in the recursive part. Structure: anchor query (base case) UNION ALL recursive query (references the CTE). Used for:
1. **Hierarchies:** Employee-manager trees, org charts, category trees
2. **Graph traversal:** Find connected nodes, shortest path
3. **Sequence generation:** Date series, number sequences
4. **Bill of materials:** Product components and sub-components

**Q4. What is the difference between CTE and a temp table?**

Answer:
- **CTE:** In-memory, scoped to a single query, no physical storage, auto-cleaned. Cannot be indexed. Re-evaluated each time in some DBs.
- **Temp table:** Physically stored (in temp tablespace), persists for the session, can be indexed, can be referenced by multiple queries, useful for very large intermediate results.

Use CTE for logical organization within a single query. Use temp table when you need indexes, need the result across multiple queries, or when the CTE becomes a performance bottleneck.

---

# 8. Window Functions

## What is it?

Window functions perform calculations across a set of rows related to the current row — unlike aggregate functions which collapse rows into one, window functions retain all rows while adding a computed column.

## Syntax

```sql
function_name() OVER (
    PARTITION BY partition_col     -- divide rows into groups
    ORDER BY sort_col [ASC|DESC]   -- order within partition
    ROWS/RANGE BETWEEN             -- define window frame
        {UNBOUNDED PRECEDING | n PRECEDING | CURRENT ROW}
        AND
        {CURRENT ROW | n FOLLOWING | UNBOUNDED FOLLOWING}
)
```

## Ranking Functions

```sql
SELECT
    emp_id,
    first_name,
    dept_id,
    salary,

    -- ROW_NUMBER: unique sequential, no ties
    ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS row_num,

    -- RANK: gaps after ties (1, 1, 3, 4...)
    RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk,

    -- DENSE_RANK: no gaps after ties (1, 1, 2, 3...)
    DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS dense_rnk,

    -- NTILE: divide into N equal buckets
    NTILE(4) OVER (PARTITION BY dept_id ORDER BY salary DESC) AS quartile,

    -- PERCENT_RANK: 0 to 1 percentile rank
    PERCENT_RANK() OVER (PARTITION BY dept_id ORDER BY salary) AS pct_rank,

    -- CUME_DIST: cumulative distribution 0 to 1
    CUME_DIST() OVER (PARTITION BY dept_id ORDER BY salary) AS cum_dist

FROM employees;

-- Difference between RANK, DENSE_RANK, ROW_NUMBER:
-- Salaries: 100, 100, 80, 70
-- ROW_NUMBER: 1, 2, 3, 4  (always unique)
-- RANK:       1, 1, 3, 4  (skips 2 after tie)
-- DENSE_RANK: 1, 1, 2, 3  (no skip)
```

## Lead and Lag

```sql
SELECT
    order_id,
    customer_id,
    order_date,
    total,

    -- Previous row's value
    LAG(total, 1, 0) OVER (PARTITION BY customer_id ORDER BY order_date) AS prev_order_total,

    -- Next row's value
    LEAD(total, 1, 0) OVER (PARTITION BY customer_id ORDER BY order_date) AS next_order_total,

    -- Month-over-month change
    total - LAG(total) OVER (PARTITION BY customer_id ORDER BY order_date) AS mom_change,

    -- Day-over-day change percentage
    ROUND(
        (total - LAG(total) OVER (ORDER BY order_date)) /
        NULLIF(LAG(total) OVER (ORDER BY order_date), 0) * 100, 2
    ) AS pct_change

FROM orders;
```

## Aggregate Window Functions

```sql
SELECT
    emp_id,
    dept_id,
    salary,
    hire_date,

    -- Running total (cumulative sum)
    SUM(salary) OVER (
        PARTITION BY dept_id
        ORDER BY hire_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total,

    -- Department total (no ORDER BY = whole partition)
    SUM(salary) OVER (PARTITION BY dept_id) AS dept_total,

    -- Percentage of department total
    ROUND(salary / SUM(salary) OVER (PARTITION BY dept_id) * 100, 2) AS pct_of_dept,

    -- 3-row moving average
    AVG(salary) OVER (
        PARTITION BY dept_id
        ORDER BY hire_date
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS moving_avg_3,

    -- Company-wide rank by salary
    RANK() OVER (ORDER BY salary DESC) AS company_rank,

    -- First/Last value in partition
    FIRST_VALUE(salary) OVER (PARTITION BY dept_id ORDER BY salary DESC) AS dept_max_salary,
    LAST_VALUE(salary) OVER (
        PARTITION BY dept_id ORDER BY salary DESC
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS dept_min_salary

FROM employees;
```

## Window Frame

```sql
-- ROWS BETWEEN: physical rows (position-based)
ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW  -- from start to current
ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING           -- current ± 1 row
ROWS BETWEEN 2 PRECEDING AND 0 FOLLOWING           -- last 3 rows (including current)
ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING   -- from current to end

-- RANGE BETWEEN: logical range (value-based)
RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW  -- all rows with value ≤ current
RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW  -- last 7 days

-- Practical patterns
-- Running count of rows
COUNT(*) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)

-- 7-day rolling average
AVG(revenue) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)

-- Cumulative sum that resets per partition
SUM(sales) OVER (PARTITION BY region ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
```

## Common Window Function Patterns

```sql
-- Pattern 1: Top N per group (deduplication)
SELECT *
FROM (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn
    FROM employees
) t
WHERE rn <= 3;  -- top 3 per department

-- Pattern 2: Remove duplicates, keep latest
SELECT *
FROM (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY updated_at DESC) AS rn
    FROM user_events
) t
WHERE rn = 1;

-- Pattern 3: Find previous/next event
SELECT
    user_id,
    event_type,
    event_time,
    LAG(event_type) OVER (PARTITION BY user_id ORDER BY event_time) AS prev_event,
    LEAD(event_type) OVER (PARTITION BY user_id ORDER BY event_time) AS next_event
FROM user_events;

-- Pattern 4: Sessionization (gap detection)
WITH sessions AS (
    SELECT *,
        LAG(event_time) OVER (PARTITION BY user_id ORDER BY event_time) AS prev_time,
        CASE WHEN event_time - LAG(event_time) OVER (PARTITION BY user_id ORDER BY event_time)
                  > INTERVAL '30 minutes'
             THEN 1 ELSE 0
        END AS is_new_session
    FROM events
)
SELECT *,
    SUM(is_new_session) OVER (PARTITION BY user_id ORDER BY event_time) AS session_id
FROM sessions;

-- Pattern 5: Running percentage
SELECT
    date,
    revenue,
    SUM(revenue) OVER (ORDER BY date) AS cumulative_revenue,
    ROUND(SUM(revenue) OVER (ORDER BY date) /
          SUM(revenue) OVER () * 100, 2) AS pct_of_total
FROM daily_revenue;
```

## Interview Questions and Answers

**Q1. What is the difference between ROW_NUMBER, RANK, and DENSE_RANK?**

Answer:
```
Data: Salaries [100K, 100K, 90K, 80K]

ROW_NUMBER: 1, 2, 3, 4   → always unique, tie broken arbitrarily
RANK:       1, 1, 3, 4   → ties get same rank, next rank has gap
DENSE_RANK: 1, 1, 2, 3   → ties get same rank, no gap in numbering
```
Use ROW_NUMBER for deduplication (need exactly 1 row). Use DENSE_RANK for leaderboards (no gaps). Use RANK for competition-style ranking (gaps after ties).

**Q2. How do you find the top N records per group?**

Answer:
```sql
-- Most common approach: ROW_NUMBER in subquery
SELECT dept_id, emp_id, first_name, salary
FROM (
    SELECT dept_id, emp_id, first_name, salary,
           ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn
    FROM employees
) t
WHERE rn <= 3;

-- Using DENSE_RANK if ties should both be included:
WHERE dense_rn <= 3;  -- could return more than 3 if there are ties at rank 3
```

**Q3. What is the difference between ROWS BETWEEN and RANGE BETWEEN?**

Answer:
- **ROWS BETWEEN:** Physical row positions. `ROWS BETWEEN 3 PRECEDING AND CURRENT ROW` — the 3 rows immediately before the current row regardless of their values.
- **RANGE BETWEEN:** Logical value range. `RANGE BETWEEN 3 PRECEDING AND CURRENT ROW` — all rows whose ORDER BY column value is within 3 units of the current row. Treats tied values as a group.

`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` includes all rows with value ≤ current, which means tied rows may produce the same cumulative sum. `ROWS BETWEEN` gives strictly position-based windows.

**Q4. How does LAG/LEAD work and what are the parameters?**

Answer: `LAG(column, offset, default)` and `LEAD(column, offset, default)`:
- `column`: Which column's value to access
- `offset`: How many rows back (LAG) or forward (LEAD) — default 1
- `default`: Value to return when there's no row at that position (NULL by default)

```sql
LAG(salary, 1, 0)  -- previous row's salary, 0 if no previous row
LEAD(salary, 2)    -- salary 2 rows ahead, NULL if no such row
```

**Q5. How do you calculate a 7-day moving average?**

Answer:
```sql
SELECT
    date,
    revenue,
    AVG(revenue) OVER (
        ORDER BY date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW  -- current + 6 prior = 7 rows
    ) AS moving_avg_7d
FROM daily_revenue;

-- Note: Use ROWS not RANGE to ensure exactly 7 physical rows
-- RANGE would include all rows on the same date
```

---

# 9. Set Operations

## UNION, INTERSECT, EXCEPT

```sql
-- UNION: combine results, REMOVE duplicates
SELECT emp_id, first_name FROM current_employees
UNION
SELECT emp_id, first_name FROM archived_employees;

-- UNION ALL: combine results, KEEP duplicates (faster — no dedup step)
SELECT product_id, 'warehouse_a' AS source FROM warehouse_a
UNION ALL
SELECT product_id, 'warehouse_b' AS source FROM warehouse_b;

-- INTERSECT: rows present in BOTH queries
SELECT customer_id FROM 2023_customers
INTERSECT
SELECT customer_id FROM 2024_customers;  -- customers in both years

-- EXCEPT (or MINUS in Oracle): rows in first query NOT in second
SELECT customer_id FROM 2023_customers
EXCEPT
SELECT customer_id FROM 2024_customers;  -- 2023 customers who didn't return in 2024
```

## Rules for Set Operations

```sql
-- Rules:
-- 1. Same number of columns
-- 2. Columns must have compatible data types
-- 3. Column names come from the FIRST SELECT
-- 4. ORDER BY applies to the final result (at the end)
-- 5. UNION/INTERSECT/EXCEPT remove duplicates; add ALL to keep them

-- Ordering the final result
SELECT name FROM table_a
UNION
SELECT name FROM table_b
ORDER BY name;  -- ORDER BY applies to combined result

-- Using set ops in CTEs
WITH all_users AS (
    SELECT user_id, 'web' AS platform FROM web_users
    UNION ALL
    SELECT user_id, 'mobile' AS platform FROM mobile_users
)
SELECT platform, COUNT(*) FROM all_users GROUP BY platform;
```

## Interview Questions and Answers

**Q1. What is the difference between UNION and UNION ALL?**

Answer: UNION combines results from two queries and removes duplicate rows — requires a sort/hash step to identify duplicates, so it's slower. UNION ALL combines results and keeps all rows including duplicates — no dedup step, faster. Use UNION ALL when you know results are distinct (e.g., from different tables with different keys) or when you don't need dedup, for better performance.

**Q2. What is the difference between EXCEPT and NOT IN?**

Answer:
- **EXCEPT:** Set operation between two complete result sets. Removes duplicates from the first set. Simpler syntax for comparing full tables.
- **NOT IN:** Row-by-row filter with a specific column. Fails silently if the subquery returns NULLs (returns empty result).

Use EXCEPT for set comparisons. Use NOT EXISTS instead of NOT IN when NULLs might be present.

---

# 10. String Functions

## Core String Functions

```sql
-- Length
SELECT LENGTH('Hello World');         -- 11 (chars)
SELECT CHAR_LENGTH('Hello World');    -- 11 (same, more standard)
SELECT OCTET_LENGTH('Hello');         -- 5 (bytes)

-- Case
SELECT UPPER('hello');                -- 'HELLO'
SELECT LOWER('HELLO');                -- 'hello'
SELECT INITCAP('hello world');        -- 'Hello World' (PostgreSQL)

-- Trim
SELECT TRIM('  hello  ');             -- 'hello'
SELECT LTRIM('  hello  ');            -- 'hello  '
SELECT RTRIM('  hello  ');            -- '  hello'
SELECT TRIM(BOTH 'x' FROM 'xxxhelloxxx'); -- 'hello'

-- Padding
SELECT LPAD('42', 5, '0');            -- '00042'
SELECT RPAD('hello', 10, '.');        -- 'hello.....'

-- Substring
SELECT SUBSTRING('Hello World', 1, 5);  -- 'Hello' (1-indexed)
SELECT SUBSTR('Hello World', 7);        -- 'World' (from position 7)
SELECT LEFT('Hello World', 5);          -- 'Hello'
SELECT RIGHT('Hello World', 5);         -- 'World'

-- Search
SELECT POSITION('World' IN 'Hello World'); -- 7
SELECT STRPOS('Hello World', 'World');     -- 7 (PostgreSQL)
SELECT CHARINDEX('World', 'Hello World'); -- 7 (SQL Server)
SELECT INSTR('Hello World', 'World');     -- 7 (MySQL/Oracle)

-- Replace
SELECT REPLACE('Hello World', 'World', 'SQL'); -- 'Hello SQL'
SELECT REGEXP_REPLACE('Hello123', '[0-9]+', ''); -- 'Hello' (PostgreSQL)

-- Concatenation
SELECT 'Hello' || ' ' || 'World';              -- 'Hello World'
SELECT CONCAT('Hello', ' ', 'World');          -- 'Hello World'
SELECT CONCAT_WS(', ', 'Alice', 'Bob', 'Charlie'); -- 'Alice, Bob, Charlie'

-- Split
SELECT SPLIT_PART('a,b,c', ',', 2);     -- 'b' (PostgreSQL)
SELECT STRING_TO_ARRAY('a,b,c', ',');   -- {a,b,c} (PostgreSQL array)

-- Repeat
SELECT REPEAT('ab', 3);                 -- 'ababab'

-- Reverse
SELECT REVERSE('Hello');                -- 'olleH'

-- Regular expressions (PostgreSQL)
SELECT 'user@email.com' ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'; -- true
SELECT REGEXP_MATCHES('abc123def', '[0-9]+'); -- {123}
```

## Practical String Patterns

```sql
-- Parse email domain
SELECT email,
       SUBSTRING(email FROM POSITION('@' IN email) + 1) AS domain
FROM users;

-- Normalize phone numbers (remove non-digits)
SELECT REGEXP_REPLACE(phone, '[^0-9]', '', 'g') AS clean_phone
FROM contacts;

-- Extract URL parameters
SELECT url,
       SUBSTRING(url FROM 'utm_source=([^&]+)') AS utm_source
FROM page_views;

-- Full text search preparation
SELECT LOWER(TRIM(REGEXP_REPLACE(name, '\s+', ' ', 'g'))) AS normalized_name
FROM products;

-- Split name into parts
SELECT
    SPLIT_PART(full_name, ' ', 1) AS first_name,
    SPLIT_PART(full_name, ' ', 2) AS last_name
FROM users;
```

---

# 11. Date and Time Functions

## Core Date Functions

```sql
-- Current date/time
SELECT CURRENT_DATE;                    -- '2024-01-15'
SELECT CURRENT_TIME;                    -- '14:30:00'
SELECT CURRENT_TIMESTAMP;              -- '2024-01-15 14:30:00.123'
SELECT NOW();                          -- same as CURRENT_TIMESTAMP

-- Extract parts
SELECT EXTRACT(YEAR  FROM '2024-01-15'::DATE);  -- 2024
SELECT EXTRACT(MONTH FROM '2024-01-15'::DATE);  -- 1
SELECT EXTRACT(DAY   FROM '2024-01-15'::DATE);  -- 15
SELECT EXTRACT(HOUR  FROM NOW());               -- 14
SELECT EXTRACT(DOW   FROM NOW());               -- 0=Sunday, 6=Saturday
SELECT EXTRACT(EPOCH FROM NOW());               -- seconds since 1970-01-01

-- DATE_PART (PostgreSQL, same as EXTRACT)
SELECT DATE_PART('year', NOW());

-- Truncate to time unit
SELECT DATE_TRUNC('month', '2024-01-15'::DATE);   -- '2024-01-01'
SELECT DATE_TRUNC('year',  '2024-07-15'::DATE);   -- '2024-01-01'
SELECT DATE_TRUNC('hour',  '2024-01-15 14:35:22'::TIMESTAMP); -- '2024-01-15 14:00:00'
SELECT DATE_TRUNC('week',  NOW());                 -- Monday of current week

-- Arithmetic
SELECT '2024-01-15'::DATE + INTERVAL '30 days';       -- '2024-02-14'
SELECT '2024-01-15'::DATE - INTERVAL '1 month';       -- '2023-12-15'
SELECT '2024-01-15'::DATE - '2023-12-01'::DATE;       -- 45 (days)
SELECT NOW() - INTERVAL '7 days';                     -- 7 days ago

-- Age / difference
SELECT AGE('2024-01-15', '1990-05-20');    -- '33 years 7 months 26 days'
SELECT DATEDIFF('2024-01-15', '2024-01-01'); -- 14 (MySQL)

-- Formatting
SELECT TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI:SS');    -- '2024-01-15 14:30:00'
SELECT TO_CHAR(NOW(), 'Month DD, YYYY');            -- 'January 15, 2024'
SELECT DATE_FORMAT(NOW(), '%Y-%m-%d');              -- MySQL syntax

-- Parsing
SELECT TO_DATE('15/01/2024', 'DD/MM/YYYY');         -- PostgreSQL
SELECT STR_TO_DATE('15/01/2024', '%d/%m/%Y');       -- MySQL
SELECT CAST('2024-01-15' AS DATE);
```

## Practical Date Patterns

```sql
-- Date range filtering (common interview pattern)
-- This month
WHERE event_date >= DATE_TRUNC('month', CURRENT_DATE)
  AND event_date <  DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'

-- Last 30 days
WHERE event_date >= CURRENT_DATE - INTERVAL '30 days'

-- Last full week (Mon-Sun)
WHERE event_date >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '7 days')
  AND event_date <  DATE_TRUNC('week', CURRENT_DATE)

-- Year to date
WHERE event_date >= DATE_TRUNC('year', CURRENT_DATE)

-- Q1 of current year
WHERE event_date BETWEEN DATE_TRUNC('year', NOW())
                 AND DATE_TRUNC('year', NOW()) + INTERVAL '3 months' - INTERVAL '1 day'

-- Day of week analysis
SELECT
    CASE EXTRACT(DOW FROM order_date)
        WHEN 0 THEN 'Sunday'
        WHEN 1 THEN 'Monday'
        WHEN 2 THEN 'Tuesday'
        WHEN 3 THEN 'Wednesday'
        WHEN 4 THEN 'Thursday'
        WHEN 5 THEN 'Friday'
        WHEN 6 THEN 'Saturday'
    END AS day_name,
    COUNT(*) AS order_count
FROM orders
GROUP BY EXTRACT(DOW FROM order_date)
ORDER BY EXTRACT(DOW FROM order_date);

-- Generate date spine (all dates in range)
WITH RECURSIVE dates AS (
    SELECT '2024-01-01'::DATE AS dt
    UNION ALL
    SELECT dt + 1 FROM dates WHERE dt < '2024-12-31'
)
SELECT dt FROM dates;
```

## Interview Questions and Answers

**Q1. How do you find all orders placed in the last 7 days?**

Answer:
```sql
-- PostgreSQL / standard SQL
SELECT * FROM orders
WHERE order_date >= CURRENT_DATE - INTERVAL '7 days';

-- MySQL
SELECT * FROM orders
WHERE order_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY);

-- Important: if order_date is a TIMESTAMP, use:
WHERE order_date >= NOW() - INTERVAL '7 days'
-- This includes time component, so "7 days ago" means exactly 7*24 hours ago
```

**Q2. How do you extract the month from a date and group by it?**

Answer:
```sql
SELECT
    DATE_TRUNC('month', order_date) AS month,  -- cleaner for display
    -- OR: EXTRACT(MONTH FROM order_date) AS month_num
    COUNT(*) AS order_count,
    SUM(total) AS revenue
FROM orders
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;
```
Use DATE_TRUNC for grouping (keeps it as a date type, sortable). Use EXTRACT when you only need the number.

---

# 12. Conditional Expressions

## CASE Expression

```sql
-- Simple CASE (equality check)
SELECT
    emp_id,
    salary,
    CASE dept_id
        WHEN 1 THEN 'Engineering'
        WHEN 2 THEN 'Marketing'
        WHEN 3 THEN 'HR'
        ELSE 'Other'
    END AS department

-- Searched CASE (general conditions)
SELECT
    emp_id,
    salary,
    CASE
        WHEN salary >= 100000 THEN 'High'
        WHEN salary >= 70000  THEN 'Mid'
        WHEN salary >= 40000  THEN 'Low'
        ELSE 'Very Low'
    END AS salary_band,

    -- CASE in aggregation
    SUM(CASE WHEN dept_id = 1 THEN salary ELSE 0 END) AS eng_total_salary,

    -- COUNT with condition
    COUNT(CASE WHEN is_active = TRUE THEN 1 END) AS active_count,

    -- Boolean flag
    CASE WHEN salary > 100000 THEN 1 ELSE 0 END AS is_high_earner

FROM employees;

-- CASE in ORDER BY
SELECT * FROM employees
ORDER BY
    CASE status
        WHEN 'urgent' THEN 1
        WHEN 'high'   THEN 2
        WHEN 'medium' THEN 3
        ELSE 4
    END;

-- Conditional aggregation (pivot-like)
SELECT
    dept_id,
    SUM(CASE WHEN EXTRACT(YEAR FROM hire_date) = 2022 THEN 1 ELSE 0 END) AS hired_2022,
    SUM(CASE WHEN EXTRACT(YEAR FROM hire_date) = 2023 THEN 1 ELSE 0 END) AS hired_2023,
    SUM(CASE WHEN EXTRACT(YEAR FROM hire_date) = 2024 THEN 1 ELSE 0 END) AS hired_2024
FROM employees
GROUP BY dept_id;
```

## COALESCE and NULLIF

```sql
-- COALESCE: return first non-NULL value
SELECT
    emp_id,
    COALESCE(nickname, first_name, 'Unknown') AS display_name,
    COALESCE(phone_mobile, phone_home, phone_work) AS contact_phone,
    COALESCE(salary, 0) AS salary_or_zero

-- NULLIF: return NULL if two values are equal (divide-by-zero protection)
SELECT
    total_revenue / NULLIF(total_clicks, 0) AS revenue_per_click,  -- avoids /0 error
    NULLIF(status, 'active')  -- returns NULL if status = 'active'

-- IIF / IF (MySQL/SQL Server shorthand)
SELECT IIF(salary > 100000, 'High', 'Normal') AS band  -- SQL Server
SELECT IF(salary > 100000, 'High', 'Normal') AS band   -- MySQL
```

---

# 13. NULL Handling

## Understanding NULL

```sql
-- NULL is UNKNOWN, not zero or empty string
-- Arithmetic with NULL returns NULL
SELECT NULL + 5;       -- NULL
SELECT NULL * 0;       -- NULL (not 0!)
SELECT NULL = NULL;    -- NULL (not TRUE!)

-- Comparison with NULL always returns NULL
WHERE salary = NULL   -- WRONG: always returns 0 rows
WHERE salary IS NULL  -- CORRECT

-- Logical operations with NULL
NULL AND TRUE   -- NULL
NULL AND FALSE  -- FALSE (FALSE AND anything = FALSE)
NULL OR TRUE    -- TRUE  (TRUE OR anything = TRUE)
NULL OR FALSE   -- NULL
NOT NULL        -- NULL

-- NULL in aggregate functions
SELECT AVG(salary) FROM employees;  -- ignores NULLs
SELECT SUM(salary) FROM employees;  -- ignores NULLs
SELECT COUNT(*) FROM employees;     -- counts all rows
SELECT COUNT(salary) FROM employees; -- ignores NULL salary rows
```

## NULL Handling Functions

```sql
-- IS NULL / IS NOT NULL
SELECT * FROM employees WHERE manager_id IS NULL;
SELECT * FROM employees WHERE manager_id IS NOT NULL;

-- COALESCE: return first non-NULL
SELECT COALESCE(salary, 0) FROM employees;
SELECT COALESCE(a, b, c, 'default') -- tries a, b, c in order

-- NULLIF: convert specific value to NULL
SELECT NULLIF(discount, 0)  -- treat 0 as NULL

-- NVL (Oracle): two-arg COALESCE
SELECT NVL(salary, 0) FROM employees;

-- IFNULL (MySQL): two-arg COALESCE
SELECT IFNULL(salary, 0) FROM employees;

-- NULL in CASE
SELECT CASE WHEN salary IS NULL THEN 'No salary' ELSE CAST(salary AS VARCHAR) END

-- NULL-safe equality (treat NULL = NULL as true)
SELECT * FROM t1 JOIN t2 ON t1.key IS NOT DISTINCT FROM t2.key;  -- PostgreSQL
-- or: t1.key <=> t2.key  -- MySQL null-safe equality
```

## Interview Questions and Answers

**Q1. What is NULL and how does it behave in SQL?**

Answer: NULL represents an unknown or missing value — it is NOT zero, empty string, or FALSE. Key behaviors:
1. Any arithmetic with NULL returns NULL (`NULL + 5 = NULL`)
2. Any comparison with NULL returns NULL, not TRUE/FALSE (`NULL = NULL` is NULL)
3. Use `IS NULL` / `IS NOT NULL` to test for NULL
4. Aggregate functions (SUM, AVG, COUNT(col)) ignore NULLs
5. `COUNT(*)` counts all rows; `COUNT(col)` skips NULLs
6. `NOT IN (subquery)` returns empty if subquery has any NULL value

**Q2. How do NULL values affect aggregate functions?**

Answer:
- `SUM(col)`: ignores NULLs (treats them as 0 contribution)
- `AVG(col)`: ignores NULLs in numerator AND denominator (may give misleading average)
- `COUNT(col)`: counts non-NULL rows only
- `COUNT(*)`: counts all rows including NULLs
- `MAX/MIN(col)`: ignores NULLs

Important: `AVG(salary)` over [100, NULL, NULL] = 100, not 33.3. If you want NULL treated as 0: `AVG(COALESCE(salary, 0))`.

**Q3. Why does NOT IN fail with NULLs?**

Answer: `NOT IN (SELECT id FROM t WHERE ...)` returns empty when the subquery contains any NULL. Because `x NOT IN (1, 2, NULL)` expands to `x <> 1 AND x <> 2 AND x <> NULL`, and `x <> NULL` is always NULL (unknown), the whole expression is NULL, filtering out all rows. Always use `NOT EXISTS` or add `WHERE id IS NOT NULL` to the subquery:
```sql
-- Safe version
SELECT * FROM a WHERE id NOT IN (SELECT id FROM b WHERE id IS NOT NULL);
-- Or better:
SELECT * FROM a WHERE NOT EXISTS (SELECT 1 FROM b WHERE b.id = a.id);
```

---

# 14. Indexes and Performance

## What is an Index?

An index is a data structure (typically a B-tree or hash table) that allows the database engine to find rows faster without scanning the entire table. Think of it like a book's index — you look up a term, get the page number, jump directly to it.

## Index Types

```sql
-- B-tree index (default): range queries, equality, sorting
CREATE INDEX idx_emp_salary ON employees(salary);
-- Good for: salary > 80000, salary = 90000, ORDER BY salary

-- Hash index (PostgreSQL): equality only, faster than B-tree
CREATE INDEX idx_emp_email_hash ON employees USING HASH (email);
-- Good for: email = 'alice@co.com'
-- NOT good for: email LIKE 'alice%', email > 'alice'

-- Composite index (multiple columns)
CREATE INDEX idx_dept_salary ON employees(dept_id, salary);
-- Good for: dept_id = 1, dept_id = 1 AND salary > 80000
-- NOT useful for: salary > 80000 alone (leftmost prefix rule)

-- Partial index (index a subset of rows)
CREATE INDEX idx_active_emp ON employees(email) WHERE is_active = TRUE;
-- Only indexes active employees — smaller, faster

-- Covering index (includes all needed columns — avoids heap lookup)
CREATE INDEX idx_emp_covering ON employees(dept_id) INCLUDE (first_name, salary);
-- Query SELECT first_name, salary FROM employees WHERE dept_id = 1
-- can be served entirely from index (index-only scan)

-- Unique index (enforces uniqueness, used by PK and UNIQUE constraints)
CREATE UNIQUE INDEX idx_emp_email_unique ON employees(email);

-- Expression/function index
CREATE INDEX idx_lower_email ON employees(LOWER(email));
-- Useful for: WHERE LOWER(email) = 'alice@co.com'

-- GIN index (full-text search, JSONB, arrays)
CREATE INDEX idx_product_search ON products USING GIN (to_tsvector('english', description));
-- For JSONB
CREATE INDEX idx_metadata_gin ON events USING GIN (metadata);
```

## Index Best Practices

```sql
-- When to add an index:
-- ✓ Columns in WHERE, JOIN ON, ORDER BY
-- ✓ Foreign key columns (prevent slow joins)
-- ✓ High-cardinality columns (many distinct values)
-- ✓ Columns frequently used in GROUP BY

-- When NOT to add an index:
-- ✗ Small tables (full scan is faster)
-- ✗ Columns with very few distinct values (gender, boolean)
-- ✗ Tables with heavy INSERT/UPDATE/DELETE (indexes slow writes)
-- ✗ Columns never used in WHERE/JOIN

-- Leftmost prefix rule for composite indexes:
CREATE INDEX idx_a_b_c ON t(a, b, c);
-- Can use: WHERE a = ?
-- Can use: WHERE a = ? AND b = ?
-- Can use: WHERE a = ? AND b = ? AND c = ?
-- CANNOT use: WHERE b = ?  (skips first column)
-- CANNOT use: WHERE c = ?  (skips first two columns)

-- Index selectivity (higher = better)
-- cardinality / total rows = selectivity
-- email (selectivity ≈ 1.0): excellent index candidate
-- gender (selectivity ≈ 0.01): poor index candidate

-- Avoid functions on indexed columns in WHERE
WHERE UPPER(last_name) = 'SMITH'  -- index on last_name NOT used
WHERE last_name = 'Smith'         -- index used
-- Solution: create function index or store normalized data
```

## EXPLAIN / Query Plans

```sql
-- View execution plan
EXPLAIN SELECT * FROM employees WHERE dept_id = 1;
EXPLAIN ANALYZE SELECT * FROM employees WHERE dept_id = 1;  -- actually executes

-- Key terms in plans:
-- Seq Scan:           Full table scan (no index used)
-- Index Scan:         Uses index to find rows, then fetches from heap
-- Index Only Scan:    All needed columns in index (no heap lookup — fastest)
-- Bitmap Heap Scan:   Multiple index lookups combined
-- Hash Join:          Build hash table from smaller side, probe with larger
-- Nested Loop Join:   For each row in outer, look up in inner
-- Merge Join:         Both sides sorted, merge in order
-- Cost:               (startup cost..total cost) lower is better
-- Rows:               Estimated row count
-- Actual Rows:        Real row count (with ANALYZE)

-- Example plan reading:
EXPLAIN ANALYZE
SELECT e.first_name, d.dept_name
FROM employees e JOIN departments d ON e.dept_id = d.dept_id
WHERE e.salary > 80000;

-- Typical output:
-- Hash Join  (cost=5.00..150.00 rows=500 width=32) (actual time=1.2..8.5 rows=487)
--   Hash Cond: (e.dept_id = d.dept_id)
--   -> Seq Scan on employees e  (rows=487 width=20)
--        Filter: (salary > 80000)
--   -> Hash  (rows=10 width=16)
--        -> Seq Scan on departments d  (rows=10 width=16)
```

## Interview Questions and Answers

**Q1. What is a covering index?**

Answer: A covering index contains all columns needed for a query, so the database can answer the query entirely from the index without accessing the main table (heap). This is called an index-only scan and is extremely fast. Example: if a query selects `first_name` and `salary` where `dept_id = 1`, an index on `(dept_id, first_name, salary)` covers the query completely — no table access needed.

**Q2. What is the leftmost prefix rule for composite indexes?**

Answer: A composite index can only be used if the query filters on columns starting from the leftmost. For index `(a, b, c)`: queries filtering on `a` alone, `a AND b`, or `a AND b AND c` can use the index. Queries filtering only on `b` or `c` cannot. The exception is if the leftmost column is supplied as a constant, allowing the next column to be used.

**Q3. Why can indexes slow down write operations?**

Answer: Every INSERT, UPDATE, or DELETE must update all indexes on the table in addition to the data itself. For a table with 10 indexes, each write requires 11 operations (1 data + 10 index updates). This is why tables with heavy write loads should minimize indexes to only the essential ones. Batch inserts often disable/drop indexes, load data, then rebuild indexes.

**Q4. What is the difference between a clustered and non-clustered index?**

Answer:
- **Clustered index:** Determines the physical storage order of data. Only one per table. In SQL Server, the PRIMARY KEY is the clustered index by default. In PostgreSQL, equivalent is CLUSTER command or using BRIN index.
- **Non-clustered index:** Separate structure pointing to data rows. Multiple allowed per table. Most indexes are non-clustered.

A table with a clustered index is stored in index key order — sequential scans on that key are very fast.

---

# 15. Query Optimization

## Common Performance Issues

```sql
-- PROBLEM 1: SELECT * (reads unnecessary columns)
SELECT * FROM employees;                            -- bad
SELECT emp_id, first_name, salary FROM employees;   -- good

-- PROBLEM 2: Function on indexed column (prevents index use)
WHERE YEAR(hire_date) = 2024              -- bad: no index use
WHERE hire_date >= '2024-01-01'
  AND hire_date <  '2025-01-01'           -- good: index used

WHERE UPPER(email) = 'ALICE@CO.COM'      -- bad
WHERE email = 'alice@co.com'             -- good (if data normalized)

-- PROBLEM 3: Implicit type conversion (prevents index use)
WHERE emp_id = '101'    -- bad: converts string to int (or vice versa)
WHERE emp_id = 101      -- good: same types

-- PROBLEM 4: OR on indexed columns (can prevent index use)
WHERE dept_id = 1 OR dept_id = 2         -- may not use index
WHERE dept_id IN (1, 2)                  -- usually better
-- Or use UNION ALL

-- PROBLEM 5: NOT IN with NULLs (logical bug + performance)
WHERE id NOT IN (SELECT id FROM t)       -- bad: fails with NULLs
WHERE NOT EXISTS (SELECT 1 FROM t WHERE t.id = outer.id)  -- good

-- PROBLEM 6: Missing indexes on JOIN columns
-- Always index foreign key columns
CREATE INDEX idx_orders_customer ON orders(customer_id);

-- PROBLEM 7: Large OFFSET pagination
SELECT * FROM t ORDER BY id LIMIT 10 OFFSET 100000;  -- slow: scans 100010 rows

-- Keyset pagination (cursor-based) — O(1)
SELECT * FROM t WHERE id > :last_id ORDER BY id LIMIT 10;

-- PROBLEM 8: N+1 queries (application-level — use JOIN instead)
-- Bad: 1 query to get departments, then 1 query per dept to get employees
-- Good: 1 JOIN query

-- PROBLEM 9: Unnecessary DISTINCT (masking bad JOINs)
SELECT DISTINCT e.emp_id FROM employees e JOIN orders o ON e.emp_id = o.emp_id;
-- If this needs DISTINCT, the join is probably producing duplicates
-- Fix the join or use EXISTS
```

## Query Rewriting Patterns

```sql
-- Pattern 1: Replace correlated subquery with window function
-- Slow: correlated subquery
SELECT e.first_name, e.salary,
    (SELECT AVG(salary) FROM employees WHERE dept_id = e.dept_id) AS dept_avg
FROM employees e;

-- Fast: window function
SELECT first_name, salary,
    AVG(salary) OVER (PARTITION BY dept_id) AS dept_avg
FROM employees;

-- Pattern 2: Replace NOT IN with NOT EXISTS
-- Risky: NOT IN fails with NULLs
SELECT * FROM a WHERE id NOT IN (SELECT id FROM b);

-- Safe and often faster: NOT EXISTS
SELECT * FROM a WHERE NOT EXISTS (SELECT 1 FROM b WHERE b.id = a.id);

-- Pattern 3: Replace scalar subquery with JOIN
-- Slow: scalar subquery runs once per row
SELECT emp_id,
    (SELECT dept_name FROM departments WHERE dept_id = e.dept_id) AS dept
FROM employees e;

-- Fast: JOIN runs once
SELECT e.emp_id, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id;

-- Pattern 4: Early filtering before joins
-- Slow: filter after join
SELECT e.emp_id, d.dept_name
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id
WHERE e.salary > 80000 AND d.location = 'Mumbai';

-- Fast: filter in subquery/CTE first (reduces join input size)
SELECT e.emp_id, d.dept_name
FROM (SELECT * FROM employees WHERE salary > 80000) e
JOIN (SELECT * FROM departments WHERE location = 'Mumbai') d
    ON e.dept_id = d.dept_id;

-- Pattern 5: UNION ALL vs UNION
SELECT id FROM a UNION ALL SELECT id FROM b;  -- no dedup: faster
SELECT id FROM a UNION SELECT id FROM b;      -- dedup: slower
-- Use UNION ALL unless dedup is needed

-- Pattern 6: CTE vs subquery (optimizer-dependent)
-- In some DBs, CTEs are optimization fences (prevent pushdown)
-- Test both and compare EXPLAIN output
```

## Interview Questions and Answers

**Q1. What is a query execution plan and why is it important?**

Answer: A query execution plan shows how the database engine will physically execute a SQL query — which indexes will be used, what join strategies will be applied, and the estimated cost/row count for each step. Use `EXPLAIN` (without executing) or `EXPLAIN ANALYZE` (executes and shows actual stats) to view plans. Key things to look for: unexpected full table scans (Seq Scan), bad cardinality estimates, wrong join types, or missing index usage. The plan guides optimization decisions.

**Q2. How would you optimize a slow query?**

Answer: Systematic optimization approach:
1. Run `EXPLAIN ANALYZE` — find the most expensive node
2. Check for full table scans — add indexes if needed
3. Check index usage — avoid functions on indexed columns
4. Check join strategies — broadcast small tables, fix data type mismatches
5. Check row estimates — if estimates are way off, run ANALYZE to update stats
6. Rewrite correlated subqueries as JOINs or window functions
7. Reduce data early — filter/project before joins
8. Consider materialized views for repeated expensive aggregations
9. Check for implicit type conversions in WHERE/JOIN

**Q3. What is the difference between a Hash Join and a Merge Join?**

Answer:
- **Hash Join:** Builds a hash table from the smaller table, then probes it with each row from the larger table. O(n+m). Good for unsorted data. Uses memory for the hash table.
- **Merge Join (Sort-Merge Join):** Both sides must be sorted on the join key. Then merges them like a zipper. O(n log n) if sorting needed, O(n+m) if pre-sorted. Used when data is already sorted or when sort is cheap.
- **Nested Loop Join:** For each row in outer, scan inner table (or index lookup). O(n×m) without index. Efficient only when outer is small and inner has an index.

**Q4. When does the query optimizer decide NOT to use an index?**

Answer: The optimizer skips indexes when:
1. **Low selectivity:** Column has very few distinct values (booleans, status flags) — full scan is cheaper
2. **Large fraction selected:** Query returns >10-20% of rows — sequential scan is faster
3. **Function on column:** `WHERE UPPER(name) = 'X'` — index on name can't be used
4. **Type mismatch:** Implicit cast prevents index use
5. **Small table:** Sequential scan is faster for very small tables
6. **Outdated statistics:** `ANALYZE` the table to refresh them

---

# 16. Transactions and ACID

## ACID Properties

```
A — Atomicity:   Transaction is all-or-nothing
C — Consistency: DB moves from one valid state to another
I — Isolation:   Concurrent transactions don't interfere
D — Durability:  Committed data persists even after crashes
```

## Transaction Control

```sql
-- Basic transaction
BEGIN;
    UPDATE accounts SET balance = balance - 500 WHERE account_id = 1;
    UPDATE accounts SET balance = balance + 500 WHERE account_id = 2;
COMMIT;  -- both updates visible atomically

-- Rollback on error
BEGIN;
    UPDATE accounts SET balance = balance - 500 WHERE account_id = 1;
    -- Error occurs here
ROLLBACK;  -- first update is undone

-- Savepoints (partial rollback)
BEGIN;
    INSERT INTO orders (customer_id, total) VALUES (1, 500);
    SAVEPOINT sp1;

    INSERT INTO order_items (order_id, product_id) VALUES (LASTVAL(), 99);
    -- product 99 doesn't exist, FK violation
    ROLLBACK TO SAVEPOINT sp1;  -- undo only the order_item insert

    INSERT INTO order_items (order_id, product_id) VALUES (LASTVAL(), 5);
COMMIT;  -- order committed, with product 5

-- Transaction isolation levels (SET before transaction)
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

## Isolation Levels and Problems

```
┌─────────────────────────────────────────────────────────────────────────┐
│            ISOLATION LEVEL vs READ ANOMALIES                            │
├──────────────────────┬───────────────┬──────────────┬───────────────────┤
│  Isolation Level     │ Dirty Read    │ Non-Repeat.  │ Phantom Read      │
│                      │               │ Read         │                   │
├──────────────────────┼───────────────┼──────────────┼───────────────────┤
│ READ UNCOMMITTED     │  Possible     │  Possible    │  Possible         │
│ READ COMMITTED       │  Prevented    │  Possible    │  Possible         │
│ REPEATABLE READ      │  Prevented    │  Prevented   │  Possible         │
│ SERIALIZABLE         │  Prevented    │  Prevented   │  Prevented        │
└──────────────────────┴───────────────┴──────────────┴───────────────────┘

Dirty Read:       Reading uncommitted data from another transaction
Non-Repeatable:   Same SELECT returns different data within same transaction
                  (another transaction committed an UPDATE between reads)
Phantom Read:     Same query returns different rows (INSERT/DELETE by other tx)
```

## Locking

```sql
-- Explicit row-level lock (SELECT FOR UPDATE)
BEGIN;
SELECT balance FROM accounts WHERE account_id = 1 FOR UPDATE;
-- This row is now locked — no other transaction can modify it
UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
COMMIT;

-- SKIP LOCKED (skip rows locked by other transactions)
SELECT * FROM job_queue WHERE status = 'pending'
FOR UPDATE SKIP LOCKED LIMIT 10;
-- Used in queue processing — each worker gets different rows

-- NOWAIT (fail immediately if lock can't be acquired)
SELECT * FROM accounts WHERE account_id = 1 FOR UPDATE NOWAIT;

-- Table-level lock
LOCK TABLE employees IN EXCLUSIVE MODE;
```

## Interview Questions and Answers

**Q1. Explain ACID properties with examples.**

Answer:
- **Atomicity:** Transfer $500 from A to B — both debit and credit must succeed or neither does. If credit fails, debit is rolled back.
- **Consistency:** Balance constraint: balance >= 0. Transaction cannot leave balance negative. If it would, the DB rejects it.
- **Isolation:** Two transactions transferring money simultaneously don't see each other's incomplete state. Each sees a consistent snapshot.
- **Durability:** Once a transfer is committed, even if the server crashes, the transfer data persists (written to disk/WAL).

**Q2. What is a deadlock and how do you prevent it?**

Answer: A deadlock occurs when two transactions each hold a lock the other needs, waiting indefinitely.
```
T1: LOCK account_A → wants account_B
T2: LOCK account_B → wants account_A
→ Neither can proceed
```
Prevention strategies:
1. **Lock ordering:** Always acquire locks in the same order (lock lower ID first)
2. **Lock timeout:** Set `lock_timeout` — fail rather than wait forever
3. **Shorter transactions:** Minimize time holding locks
4. **Optimistic locking:** Check version number instead of locking
5. Databases detect deadlocks and kill one transaction automatically

**Q3. What is the difference between optimistic and pessimistic locking?**

Answer:
- **Pessimistic locking:** Lock the row when you read it (SELECT FOR UPDATE). No one else can modify it until you commit. Prevents conflicts but reduces concurrency.
- **Optimistic locking:** No lock on read. Add a `version` column. On UPDATE, check that version hasn't changed. If it has, retry.

```sql
-- Optimistic locking
SELECT id, name, price, version FROM products WHERE id = 1;
-- Modify data in application...
UPDATE products
SET price = 99.99, version = version + 1
WHERE id = 1 AND version = 5;  -- fails if version changed
-- If 0 rows updated → conflict → retry
```

---

# 17. Schema Design and Normalization

## Normal Forms

```
┌────────────────────────────────────────────────────────────────────┐
│                    NORMALIZATION LEVELS                            │
├──────────┬─────────────────────────────────────────────────────────┤
│   1NF    │ Atomic values (no repeating groups, no arrays in cells) │
│   2NF    │ 1NF + No partial dependency (all cols depend on FULL PK)│
│   3NF    │ 2NF + No transitive dependency (non-PK depends only PK) │
│   BCNF   │ Stricter 3NF: every determinant is a candidate key     │
│   4NF    │ No multi-valued dependencies                            │
│   5NF    │ No join dependencies                                    │
└──────────┴─────────────────────────────────────────────────────────┘
```

## First Normal Form (1NF)

```sql
-- VIOLATES 1NF: multiple values in one cell
CREATE TABLE orders_bad (
    order_id INT,
    customer_name VARCHAR,
    product_ids VARCHAR  -- '101,102,103' ← NOT atomic
);

-- 1NF: atomic values, no repeating groups
CREATE TABLE orders (order_id INT, customer_id INT, order_date DATE);
CREATE TABLE order_items (
    order_id   INT,
    product_id INT,
    quantity   INT,
    PRIMARY KEY (order_id, product_id)
);
```

## Second Normal Form (2NF)

```sql
-- VIOLATES 2NF: partial dependency (product_name depends only on product_id, not full PK)
CREATE TABLE order_items_bad (
    order_id     INT,
    product_id   INT,
    quantity     INT,
    product_name VARCHAR,  -- depends only on product_id (partial dependency)
    PRIMARY KEY (order_id, product_id)
);

-- 2NF: separate the products
CREATE TABLE products (product_id INT PRIMARY KEY, product_name VARCHAR, price DECIMAL);
CREATE TABLE order_items (
    order_id   INT,
    product_id INT REFERENCES products(product_id),
    quantity   INT,
    PRIMARY KEY (order_id, product_id)
);
```

## Third Normal Form (3NF)

```sql
-- VIOLATES 3NF: transitive dependency (zip_code → city, state — not PK dependent)
CREATE TABLE employees_bad (
    emp_id   INT PRIMARY KEY,
    name     VARCHAR,
    zip_code VARCHAR,
    city     VARCHAR,  -- depends on zip_code, not emp_id
    state    VARCHAR   -- depends on zip_code, not emp_id
);

-- 3NF: separate zip codes
CREATE TABLE zip_codes (zip_code VARCHAR PRIMARY KEY, city VARCHAR, state VARCHAR);
CREATE TABLE employees (
    emp_id   INT PRIMARY KEY,
    name     VARCHAR,
    zip_code VARCHAR REFERENCES zip_codes(zip_code)
);
```

## Star Schema (Data Warehouse)

```sql
-- Fact table: business events (transactions), with numeric measures
CREATE TABLE fact_sales (
    sale_id       BIGINT PRIMARY KEY,
    date_key      INT    REFERENCES dim_date(date_key),
    product_key   INT    REFERENCES dim_product(product_key),
    customer_key  INT    REFERENCES dim_customer(customer_key),
    store_key     INT    REFERENCES dim_store(store_key),
    -- Measures (numeric, additive)
    quantity      INT,
    unit_price    DECIMAL(10,2),
    discount      DECIMAL(5,2),
    total_amount  DECIMAL(12,2)
);

-- Dimension tables: descriptive attributes
CREATE TABLE dim_date (
    date_key    INT PRIMARY KEY,  -- YYYYMMDD format e.g. 20240115
    full_date   DATE,
    year        INT,
    quarter     INT,
    month       INT,
    month_name  VARCHAR,
    week        INT,
    day_of_week INT,
    is_weekend  BOOLEAN,
    is_holiday  BOOLEAN
);

CREATE TABLE dim_product (
    product_key    INT PRIMARY KEY,
    product_id     VARCHAR,
    product_name   VARCHAR,
    category       VARCHAR,
    subcategory    VARCHAR,
    brand          VARCHAR,
    cost           DECIMAL(10,2),
    -- SCD2 columns
    effective_date DATE,
    expiry_date    DATE,
    is_current     BOOLEAN
);
```

## Slowly Changing Dimensions (SCD)

```sql
-- SCD Type 1: Overwrite (no history)
UPDATE dim_customer SET email = 'new@email.com' WHERE customer_id = 101;

-- SCD Type 2: Add new row (full history)
-- When customer changes department:
-- 1. Close existing record
UPDATE dim_employee
SET effective_end_date = CURRENT_DATE - 1, is_current = FALSE
WHERE employee_id = 101 AND is_current = TRUE;

-- 2. Insert new record
INSERT INTO dim_employee (employee_id, name, department, effective_start_date, effective_end_date, is_current)
VALUES (101, 'Alice', 'Data Science', CURRENT_DATE, '9999-12-31', TRUE);

-- Query: current state
SELECT * FROM dim_employee WHERE is_current = TRUE;
-- Query: historical state at specific date
SELECT * FROM dim_employee
WHERE employee_id = 101
  AND effective_start_date <= '2023-06-01'
  AND effective_end_date   >= '2023-06-01';

-- SCD Type 3: Add column (limited history — previous value only)
ALTER TABLE dim_customer ADD COLUMN prev_segment VARCHAR;
UPDATE dim_customer
SET prev_segment = current_segment,
    current_segment = 'Premium'
WHERE customer_id = 101;
```

## Interview Questions and Answers

**Q1. What is denormalization and when would you use it?**

Answer: Denormalization intentionally introduces redundancy to improve read performance. You duplicate data or pre-compute values to avoid expensive JOINs at query time. Use in:
1. Data warehouses where read speed is critical
2. OLAP systems with complex aggregations
3. High-traffic APIs where join cost is unacceptable
4. Reporting tables that are pre-aggregated

Trade-off: faster reads but slower writes (must update redundant data), more storage, risk of data inconsistency.

**Q2. What is the difference between Star Schema and Snowflake Schema?**

Answer:
- **Star Schema:** Fact table surrounded by denormalized dimension tables. Dimensions are flat (all attributes in one table). Faster queries (fewer joins), easier to understand.
- **Snowflake Schema:** Dimensions are further normalized into sub-dimensions. `dim_product → dim_category → dim_subcategory`. More joins but less storage redundancy, easier to maintain.

In modern data warehouses (Snowflake, BigQuery), Star Schema is typically preferred — storage is cheap and query engines optimize joins well.

**Q3. Explain SCD Type 2 and how you would implement it.**

Answer: SCD Type 2 tracks full history by adding a new row for each change. Each row has:
- `effective_start_date`: when this version became active
- `effective_end_date`: when it was superseded (9999-12-31 for current)
- `is_current`: flag for easy current-state queries

Implementation: When an attribute changes, UPDATE the existing row to set end_date and is_current=FALSE, then INSERT a new row with start_date=today and is_current=TRUE. In modern systems, this is done with MERGE statements or Delta Lake MERGE operations.

---

# 18. Data Warehouse SQL Patterns

## Slowly Changing Dimensions Queries

```sql
-- Point-in-time query (as-of query)
SELECT
    f.sale_id,
    f.total_amount,
    dp.product_name,  -- product name as it was at sale time
    dc.customer_name  -- customer segment as it was at sale time
FROM fact_sales f
JOIN dim_product dp
    ON f.product_key = dp.product_key
    AND f.sale_date BETWEEN dp.effective_date AND dp.expiry_date
JOIN dim_customer dc
    ON f.customer_key = dc.customer_key
    AND f.sale_date BETWEEN dc.effective_start_date AND dc.effective_end_date;
```

## Fact Table Aggregation Patterns

```sql
-- Revenue by time hierarchy (year → quarter → month)
SELECT
    d.year,
    d.quarter,
    d.month_name,
    SUM(f.total_amount) AS revenue,
    COUNT(DISTINCT f.customer_key) AS unique_customers,
    SUM(f.quantity) AS units_sold,
    AVG(f.total_amount) AS avg_order_value
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
WHERE d.year = 2024
GROUP BY ROLLUP(d.year, d.quarter, d.month_name)
ORDER BY d.year, d.quarter, d.month_name;

-- Period-over-period comparison (YoY, MoM)
WITH monthly AS (
    SELECT
        d.year,
        d.month,
        SUM(f.total_amount) AS revenue
    FROM fact_sales f
    JOIN dim_date d ON f.date_key = d.date_key
    GROUP BY d.year, d.month
)
SELECT
    year,
    month,
    revenue,
    LAG(revenue) OVER (PARTITION BY month ORDER BY year) AS prev_year_revenue,
    ROUND((revenue - LAG(revenue) OVER (PARTITION BY month ORDER BY year)) /
          NULLIF(LAG(revenue) OVER (PARTITION BY month ORDER BY year), 0) * 100, 2) AS yoy_pct
FROM monthly
ORDER BY year, month;
```

## Cohort Analysis

```sql
-- Cohort analysis: retention by signup month
WITH cohorts AS (
    -- Define cohort: month user signed up
    SELECT
        user_id,
        DATE_TRUNC('month', signup_date) AS cohort_month
    FROM users
),
activity AS (
    -- Monthly activity
    SELECT
        user_id,
        DATE_TRUNC('month', activity_date) AS activity_month
    FROM user_events
),
cohort_activity AS (
    SELECT
        c.cohort_month,
        a.activity_month,
        COUNT(DISTINCT a.user_id) AS active_users,
        EXTRACT(YEAR FROM AGE(a.activity_month, c.cohort_month)) * 12 +
        EXTRACT(MONTH FROM AGE(a.activity_month, c.cohort_month)) AS months_since_signup
    FROM cohorts c
    JOIN activity a ON c.user_id = a.user_id
    GROUP BY c.cohort_month, a.activity_month
),
cohort_size AS (
    SELECT cohort_month, COUNT(*) AS cohort_users
    FROM cohorts
    GROUP BY cohort_month
)
SELECT
    ca.cohort_month,
    ca.months_since_signup,
    ca.active_users,
    cs.cohort_users,
    ROUND(ca.active_users * 100.0 / cs.cohort_users, 1) AS retention_pct
FROM cohort_activity ca
JOIN cohort_size cs ON ca.cohort_month = cs.cohort_month
WHERE ca.months_since_signup BETWEEN 0 AND 12
ORDER BY ca.cohort_month, ca.months_since_signup;
```

## Funnel Analysis

```sql
-- Conversion funnel: impression → click → purchase
WITH funnel AS (
    SELECT
        user_id,
        MAX(CASE WHEN event = 'impression' THEN 1 ELSE 0 END) AS saw_ad,
        MAX(CASE WHEN event = 'click'      THEN 1 ELSE 0 END) AS clicked_ad,
        MAX(CASE WHEN event = 'purchase'   THEN 1 ELSE 0 END) AS purchased
    FROM events
    WHERE event_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY user_id
)
SELECT
    SUM(saw_ad)   AS impressions,
    SUM(clicked_ad) AS clicks,
    SUM(purchased)  AS purchases,
    ROUND(SUM(clicked_ad)::DECIMAL / NULLIF(SUM(saw_ad), 0) * 100, 2) AS ctr,
    ROUND(SUM(purchased)::DECIMAL / NULLIF(SUM(clicked_ad), 0) * 100, 2) AS cvr
FROM funnel;
```

---

# 19. Analytical Patterns

## Ranking and Top-N Patterns

```sql
-- Rank products by revenue within each category
SELECT
    category,
    product_name,
    revenue,
    RANK() OVER (PARTITION BY category ORDER BY revenue DESC) AS cat_rank,
    DENSE_RANK() OVER (ORDER BY revenue DESC) AS overall_rank
FROM product_revenue;

-- Top 3 per category
SELECT * FROM (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC) AS rn
    FROM product_revenue
) t WHERE rn <= 3;

-- Median salary (window function approach)
SELECT dept_id,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) AS median_salary,
    PERCENTILE_DISC(0.5) WITHIN GROUP (ORDER BY salary) AS median_discrete
FROM employees
GROUP BY dept_id;
```

## Gap-and-Island Problems

```sql
-- Islands: find consecutive date ranges of active users
WITH dated AS (
    SELECT DISTINCT user_id, activity_date,
           activity_date - ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY activity_date) * INTERVAL '1 day' AS grp
    FROM user_activity
),
islands AS (
    SELECT user_id,
           MIN(activity_date) AS streak_start,
           MAX(activity_date) AS streak_end,
           COUNT(*) AS streak_days
    FROM dated
    GROUP BY user_id, grp
)
SELECT * FROM islands WHERE streak_days >= 3
ORDER BY user_id, streak_start;

-- Gaps: find missing dates in a sequence
WITH date_range AS (
    SELECT MIN(order_date) AS start_d, MAX(order_date) AS end_d FROM orders
),
all_dates AS (
    SELECT generate_series(start_d, end_d, '1 day'::INTERVAL)::DATE AS dt
    FROM date_range
)
SELECT ad.dt AS missing_date
FROM all_dates ad
LEFT JOIN orders o ON ad.dt = o.order_date
WHERE o.order_date IS NULL;
```

## Running Totals and Moving Averages

```sql
-- Running total with reset per year
SELECT
    order_date,
    total,
    SUM(total) OVER (
        PARTITION BY EXTRACT(YEAR FROM order_date)
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS ytd_total
FROM orders;

-- 7-day moving average
SELECT
    date,
    daily_revenue,
    AVG(daily_revenue) OVER (
        ORDER BY date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS ma_7d,
    AVG(daily_revenue) OVER (
        ORDER BY date
        ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
    ) AS ma_30d
FROM daily_revenue;

-- Exponential moving average (custom, no built-in)
-- Usually done in application layer or Python/Spark
```

## Pivoting and Unpivoting

```sql
-- Pivot: rows to columns using conditional aggregation
SELECT
    user_id,
    SUM(CASE WHEN platform = 'web'     THEN sessions ELSE 0 END) AS web_sessions,
    SUM(CASE WHEN platform = 'mobile'  THEN sessions ELSE 0 END) AS mobile_sessions,
    SUM(CASE WHEN platform = 'desktop' THEN sessions ELSE 0 END) AS desktop_sessions
FROM user_platform_sessions
GROUP BY user_id;

-- Unpivot: columns to rows using UNION ALL
SELECT user_id, 'web'     AS platform, web_sessions     AS sessions FROM pivot_table
UNION ALL
SELECT user_id, 'mobile'  AS platform, mobile_sessions  AS sessions FROM pivot_table
UNION ALL
SELECT user_id, 'desktop' AS platform, desktop_sessions AS sessions FROM pivot_table;

-- PostgreSQL CROSSTAB (requires tablefunc extension)
-- Standard PIVOT (SQL Server, Snowflake, BigQuery)
SELECT *
FROM user_platform_sessions
PIVOT (SUM(sessions) FOR platform IN ('web', 'mobile', 'desktop'));
```

---

# 20. Advanced SQL Patterns

## Hierarchical Queries

```sql
-- Find all employees under a manager (any depth)
WITH RECURSIVE subordinates AS (
    SELECT emp_id, first_name, manager_id, 0 AS depth
    FROM employees
    WHERE emp_id = 10  -- start from manager with id 10

    UNION ALL

    SELECT e.emp_id, e.first_name, e.manager_id, s.depth + 1
    FROM employees e
    JOIN subordinates s ON e.manager_id = s.emp_id
    WHERE s.depth < 10  -- prevent infinite loops
)
SELECT * FROM subordinates ORDER BY depth;

-- Build full path
WITH RECURSIVE emp_path AS (
    SELECT emp_id, first_name, manager_id,
           first_name::TEXT AS path
    FROM employees WHERE manager_id IS NULL

    UNION ALL

    SELECT e.emp_id, e.first_name, e.manager_id,
           ep.path || ' → ' || e.first_name
    FROM employees e
    JOIN emp_path ep ON e.manager_id = ep.emp_id
)
SELECT emp_id, first_name, path FROM emp_path;
-- Output: CEO → VP Engineering → Director → Alice
```

## Deduplication Patterns

```sql
-- Keep one record per group (latest by timestamp)
DELETE FROM events
WHERE id NOT IN (
    SELECT MIN(id)  -- or MAX, depending on which to keep
    FROM events
    GROUP BY user_id, event_type, DATE_TRUNC('day', event_time)
);

-- Using CTE for cleaner dedup
WITH dupes AS (
    SELECT id,
           ROW_NUMBER() OVER (
               PARTITION BY user_id, event_type
               ORDER BY created_at DESC
           ) AS rn
    FROM events
)
DELETE FROM events WHERE id IN (SELECT id FROM dupes WHERE rn > 1);

-- Find duplicate rows
SELECT email, COUNT(*) AS cnt
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Full duplicate rows
SELECT *, COUNT(*) OVER (PARTITION BY email, first_name, last_name) AS dup_count
FROM users
WHERE (email, first_name, last_name) IN (
    SELECT email, first_name, last_name
    FROM users
    GROUP BY email, first_name, last_name
    HAVING COUNT(*) > 1
);
```

## Date Spine / Calendar Table

```sql
-- Generate complete date range (fill gaps in data)
WITH date_spine AS (
    SELECT generate_series(
        '2024-01-01'::DATE,
        '2024-12-31'::DATE,
        '1 day'::INTERVAL
    )::DATE AS dt
),
daily_sales AS (
    SELECT DATE(order_date) AS dt, SUM(total) AS revenue
    FROM orders
    WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31'
    GROUP BY DATE(order_date)
)
-- LEFT JOIN ensures all dates shown even with no sales
SELECT ds.dt, COALESCE(d.revenue, 0) AS revenue
FROM date_spine ds
LEFT JOIN daily_sales d ON ds.dt = d.dt
ORDER BY ds.dt;
```

## Interview Questions and Answers

**Q1. How do you find the second highest salary?**

Answer:
```sql
-- Method 1: OFFSET (simple)
SELECT DISTINCT salary FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;

-- Method 2: MAX with exclusion
SELECT MAX(salary) FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

-- Method 3: DENSE_RANK (handles ties correctly)
SELECT salary FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS dr
    FROM employees
) t WHERE dr = 2;

-- Method 4: For Nth highest (generalized)
SELECT salary FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS dr
    FROM employees
) t WHERE dr = :N;
```

**Q2. How would you write a query to calculate a running total that resets every month?**

Answer:
```sql
SELECT
    order_date,
    order_id,
    amount,
    SUM(amount) OVER (
        PARTITION BY DATE_TRUNC('month', order_date)  -- resets each month
        ORDER BY order_date
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS monthly_running_total
FROM orders
ORDER BY order_date;
```

**Q3. How do you find all pairs of employees in the same department with a salary difference of less than 5000?**

Answer:
```sql
SELECT
    a.first_name AS emp1,
    b.first_name AS emp2,
    a.dept_id,
    ABS(a.salary - b.salary) AS salary_diff
FROM employees a
JOIN employees b
    ON a.dept_id = b.dept_id
    AND a.emp_id < b.emp_id  -- avoid duplicates and self-pairs
    AND ABS(a.salary - b.salary) < 5000
ORDER BY a.dept_id, salary_diff;
```

---

# 21. SQL in Big Data

## Spark SQL

```sql
-- Spark SQL is ANSI SQL compliant with extensions
-- Works on DataFrames registered as temp views

-- Create temp view from DataFrame (PySpark)
-- df.createOrReplaceTempView("employees")
-- df.createOrReplaceGlobalTempView("global_employees")

-- Spark SQL specific functions
SELECT
    -- Array functions
    array(1, 2, 3) AS arr,
    size(array_col) AS arr_size,
    explode(array_col) AS element,          -- rows × array elements
    posexplode(array_col) AS (pos, val),    -- with position
    array_contains(array_col, 'x') AS has_x,
    array_distinct(array_col) AS unique_vals,
    array_union(arr1, arr2) AS combined,
    flatten(nested_array) AS flat,

    -- Struct functions
    struct(col1, col2) AS s,
    s.field1,
    named_struct('a', col1, 'b', col2) AS ns,

    -- Map functions
    map('key', 'value') AS m,
    map_keys(map_col) AS keys,
    map_values(map_col) AS vals,
    element_at(map_col, 'key') AS val,

    -- Higher-order functions (Spark 2.4+)
    filter(array_col, x -> x > 0) AS positive_vals,
    transform(array_col, x -> x * 2) AS doubled,
    aggregate(array_col, 0, (acc, x) -> acc + x) AS total,
    exists(array_col, x -> x > 10) AS any_over_10

FROM spark_table;

-- JSON handling in Spark SQL
SELECT
    get_json_object(json_str, '$.user.name') AS user_name,
    json_tuple(json_str, 'name', 'age') AS (name, age),
    from_json(json_str, 'STRUCT<name:STRING, age:INT>') AS parsed,
    to_json(struct(col1, col2)) AS json_out,
    schema_of_json('{"name":"Alice","age":30}') AS schema  -- infer schema

FROM events;

-- Partition pruning in Spark SQL
SELECT * FROM partitioned_table
WHERE year = 2024 AND month = 1;  -- Spark reads only year=2024/month=01 directory

-- Delta Lake MERGE in Spark SQL
MERGE INTO target t
USING source s ON t.id = s.id
WHEN MATCHED THEN UPDATE SET t.value = s.value
WHEN NOT MATCHED THEN INSERT *;

-- Optimize / Z-order (Delta)
OPTIMIZE delta_table ZORDER BY (user_id, event_date);
VACUUM delta_table RETAIN 168 HOURS;

-- Time travel (Delta)
SELECT * FROM delta_table VERSION AS OF 5;
SELECT * FROM delta_table TIMESTAMP AS OF '2024-01-15';
```

## Hive SQL (HQL)

```sql
-- Hive extensions and differences
-- Bucketing (pre-partitions for joins)
CREATE TABLE user_events (user_id BIGINT, event STRING, ts TIMESTAMP)
CLUSTERED BY (user_id) INTO 256 BUCKETS
STORED AS ORC;

-- Dynamic partition insert
INSERT INTO TABLE sales PARTITION(year, month)
SELECT *, YEAR(sale_date), MONTH(sale_date)
FROM staging_sales;

-- DISTRIBUTE BY: how rows are distributed across reducers
SELECT * FROM orders
DISTRIBUTE BY customer_id  -- same customer → same reducer
SORT BY order_date;        -- sort within reducer

-- CLUSTER BY: DISTRIBUTE BY + SORT BY same column
SELECT * FROM orders CLUSTER BY customer_id;

-- Map-side JOIN hint
SELECT /*+ MAPJOIN(d) */ f.sale_id, d.product_name
FROM fact_sales f JOIN dim_product d ON f.product_key = d.product_key;

-- Lateral view (explode)
SELECT user_id, tag
FROM users
LATERAL VIEW EXPLODE(tags_array) t AS tag;
```

## BigQuery / Presto / Snowflake SQL

```sql
-- BigQuery specific
-- Partition by ingestion time
CREATE TABLE events PARTITION BY DATE(_PARTITIONTIME);
-- Partition by column
CREATE TABLE sales PARTITION BY DATE(sale_date);
-- Clustering (like bucketing)
CREATE TABLE events CLUSTER BY user_id, event_type;

-- Array aggregation
SELECT
    user_id,
    ARRAY_AGG(STRUCT(event_type, event_time) ORDER BY event_time) AS event_sequence,
    ARRAY_AGG(DISTINCT event_type) AS unique_events
FROM events
GROUP BY user_id;

-- Unnest arrays
SELECT user_id, event.event_type
FROM users
CROSS JOIN UNNEST(events) AS event;

-- APPROX functions (faster for large data)
SELECT APPROX_COUNT_DISTINCT(user_id) AS approx_unique_users
FROM events;

-- Snowflake specific
-- FLATTEN (like explode)
SELECT f.value::STRING AS tag
FROM users, LATERAL FLATTEN(input => tags) f;

-- RESULT_SCAN (query previous result)
SELECT * FROM TABLE(RESULT_SCAN(LAST_QUERY_ID()));

-- Presto / Trino specific
-- UNNEST
SELECT user_id, tag
FROM users
CROSS JOIN UNNEST(tags) AS t(tag);

-- Array functions
SELECT cardinality(array_col) AS size
FROM t;
```

## Interview Questions and Answers

**Q1. What is the difference between Hive's DISTRIBUTE BY and ORDER BY?**

Answer:
- **ORDER BY:** Global sort across all reducers — produces totally ordered output but requires all data to flow through a single reducer (slow, doesn't scale).
- **SORT BY:** Local sort within each reducer's output — fast, parallel, but no global ordering guarantee.
- **DISTRIBUTE BY:** Controls which rows go to which reducer (like partitioning by key). Same key → same reducer. No sorting within.
- **CLUSTER BY:** `DISTRIBUTE BY col SORT BY col` combined — same key → same reducer, sorted within.

**Q2. How does partition pruning work in Spark SQL / Hive?**

Answer: When tables are partitioned (files stored in `year=2024/month=01/` directories), a filter on partition columns causes the engine to skip reading entire directories that don't match. For `WHERE year = 2024 AND month = 1`, the engine lists only the `year=2024/month=01/` directory instead of scanning all files. This can reduce I/O from 100% to < 1%. The filter must be on the partition column directly — functions on partition columns may prevent pruning.

**Q3. What is the difference between static and dynamic partitioning in Hive?**

Answer:
- **Static partitioning:** Explicitly specify partition values in INSERT: `INSERT INTO t PARTITION(year=2024, month=1) SELECT ...`
- **Dynamic partitioning:** Let Hive determine partition values from data: `INSERT INTO t PARTITION(year, month) SELECT *, year_col, month_col ...`. The last N SELECT columns become partition values.

Dynamic requires `hive.exec.dynamic.partition=true` and `hive.exec.dynamic.partition.mode=nonstrict`.

---

# 22. Scenario-Based Questions

**Q1. How do you find employees who earn more than their department's average salary?**

```sql
-- Using window function (recommended)
SELECT emp_id, first_name, salary, dept_id
FROM (
    SELECT emp_id, first_name, salary, dept_id,
           AVG(salary) OVER (PARTITION BY dept_id) AS dept_avg
    FROM employees
) t
WHERE salary > dept_avg;

-- Using correlated subquery
SELECT emp_id, first_name, salary
FROM employees e
WHERE salary > (SELECT AVG(salary) FROM employees WHERE dept_id = e.dept_id);

-- Using CTE
WITH dept_avg AS (SELECT dept_id, AVG(salary) AS avg_sal FROM employees GROUP BY dept_id)
SELECT e.* FROM employees e JOIN dept_avg d ON e.dept_id = d.dept_id WHERE e.salary > d.avg_sal;
```

**Q2. Write a query to find customers who placed orders in every month of 2024.**

```sql
SELECT customer_id
FROM orders
WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY customer_id
HAVING COUNT(DISTINCT EXTRACT(MONTH FROM order_date)) = 12;
```

**Q3. How do you find the most popular product in each category?**

```sql
SELECT category, product_name, total_sales
FROM (
    SELECT p.category, p.product_name,
           SUM(oi.quantity) AS total_sales,
           ROW_NUMBER() OVER (PARTITION BY p.category ORDER BY SUM(oi.quantity) DESC) AS rn
    FROM products p
    JOIN order_items oi ON p.product_id = oi.product_id
    GROUP BY p.category, p.product_name
) t
WHERE rn = 1;
```

**Q4. Find all duplicate email addresses in a users table.**

```sql
SELECT email, COUNT(*) AS count
FROM users
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY count DESC;

-- Get full rows for duplicates
SELECT * FROM users
WHERE email IN (
    SELECT email FROM users
    GROUP BY email
    HAVING COUNT(*) > 1
)
ORDER BY email;
```

**Q5. Find users who logged in for 3 or more consecutive days.**

```sql
WITH dated AS (
    SELECT DISTINCT user_id, login_date,
           login_date - CAST(ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS INT) AS grp
    FROM login_history
),
streaks AS (
    SELECT user_id, grp, COUNT(*) AS streak_len
    FROM dated
    GROUP BY user_id, grp
)
SELECT DISTINCT user_id
FROM streaks
WHERE streak_len >= 3;
```

**Q6. Calculate month-over-month revenue growth.**

```sql
WITH monthly AS (
    SELECT DATE_TRUNC('month', order_date) AS month, SUM(total) AS revenue
    FROM orders GROUP BY 1
)
SELECT
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) AS prev_month,
    ROUND((revenue - LAG(revenue) OVER (ORDER BY month)) /
          NULLIF(LAG(revenue) OVER (ORDER BY month), 0) * 100, 2) AS growth_pct
FROM monthly
ORDER BY month;
```

**Q7. Find the top 3 products by revenue in each region.**

```sql
SELECT region, product_name, revenue
FROM (
    SELECT r.region, p.product_name, SUM(f.total_amount) AS revenue,
           RANK() OVER (PARTITION BY r.region ORDER BY SUM(f.total_amount) DESC) AS rnk
    FROM fact_sales f
    JOIN dim_product p ON f.product_key = p.product_key
    JOIN dim_store s ON f.store_key = s.store_key
    JOIN dim_region r ON s.region_id = r.region_id
    GROUP BY r.region, p.product_name
) t
WHERE rnk <= 3
ORDER BY region, rnk;
```

**Q8. How do you identify users who haven't logged in for 30 days but were active before?**

```sql
SELECT user_id, MAX(login_date) AS last_login
FROM logins
GROUP BY user_id
HAVING MAX(login_date) < CURRENT_DATE - INTERVAL '30 days'
   AND MAX(login_date) >= CURRENT_DATE - INTERVAL '365 days';  -- was active in last year
```

**Q9. Find the rolling 7-day average CTR for each ad campaign.**

```sql
WITH daily_ctr AS (
    SELECT
        campaign_id,
        DATE(event_time) AS event_date,
        SUM(CASE WHEN event_type = 'click'      THEN 1 ELSE 0 END) AS clicks,
        SUM(CASE WHEN event_type = 'impression' THEN 1 ELSE 0 END) AS impressions,
        SUM(CASE WHEN event_type = 'click' THEN 1 ELSE 0 END)::DECIMAL /
        NULLIF(SUM(CASE WHEN event_type = 'impression' THEN 1 ELSE 0 END), 0) AS ctr
    FROM ad_events
    GROUP BY campaign_id, DATE(event_time)
)
SELECT
    campaign_id,
    event_date,
    ctr,
    AVG(ctr) OVER (
        PARTITION BY campaign_id
        ORDER BY event_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS rolling_7d_ctr
FROM daily_ctr
ORDER BY campaign_id, event_date;
```

**Q10. How do you swap values in a column without a temp variable?**

```sql
-- Classic swap (Male ↔ Female)
UPDATE employees
SET gender = CASE gender WHEN 'M' THEN 'F' WHEN 'F' THEN 'M' END
WHERE gender IN ('M', 'F');
```

**Q11. Write a query to calculate the median salary.**

```sql
-- Method 1: PERCENTILE_CONT (standard SQL)
SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) AS median
FROM employees;

-- Method 2: Window function approach (portable)
SELECT AVG(salary) AS median
FROM (
    SELECT salary,
           COUNT(*) OVER () AS total_rows,
           ROW_NUMBER() OVER (ORDER BY salary) AS row_num
    FROM employees
) t
WHERE row_num IN (FLOOR((total_rows + 1) / 2.0), CEIL((total_rows + 1) / 2.0));
```

**Q12. Find employees hired in the same month as their manager.**

```sql
SELECT e.emp_id, e.first_name, e.hire_date,
       m.first_name AS manager_name, m.hire_date AS manager_hire_date
FROM employees e
JOIN employees m ON e.manager_id = m.emp_id
WHERE EXTRACT(MONTH FROM e.hire_date) = EXTRACT(MONTH FROM m.hire_date)
  AND EXTRACT(YEAR  FROM e.hire_date) = EXTRACT(YEAR  FROM m.hire_date);
```

**Q13. How do you write a query that generates a report showing sales for every combination of product and region, even if there were no sales?**

```sql
-- Cross join dimension tables to create all combinations
WITH all_combos AS (
    SELECT p.product_id, p.product_name, r.region_id, r.region_name
    FROM dim_product p
    CROSS JOIN dim_region r
)
SELECT
    ac.product_name,
    ac.region_name,
    COALESCE(SUM(f.total_amount), 0) AS total_sales
FROM all_combos ac
LEFT JOIN fact_sales f
    ON f.product_key = ac.product_id
    AND f.region_key  = ac.region_id
GROUP BY ac.product_name, ac.region_name
ORDER BY ac.product_name, ac.region_name;
```

**Q14. Find the department with the highest average salary, excluding departments with fewer than 5 employees.**

```sql
SELECT dept_id, AVG(salary) AS avg_salary, COUNT(*) AS emp_count
FROM employees
GROUP BY dept_id
HAVING COUNT(*) >= 5
ORDER BY avg_salary DESC
LIMIT 1;
```

**Q15. How do you find the Nth highest salary?**

```sql
-- Using DENSE_RANK (handles ties)
SELECT DISTINCT salary
FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS dr
    FROM employees
) t
WHERE dr = :N;  -- replace :N with desired rank

-- Using OFFSET (may not handle ties as expected)
SELECT DISTINCT salary FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET :N - 1;
```

**Q16. Write a query to detect fraudulent transactions (same card, > 3 transactions within 1 hour).**

```sql
WITH windowed AS (
    SELECT
        transaction_id,
        card_number,
        transaction_time,
        COUNT(*) OVER (
            PARTITION BY card_number
            ORDER BY transaction_time
            RANGE BETWEEN INTERVAL '1 hour' PRECEDING AND CURRENT ROW
        ) AS txn_count_1h
    FROM transactions
)
SELECT * FROM windowed
WHERE txn_count_1h > 3
ORDER BY card_number, transaction_time;
```

**Q17. How do you calculate the percentage of total for each row?**

```sql
SELECT
    dept_id,
    employee_name,
    salary,
    SUM(salary) OVER (PARTITION BY dept_id) AS dept_total,
    SUM(salary) OVER () AS company_total,
    ROUND(salary * 100.0 / SUM(salary) OVER (PARTITION BY dept_id), 2) AS pct_of_dept,
    ROUND(salary * 100.0 / SUM(salary) OVER (), 2) AS pct_of_company
FROM employees;
```

**Q18. Find users who visited page A but NOT page B.**

```sql
-- Using NOT EXISTS (correct with NULLs)
SELECT DISTINCT user_id
FROM page_views
WHERE page = 'A'
  AND NOT EXISTS (
      SELECT 1 FROM page_views pv2
      WHERE pv2.user_id = page_views.user_id
      AND pv2.page = 'B'
  );

-- Using LEFT JOIN approach
SELECT DISTINCT pva.user_id
FROM page_views pva
LEFT JOIN page_views pvb ON pva.user_id = pvb.user_id AND pvb.page = 'B'
WHERE pva.page = 'A'
  AND pvb.user_id IS NULL;
```

**Q19. Write a query to find the first and last order date for each customer.**

```sql
SELECT
    customer_id,
    MIN(order_date) AS first_order,
    MAX(order_date) AS last_order,
    COUNT(*) AS total_orders,
    MAX(order_date) - MIN(order_date) AS customer_lifespan_days
FROM orders
GROUP BY customer_id;
```

**Q20. How would you find all manager-employee pairs where the employee earns more than the manager?**

```sql
SELECT
    e.first_name AS employee_name,
    e.salary AS employee_salary,
    m.first_name AS manager_name,
    m.salary AS manager_salary
FROM employees e
JOIN employees m ON e.manager_id = m.emp_id
WHERE e.salary > m.salary;
```

**(Q21–Q100 continue covering: rank without window functions, pivot tables, date arithmetic edge cases, recursive hierarchies, OLAP cube queries, anti-joins, set-based updates, temporal queries, ad-tech CTR/CVR calculations, e-commerce funnel analysis, sessionization, A/B test significance queries, Pareto analysis, cohort LTV, inventory queries, bank transaction patterns, and more.)**

---

# 23. Coding Questions

## 1. Employees with Salary Above Department Average

```sql
SELECT emp_id, first_name, salary, dept_id,
       ROUND(avg_salary, 2) AS dept_avg_salary
FROM (
    SELECT emp_id, first_name, salary, dept_id,
           AVG(salary) OVER (PARTITION BY dept_id) AS avg_salary
    FROM employees
) t
WHERE salary > avg_salary
ORDER BY dept_id, salary DESC;
```

## 2. Second Highest Salary (Multiple Methods)

```sql
-- Method 1: DENSE_RANK
SELECT salary AS second_highest
FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS dr FROM employees) t
WHERE dr = 2
LIMIT 1;

-- Method 2: Subquery
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

-- Method 3: Handle case when fewer than 2 salaries exist
SELECT COALESCE(
    (SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET 1),
    NULL
) AS second_highest;
```

## 3. Duplicate Records

```sql
-- Find duplicates
SELECT email, COUNT(*) AS cnt
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Remove duplicates, keep lowest ID
DELETE FROM users
WHERE id NOT IN (
    SELECT MIN(id)
    FROM users
    GROUP BY email
);

-- Safer: CTE approach
WITH dupes AS (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
    FROM users
)
DELETE FROM users WHERE id IN (SELECT id FROM dupes WHERE rn > 1);
```

## 4. Running Total

```sql
SELECT
    order_date,
    order_id,
    amount,
    SUM(amount) OVER (ORDER BY order_date, order_id
                      ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM orders
ORDER BY order_date, order_id;
```

## 5. Moving Average (3-Month)

```sql
SELECT
    month,
    revenue,
    ROUND(AVG(revenue) OVER (ORDER BY month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 2) AS ma_3m
FROM monthly_revenue
ORDER BY month;
```

## 6. Consecutive Login Days (Streak Detection)

```sql
WITH consecutive AS (
    SELECT user_id, login_date,
           login_date - CAST(
               ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS INTEGER
           ) AS grp
    FROM (SELECT DISTINCT user_id, DATE(login_time) AS login_date FROM logins) d
),
streaks AS (
    SELECT user_id, grp,
           MIN(login_date) AS streak_start,
           MAX(login_date) AS streak_end,
           COUNT(*) AS streak_length
    FROM consecutive
    GROUP BY user_id, grp
)
SELECT user_id, streak_start, streak_end, streak_length
FROM streaks
WHERE streak_length >= 3
ORDER BY user_id, streak_start;
```

## 7. Pivot: Monthly Sales by Product

```sql
SELECT product_name,
    SUM(CASE WHEN month = 'Jan' THEN revenue ELSE 0 END) AS Jan,
    SUM(CASE WHEN month = 'Feb' THEN revenue ELSE 0 END) AS Feb,
    SUM(CASE WHEN month = 'Mar' THEN revenue ELSE 0 END) AS Mar,
    SUM(CASE WHEN month = 'Apr' THEN revenue ELSE 0 END) AS Apr,
    SUM(revenue) AS total
FROM (
    SELECT p.product_name,
           TO_CHAR(s.sale_date, 'Mon') AS month,
           SUM(s.amount) AS revenue
    FROM sales s JOIN products p ON s.product_id = p.product_id
    WHERE EXTRACT(YEAR FROM s.sale_date) = 2024
    GROUP BY p.product_name, TO_CHAR(s.sale_date, 'Mon')
) t
GROUP BY product_name
ORDER BY total DESC;
```

## 8. CTR and CVR by Campaign

```sql
SELECT
    campaign_id,
    COUNT(CASE WHEN event_type = 'impression' THEN 1 END) AS impressions,
    COUNT(CASE WHEN event_type = 'click'      THEN 1 END) AS clicks,
    COUNT(CASE WHEN event_type = 'purchase'   THEN 1 END) AS purchases,
    ROUND(
        COUNT(CASE WHEN event_type = 'click' THEN 1 END) * 100.0 /
        NULLIF(COUNT(CASE WHEN event_type = 'impression' THEN 1 END), 0), 4
    ) AS ctr_pct,
    ROUND(
        COUNT(CASE WHEN event_type = 'purchase' THEN 1 END) * 100.0 /
        NULLIF(COUNT(CASE WHEN event_type = 'click' THEN 1 END), 0), 4
    ) AS cvr_pct
FROM ad_events
WHERE event_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY campaign_id
ORDER BY impressions DESC;
```

## 9. Rank Departments by Total Salary

```sql
SELECT
    d.dept_name,
    SUM(e.salary) AS total_salary,
    COUNT(e.emp_id) AS emp_count,
    ROUND(AVG(e.salary), 2) AS avg_salary,
    RANK() OVER (ORDER BY SUM(e.salary) DESC) AS salary_rank
FROM departments d
LEFT JOIN employees e ON d.dept_id = e.dept_id
GROUP BY d.dept_id, d.dept_name
ORDER BY salary_rank;
```

## 10. Customer Retention: Active Last Month but Not This Month

```sql
WITH last_month AS (
    SELECT DISTINCT customer_id FROM orders
    WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
      AND order_date <  DATE_TRUNC('month', CURRENT_DATE)
),
this_month AS (
    SELECT DISTINCT customer_id FROM orders
    WHERE order_date >= DATE_TRUNC('month', CURRENT_DATE)
)
SELECT lm.customer_id
FROM last_month lm
LEFT JOIN this_month tm ON lm.customer_id = tm.customer_id
WHERE tm.customer_id IS NULL;  -- in last month but not this month (churned)
```

## 11. Sessionization with Gap Detection

```sql
WITH session_start AS (
    SELECT
        user_id,
        page_view_time,
        CASE WHEN page_view_time - LAG(page_view_time) OVER (PARTITION BY user_id ORDER BY page_view_time)
                  > INTERVAL '30 minutes'
             THEN 1 ELSE 0
        END AS is_new_session
    FROM page_views
),
sessions AS (
    SELECT *,
           SUM(is_new_session) OVER (PARTITION BY user_id ORDER BY page_view_time) AS session_num
    FROM session_start
)
SELECT
    user_id,
    session_num,
    MIN(page_view_time) AS session_start,
    MAX(page_view_time) AS session_end,
    COUNT(*) AS page_views_in_session,
    EXTRACT(EPOCH FROM MAX(page_view_time) - MIN(page_view_time)) / 60 AS session_duration_min
FROM sessions
GROUP BY user_id, session_num
ORDER BY user_id, session_num;
```

## 12. Find Products Never Ordered

```sql
-- LEFT JOIN approach
SELECT p.product_id, p.product_name
FROM products p
LEFT JOIN order_items oi ON p.product_id = oi.product_id
WHERE oi.product_id IS NULL;

-- NOT EXISTS approach (handles NULLs correctly)
SELECT product_id, product_name
FROM products p
WHERE NOT EXISTS (
    SELECT 1 FROM order_items oi WHERE oi.product_id = p.product_id
);
```

## 13. Year-over-Year Growth by Product Category

```sql
WITH yearly AS (
    SELECT
        p.category,
        EXTRACT(YEAR FROM o.order_date) AS year,
        SUM(oi.quantity * oi.unit_price) AS revenue
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.order_id
    JOIN products p ON oi.product_id = p.product_id
    GROUP BY p.category, EXTRACT(YEAR FROM o.order_date)
)
SELECT
    category,
    year,
    revenue,
    LAG(revenue) OVER (PARTITION BY category ORDER BY year) AS prev_year,
    ROUND(
        (revenue - LAG(revenue) OVER (PARTITION BY category ORDER BY year)) * 100.0 /
        NULLIF(LAG(revenue) OVER (PARTITION BY category ORDER BY year), 0), 2
    ) AS yoy_growth_pct
FROM yearly
ORDER BY category, year;
```

**(Additional problems 14–50 cover: inventory reorder queries, product affinity (basket analysis), A/B test winner query, cohort LTV calculation, SCD2 implementation with MERGE, recursive BOM (bill of materials), fraud pattern detection, geographic distance filtering, customer segmentation (RFM analysis), full-text search, JSON aggregation, and domain-specific patterns for ad-tech, e-commerce, banking, and healthcare.)**

---

# 24. SQL Interview Cheat Sheet

```
╔══════════════════════════════════════════════════════════════════════════════╗
║              SQL INTERVIEW CHEAT SHEET — Senior Data Engineer               ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

## Most Asked — One-Line Answers

| Question | Answer |
|---|---|
| SQL execution order | FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT |
| WHERE vs HAVING | WHERE: filter rows before grouping; HAVING: filter groups after GROUP BY |
| INNER vs LEFT JOIN | INNER: only matching rows; LEFT: all left rows + NULL for no match |
| DELETE vs TRUNCATE | DELETE: row-by-row, rollback possible; TRUNCATE: fast DDL, no rollback |
| COUNT(*) vs COUNT(col) | COUNT(*): all rows; COUNT(col): non-NULL rows only |
| UNION vs UNION ALL | UNION: removes duplicates (slow); UNION ALL: keeps all (fast) |
| ROW_NUMBER vs RANK | ROW_NUMBER: always unique; RANK: gaps after ties; DENSE_RANK: no gaps |
| Correlated subquery | Subquery that references outer query; runs once per outer row |
| CTE vs subquery | CTE: named, reusable, readable, supports recursion; subquery: inline |
| Index purpose | Speed up reads using B-tree/hash structure; slows writes |
| Clustered index | Determines physical storage order; one per table |
| ACID | Atomicity, Consistency, Isolation, Durability |
| Deadlock | Two txns each hold lock the other needs; DB kills one to resolve |
| NULL behavior | NULL ≠ NULL; use IS NULL; NULLs ignored by aggregates; NOT IN fails with NULLs |
| Star schema | Fact table + denormalized dimension tables; fast reads |
| SCD Type 2 | Add row for each change; track history with start/end date + is_current |
| Covering index | Index contains all query columns; avoids table lookup |
| Leftmost prefix | Composite index usable only if leftmost column is in predicate |
| Window function | Calculation across related rows without collapsing; uses OVER() |
| Partitioned table | Data split into directories by column; enables partition pruning |

## Join Type Quick Reference

```sql
INNER JOIN  → only matching rows from BOTH
LEFT JOIN   → all LEFT + NULLs for no match on right
RIGHT JOIN  → all RIGHT + NULLs for no match on left
FULL JOIN   → ALL rows from BOTH, NULLs where no match
CROSS JOIN  → every row × every row (Cartesian product)
SELF JOIN   → table joined with itself (hierarchies, comparisons)

-- Find rows in A not in B:
A LEFT JOIN B ON ... WHERE B.key IS NULL
-- or
WHERE NOT EXISTS (SELECT 1 FROM B WHERE B.key = A.key)
```

## Aggregation Quick Reference

```sql
COUNT(*)                  -- total rows
COUNT(col)                -- non-NULL rows
COUNT(DISTINCT col)       -- unique non-NULL values
SUM(col)                  -- sum (ignores NULLs)
AVG(col)                  -- average (ignores NULLs)
MIN(col) / MAX(col)
STDDEV(col) / VARIANCE(col)

-- Filter before aggregating
COUNT(CASE WHEN status='active' THEN 1 END)
SUM(CASE WHEN channel='web' THEN revenue ELSE 0 END)

-- HAVING examples
HAVING COUNT(*) >= 5
HAVING AVG(salary) > 80000
HAVING MAX(date) < CURRENT_DATE - INTERVAL '30 days'
```

## Window Functions Quick Reference

```sql
-- Ranking
ROW_NUMBER() OVER (PARTITION BY x ORDER BY y)
RANK()        OVER (PARTITION BY x ORDER BY y)
DENSE_RANK()  OVER (PARTITION BY x ORDER BY y)
NTILE(4)      OVER (ORDER BY y)
PERCENT_RANK() OVER (ORDER BY y)

-- Navigation
LAG(col, 1, default)  OVER (PARTITION BY x ORDER BY y)
LEAD(col, 1, default) OVER (PARTITION BY x ORDER BY y)
FIRST_VALUE(col)      OVER (PARTITION BY x ORDER BY y)
LAST_VALUE(col)       OVER (PARTITION BY x ORDER BY y ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING)

-- Aggregate as window
SUM(col)   OVER (PARTITION BY x ORDER BY y ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)
AVG(col)   OVER (PARTITION BY x ORDER BY y ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)
COUNT(*)   OVER (PARTITION BY x)
MAX(col)   OVER (PARTITION BY x)

-- Top N per group
SELECT * FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY grp ORDER BY val DESC) AS rn FROM t) WHERE rn <= N;
```

## Date Functions Quick Reference

```sql
CURRENT_DATE / NOW() / CURRENT_TIMESTAMP
EXTRACT(YEAR/MONTH/DAY/HOUR FROM ts)
DATE_TRUNC('month'/'year'/'week'/..., ts)
date + INTERVAL '30 days'
date - INTERVAL '1 month'
date1 - date2                      -- days between (PostgreSQL)
DATEDIFF(date1, date2)             -- MySQL
AGE(date1, date2)                  -- PostgreSQL (returns interval)
TO_CHAR(date, 'YYYY-MM-DD')       -- format date to string
TO_DATE('2024-01-15', 'YYYY-MM-DD') -- parse string to date

-- Common patterns
WHERE date >= CURRENT_DATE - INTERVAL '30 days'         -- last 30 days
WHERE date >= DATE_TRUNC('month', CURRENT_DATE)          -- this month
WHERE date >= DATE_TRUNC('year', CURRENT_DATE)           -- YTD
WHERE date BETWEEN '2024-01-01' AND '2024-12-31'         -- full year
```

## NULL Handling Quick Reference

```sql
col IS NULL / col IS NOT NULL
COALESCE(col, 0)                    -- first non-NULL
NULLIF(col, 0)                      -- returns NULL if col = 0
col IS NOT DISTINCT FROM other      -- NULL-safe equality

-- Aggregate: all ignore NULLs except COUNT(*)
SELECT COALESCE(AVG(salary), 0)     -- treat NULL avg as 0

-- NOT IN + NULLs = trap
-- BAD:  WHERE id NOT IN (SELECT id FROM t)  -- fails if NULLs in subquery
-- GOOD: WHERE NOT EXISTS (SELECT 1 FROM t WHERE t.id = outer.id)
```

## Index Decision Guide

```
Column in WHERE clause?         → Consider index
Column in JOIN ON?              → Index foreign keys
Column in ORDER BY?             → Consider index
Column has high cardinality?    → Good index candidate
Column often used with =?       → Hash or B-tree
Column often used with ranges?  → B-tree only
Multiple columns in predicate?  → Composite index (leftmost first)
LIKE 'pattern%'?                → B-tree index on column
LIKE '%pattern%'?               → Full-text index
Function on column in WHERE?    → Function-based/expression index
Small table (< 1000 rows)?      → Skip the index
Heavy INSERT/UPDATE table?      → Minimize indexes
```

## Query Optimization Checklist

```
□ Avoid SELECT * — list specific columns
□ Filter early — WHERE before JOIN if possible
□ Use EXISTS instead of IN for large subqueries
□ Use NOT EXISTS instead of NOT IN (NULL safety)
□ Avoid functions on indexed columns in WHERE
□ Use covering index for frequently-queried patterns
□ Match data types in JOINs and WHERE (avoid implicit cast)
□ Use UNION ALL instead of UNION unless dedup needed
□ Replace correlated subquery with window function or JOIN
□ Check EXPLAIN plan for unexpected Seq Scans
□ Index all foreign key columns
□ Run ANALYZE after bulk loads to update statistics
□ Prefer CTE for readability; test subquery for performance
□ Use LIMIT for top-N queries to stop early
□ Partition large tables by date/key for pruning
□ Use approximate functions (APPROX_COUNT_DISTINCT) for analytics
```

## Transaction Isolation Quick Reference

```
READ UNCOMMITTED → may see dirty reads (rarely used)
READ COMMITTED   → default in most DBs; see committed data only
REPEATABLE READ  → snapshot at tx start; prevents non-repeatable reads
SERIALIZABLE     → strictest; prevents all anomalies; slowest

Dirty Read:           read uncommitted data from another tx
Non-Repeatable Read:  same SELECT returns different data within tx
Phantom Read:         new rows appear between reads in same tx
```

## Common Patterns Cheat Sheet

```sql
-- Top N per group
SELECT * FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY g ORDER BY v DESC) AS rn FROM t) t WHERE rn <= N

-- Dedup: keep latest
SELECT * FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated_at DESC) AS rn FROM t) WHERE rn = 1

-- Running total
SUM(v) OVER (PARTITION BY g ORDER BY d ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)

-- Period-over-period change
v - LAG(v) OVER (PARTITION BY g ORDER BY d)

-- YoY growth pct
(v - LAG(v) OVER (PARTITION BY month ORDER BY year)) * 100.0 / NULLIF(LAG(v) OVER (...), 0)

-- Fill gaps (date spine)
date_spine LEFT JOIN actual_data → COALESCE(value, 0)

-- Pivot
SUM(CASE WHEN category = 'A' THEN value ELSE 0 END) AS cat_A

-- Sessionization (30-min gap)
SUM(CASE WHEN ts - LAG(ts) OVER (...) > INTERVAL '30 min' THEN 1 ELSE 0 END) OVER (...)

-- Consecutive days (island)
date - ROW_NUMBER() OVER (PARTITION BY user ORDER BY date)::INT  -- constant per streak group

-- Nth highest salary
SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET N-1

-- Employees NOT in another table
A LEFT JOIN B ON ... WHERE B.key IS NULL
-- OR NOT EXISTS (SELECT 1 FROM B WHERE B.key = A.key)

-- Month-to-date
WHERE date >= DATE_TRUNC('month', CURRENT_DATE) AND date < CURRENT_DATE + 1

-- Conditional aggregation (pivot without PIVOT syntax)
COUNT(CASE WHEN status = 'active' THEN 1 END) AS active_count
```

## Troubleshooting Quick Reference

```
SYMPTOM                              | CAUSE                    | FIX
─────────────────────────────────────┼──────────────────────────┼──────────────────────
Query returns 0 rows unexpectedly    | NULL in NOT IN subquery   | Use NOT EXISTS
Query returns wrong count            | Duplicate rows from JOIN  | Use DISTINCT or EXISTS
HAVING clause doesn't filter         | Using WHERE alias         | Repeat expression or use CTE
Index not being used                 | Function on column        | Use expression index
ORDER BY alias doesn't work          | Wrong execution order     | Use column name or CTE
GROUP BY error on non-agg col        | Missing column in GROUP BY| Add to GROUP BY
Window function not available        | Old SQL version/dialect   | Use correlated subquery
CROSS JOIN exploded result set       | Forgot join condition     | Add ON clause
Slow query with LIKE '%pattern%'     | Leading wildcard          | Use full-text search
Deadlock detected                    | Lock order inconsistency  | Lock in consistent order
```

## Big Data SQL Quick Reference

```sql
-- Spark SQL: partition pruning (always filter on partition columns)
WHERE year = 2024 AND month = 1

-- Spark SQL: broadcast hint
SELECT /*+ BROADCAST(small) */ * FROM large JOIN small ON ...

-- Spark SQL: array operations
explode(arr), size(arr), array_contains(arr, val), transform(arr, x -> x*2)

-- Hive: dynamic partition insert
INSERT INTO t PARTITION(year, month) SELECT *, year_col, month_col FROM src

-- BigQuery: approximate functions
APPROX_COUNT_DISTINCT(user_id)  -- ~2% error, 10x faster

-- Delta Lake: MERGE
MERGE INTO target t USING source s ON t.id = s.id
WHEN MATCHED THEN UPDATE SET ... WHEN NOT MATCHED THEN INSERT ...

-- Delta Lake: time travel
SELECT * FROM table VERSION AS OF 5
SELECT * FROM table TIMESTAMP AS OF '2024-01-15'

-- Delta Lake: Z-ordering
OPTIMIZE table ZORDER BY (user_id, date)
```

---

*This document covers SQL topics for Senior Data Engineer, Data Analyst, Analytics Engineer, and Data Warehouse/BI interviews.*
*Key areas to master: Window Functions, CTEs, JOIN strategies, NULL handling, Query Optimization, Aggregations, and Data Warehouse patterns.*

*Dialects covered: PostgreSQL, MySQL, SQL Server, Oracle, Spark SQL, Hive, BigQuery, Snowflake, Presto/Trino.*
