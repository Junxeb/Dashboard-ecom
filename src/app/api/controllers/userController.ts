import fs from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'public/data.json');


// กำหนด type ของ customer
export interface Customer {
  name: string;
  email: string;
  password: string;
  userId: string;
  address?: string;
  phone?: string;
}

interface DataFile {
  customer: Customer[];
}

function readData(): DataFile {
  const raw = fs.readFileSync(dataFile, 'utf-8');
  return JSON.parse(raw) as DataFile;
}

function writeData(data: DataFile) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// สมัครสมาชิก
export async function signUpUser(name: string, email: string, password: string) {
  const data = readData();
  const existing = data.customer.find((u: Customer) => u.email === email);
  if (existing) return { error: 'User already exists' };

  const newUser: Customer = {
    name,
    email,
    password,
    userId: 'U' + Date.now().toString()
  };

  data.customer.push(newUser);
  writeData(data);

  return { user: newUser };
}

// เข้าสู่ระบบ
export async function signInUser(email: string, password: string) {
  const data = readData();
  const user = data.customer.find((u: Customer) => u.email === email && u.password === password);
  if (!user) return { error: 'Invalid credentials' };

  return { message: 'Login success', user };
}