Create a professional system flowchart diagram for a “Restaurant Loyalty Scratch Card System”.

The flowchart should clearly separate:

1. Customer Flow  
2. Admin Flow  
3. System Backend Logic  
4. Database interactions

Use modern SaaS architecture style with:

* Rounded rectangles for processes  
* Diamonds for decision points  
* Cylinders for database  
* Arrows showing directional flow  
* Clean white background  
* Minimal professional color palette (Blue for customer, Orange for admin, Green for system/database)

---

## **🧑‍🍳 CUSTOMER FLOW SECTION (Left Side)**

Start Node:  
“Customer Visits Restaurant”

Arrow →

Process:  
“Customer Enters Name \+ Mobile Number”

Arrow →

Decision (Diamond):  
“Is Customer Already Registered?”

If NO →  
Process: “Create New Customer Record in Database”

If YES →  
Process: “Fetch Existing Customer Data”

Both arrows merge →

Decision:  
“Has Customer Scratched Today?”

If YES →  
Process: “Show Message: Already Claimed Today”  
End Flow

If NO →  
Process: “Generate Scratch Card”

Arrow →

Process: “Assign Offer Based on Probability Logic”

Arrow →

Process: “Generate Unique Offer Code”

Arrow →

Process: “Store Scratch Record in Database”

Arrow →

Process: “Display Scratch Animation to Customer”

Arrow →

Process: “Reveal Offer \+ Unique Code”

Arrow →

Process: “Send SMS Confirmation”

End Customer Flow

---

## **⚙️ SYSTEM BACKEND LOGIC (Center Section)**

Include:

Process: “Validate Phone Number Format”  
Process: “Check Daily Claim Limit”  
Process: “Weighted Random Offer Selection”  
Process: “Generate Encrypted Unique Code”  
Process: “Store in Scratch\_Cards Table”  
Process: “Update Visit Count”

Connect these to database cylinder labeled:  
“Customer Database”  
“Offers Database”  
“Scratch Cards Database”

---

## **🧑‍💼 ADMIN FLOW SECTION (Right Side)**

Start Node:  
“Admin Login”

Arrow →

Decision:  
“Valid Credentials?”

If NO → “Access Denied”  
If YES →

Dashboard →

Split into multiple branches:

1. “View Customer List”  
2. “Create / Edit Offers”  
3. “Set Offer Probability %”  
4. “Enable / Disable Offers”  
5. “Redeem Offer Code”  
6. “View Analytics Dashboard”  
7. “Send Bulk SMS Campaign”

For Redemption:

Process: “Enter or Scan Unique Code”  
Decision: “Is Code Valid & Not Expired?”  
If YES → “Mark as Redeemed”  
If NO → “Invalid / Expired Message”

---

## **📊 ANALYTICS SECTION**

Include:

Process:

* Calculate Redemption Rate  
* Total Customers  
* Total Scratch Cards Generated  
* Most Popular Offer  
* Daily Visit Trends

---

## **🎨 DESIGN STYLE REQUIREMENTS**

* Layout: Horizontal flow  
* Customer Flow on left  
* Backend in center  
* Admin Flow on right  
* Database icons below backend  
* Use color-coded swimlanes:  
  * Blue: Customer  
  * Green: System  
  * Orange: Admin  
* Modern SaaS architecture style  
* Clean typography  
* Professional tech diagram look

---

## **🏷️ Add Title:**

“Restaurant Loyalty Scratch Card System – Functional Flow Architecture”

Subtitle:  
“Customer Engagement \+ Offer Management \+ Redemption Tracking”

---

If you want, I can also:

* 🔥 Create a **technical architecture flow (microservices style)**  
* 📊 Create a **database ER diagram prompt**  
* 📱 Create a **UI screen flow prompt**  
* 💼 Or generate a client presentation-ready system explanation\*\*

Tell me which one you want next 🚀

make an md doc for both user and admin with proper development guide

Here is a **complete Markdown (MD) documentation** for your Loyalty Scratch Card System.  
You can directly use this in Notion, GitHub, ClickUp, or share with developers.

---

# **🍽️ Restaurant Loyalty Scratch Card System**

## **Product & Development Guide**

---

# **📌 1\. System Overview**

The **Restaurant Loyalty Scratch Card System** is a digital engagement platform where:

* Customers enter **Name \+ Mobile Number**  
* They receive a **Digital Scratch Card**  
* The scratch reveals a **Unique Offer Code**  
* Admin can manage offers, customers, redemptions, and analytics

---

# **🎯 2\. System Architecture Overview**

`Customer Interface (Tablet / QR Web App)`  
        `↓`  
`Frontend Application (React / Next.js)`  
        `↓`  
`Backend API (.NET Core / Node.js)`  
        `↓`  
`Database (PostgreSQL / MySQL)`  
        `↓`  
`SMS Gateway (Twilio / Indian SMS Provider)`

---

# **👤 3\. USER (CUSTOMER) MODULE – Development Guide**

---

## **🧑‍🍳 3.1 Customer Flow**

1. Customer visits restaurant  
2. Enters Name \+ Phone Number  
3. System validates mobile number  
4. Checks if customer already exists  
5. Checks daily scratch eligibility  
6. Generates scratch card  
7. Assigns offer  
8. Generates unique code  
9. Shows scratch animation  
10. Sends SMS confirmation

---

## **🗄 3.2 Database Structure (Customer Side)**

### **Table: Customers**

| Field | Type | Description |
| ----- | ----- | ----- |
| id | UUID | Primary key |
| name | varchar | Customer name |
| phone | varchar | Unique mobile |
| visit\_count | int | Total visits |
| created\_at | timestamp | Registration date |

---

### **Table: Scratch\_Cards**

| Field | Type | Description |
| ----- | ----- | ----- |
| id | UUID | Primary key |
| customer\_id | FK | Linked to customer |
| offer\_id | FK | Linked to offer |
| unique\_code | varchar | Generated code |
| is\_redeemed | boolean | Redemption status |
| generated\_at | timestamp | Creation date |
| redeemed\_at | timestamp | Redemption date |

---

## **🔄 3.3 Backend Logic – Customer Side**

### **Step 1: Validate Input**

* Check phone format  
* Prevent duplicate submissions

### **Step 2: Check Eligibility**

* 1 scratch per day per phone  
* Query Scratch\_Cards where date \= today

### **Step 3: Offer Selection Logic**

Use weighted probability:

`Select offer`  
`ORDER BY RANDOM()`  
`USING probability_weight`  
`LIMIT 1`

Example:

* 50% → 5% OFF  
* 30% → 10% OFF  
* 15% → Free Dessert  
* 5% → 30% OFF

---

### **Step 4: Generate Unique Code**

Format example:

`RESTO-2026-ABX92`

Code structure:

* Prefix  
* Year  
* Random alphanumeric  
* Must be unique (check DB before insert)

---

### **Step 5: Scratch Animation UI**

Options:

* HTML Canvas scratch effect  
* JS scratch plugin  
* Flutter scratch widget (if app)

After scratch:

* Display offer title  
* Show unique code  
* Show expiry

---

### **Step 6: SMS Integration**

Send SMS:

`Hi Rahul 🎉`  
`You won 10% OFF!`  
`Code: RESTO-XYS89`  
`Valid till 20 Feb.`

---

# **🧑‍💼 4\. ADMIN MODULE – Development Guide**

---

## **🔐 4.1 Admin Authentication**

### **Table: Admin\_Users**

| Field | Type |
| ----- | ----- |
| id | UUID |
| email | varchar |
| password\_hash | varchar |
| role | enum (superadmin, manager) |

Use:

* JWT Authentication  
* Role-based access control

---

## **📊 4.2 Admin Dashboard Features**

---

## **🧍 1\. Customer Management**

Features:

* View all customers  
* Search by phone  
* View visit history  
* View redemption history

API Endpoints:

`GET /customers`  
`GET /customers/{id}`

---

## **🎁 2\. Offer Management**

### **Table: Offers**

| Field | Type |
| ----- | ----- |
| id | UUID |
| title | varchar |
| description | text |
| discount\_type | enum |
| value | decimal |
| expiry\_date | date |
| probability\_weight | int |
| active\_status | boolean |

Admin can:

* Create offer  
* Edit offer  
* Set probability %  
* Activate/Deactivate  
* Set expiry

API:

`POST /offers`  
`PUT /offers/{id}`  
`DELETE /offers/{id}`

---

## **🎟 3\. Redemption System**

Flow:

1. Admin enters code OR scans QR  
2. System validates:  
   * Exists?  
   * Not expired?  
   * Not already redeemed?  
3. If valid → mark as redeemed

API:

`POST /redeem`

Logic:

`if is_redeemed = false AND expiry_date > today`  
    `mark redeemed`  
`else`  
    `show error`

---

## **📈 4\. Analytics Module**

Display:

* Total Customers  
* Total Scratch Cards Generated  
* Redemption Rate  
* Most Popular Offer  
* Daily / Monthly Visits Graph

Recommended:

* Chart.js / Recharts

Metrics:

`Redemption Rate = Redeemed / Generated * 100`

---

## **📢 5\. Marketing Campaign Module**

Admin can:

* Filter inactive customers  
* Filter frequent customers  
* Send bulk SMS

Optional:

* Birthday campaign  
* Festival campaign

---

# **🔐 5\. Security Guidelines**

* OTP verification (recommended)  
* Daily scratch limit  
* Rate limiting API  
* Encrypt unique codes  
* Password hashing (bcrypt)  
* Input validation  
* SQL injection prevention

---

# **📌 9\. Recommended Tech Stack**

| Layer | Tech |
| ----- | ----- |
| Frontend | React  |
| CSS | Tailwind  |
|  |  |
|  |  |
|  |  |

---

# **🎯 Business Outcome**

* Collect customer database  
* Increase repeat visits  
* Increase order value  
* Build direct marketing channel  
* Track measurable ROI

---

