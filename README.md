# 1. Frameworks & Versions

Frontend

	•	React – v19.2.0 
	•	Vite – v7.2.4
	•	React Router – v7.13.0
	•	Tailwind CSS – v3.4.19

Backend

	•	Node.js – v24.5.0
	•	Express – v5.2.1

Database

	•	PostgreSQL – v14.18 (Homebrew)

Cache / Session Management

	•	Redis – v5.10.0

Main Libraries & Tools

	•	bcrypt – v6.0.0
	•	jsonwebtoken – v9.0.3
	•	nodemailer – v8.0.0
	•	dotenv – v17.2.3
	•	cookie-parser – v1.4.7

⸻

# 2. Setup Steps (How to Run the Project)

Follow the steps below to run the project locally:

A. Download the Project Files

	1.	Clone or Download the project from the GitHub repository as a .zip file.
	2.	Extract the .zip file on your computer.

B. Install Required Software

Make sure the following are installed:

	•	Node.js
	•	PostgreSQL + pgAdmin
	•	Redis

C. Setup the Database

	1.	Open pgAdmin.
	2.	Right-click Databases → Click Create → Database → Enter a name → Click Save.
	3.	Right-click the newly created database → Click Restore.
	4.	Select the provided schema-only backup file (.sql).
	5.	Click Restore to recreate the database structure (tables, constraints, relations, and triggers).

D. Install Dependencies

	1.	Open the project folder in VS Code.
	2.	Open the terminal and run: npm install

E. Setup Environment Variables

	1.	Create a .env file in the root folder.
	2.	Add the required environment variables:
  
	•	Database configuration
	•	JWT secret
	•	Nodemailer email credentials
	•	Redis configuration

  ```
Inside the .env file:

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Nodemailer (Email OTP / 2FA)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```

F. Run the Project

Start the backend: `node server/server.js`  
Start the frontend: `npm run dev`  
Open the browser and go to: `http://localhost:5173`

# 3. Admin & User Test Accounts

Roles

	•	Librarian (Admin)
	•	Student (User)

Test Accounts:

Due to the implementation of two-factor authentication (2FA) using OTP sent via email, real email accounts were used for testing.

To test the system:

	1.	Register a valid email address for the student role. For the librarian role, you can manually insert it into the database since there is no registration route for librarian a ccounts.
	2.	Log in using your credentials.
	3.	Enter the OTP sent to your email to complete authentication.

# 4. Notes

	•	The system uses email-based OTP verification for secure login.
	•	Parameterized queries are used to prevent SQL injection.
	•	Redis caching is used to improve performance and session handling.



