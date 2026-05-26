import { NextResponse } from "next/server";
import { cartsController } from "../controllers/cartsController"; // แก้ไข path ให้ตรงตามโปรเจกต์ของคุณนะคร้าบ

// 🔍 เช็คไฟล์ src/app/api/carts/route.ts
export async function POST(req: Request) {
    try {
        // ดึงข้อมูลที่หน้าบ้านส่งมา
        const { userId, productId, name, quantity, price } = await req.json();

        // 🚨 จุดเสี่ยง: ลอง console.log ดูตรงนี้ครับว่าค่าส่งมาครบไหม
        console.log("Backend received:", { userId, productId, name, quantity, price });

        if (!userId) {
            return NextResponse.json({ success: false, error: "กรุณาเข้าสู่ระบบก่อนทำรายการ" }, { status: 401 });
        }

        // ส่งต่อให้ Controller
        const cart = await cartsController.addItem(userId, productId, name, quantity, price);

        return NextResponse.json({ success: true, cart });
    } catch (error: any) {
        // 💡 ถ้ามันพังตรงนี้ มันจะส่ง Error Message กลับไปเป็นสีส้ม/สีแดงในหน้าบ้าน
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}