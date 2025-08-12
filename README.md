#  RentHub – Find it. List it. Rent it. All in one place 📍

RentHub is a peer-to-peer rental platform that enables users to list, find, and rent items or spaces directly from others — saving money and reducing waste. Designed to make renting simple and accessible, the platform connects people who have underused resources with those who need them, fostering a community of sharing, convenience, and trust.

---
## 👥 Team Details
**Team Name:** CodeStorm
 
**Team Members:**
- Arman 
- Ayush Rai  
- Arijit Kumar  
- Mohd Asheer


## 📚 Table of Contents
- [✨ Features](#-features)
- [📦 Project Structure](#-project-structure)
- [🛠 Technologies Used](#-technologies-used)
- [🚀 Installation](#-installation)
- [🕹 Usage Guide](#-usage-guide)
- [📢 API Endpoints (Backend)](#-api-endpoints-backend)
- [🤝 Contributing](#-contributing)
- [📄 Motivation](#-motivation)

---

## ✨ Features

## 👤 User Profile
* Add basic details: name, location (optional), profile photo (optional)
* List items or spaces you want to **rent out** and those you **want to rent**
* Set availability for pickup/return timings
* Choose to make your profile **public or private**

## 🔍 Product Discovery
* Browse or search available rental items/spaces by category (e.g., "Camera", "Apartment")
* Filter results based on location, availability, or rental duration
* View detailed listings with pricing, photos, and availability calendar

## 🛒 Rental Requests & Orders
* Send rental requests for listed products
* Accept or reject incoming rental requests
* View all **pending**, **active**, and **completed** rentals
* Option to **cancel** requests before they are accepted

## 💳 Secure Payments
* Pay directly via integrated payment gateways (e.g., Razorpay, Stripe, PayPal)
* Support for full upfront payment, partial deposit, or pay-on-return
* Automatic calculation of late return fees based on predefined rules

## 🔔 Notifications (Optional/Enhancement)
* Get notified when:
  * Someone sends you a rental request
  * Your request is accepted or rejected
  * Payment is confirmed
  * Return date is approaching or overdue

## ⭐ Ratings & Feedback
* Rate users and leave reviews after a rental transaction
* Helps build a **trusted and reliable** rental community




---

## 📦 Project Structure
```
Rentalhub/
├── 📁 backend/
│ ├── 📁 .mvn/
│ │ └── 📄 maven-wrapper.properties
│ ├── 📁 src/
│ │ └── 📁 main/
│ │ ├── 📁 java/com/hackathon/backend/
│ │ │ ├── 📁 controller/
│ │ │ ├── 📁 dto/
│ │ │ ├── 📁 entity/  
│ │ │ ├── 📁 repository/ 
│ │ │ ├── 📁 security/ 
│ │ │ ├── 📁 service/ # Business logic/
│ │ │ └── 📄 BackendApplication.java 
│ │ └── 📁 resources/
│ │ └── 📄 application.properties 
│ ├── 📁 test/java/com/hackathon/backend/ 
│ ├── 📄 .gitattributes
│ ├── 📄 .gitignore
│ ├── 📄 mvnw
│ ├── 📄 mvnw.cmd
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 Auth/
│   │   │   └── 📁 ui/
│   │   ├── 📁 pages/
│   │   │   ├── Home.js/
│   │   │   ├── Landing.js/
│   │   │   ├── profile.js/
│   │   │   ├── Request.js/
│   │   ├── 📁 services/
│   │   │   └──  api.js/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .env
│   └── index.html
└── README.md
```

---

## 🛠 Technologies Used

### 🔧 Backend
- mySQL
- Spring Boot
- JWT Authentication
- Spring MVC

### 🎨 Frontend & Admin Panel
- React.js
- Tailwind CSS 
- React Router DOM
- Axios
- lucide-react
- react-toastify
- framer-motion

---

## 🚀 Installation

### 🔧 1. Clone the Repository
```bash
git clone https://github.com/techAkki-cmd/odoo-hackathon-project.git
cd odoo-hackathon-project
```
### ⚙️ 2. Backend Setup (inside /server)
```bash
cd backend
npm install
```
Create a .env file and add:
```bash
CLOUDINARY_NAME = ''
CLOUDINARY_API_KEY = ''
CLOUDINARY_SECRET_KEY = '' 
JWT_SECRET = ''

```
Start the backend server:
```bash
./mvnw spring-boot:run
```
### 💻 3. Frontend Setup (inside /client)
```bash
cd ../frontend
npm install
```
Start the frontend:
```bash
npm run start
```

## 📖 Usage Guide

### For Owners
1. **Sign Up / Log In** – Create your account and complete your profile.
2. **List Your Item/Space** – Add details, upload photos, set rental price & duration.
3. **Set Availability** – Choose available dates and time slots.
4. **Approve Requests** – Accept or reject rental requests from renters.
5. **Receive Payment** – Payments are processed securely through integrated gateways.
6. **Handover & Track** – Deliver the product/space at the agreed time and track the rental period.
7. **Collect & Review** – Receive the returned item and leave a rating for the renter.

### For Renters (Buyers)
1. **Sign Up / Log In** – Create your account and complete your profile.
2. **Search Items/Spaces** – Browse by category or use filters to find what you need.
3. **Check Availability** – View pricing, availability calendar, and item details.
4. **Send Rental Request** – Choose rental period and submit your request.
5. **Make Payment** – Pay securely (full amount, partial, or deposit).
6. **Pickup & Use** – Collect the item/space at the agreed time.
7. **Return & Review** – Return on time and leave a rating for the owner.

### Tips for Safe Usage
- Always check item details and ratings before confirming.
- Communicate with the other party through the platform's secure messaging.
- Follow pickup and return timelines to avoid late fees.



---

## 🏠 API Endpoints

These APIs handle user discovery, filtering, and skill search functionality.

## 📌 API Route Structure

| Endpoint                              | Router Module              | Description                       |
|---------------------------------------|----------------------------|------------------------------------|
| `/api/v1/user`                        | `userRouter`               | Handles user authentication, profiles, etc. |
| `/api/v1/product`                     | `productRouter`            | Manages products and their details |
| `/api/v1/category`                    | `categoryRouter`           | Product categories management      |
| `/api/v1/order`                       | `orderRouter`              | Order creation, tracking, updates |
| `/api/v1/quotation`                   | `quotationRouter`          | Generate and manage quotations     |
| `/api/v1/discount`                    | `discountRouter`           | Discount rules and offers          |
| `/api/v1/invoice`                     | `invoiceRouter`            | Invoice generation and tracking    |
| `/api/v1/logistics`                   | `logisticsRouter`          | Shipment and delivery handling     |
| `/api/v1/payment`                     | `paymentRouter`            | Payment processing and records     |
| `/api/v1/notification`                | `notificationRouter`       | Push and email notifications       |
| `/api/v1/priceList`                   | `priceListRouter`          | Price list management              |
| `/api/v1/timeDependentPriceRule`      | `timeDependentPriceRule`   | Time-based pricing rules           |
| `/api/v1/reservation`                 | `reservationRouter`        | Reservation booking management     |


📌 More endpoints available in API documentation.

---

## 🤝 Contributing

We welcome contributions to improve **Renthub**!

### 🧩 How to Contribute

#### 1. Fork the Repository  
   Click the **Fork** button on the top right of this page.

#### 2. Clone Your Fork 
   Open terminal and run:
   ```bash
   git clone https://github.com/techAkki-cmd/odoo-hackathon-project.git
   cd odoo-hackathon-project
   ```

#### 3. Create a feature branch:
   Use a clear naming convention:
   ```bash
   git checkout -b feature/new-feature
   ```
   
#### 4. Make & Commit Your Changes
   Write clean, documented code and commit:
   ```bash
   git add .
   git commit -m "✨ Added: your change description"
   ```
   
#### 5. Push to GitHub & Submit PR
   ```bash
   git push origin feature/your-feature-name
   ```
#### 6. Then go to your forked repo on GitHub and open a Pull Request.

---

## 🔗Video  Link
https://drive.google.com/file/d/1yOXyAwp6q-5nDOk7gNYZm3ZifQUnAwLT/view?usp=drive_link
## ⭐ Motivation

> 💡**PS:** If you found this project helpful or inspiring, please **[⭐ star the repository](https://github.com/techAkki-cmd/odoo-hackathon-project)** — it keeps me motivated to build and share more awesome projects like this one!
---
