# CampusLoop

### Campus-Verified Circular Marketplace

CampusLoop is a full-stack campus marketplace designed for university students to **buy, sell, and request second-hand academic and hostel essentials within their campus community**.

The platform focuses on safe campus-based discovery, seller verification, product management, wishlist and cart functionality, orders, and a Wanted Board where students can post items they are looking for.

---

## 🚀 Overview

Students often have books, electronics, hostel items, stationery, and other useful products that they no longer need. At the same time, other students may be looking for the same items at affordable prices.

CampusLoop connects these students through a **campus-aware marketplace**.

Each user belongs to a specific campus, and marketplace products and wanted requests are filtered according to the authenticated user's campus.

### Core workflow

```text
Student
   │
   ├── Register with Campus
   │
   ├── Browse Campus Marketplace
   │       ├── Search
   │       ├── Filter
   │       └── Sort
   │
   ├── Buy Products
   │       ├── Wishlist
   │       ├── Cart
   │       └── Checkout
   │
   └── Become a Seller
           │
           ├── Seller Application
           │
           ├── Admin Approval
           │
           └── Create Product Listings
```

---

## ✨ Features

### 🔐 Authentication & Authorization

- User registration and login
- JWT-based authentication
- Password encryption
- Role-based authorization
- Protected frontend routes
- Backend API protection using Spring Security
- Customer, Seller, and Admin roles

### 🎓 Campus-Based Marketplace

- Users select their campus during registration
- Every user is associated with a campus
- Marketplace products are filtered by campus
- Wanted posts are filtered by campus
- Backend determines campus from the authenticated user
- Users cannot simply change a frontend campus ID to access another campus marketplace

### 🛍️ Product Marketplace

- Create product listings
- Update products
- Delete products
- Product details
- Product images
- Product categories
- Product condition
- Listing type
- Stock management
- Course and subject information
- Semester information
- Campus pickup location

### 🔎 Product Search & Filtering

The marketplace supports:

- Keyword search
- Category filtering
- Minimum price
- Maximum price
- Product condition
- Listing type
- Course
- Subject
- Semester
- Seller filtering
- Price sorting
- Name sorting
- Latest products
- Pagination

Product filtering is implemented using **Spring Data JPA Specifications**.

### ❤️ Wishlist

- Add products to wishlist
- Remove products from wishlist
- Check wishlist status
- Wishlist access for authenticated users

### 🛒 Shopping Cart

- Add products to cart
- Update quantities
- Remove products
- Stock-aware cart operations
- Authenticated cart access

### 📦 Orders

- Checkout workflow
- Order creation
- Order history
- Order details
- Authenticated order access

### 📝 Wanted Board

Students can create requests for products they are looking for.

Example:

> "Looking for a second-hand Engineering Mathematics book under ₹500."

Features include:

- Create wanted posts
- View campus wanted posts
- View personal wanted posts
- Category selection
- Maximum budget
- Request description
- Request image
- Product matching

The matching system considers:

- Campus
- Budget
- Product availability
- Category

### 🏪 Seller Management

- Seller application
- Seller approval workflow
- Seller status management
- Admin approval/rejection
- Verified seller state
- Product listing restricted to approved sellers

### 🛡️ Security

- Stateless JWT authentication
- Spring Security
- Role-based authorization
- Protected API endpoints
- Protected frontend routes
- Campus-level data isolation
- Backend ownership checks

---

## 🏗️ Architecture

CampusLoop follows a layered full-stack architecture.

```text
┌─────────────────────────────┐
│        React Frontend       │
│                             │
│ Pages / Components          │
│ Context / Hooks             │
│ Services / Axios            │
└──────────────┬──────────────┘
               │
               │ REST API + JWT
               ▼
┌─────────────────────────────┐
│       Spring Boot API       │
│                             │
│ Controllers                 │
│ Services                    │
│ Repositories                │
│ Specifications              │
│ Security                    │
└──────────────┬──────────────┘
               │
               │ JPA / Hibernate
               ▼
┌─────────────────────────────┐
│           MySQL             │
│                             │
│ Users                       │
│ Campuses                    │
│ Products                    │
│ Categories                  │
│ Sellers                     │
│ Cart / Orders / Wishlist    │
│ Wanted Posts                │
└─────────────────────────────┘
```

---

## 🔐 Authentication Flow

CampusLoop uses JWT-based authentication.

```text
Login / Register
       │
       ▼
Spring Security Authentication
       │
       ▼
JWT Token Generated
       │
       ▼
Frontend Stores Token
       │
       ▼
Axios Request Interceptor
       │
       ▼
Authorization: Bearer <JWT>
       │
       ▼
JwtAuthenticationFilter
       │
       ▼
Spring Security Context
       │
       ▼
Authenticated User
```

The authenticated user's email is used by the backend to identify the user and retrieve their campus.

---

## 🎓 Campus Isolation

One of the key architectural features of CampusLoop is **backend-enforced campus isolation**.

The application does not trust the frontend to determine which campus a user can access.

The relationship is:

```text
Product
   │
   ▼
SellerProfile
   │
   ▼
User
   │
   ▼
Campus
```

When a user requests marketplace products:

```text
Authenticated User
       │
       ▼
User's Campus
       │
       ▼
Campus ID
       │
       ▼
Product → Seller → User → Campus
       │
       ▼
Only matching campus products
```

This prevents users from bypassing campus restrictions simply by modifying frontend parameters.

---

## 👤 Seller Approval Workflow

A user cannot immediately create marketplace listings.

```text
Customer
   │
   ▼
Seller Application
   │
   ▼
PENDING
   │
   ├───────────────┐
   ▼               ▼
APPROVED         REJECTED
   │               │
   ▼               ▼
SELLER           CUSTOMER
   │
   ▼
Create Products
```

Only approved sellers can create product listings.

---

## 🧩 Technology Stack

### Frontend

- React
- React Router
- Axios
- Tailwind CSS
- React Icons
- Zod
- React Hook Form
- Vite

### Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- Maven
- Lombok
- Jakarta Validation
- OpenAPI / Swagger

### Database

- MySQL

---

## 📁 Project Structure

```text
CampusLoop/
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validation/
│   │
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── marketplace/
│   │       │           └── backend/
│   │       │               ├── config/
│   │       │               ├── controller/
│   │       │               ├── dto/
│   │       │               ├── entity/
│   │       │               ├── enums/
│   │       │               ├── exception/
│   │       │               ├── mapper/
│   │       │               ├── repository/
│   │       │               ├── security/
│   │       │               ├── service/
│   │       │               ├── specification/
│   │       │               └── util/
│   │       │
│   │       └── resources/
│   │
│   ├── pom.xml
│   └── ...
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

- Java 17+
- Node.js 18+
- npm
- MySQL
- Maven

---

## 🔧 Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Configure your database and application properties.

Example configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/campusloop
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

jwt.secret=YOUR_SECRET_KEY
jwt.expiration=86400000
```

Start the Spring Boot application:

```bash
mvn spring-boot:run
```

The backend will run on:

```text
http://localhost:8080
```

---

## 💻 Frontend Setup

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8080/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will be available at the Vite development URL shown in your terminal.

---

## 🔑 Environment Variables

### Frontend

```env
VITE_API_URL=http://localhost:8080/api
```

### Backend

Configure the following values according to your environment:

```properties
spring.datasource.url=YOUR_DATABASE_URL
spring.datasource.username=YOUR_DATABASE_USERNAME
spring.datasource.password=YOUR_DATABASE_PASSWORD

jwt.secret=YOUR_JWT_SECRET
jwt.expiration=86400000
```

**Never commit real passwords, database credentials, or JWT secrets to GitHub.**

---

## 🔌 Important API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Campus

```text
GET  /api/campuses
GET  /api/campuses/{id}
```

### Products

```text
GET    /api/products
GET    /api/products/search
GET    /api/products/{id}
GET    /api/products/my-products

POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

### Wanted Board

```text
GET  /api/wanted-posts
GET  /api/wanted-posts/mine
GET  /api/wanted-posts/{id}/matches

POST /api/wanted-posts
```

Other APIs handle:

- Categories
- Seller management
- Cart
- Wishlist
- Orders
- Payments
- Admin operations

---

## 🛡️ Validation & Error Handling

CampusLoop uses validation at both the frontend and backend layers.

### Frontend

- Form validation
- Required-field validation
- Email validation
- Password validation
- Password confirmation
- Campus selection validation
- Inline error messages

### Backend

- Jakarta Bean Validation
- Authentication checks
- Authorization checks
- Resource existence checks
- Seller approval checks
- Campus association checks
- Product ownership checks
- Business-rule validation

---

## 📌 Key Design Decisions

### Backend-enforced campus filtering

Campus information is derived from the authenticated user instead of trusting a `campusId` supplied by the frontend.

### Seller approval before listing

Only approved sellers can create marketplace listings.

### Specification-based search

Spring Data JPA Specifications allow multiple optional filters without creating a large number of repository methods.

### JWT-based stateless security

The backend does not rely on server-side sessions. Each authenticated request carries its JWT.

### Role-based access

Different roles have different permissions across the marketplace.

---

## 🎯 Project Goals

CampusLoop was designed to demonstrate practical full-stack development concepts including:

- REST API development
- Authentication and authorization
- Secure application design
- Relational database modeling
- Role-based access control
- Frontend state management
- API integration
- Search and filtering
- Business workflow implementation
- Data isolation
- Form validation
- Exception handling

---

## 🚧 Future Improvements

Possible future improvements include:

- Real user reviews and ratings
- In-app buyer/seller messaging
- Email notifications
- Advanced product recommendations
- Improved seller analytics
- Campus administration dashboard
- More advanced order/payment integrations

These features are intentionally outside the current core scope to keep the platform focused on its primary campus marketplace workflow.

---

## 📚 Learning Outcomes

Through CampusLoop, the project demonstrates practical experience with:

- Building a full-stack application from frontend to database
- Designing RESTful APIs
- Implementing JWT authentication with Spring Security
- Designing entity relationships with JPA/Hibernate
- Implementing role-based authorization
- Building dynamic search and filtering
- Protecting data using backend authorization rules
- Integrating React with Spring Boot APIs
- Managing application state and authentication on the frontend
- Implementing real-world business workflows

---

## 👨‍💻 Project

**CampusLoop — Campus-Verified Circular Marketplace**

Built with:

```text
React + Spring Boot + MySQL
```

A focused marketplace designed to make student-to-student reuse easier, more affordable, and campus-aware.
