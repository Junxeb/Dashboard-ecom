import { NextResponse } from "next/server";
import { signUpUser, signInUser } from "../controllers/userController";
import fs from "fs";
import path from "path";
import UserModel from "../models/User";

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

// ✅ ใช้ POST สำหรับ signup, signin, getUser, updateProfile (แบบ action)
export async function POST(req: Request) {
  const { action, name, email, password, userId, address, phone } = await req.json();

  if (action === "signup") {
    const result = await signUpUser(name, email, password);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ user: result.user });
  }

  if (action === "signin") {
    const result = await signInUser(email, password);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    return NextResponse.json({ message: result.message, user: result.user });
  }

  if (action === "getUser") {
    const data = readData();
    const user = data.customer.find((u) => u.userId === userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  }

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

// ✅ ใช้ PATCH สำหรับแก้ไขข้อมูลผู้ใช้แบบ RESTful
export async function PATCH(req: Request) {
  const { userId, name, email, address, phone } = await req.json();

  const data = readData();
  const userIndex = data.customer.findIndex((u) => u.userId === userId);

  if (userIndex === -1) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // อัปเดตเฉพาะ field ที่ส่งมา
  if (name) data.customer[userIndex].name = name;
  if (email) data.customer[userIndex].email = email;
  if (address) data.customer[userIndex].address = address;
  if (phone) data.customer[userIndex].phone = phone;

  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

  return NextResponse.json({ success: true, user: data.customer[userIndex] });
}


export async function DELETE(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing User ID" }, { status: 400 });
    }

    // 📡 สั่งลบผ่าน Model ตัวใหม่ที่เราเพิ่งเพิ่มไปในไฟล์ที่ 1
    const isDeleted = UserModel.delete(userId);

    if (!isDeleted) {
      return NextResponse.json({ error: "User not found or cannot delete" }, { status: 404 });
    }

    // 🎉 ตอบกลับหน้าบ้านเมื่อลบสำเร็จ
    return NextResponse.json({ success: true, message: "Account deleted successfully" });
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

