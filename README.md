# UniFriend

UniFriend is a social platform designed to connect students across South African universities, TVET colleges, and other educational institutions. The platform aims to foster collaboration, networking, and community building among students.

## Features

- User authentication with multiple registration paths (Students, Alumni, Human)
- Support for universities and TVET colleges across South Africa
- Dark mode interface
- Secure registration with reCAPTCHA protection

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/unifriend.git
cd unifriend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
# Next Auth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-32-character-secret-key-here

# Database
DATABASE_URL="your-postgresql-database-url"

# Google reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LdOdgUrAAAAAMNq6_5ttnbMboLWDpfM9CTtzMtp

# Add any other API keys or secrets here
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Environment Variables

- `NEXTAUTH_URL`: The canonical URL of your website (required for NextAuth.js)
- `NEXTAUTH_SECRET`: A secret key for NextAuth.js (generate one using `openssl rand -base64 32`)
- `DATABASE_URL`: Your PostgreSQL database connection string
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`: Google reCAPTCHA v2 site key

## Development

### Tech Stack

- [Next.js 15](https://nextjs.org/) with App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/) for database ORM
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Radix UI](https://www.radix-ui.com/) for UI components
- [Google reCAPTCHA](https://www.google.com/recaptcha) for form protection

### Project Structure

```
unifriend/
├── app/                    # Next.js app router pages
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
├── public/               # Static files
└── styles/               # Global styles
```

### Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors and maintainers
- Special thanks to the South African student community

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
