import { NextResponse } from "next/server";
import { signUpUser, signInUser } from "../controllers/userController";
import fs from "fs";
import path from "path";

interface CustomerItem {
  userId: string;
  name: string;
  email: string;
  password: string;
  address?: string;
  phone?: string;
}

interface DataFile {
  customer: CustomerItem[];
}

const dataFile = path.join(process.cwd(), "public", "data.json");

// ฟังก์ชันอ่านไฟล์แบบปลอดภัย
function readData(): DataFile {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ customer: [] }, null, 2));
  }
  const raw = fs.readFileSync(dataFile, "utf-8");
  return JSON.parse(raw) as DataFile;
}

export async function POST(req: Request) {
  const { action, name, email, password, userId, address, phone } = await req.json();

  // ✅ สมัครสมาชิก
  if (action === "signup") {
    const result = await signUpUser(name, email, password);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ user: result.user });
  }

  // ✅ เข้าสู่ระบบ
  if (action === "signin") {
    const result = await signInUser(email, password);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    return NextResponse.json({ message: result.message, user: result.user });
  }

  // ✅ ดึงข้อมูลผู้ใช้
  if (action === "getUser") {
    const data = readData();
    const user = data.customer.find((u) => u.userId === userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  }

  // ✅ อัปเดตโปรไฟล์
  if (action === "updateProfile") {
    const data = readData();
    const userIndex = data.customer.findIndex((u) => u.userId === userId);
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    data.customer[userIndex].address = address;
    data.customer[userIndex].phone = phone;

    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true, user: data.customer[userIndex] });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
