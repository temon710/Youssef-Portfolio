# Youssef Elnasry - Personal Portfolio

A bilingual (Arabic/English) personal portfolio website with an admin-only dashboard for managing profile information and projects. Built with React, Express, and PostgreSQL.

## Features

✨ **Bilingual Support**
- Full Arabic (RTL) and English (LTR) interface
- Language toggle in navbar
- Bilingual content for bio, projects, and all UI elements

🎨 **Design**
- Dark/Light mode toggle
- Minimalist aesthetic with custom HSL color system
- Responsive design (mobile, tablet, desktop)
- Smooth animations with Framer Motion

👤 **Admin Dashboard**
- Secure login system (password protected)
- **Profile Tab**: Edit bio (Arabic/English), phone number, and profile image
- **Projects Tab**: Create, edit, delete portfolio projects with images
- **Security Tab**: Change admin password
- Image upload from device gallery or URL

🗄️ **Backend**
- Express.js REST API
- PostgreSQL database with Drizzle ORM
- Secure session management
- Base64 image storage

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form, Zod validation

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/temon710/Youssef-Portfolio.git
cd Youssef-Portfolio
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
DATABASE_URL=your_postgresql_url
```

4. Run database migrations
```bash
npm run db:migrate
```

5. Seed initial data
```bash
npm run seed
```

6. Start the development server
```bash
npm run dev
```

Visit `http://localhost:5000`

## Admin Access

**Default Credentials:**
- Password: `admin123`

Access the dashboard at `/admin`

## Project Structure

```
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── context/          # Global state (AppContext)
│   │   └── index.css         # Global styles
│
├── server/                    # Express backend
│   ├── routes.ts             # API routes
│   ├── storage.ts            # Database operations
│   ├── seed.ts               # Database seeding
│   └── index.ts              # Server configuration
│
├── shared/                    # Shared types & schemas
│   └── schema.ts             # Drizzle ORM schemas
│
└── dist/                      # Built files
```

## API Endpoints

### Authentication
- `POST /api/login` - Admin login

### Admin Data
- `GET /api/admin` - Get admin profile data
- `POST /api/admin` - Update admin profile

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## Features in Detail

### Bilingual System
- All content stored in Arabic and English
- Automatic direction switching (RTL/LTR)
- Language preference stored in context

### Image Management
- Upload from device gallery (FileReader API)
- Base64 encoding for database storage
- Support for large images (50MB limit)
- URL input alternative

### Data Persistence
- All changes saved to PostgreSQL
- Persists across devices
- Database seed with default data

## Deployment

The application is ready to be deployed on any Node.js hosting platform:
- Replit
- Heroku
- Vercel
- Railway
- AWS, Google Cloud, Azure

## License

MIT License - feel free to use this project as a template for your own portfolio!

## Support

For issues or questions, please open an issue on GitHub.

---

**Portfolio**: [Visit Site](https://youssef-portfolio.replit.dev)  
**GitHub**: [temon710/Youssef-Portfolio](https://github.com/temon710/Youssef-Portfolio)

**Created with ❤️ using React & Express**
