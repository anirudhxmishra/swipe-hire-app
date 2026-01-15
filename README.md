# SwipeHire – Smart Job Matcher

**SwipeHire** is a modern, mobile-first job discovery platform that revolutionizes job hunting with a Tinder-like swiping interface. Users can swipe through curated job cards, match with opportunities intelligently, and apply seamlessly with AI-powered suggestions. Built with a sleek design, smooth animations, and smart features, SwipeHire makes the job search process effortless and engaging.

<img width="1804" height="1012" alt="image" src="https://github.com/user-attachments/assets/655d1079-df57-4e0a-b068-c932cdb66517" />
<img width="1148" height="912" alt="image" src="https://github.com/user-attachments/assets/f69c0866-d76d-42a2-adbe-27d9c5fdc5db" />

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/anirudhmishra/swipehire)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
  - [Prerequisites](#prerequisites)
  - [Clone Repository](#clone-repository)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Overview

SwipeHire transforms the traditional job search experience into an engaging, mobile-friendly interface. Just like dating apps revolutionized online dating, SwipeHire brings the same intuitive swiping mechanism to job discovery.

**Key Highlights:**
- Swipe through curated job cards with smooth, mobile-optimized animations
- AI-powered job matching based on user preferences and profile
- Save favorite jobs for later review
- Filter jobs by location, type, skills, and more
- Dark mode support for comfortable browsing
- Google OAuth authentication for seamless sign-in
- Profile management with personalized job recommendations

---

## Features

### Core Features
- **Swipe-Based Job Discovery** - Swipe right to save jobs, left to skip them
- **AI-Powered Matching** - Intelligent job suggestions based on your profile and preferences
- **Smart Filters** - Filter jobs by location, job type, experience level, and skills
- **Save & Review** - Save interesting jobs and review them later in your saved jobs section
- **Application Tracking** - Track all your job applications in one place
- **Resume Upload & Parsing** - Upload your resume for better job matching

### User Experience
- **Mobile-First Design** - Optimized for mobile devices with responsive layouts
- **Smooth Animations** - Powered by Framer Motion for delightful interactions
- **Dark Mode** - Toggle between light and dark themes
- **Google OAuth** - Quick and secure authentication
- **Profile Management** - Manage your profile, preferences, and settings
- **Export & Share** - Export and share job applications directly

### Premium Features
- Advanced analytics dashboard
- Priority job recommendations
- Direct messaging with recruiters
- Resume building tools

---

## Tech Stack

### Frontend
- **Framework:** React 18.3.1 with TypeScript
- **Build Tool:** Vite 5.4.19
- **Styling:** TailwindCSS 3.4.17
- **UI Components:** Radix UI (Comprehensive component library)
- **Animations:** Framer Motion 12.23.24
- **Form Handling:** React Hook Form + Zod validation
- **State Management:** TanStack React Query
- **Routing:** React Router DOM 6.30.1
- **Authentication:** Google OAuth (@react-oauth/google)
- **Charts:** Recharts 2.15.4
- **Icons:** Lucide React

### Backend
- **Framework:** Spring Boot 3.5.7
- **Language:** Java 17
- **Database:** MySQL
- **ORM:** Spring Data JPA (Hibernate)
- **Security:** Spring Security
- **Build Tool:** Maven

### Additional Libraries
- **Carousel:** Embla Carousel React
- **Date Handling:** date-fns
- **Toast Notifications:** Sonner
- **Command Palette:** cmdk
- **Theme Management:** next-themes

---

## Project Structure

```
swipe-hire-app/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/        # Java source files
│   │   │   └── resources/   # Application properties
│   │   └── test/            # Test files
│   ├── uploads/             # Uploaded files (resumes, etc.)
│   ├── pom.xml              # Maven dependencies
│   └── mvnw                 # Maven wrapper
│
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript type definitions
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── public/              # Static assets
│   ├── package.json         # npm dependencies
│   ├── vite.config.ts       # Vite configuration
│   ├── tailwind.config.ts   # TailwindCSS configuration
│   └── tsconfig.json        # TypeScript configuration
│
└── README.md                # This file
```

---

## Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Java JDK 17** - [Download](https://www.oracle.com/java/technologies/downloads/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- **Maven** (optional, project includes Maven wrapper) - [Download](https://maven.apache.org/download.cgi)
- **Git** - [Download](https://git-scm.com/downloads)

### Clone Repository

```bash
git clone https://github.com/anirudhmishra/swipehire.git
cd swipehire
```

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create MySQL Database:**
   ```sql
   CREATE DATABASE jobAIagentic;
   ```

3. **Configure Database Connection:**
   
   Edit `src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/jobAIagentic
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   spring.jpa.hibernate.ddl-auto=update
   server.port=8096
   ```

4. **Install Dependencies & Run:**
   
   Using Maven wrapper (recommended):
   ```bash
   # Windows
   mvnw.cmd clean install
   mvnw.cmd spring-boot:run

   # Linux/Mac
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

   Or using Maven:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

5. **Verify Backend:**
   
   The backend should now be running at `http://localhost:8096`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   
   Create a `.env` file in the `frontend` directory (see [Environment Variables](#environment-variables) section below)

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

5. **Verify Frontend:**
   
   The frontend should now be running at `http://localhost:5173` (or the port shown in terminal)

---

## Environment Variables

### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id

# Backend API URL (optional, defaults to http://localhost:8096)
VITE_API_BASE_URL=http://localhost:8096
```

**How to get Google OAuth Client ID:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins: `http://localhost:5173`
6. Add authorized redirect URIs: `http://localhost:5173`
7. Copy the Client ID and paste it in the `.env` file

### Backend (application.properties)

The `backend/src/main/resources/application.properties` file should contain:

```properties
spring.application.name=jobAI

# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/jobAIagentic
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update

# Server Port
server.port=8096

# File Upload Configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Stripe API Key (for premium features - optional)
stripe.api.key=your_stripe_secret_key

# Lombok Configuration
lombok.copyableAnnotations += org.springframework.beans.factory.annotation.Value
```

---

## Running the Application

### Development Mode

1. **Start Backend:**
   ```bash
   cd backend
   ./mvnw spring-boot:run   # Linux/Mac
   # OR
   mvnw.cmd spring-boot:run  # Windows
   ```

2. **Start Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access Application:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8096`

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

**Backend:**
```bash
cd backend
./mvnw clean package
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

---

## Screenshots

> Add screenshots or GIFs of your application here to showcase the UI and features.

### Example Screenshots:
- Home page with swipe interface
- Job details page
- Saved jobs section
- Profile management
- Dark mode
- Mobile responsive views

---

## Future Improvements

### Planned Features
- [ ] AI-powered resume builder
- [ ] Direct messaging with recruiters
- [ ] Video interview scheduling
- [ ] Salary insights and negotiation tips
- [ ] Company reviews and ratings
- [ ] Job market analytics
- [ ] Mobile app (iOS & Android)
- [ ] LinkedIn integration
- [ ] Advanced search filters
- [ ] Email notifications for new matches

### Technical Improvements
- [ ] Add comprehensive unit and integration tests
- [ ] Implement CI/CD pipeline
- [ ] Add Docker support for easy deployment
- [ ] Implement Redis caching for better performance
- [ ] Add WebSocket support for real-time notifications
- [ ] Implement rate limiting and API throttling
- [ ] Add comprehensive API documentation (Swagger/OpenAPI)
- [ ] Implement progressive web app (PWA) features

---

## Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes and commit:**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Ensure your code follows the project's coding standards
- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Be respectful and constructive in discussions

### Reporting Issues

If you find a bug or have a feature request:
1. Check if the issue already exists
2. Create a new issue with a clear title and description
3. Include steps to reproduce (for bugs)
4. Add relevant labels

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Author

**Anirudh Mishra**

- GitHub: [@anirudhxmishra](https://github.com/anirudhxmishra)
- Website: [swipehire.com](https://swipehire.com)(comming soon)

---

## Acknowledgments

- Thanks to all contributors who have helped shape SwipeHire
- Inspired by modern job search platforms and dating app UX
- Built with amazing open-source libraries and frameworks

---

**Made with ❤️ for job seekers everywhere**

If you found this project helpful, please consider giving it a ⭐ on GitHub!
