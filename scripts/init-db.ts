import prisma from '@/lib/db';
import bcryptjs from 'bcryptjs';

async function initializeDatabase() {
  try {
    // Check if admin exists
    const adminExists = await prisma.admin.findUnique({
      where: { username: 'admin' },
    });

    if (!adminExists) {
      const hashedPassword = bcryptjs.hashSync('admin123', 10);
      await prisma.admin.create({
        data: {
          username: 'admin',
          password: hashedPassword,
          email: 'admin@sblueenergy.com',
        },
      });
      console.log('Default admin user created');
    }

    // Initialize home page
    const homePageExists = await prisma.homePage.findFirst();
    if (!homePageExists) {
      await prisma.homePage.create({
        data: {
          introductionEN:
            'Welcome to Sblueenergy - Leading the future of renewable energy',
          introductionDE:
            'Willkommen bei Sblueenergy - Die Zukunft der erneuerbaren Energien führen',
          heroImage: '/images/hero-default.jpg',
        },
      });
      console.log('Home page initialized');
    }

    // Initialize about page
    const aboutPageExists = await prisma.aboutPage.findFirst();
    if (!aboutPageExists) {
      await prisma.aboutPage.create({
        data: {
          descriptionEN:
            'Sblueenergy is committed to providing sustainable energy solutions.',
          descriptionDE:
            'Sblueenergy ist dem Angebot nachhaltiger Energielösungen verpflichtet.',
        },
      });
      console.log('About page initialized');
    }

    // Initialize contact settings
    const contactSettingsExists = await prisma.contactSettings.findFirst();
    if (!contactSettingsExists) {
      await prisma.contactSettings.create({
        data: {
          email: process.env.CONTACT_EMAIL || 'info@sblueenergy.com',
        },
      });
      console.log('Contact settings initialized');
    }

    console.log('Database initialization complete');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initializeDatabase();
