# Cooee technical assessment

## **ArmstrongCheck - Armstrong Number Management System**

ArmstrongCheck is a web application that allows users to verify Armstrong numbers, save them, and view their submissions through interactive dashboards. The application also includes a global dashboard to view all registered users and their Armstrong numbers.

---

## Clone the repo
```
git clone https://github.com/jobint001/cooee_technical_assessment.git
```

## **Project Structure**

```plaintext
cooee_technical_assessment/
│
├── backend/          # Go backend with REST APIs
│   ├── main.go       # Entry point for backend server
│   ├── handlers/     # HTTP handlers for APIs
│   ├── models/       # Database models
│   ├── utils/        # Utility functions (e.g., Armstrong number verification)
│   └── database/     # Database connection setup
│
├── frontend/armstrong-app         # React.js frontend application
│   ├── src/          # React components and pages
│   ├── public/       # Static files
│   └── package.json  # React project dependencies
│
├── README.md         # Project documentation
│
└── ArmstrongAppCollection.postman_collection.json  #Postman collection for backend APIs

```

## **Tech Stack**
- Backend: Go (Golang), GORM ORM, MySQL
- Frontend: React.js, Tailwind CSS, Axios
- Database: MySQL

## **Backend Setup**

### Prerequisites
- Install Go (version 1.18+): Download Go
- Install MySQL: Ensure MySQL server is running.
### Step 1: Configure MySQL
    CREATE DATABASE armstrong_app;
### **Step 2: Setup Environment Variables**

Create a `.env` file in the **backend** directory and add the following content(use actual DB username and password):

```env
DB_USER=root
DB_PASSWORD=testpassword
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=armstrong_app
```
### **Step 3: Run the Backend**

1. Navigate to the backend folder:

    ```bash
    cd backend
    ```
2. Run the backend server:
    ```bash
    go run main.go
    ```
3. The backend server will start on:
    ```
    http://localhost:8080
    ```
## **Frontend Setup**
### Prerequisites
- Install Node.js (version 14+): Download Node.js
- Install npm (comes with Node.js).
### Step 1: Set Up the Frontend
1. Navigate to the frontend folder from root:

    ```bash

    cd frontend
    cd armstrong-app
    ```
2. Install frontend dependencies:
    ```bash
    
    npm install
    ```

3. Start the React development server:

    ```bash

    npm run dev
    ```
4. The frontend application will start on:

    ```a

    http://localhost:5173
    ```


## **Available API Endpoints**

| **Endpoint**              | **Method** | **Description**                       | **Parameters**                              |
|----------------------------|------------|---------------------------------------|--------------------------------------------|
| `/users/register`          | POST       | Register a new user                   | `{ "email": "user@example.com" }`          |
| `/users/login`             | POST       | Log in an existing user               | `{ "email": "user@example.com" }`          |
| `/armstrong/verify`        | POST       | Verify if a number is Armstrong       | `{ "email": "user@example.com", "number": 153 }` |
| `/armstrong/save`          | POST       | Save a verified Armstrong number      | `{ "email": "user@example.com", "number": 153 }` |
| `/user/dashboard`          | GET        | Fetch Armstrong numbers for a user    | `email` (query parameter)                  |
| `/armstrong/global`        | GET        | Fetch all users and their numbers     | `page`, `size`, `query` (optional)         |


Here’s the updated Markdown documentation for the Database Schema Design section according to the provided Go structs for User and ArmstrongNumber:

markdown
Copy code
## **Database Schema Design**

The application uses a **MySQL** database with two tables: `users` and `armstrong_numbers`.

### **Schema Structure**

1. **`users` Table**
   - Stores user information.
   - **Columns**:
     | Column Name   | Type         | Constraints                |
     |---------------|--------------|----------------------------|
     | `id`         | INT          | Primary Key, Auto Increment |
     | `email`      | VARCHAR(255) | Unique, Not Null           |
     | `created_at` | TIMESTAMP    | Default: CURRENT_TIMESTAMP |

   - **Relationship**:  
     Each user can have multiple Armstrong numbers, linked through the `user_id` column in the `armstrong_numbers` table.

2. **`armstrong_numbers` Table**
   - Stores Armstrong numbers associated with each user.
   - **Columns**:
     | Column Name   | Type         | Constraints                      |
     |---------------|--------------|----------------------------------|
     | `id`         | INT          | Primary Key, Auto Increment      |
     | `user_id`    | INT          | Foreign Key (References `users.id`), Indexed |
     | `number`     | INT          | Not Null                         |
     | `created_at` | TIMESTAMP    | Default: CURRENT_TIMESTAMP       |


---

## **Performance Optimization Approaches**
### **1. Database Optimization**
- **Indexes**: Added an **index** on the `user_id` column in the `armstrong_numbers` table to optimize queries involving user-specific data.
    
- **Unique Constraint**: Added a unique constraint on the `email` column in the `users` table to prevent duplicate user registration.
    

- **Lazy Loading**: Used GORM's **lazy loading** to fetch associated Armstrong numbers only when necessary.

### **2. Pagination**
- Implemented **pagination** for endpoints returning large datasets, such as `/armstrong/global`.  
  Pagination reduces the amount of data fetched and transferred at one time, improving performance and user experience.

## **Challenges Encountered and Solutions Implemented**

### **1. Duplicate User Registration**
- **Challenge**: Users could register with duplicate email addresses, causing data integrity issues.
- **Solution**: Added a **unique constraint** on the `email` column in the database and handled errors in the backend:

### **2. CORS Issues**
- **Challenge**: The frontend React app couldn't fetch data from the backend due to CORS restrictions.
- **Solution**: Configured CORS middleware in the backend to allow requests from the frontend origin:
