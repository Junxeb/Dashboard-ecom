import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface CustomerItem {
  userId: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
}

interface DataFile {
  customer: CustomerItem[];
}

const dataFile = path.join(process.cwd(), "src/app/data.json");

export async function POST(req: Request) {
  const { action, userId, address, phone } = await req.json();

  if (action === "updateProfile") {
    const raw = fs.readFileSync(dataFile, "utf-8");
    const data: DataFile = JSON.parse(raw);

    const userIndex = data.customer.findIndex((u: CustomerItem) => u.userId === userId);
    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ อัปเดตเฉพาะ address และ phone
    data.customer[userIndex].address = address;
    data.customer[userIndex].phone = phone;

    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true, user: data.customer[userIndex] });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
