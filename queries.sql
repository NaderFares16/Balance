sqlite3 queries.db

CREATE TABLE IF NOT EXISTS Categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Expense', 'Income'))
);

CREATE TABLE IF NOT EXISTS Transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER,
  amount REAL NOT NULL,
  date INTEGER NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('Expense', 'Income')),
  FOREIGN KEY (category_id) REFERENCES Categories (id)
);

/* INSERT DATA INTO CATEGORIES TABLE */

INSERT INTO Categories (name, type) VALUES ('Utilities', 'Expense');

INSERT INTO Categories (name, type) VALUES ('Dining Out', 'Expense');

INSERT INTO Categories (name, type) VALUES ('Bills', 'Expense');

INSERT INTO Categories (name, type) VALUES ('Health', 'Expense');

INSERT INTO Categories (name, type) VALUES ('Subscriptions', 'Expense');

INSERT INTO Categories (name, type) VALUES ('Bonus', 'Income');

INSERT INTO Categories (name, type) VALUES ('Sale', 'Income');

INSERT INTO Categories (name, type) VALUES ('Salary', 'Income');

/* INSERT DATA INTO TRANSACTIONS TABLE */

INSERT INTO Transactions (category_id, amount, date, description, type) VALUES (1, 30.75, 7281724, 'Weekly Groceries', 'Expense');

INSERT INTO Transactions (category_id, amount, date, description, type) VALUES (4, 149.00, 209381, 'Gym', 'Expense');

INSERT INTO Transactions (category_id, amount, date, description, type) VALUES (8, 1084.00, 109217, 'Weekly Salary', 'Income');

.quit