# 📅 Planora - Comprehensive Event Management System

Planora is a secure and robust full-stack web platform designed to streamline event creation, management, and participation. Built with a modern tech stack, it provides a seamless experience for both organizers and attendees.

## 🚀 Live Demo
You can explore the live application here: **[Planora Live](https://planora-azure.vercel.app)**
## ✨ Key Features

### 🔐 Authentication & Roles
- **Secure Auth:** JWT-based authentication for user sessions.
- **Role-Based Access:** Dedicated permissions for **Admins** and **Users**.
- **Profile Management:** Personalized user profiles with bios and activity history.

### 🎫 Event Management
- **Public & Private Events:** Create events with different visibility types.
- **Flexible Pricing:** Support for both **Free** and **Paid** events.
- **Organizer Tools:** Organizers can approve/reject join requests, ban participants, and manage event details.
- **Event Categorization:** Filter events by categories like Public-Free, Private-Paid, etc.

### 💳 Participation & Payments
- **Join Workflow:** Instant join for free events and request-based join for private/paid events.
- **Payment Integration:** Secure transactions via **SSLCommerz/Stripe**.
- **Ticketing:** Unique ticket numbers generated upon successful participation.

### 💬 Social & Interaction
- **Invitations:** Host-to-user invitation system with acceptance/payment workflow.
- **Reviews & Ratings:** User feedback system with average rating calculations.
- **Notifications:** Real-time system alerts and unread message tracking.

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, shadcn/ui.
- **Backend:** Node.js, Express.js.
- **Language:** TypeScript (Strictly Typed).
- **ORM:** Prisma.
- **Database:** PostgreSQL.
- **State Management:** TanStack Query (React Query) / Context API.

## 📁 Database Schema (Prisma)
The project uses a relational PostgreSQL database with the following core models:
- `User` & `Profile`: Managing identities and details.
- `Event` & `EventImage`: Handling event data and multi-image uploads.
- `Participation` & `Payment`: Tracking registrations and financial transactions.
- `Invitation`: For private event guest lists.
- `Review` & `Notification`: For user engagement and updates.

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/muhiburmahin/Planora_frontend.git](https://github.com/muhiburmahin/Planora_frontend.git)
