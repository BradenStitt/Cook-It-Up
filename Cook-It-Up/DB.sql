-- 1. Create a new database called CookItUp
sqlite3 CookItUp.db

-- 2. Create tables for User, Pantry, PantryItem, and FoodPreference

-- Create User table
CREATE TABLE IF NOT EXISTS User (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create Pantry table
CREATE TABLE IF NOT EXISTS Pantry (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  userId INTEGER NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id)
);

-- Create PantryItem table
CREATE TABLE IF NOT EXISTS PantryItem (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  expiryDate DATETIME,
  pantryId INTEGER NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pantryId) REFERENCES Pantry(id)
);

-- Create FoodPreference table
CREATE TABLE FoodPreference (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  userId INTEGER NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id)
);

-- Insert data into User table
INSERT INTO User (email, password, name) VALUES 
('alice@example.com', 'password123', 'Alice Smith'),
('bob@example.com', 'securepass456', 'Bob Johnson'),
('charlie@example.com', 'charlie789', 'Charlie Brown'),
('diana@example.com', 'diana321', 'Diana Green'),
('eva@example.com', 'eva654', 'Eva White');
