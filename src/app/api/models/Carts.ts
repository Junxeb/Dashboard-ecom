import fs from "fs";
import path from "path";

// 1. กำหนดตำแหน่งที่อยู่ของไฟล์ data.json (อยู่ที่ Root ของโปรเจกต์)
const filePath = path.join(__dirname, "../../../data.json");

// 2. กำหนด Type กำกับโครงสร้างข้อมูลของตะกร้าสินค้า
export type CartItem = {
    productId: string;
    name: string;
    quantity: number;
    price: number;
};

export type UserCart = {
    cartId: string;
    userId: string;
    date: string;
    items: CartItem[];
    totalPrice: number;
};

// 3. สร้าง Object CartModel สำหรับจัดการข้อมูลตะกร้าสินค้า
const CartModel = {
    // ฟังก์ชันดึงข้อมูลตะกร้าทั้งหมด
    getAllCarts: (): UserCart[] => {
        try {
            if (!fs.existsSync(filePath)) return [];
            const fileContent = fs.readFileSync(filePath, "utf-8");
            const data = JSON.parse(fileContent);
            return data.userCarts || [];
        } catch (error) {
            console.error("Error reading userCarts from data.json:", error);
            return [];
        }
    },

    // ฟังก์ชันเพิ่มข้อมูล/อัปเดตข้อมูลลงตะกร้าสินค้า
    addToCart: (userId: string, item: CartItem): UserCart | null => {
        try {
            if (!fs.existsSync(filePath)) return null;
            const fileContent = fs.readFileSync(filePath, "utf-8");
            const fullData = JSON.parse(fileContent);
            
            // ดักจับความปลอดภัย: ถ้าไม่มีคีย์ userCarts ให้สร้างรอก่อน
            if (!fullData.userCarts) {
                fullData.userCarts = [];
            }
            
            const carts = fullData.userCarts;

            // ตรวจสอบว่าผู้ใช้คนนี้มีตะกร้าเดิมอยู่แล้วหรือไม่
            let userCart = carts.find((c: any) => c.userId === userId);

            if (userCart) {
                // เคสที่ 1: มีตะกร้าเดิมอยู่แล้ว -> เช็คว่ามีสินค้านี้ซ้ำไหม
                if (!userCart.items) userCart.items = [];
                
                const existingItem = userCart.items.find((i: CartItem) => i.productId === item.productId);
                if (existingItem) {
                    existingItem.quantity += item.quantity; // บวกจำนวนเพิ่ม
                } else {
                    userCart.items.push(item); // เพิ่มชิ้นใหม่เข้าไปในตะกร้าเดิม
                }
            } else {
                // เคสที่ 2: ยังไม่มีตะกร้า -> สร้างตะกร้าใหม่ขึ้นมาเลย
                const randomId = "CRT" + Math.floor(100 + Math.random() * 900); // สุ่มไอดี CRT100 - CRT999
                const today = new Date().toISOString().split("T")[0]; // วันที่ปัจจุบัน YYYY-MM-DD

                userCart = {
                    cartId: randomId,
                    userId: userId,
                    date: today,
                    items: [item],
                    totalPrice: 0
                };
                carts.push(userCart);
            }

            // คำนวณราคารวมทั้งหมดในตะกร้าชิ้นนั้นใหม่ (ราคาสุทธิ)
            userCart.totalPrice = Number(
                userCart.items.reduce((sum: number, i: CartItem) => sum + (i.price * i.quantity), 0).toFixed(2)
            );

            // บันทึกกลับลงไฟล์ json โดยยังรักษาข้อมูลกลุ่มอื่นๆ ไว้ (เช่น customer, salesData)
            fullData.userCarts = carts;
            fs.writeFileSync(filePath, JSON.stringify(fullData, null, 2), "utf-8");

            return userCart;
        } catch (error) {
            console.error("Error writing cart to data.json:", error);
            return null;
        }
    }
};

export default CartModel;