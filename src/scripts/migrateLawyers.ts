// scripts/migrateLawyers.ts
// Run this ONCE to migrate hardcoded lawyers to Firestore

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc } from 'firebase/firestore';

// Your Firebase config (copy from src/lib/firebase.ts)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "legalai-b0ce1.firebaseapp.com",
  projectId: "legalai-b0ce1",
  storageBucket: "legalai-b0ce1.firebasestorage.app",
  messagingSenderId: "522768714538",
  appId: "1:522768714538:web:b9ecf327e3db65d67d6c53"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Lawyer data to migrate
const lawyers = [
  {
    name: 'Adv. Priya Sharma',
    barNumber: 'D/1234/2012',
    yearsOfPractice: 12,
    location: 'Mumbai, Maharashtra',
    city: 'Mumbai',
    state: 'Maharashtra',
    practiceAreas: ['Criminal Defense', 'Bail Applications', 'Trial Advocacy'],
    courts: ['Bombay High Court', 'Sessions Court, Mumbai'],
    languages: ['English', 'Hindi', 'Marathi'],
    consultationFee: '₹2,000 - ₹5,000',
    feeMin: 2000,
    feeMax: 5000,
    availability: 'Available within 48 hours',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
    verified: true,
    active: true,
    email: 'priya.sharma@lawfirm.com',
    phone: '+91 98765 43210',
    rating: 4.8,
    totalCases: 250,
    successRate: 92,
    bio: 'Specializing in criminal defense with over 12 years of experience in Mumbai courts.',
    education: 'LLB from Government Law College, Mumbai',
    barCouncil: 'Bar Council of Maharashtra',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Adv. Rajesh Kumar',
    barNumber: 'DL/5678/2008',
    yearsOfPractice: 16,
    location: 'New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    practiceAreas: ['White Collar Crime', 'Economic Offences', 'Corporate Fraud'],
    courts: ['Delhi High Court', 'Patiala House Courts'],
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationFee: '₹3,000 - ₹8,000',
    feeMin: 3000,
    feeMax: 8000,
    availability: 'Next available: 3 days',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    verified: true,
    active: true,
    email: 'rajesh.kumar@lawassociates.com',
    phone: '+91 98765 43211',
    rating: 4.9,
    totalCases: 380,
    successRate: 95,
    bio: 'Expert in white collar crime and economic offences with 16 years of practice.',
    education: 'LLB from Delhi University, LLM from Cambridge',
    barCouncil: 'Bar Council of Delhi',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Adv. Meera Patel',
    barNumber: 'KA/9012/2014',
    yearsOfPractice: 10,
    location: 'Bangalore, Karnataka',
    city: 'Bangalore',
    state: 'Karnataka',
    practiceAreas: ['Cyber Crime', 'IT Act Violations', 'Data Privacy'],
    courts: ['Karnataka High Court', 'City Civil Court, Bangalore'],
    languages: ['English', 'Hindi', 'Kannada'],
    consultationFee: '₹1,500 - ₹4,000',
    feeMin: 1500,
    feeMax: 4000,
    availability: 'Available within 24 hours',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
    verified: true,
    active: true,
    email: 'meera.patel@cyberlawfirm.com',
    phone: '+91 98765 43212',
    rating: 4.7,
    totalCases: 180,
    successRate: 89,
    bio: 'Cybercrime specialist focusing on IT Act violations and data privacy cases.',
    education: 'LLB from National Law School, Bangalore',
    barCouncil: 'Bar Council of Karnataka',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'Adv. Arjun Reddy',
    barNumber: 'TN/3456/2010',
    yearsOfPractice: 14,
    location: 'Chennai, Tamil Nadu',
    city: 'Chennai',
    state: 'Tamil Nadu',
    practiceAreas: ['Criminal Appeals', 'POCSO Cases', 'Witness Protection'],
    courts: ['Madras High Court', 'District Courts, Chennai'],
    languages: ['English', 'Hindi', 'Tamil'],
    consultationFee: '₹2,500 - ₹6,000',
    feeMin: 2500,
    feeMax: 6000,
    availability: 'Next available: 2 days',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    verified: true,
    active: true,
    email: 'arjun.reddy@legalservices.com',
    phone: '+91 98765 43213',
    rating: 4.6,
    totalCases: 220,
    successRate: 88,
    bio: 'Specialized in criminal appeals and POCSO cases with focus on victim protection.',
    education: 'LLB from Madras Law College',
    barCouncil: 'Bar Council of Tamil Nadu',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function migrateLawyers() {
  console.log('🚀 Starting migration...');
  
  try {
    // Migrate lawyers
    for (const lawyer of lawyers) {
      const docRef = await addDoc(collection(db, 'lawyers'), lawyer);
      console.log(`✅ Added lawyer: ${lawyer.name} (${docRef.id})`);
    }
    
    console.log('\n✅ Migration complete!');
    console.log(`📊 Total lawyers migrated: ${lawyers.length}`);
  } catch (error) {
    console.error('❌ Migration error:', error);
  }
}

async function setupAdminUser(adminEmail: string) {
  console.log('\n🔐 Setting up admin user...');
  
  try {
    // Add admin user to adminUsers collection
    await setDoc(doc(db, 'adminUsers', adminEmail), {
      email: adminEmail,
      role: 'admin',
      createdAt: new Date().toISOString(),
      permissions: ['manage_lawyers', 'view_consultations', 'view_cases'],
    });
    
    console.log(`✅ Admin user created: ${adminEmail}`);
    console.log('🎉 You can now login with this email as admin!');
  } catch (error) {
    console.error('❌ Admin setup error:', error);
  }
}

// Run migration
(async () => {
  await migrateLawyers();
  
  // Set your email as admin (CHANGE THIS!)
  await setupAdminUser('remoram2004@gmail.com');
  
  process.exit(0);
})();

/* 
HOW TO RUN THIS SCRIPT:

1. Create this file: scripts/migrateLawyers.ts

2. Update firebaseConfig with your credentials

3. Change 'YOUR_EMAIL@example.com' to your actual email

4. Run with ts-node:
   npx ts-node scripts/migrateLawyers.ts

5. Check Firestore Console to verify:
   - lawyers collection (4 documents)
   - adminUsers collection (1 document with your email)

⚠️ IMPORTANT: Only run this ONCE!
*/