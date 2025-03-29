# Alliance for Healthier Communities IT Ticketing System

![Alliance Logo](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vBpw3Gd4BCDJiY6oztvM68hJY0moN9.png)

A comprehensive IT support ticketing system designed for Alliance for Healthier Communities, empowering health equity through efficient IT solutions.

**Live Demo:** [https://alliance-ticketing-system.vercel.app/](https://alliance-ticketing-system.vercel.app/)

## 🚀 Features

### For Users
- **Dashboard Overview**: Quick view of all tickets and their statuses
- **Ticket Management**: Create, view, and track IT support tickets
- **File Attachments**: Upload files to provide additional context for tickets
- **AI Chatbot Assistant**: Get instant help for common IT issues
- **Dark/Light Mode**: Choose your preferred theme

### For Administrators
- **Comprehensive Dashboard**: Monitor all tickets and system performance
- **Advanced Analytics**: Track resolution times, ticket volumes, and team performance
- **User Management**: Add, edit, and manage system users
- **Ticket Assignment**: Assign tickets to specific technicians
- **Priority Management**: Set and adjust ticket priorities

## 💻 Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts & Visualization**: Recharts
- **State Management**: React Hooks
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn

## 🔧 Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/alliance-ticketing-system.git
cd alliance-ticketing-system
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Usage

### User Access

- Click "Login as User" on the homepage
- Navigate through the dashboard to view your tickets
- Create new tickets using the "New Ticket" button
- Use the AI chatbot for quick assistance

### Admin Access

- Click "Login as Admin" on the homepage
- Access comprehensive analytics and user management
- Manage tickets and assign them to technicians
- Monitor system performance and user activity

## 📸 Screenshots

### Homepage

![Homepage]([https://placeholder-for-homepage-screenshot.png](https://private-user-images.githubusercontent.com/146143293/428257032-658f8ef4-3504-4c4f-a82a-f37f607b56b6.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDMyMjExMzcsIm5iZiI6MTc0MzIyMDgzNywicGF0aCI6Ii8xNDYxNDMyOTMvNDI4MjU3MDMyLTY1OGY4ZWY0LTM1MDQtNGM0Zi1hODJhLWYzN2Y2MDdiNTZiNi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwMzI5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDMyOVQwNDAwMzdaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1lZDJiZDZkZjY0ODJjOTMzOTQ0ZWJiYTJkNTBiYzNhODE2OWNhZjExODc5ZDNmM2QzNjA4NTRmNDljOTQyNTQ1JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.McsYHebAQmdmBUjXPeZt6DhEt0sHtoejXuiwZXyWoVY))

### User Dashboard

![User Dashboard]()

### Admin Analytics

![Admin Analytics](https://placeholder-for-admin-analytics-screenshot.png)

### Ticket Management

![Ticket Management](https://placeholder-for-ticket-management-screenshot.png)

## 🔄 Data Persistence

This demo uses browser localStorage for data persistence. In a production environment, this would be replaced with a proper database solution.

## 🛠️ Project Structure

```plaintext
alliance-ticketing-system/
├── app/                  # Next.js app directory
│   ├── dashboard/        # Dashboard pages (user and admin)
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/           # Reusable components
│   ├── ui/               # UI components from shadcn
│   ├── ai-chatbot.tsx    # AI assistant component
│   └── dashboard-layout.tsx # Layout for dashboard pages
├── lib/                  # Utility functions
├── public/               # Static assets
├── tailwind.config.js    # Tailwind configuration
└── package.json          # Project dependencies


