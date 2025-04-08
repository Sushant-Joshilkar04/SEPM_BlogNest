
# BlogNest – Where Ideas Take Flight

**BlogNest** is a full-stack blogging platform designed to enable users to seamlessly create, manage, and share content. It includes powerful community features and an admin dashboard for content moderation and analytics. The platform integrates AI assistance using **GROQ** for smart blog generation.

---

## 🔧 Core Features

### 📝 Blog Management (CRUD)
- Authenticated users can perform full **CRUD operations** on their blog posts.
- Integrated **GROQ-based AI** assistant enables users to auto-generate blog content based on prompts or topics.
- Rich-text editor for structured and formatted content creation.

### 👥 Community Module
- Users can **explore and join communities** based on interests.
- Users can post blogs directly within communities.
- Facilitates content discovery, collaboration, and engagement among users with shared interests.

### 🛡️ Admin Dashboard
- **Real-time analytics**:
    - Track trends in blog creation and community activity.
- **User Management**:
    - View and manage registered users.
- **Post Moderation**:
    - Posts receiving **more than 10 reports** are flagged for admin review.
    - Admin can **verify, delete**, or **restore** flagged posts.
    - Approved posts are republished to the public dashboard.

---

## 🧠 AI Integration

- Utilizes **GROQ** to generate blog content using AI.
- Content is generated dynamically based on user-provided context or keywords.
- Ensures enhanced user productivity and content consistency.

---

## 🛠 Tech Stack

| Layer        | Technology                  |
|--------------|------------------------------|
| Frontend     | React.js / EJS (templating), Tailwind CSS |
| Backend      | Node.js, Express.js           |
| Database     | MongoDB (Mongoose ORM)        |
| Authentication | JWT (JSON Web Tokens)       |
| AI Services  | GROQ API (AI Content Gen)     |
| Admin Panel  | Custom-built dashboard with analytics & moderation tools |

---

## 🛆 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Sushant-Joshilkar04/SEPM_BlogNest.git
cd blognest
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and provide the following variables:

```
PORT=5000
MONGODB_URI=<your-mongo-uri>
JWT_SECRET=<your-jwt-secret>
GROQ_API_KEY=<your-groq-api-key>
```

### 4. Start the Development Server
```bash
npm run dev
```

---

## 📊 Admin Workflow

- **Flagged Post Handling**:  
    Any blog or community post with `> 10 reports` is pushed to the admin queue.

- **Moderation Actions**:
    - `Accept`: Removes reports and republishes the post.
    - `Delete`: Permanently removes the post from the platform.

---

## 📈 Analytics (Admin Panel)
- Blog creation trends (daily/weekly/monthly)
- Community post trends
- Active users statistics

---

## 📁 Folder Structure (Example)

```
blognest/
├── frontend/                # Frontend source
├── backend/                 # Backend source (Node.js, Express)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
├── utils/
├── .env
├── package.json
└── README.md
```

---

## 🚀 Future Enhancements

- Role-based access controls (RBAC)
- Blog likes/comments
- Bookmarking & personalized feed
- Email/notification system
- Real-time activity tracking

---

