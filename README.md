# Sblueenergy Website

A modern, multilingual company website for Sblueenergy with an admin dashboard for managing content.

## Features

- ✅ Multilingual support (English & German)
- ✅ Admin dashboard with JWT authentication
- ✅ Project management (CRUD operations)
- ✅ Editable home and about pages
- ✅ Contact form with email notifications
- ✅ Responsive design
- ✅ MongoDB database integration

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Database**: MongoDB + Prisma ORM
- **Internationalization**: next-i18next
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Email**: Nodemailer

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB instance (local or cloud)
- Gmail account or SMTP credentials for email

### Installation

1. Clone the repository
```bash
git clone https://github.com/fortelh/sblueenergy-website.git
cd sblueenergy-website
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

4. Set up the database
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## Project Structure

```
├── pages/
│   ├── _app.tsx              # App wrapper with i18n config
│   ├── index.tsx             # Home page
│   ├── about.tsx             # About page
│   ├── projects.tsx          # Projects list
│   ├── projects/[id].tsx     # Project details
│   ├── contact.tsx           # Contact page
│   ├── admin/
│   │   ├── login.tsx         # Admin login
│   │   ├── dashboard.tsx     # Admin dashboard
│   │   ├── edit-home.tsx     # Edit home page
│   │   ├── edit-about.tsx    # Edit about page
│   │   ├── projects.tsx      # Manage projects
│   │   └── settings.tsx      # Contact settings
│   └── api/
│       ├── auth/             # NextAuth endpoints
│       ├── projects/         # Project CRUD endpoints
│       ├── pages/            # Home/About endpoints
│       ├── contact/          # Contact form endpoint
│       └── settings/         # Settings endpoints
├── components/
│   ├── Layout.tsx            # Main layout wrapper
│   ├── Navigation.tsx        # Navigation bar
│   ├── LanguageSwitcher.tsx  # Language toggle
│   ├── Footer.tsx            # Footer
│   ├── ProjectCard.tsx       # Project card component
│   └── forms/                # Form components
├── lib/
│   ├── auth.ts              # Authentication utilities
│   ├── email.ts             # Email service
│   ├── db.ts                # Database utilities
│   └── middleware.ts        # API middleware
├── public/
│   ├── locales/             # i18n translation files
│   ├── uploads/             # User uploads
│   └── images/              # Static images
├── prisma/
│   └── schema.prisma        # Database schema
├── styles/
│   └── globals.css          # Global styles
└── .env.local               # Environment variables
```

## Admin Panel

Access the admin panel at `/admin/login`

**Default credentials** (must be changed after first login):
- Username: `admin`
- Password: `admin123`

### Admin Features

- Edit home page content (EN/DE)
- Upload hero image
- Edit about page
- Create, edit, and delete projects
- Set contact form email

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Get current session

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/[id]` - Get project details
- `POST /api/projects` - Create project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Pages
- `GET /api/pages/home` - Get home page content
- `PUT /api/pages/home` - Update home page
- `GET /api/pages/about` - Get about page content
- `PUT /api/pages/about` - Update about page

### Contact
- `POST /api/contact/send` - Send contact message
- `GET /api/settings/contact` - Get contact settings
- `PUT /api/settings/contact` - Update contact settings

## Email Configuration

For Gmail:
1. Enable 2-factor authentication
2. Generate an app password: https://myaccount.google.com/apppasswords
3. Use the app password in `SMTP_PASS`

For other providers, update `SMTP_HOST` and `SMTP_PORT` accordingly.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t sblueenergy-website .
docker run -p 3000:3000 sblueenergy-website
```

## Contributing

Fork the repository and create a feature branch for any changes.

## License

MIT
