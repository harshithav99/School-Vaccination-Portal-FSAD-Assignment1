Full Stack Application Development- Assignment 1
School Vaccination Portal – Report
By:- V Harshitha, 2024TM93089


1.	System Overview
School Vaccination Portal is a full-stack web application created to efficiently handle student vaccinations. It allows authenticated users (such as school admins) to:
•	Add/manage students
•	Manage vaccination drives
•	Mark students as vaccinated
•	View vaccination reports
The system provides centralized tracking of vaccination data and is developed with recent web technologies using MERN (MongoDB, Express, React, Node.js) stack
2. Application Architecture

     
 	Users 
Authentication Flow
•	Users login/register.
•	JWT token is returned and stored in Local Storage.
•	For protected API routes, the token is sent via Authorization: Bearer <token> header.
Data Flow
1.	Frontend makes requests to backend (e.g., create student, fetch report).
2.	Backend validates token → handles logic → queries MongoDB.
3.	MongoDB returns data → backend sends JSON response → frontend renders data.
Technologies Used
•	Frontend: React
•	Backend: Node.js with Express
•	Database: MongoDB with Mongoose
•	Authentication: JWT
API Testing: Postman

3. Frontend–Backend Interaction
The frontend uses Axios to communicate with the backend API endpoints. JWT tokens are stored in localStorage and sent in headers for authenticated requests.
Example:
axios.post('/api/students/:id/vaccinate', { driveId, vaccineName, date }, {
  headers: { Authorization: `Bearer ${token}` }
});

4. API Endpoints
Student APIs
Method	Endpoint	Description
POST	/api/students	Add a new student
GET	/api/students	Fetch all students
POST	/api/students/:id/vaccinate	Mark a student as vaccinated


Drive APIs
Method	Endpoint	Description
POST	/api/drives	Add a new vaccination drive
GET	/api/drives	Fetch all drives

Report API
Method	Endpoint	Description
GET	/api/reports	Get vaccination summary/report


5. API Documentation (Postman)
A Postman collection was created to test all the endpoints, including:
•	Student creation
•	Drive creation
•	Marking a student as vaccinated
•	Fetching reports

6. Database Schema
Student Schema
const studentSchema = new mongoose.Schema({
  name: String,
  studentClass: String,
  studentId: String,
  vaccinated: { type: Boolean, default: false },
  vaccinationRecord: [{
    vaccineName: String,
    date: Date,
    driveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive' }
  }]
});
Drive Schema
const driveSchema = new mongoose.Schema({
  name: String,
  date: Date,
  location: String
});

7. Assumptions
•	Only authenticated users can access the dashboard and APIs
•	A student can be vaccinated in multiple drives (stored as an array)
•	Vaccination marking updates both the status and adds to vaccinationRecord

8. UI/UX Wireframes
Not created separately — UI directly implemented in React. Key pages:
•	Login/Register Page
•	Dashboard
•	Student Management
•	Drive Management
•	Report Page

9. Snapshots (Add to Word or folder)
•	UI Screenshots:
o	Login/Register
 
 
o	Dashboard
 
o	Student Management
 
o	Vaccination Drives
 
o	Reports page
 
 

•	 Postman/API Response Snapshots:
o	POST /api/students
 
 

 
o	POST /api/students/:id/vaccinate
 
o	GET /api/reports
 

•	MongoDB Schemas Snapshots
o	Drive Schema

 

o	Students Schema




 
o	Users Schema

 


10. Setup & Running Instructions
Backend Setup
•	cd backend
•	npm install
•	npm start

.env file:
PORT=5055
MONGO_URI=mongodb://localhost:27017/school_vaccine_portal
JWT_SECRET=your_super_secret_key_123

Frontend Setup
•	cd frontend
•	npm install
•	npm start



11. Video Demonstration Link:

https://drive.google.com/file/d/198C4ocjbaArKidSKhuz07QJlVL8_YcCt/view?usp=sharing
