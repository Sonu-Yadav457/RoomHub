import mongoose from 'mongoose';
import dotenv from 'dotenv';
import College from '../models/college.model.js';
import Department from '../models/Department.model.js';
import Room from '../models/Room.model.js';

// Load environmental variables since this script runs independently
dotenv.config();

const seedDatabase = async () => {
  try {
    // 1. Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔄 Connected to MongoDB Atlas for seeding...');

    // 2. Clear out existing sample data to prevent duplicate clutter
    await College.deleteMany();
    await Department.deleteMany();
    await Room.deleteMany();
    console.log('🗑️ Clear-out complete: Old collections purged.');

    // 3. Insert Colleges
    const dtu = await College.create({ name: 'Delhi Technological University', shortCode: 'DTU' });
    const nsut = await College.create({ name: 'Netaji Subhas University of Technology', shortCode: 'NSUT' });
    console.log('🏫 Added Colleges: DTU and NSUT initialized.');

    // 4. Insert Departments for DTU
    const dtuCse = await Department.create({ collegeId: dtu._id, name: 'Computer Science & Engineering', shortCode: 'CSE' });
    const dtuEce = await Department.create({ collegeId: dtu._id, name: 'Electronics & Communication', shortCode: 'ECE' });

    // 5. Insert Departments for NSUT
    const nsutCse = await Department.create({ collegeId: nsut._id, name: 'Computer Science & Engineering', shortCode: 'CSE' });
    const nsutMac = await Department.create({ collegeId: nsut._id, name: 'Mathematics & Computing', shortCode: 'MAC' });
    console.log('📂 Added Departments for DTU and NSUT.');

    // 6. Insert Rooms for DTU CSE with built-in timetables
    await Room.create([
      { 
        departmentId: dtuCse._id, 
        roomNumber: 'SPS-01',
        timetable: [
          { day: 'Monday', startTime: '09:00', endTime: '11:00', subject: 'CO202 - Data Structures Lab' },
          { day: 'Friday', startTime: '14:00', endTime: '16:00', subject: 'CO204 - Operating Systems' },
          { day: 'Saturday', startTime: '08:00', endTime: '23:59', subject: 'B.Tech Weekend Coding Bootcamp' } // Active right now!
        ]
      },
      { 
        departmentId: dtuCse._id, 
        roomNumber: 'SPS-02',
        timetable: [
          { day: 'Monday', startTime: '11:00', endTime: '12:00', subject: 'CO206 - Discrete Mathematics' },
          { day: 'Wednesday', startTime: '10:00', endTime: '11:00', subject: 'HU202 - Engineering Economics' }
        ]
      }
    ]);

    // 7. Insert Rooms for NSUT CSE
    await Room.create([
      { 
        departmentId: nsutCse._id, 
        roomNumber: 'APJ-TS-101',
        timetable: [
          { day: 'Tuesday', startTime: '10:00', endTime: '12:00', subject: 'CSPC01 - Algorithms' },
          { day: 'Saturday', startTime: '11:00', endTime: '13:00', subject: 'AI/ML Research Group Meeting' } // Active right now!
        ]
      },
      { 
        departmentId: nsutCse._id, 
        roomNumber: 'APJ-TS-102',
        timetable: [
          { day: 'Thursday', startTime: '09:00', endTime: '11:00', subject: 'CSPC03 - Digital Logic Design' }
        ]
      }
    ]);

    console.log('🟢 Successfully injected automated Timetable Classrooms!');
    console.log('✨ Seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding Failed Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();