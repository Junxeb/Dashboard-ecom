import CartModel, { CartItem } from "../models/Carts"; // 🚨 เช็ค Path ชี้ไปหาไฟล์ Carts.ts ให้ถูกต้อง

export const cartsController = {
    addItem: async (userId: string, productId: string, name: string, quantity: number, price: number) => {
        if (!userId || !productId || !name) {
            throw new Error("ข้อมูลไอเทมหรือผู้ใช้งานไม่ครบถ้วน");
        }

        const validQuantity = Number(quantity) || 1;
        const validPrice = Number(price) || 0;

        const itemPayload: CartItem = {
            productId,
            name,
            quantity: validQuantity,
            price: validPrice
        };

        // ยิงสั่งเพิ่มข้อมูลลง Model
        const updatedCart = CartModel.addToCart(userId, itemPayload);
        
        return updatedCart; // จะส่งข้อมูลตะกร้ากลับไป (หรือส่ง null ถ้าเกิด error ด้านใน)
    }
};