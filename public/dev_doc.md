ASG Developer Documentation
This document provides a detailed technical overview of the ASG (Antigravity Scratch & Gift) application, focusing on the API integrations and component architecture for both the Customer and Admin sections.

🏗️ System Overview
ASG is a customer engagement platform featuring a gamified "Scratch and Win" experience. Customers register and scratch cards to win offers, which can then be redeemed at physical outlets using an Admin-managed terminal.

Frontend: React (TSX), Tailwind CSS, Framer Motion (Animations), Lucide React (Icons).
Backend API: .NET REST API (Base URL: VITE_API_URL).
Pattern: Service-based API integration layer.
📱 Customer Section
The Customer section is designed for mobile-first interaction, allowing users to register, scratch daily cards, and manage their won offers.

Core Workflows
Authentication & Registration: Verified via phone number.
Daily Scratch Card: Users can scratch one card per day to reveal randomized offers.
Offer Wallet: A profile view showing history and active coupons.
API Reference (
customerService.ts
)
1. Registration / Login
Endpoint: POST /Customer/Register
Purpose: Creates a new customer or updates existing details.
Used In: 
CustomerPortal.tsx
Request Body:
json
{
  "name": "string",
  "phone": "string",
  "email": "string | null",
  "dob": "ISO Date String | null",
  "gender": "male | female | other | null",
  "foodPreference": "veg | non-veg | null",
  "alcoholPreference": "string | null",
  "spType": "string (Default: 'C')"
}
2. Get Customer Details
Endpoint: GET /Customer/GetCustomers?phone={phone}
Purpose: Checks if a customer exists and retrieves their preliminary data.
Used In: UserLogin.tsx (Verification step)
3. Detailed Profile & History
Endpoint: GET /Customer/GetCustomerProfile/{id}
Purpose: Retrieves full customer profile including visit counts and offer history.
Used In: 
CustomerProfile.tsx
4. Scratch Card Generation
Endpoint: POST /Offer/GenerateScratchCard
Purpose: Triggers the randomization logic to assign an offer to a customer for the day.
Used In: 
ScratchCard.tsx
Request Body: { "customerId": number }
🛠️ Admin Section
The Admin section provides tools for business owners to manage offers, track analytics, and handle in-person redemptions.

1. Dashboard & Analytics
Feature: Real-time metrics on customer engagement and redemption rates.
API: GET /Dashboard/GetMetrics?days={int}
Service: 
dashboardService.ts
Used In: 
Analytics.tsx
 (Dashboard view)
2. Offer Management
Feature: Create, Edit, and Track specific scratch card offers.
APIs (
offerService.ts
):
GET /Offer/GetAll: List all offers.
POST /Offer/ManageOffer: Create or update an offer (Title, weight/probability, image, targeting).
GET /Offer/GetUtilization/{id}: detailed log of who revealed/redeemed a specific offer.
Used In: 
OfferManager.tsx
, 
OfferAnalyticsView.tsx
3. Redemption Terminal
Feature: Validates and marks customer coupons as used.
APIs (
redemptionService.ts
):
GET /Redemption/Validate/{code}: Validates if a code is authentic, active, and belongs to the customer.
POST /Redemption/Redeem: Finalizes the transaction.
Request (Redeem):
json
{
  "code": "string",
  "customerId": number,
  "offerId": number,
  "spType": "Admin"
}
Used In: 
RedemptionTerminal.tsx
4. Customer Management
Feature: Search and view detailed history for any registered customer.
API: GET /Customer/GetCustomers (Lists all)
Used In: CustomerList.tsx
5. Admin User Management
Feature: Manage internal staff access.
APIs (
adminService.ts
):
GET /Admin/GetById?Email={email}: Login/Verification.
POST /Admin/Manage: Create or Update admin profiles.
Used In: 
AdminUserManager.tsx
🔧 Technical Patterns
1. Date Handling
Dates are typically handled as ISO strings for the API but formatted locally using new Date().toLocaleDateString() or custom utilities in dateUtils.ts.

2. Error Handling
The application uses a consistent wrapper for API responses:

json
{
  "success": boolean,
  "message": "string",
  "data": any,
  "statusCode": 200
}
Components usually check the success flag and display toast notifications using react-hot-toast for feedback.

3. Animations
Framer Motion is used extensively for "Premium" feel:

AnimatePresence for smooth layout transitions.
motion.div for hover effects and modal entrances.