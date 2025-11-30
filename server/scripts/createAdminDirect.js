const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.DATABASE_URL || "mongodb+srv://georgegoodlook_db_user:8hoPDo8kf1zP53F0@blue.jc2ki4r.mongodb.net/bluestockfx?retryWrites=true&w=majority&appName=blue";
const client = new MongoClient(uri);

async function createAdminDirect() {
  try {
    await client.connect();
    const db = client.db('bluestockfx');
    const users = db.collection('User');
    const email = 'novalcapital@example.com';
    const password = 'Valcap123';
    const fullName = 'Noval Capital';
    const role = 'admin';
    const hashedPassword = await bcrypt.hash(password, 10);
    await users.insertOne({
      email,
      password: hashedPassword,
      fullName,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Admin user created directly in MongoDB.');
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    await client.close();
  }
}

createAdminDirect();
