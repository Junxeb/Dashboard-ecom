import { NextResponse } from "next/server";
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

const dataFile = path.join(process.cwd(), "src/app/data.json");

export async function POST(req: Request) {
  const { action, email, password, userId, address, phone } = await req.json();

  const raw = fs.readFileSync(dataFile, "utf-8");
  const data: DataFile = JSON.parse(raw);

  if (action === "signin") {
    const user = data.customer.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    return NextResponse.json({ user });
  }

  if (action === "getUser") {
    const user = data.customer.find((u) => u.userId === userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  }

  if (action === "updateProfile") {
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
