import fs from "fs";
import path from "path";

// 1. กำหนดตำแหน่งที่อยู่ของไฟล์ data.json (อยู่ที่ Root ของโปรเจกต์)
const filePath = path.join(process.cwd(), "data.json");

// 2. กำหนด Type กำกับโครงสร้างข้อมูล (สำหรับ TypeScript)
export type UserItem = {
    name: string;
    address: string;
    email: string;
    password?: string;
    userId: string;
    phone: number;
    language: string;
    gender: string;
    dateOfBirth: string;
    profilePicture: string;
    Currency: string;
};

// 3. สร้าง Object หรือ Class สำหรับเป็น Model ในการจัดการข้อมูล
const UserModel = {
    // ฟังก์ชันสำหรับดึงข้อมูลทั้งหมด
    getAll: (): UserItem[] => {
        try {
            if (!fs.existsSync(filePath)) {
                return [];
            }
            const fileContent = fs.readFileSync(filePath, "utf-8");
            const data = JSON.parse(fileContent);
            return data.customer || [];
        } catch (error) {
            console.error("Error reading data.json:", error);
            return [];
        }
    },

    // ฟังก์ชันสำหรับเพิ่มข้อมูลใหม่เข้าไปในไฟล์ (คล้าย ๆ การคำสั่ง .save() หรือ .create())
    create: (userData: UserItem): boolean => {
        try {
            // อ่านข้อมูลเดิมที่มีอยู่ก่อน
            const customers = UserModel.getAll();

            // เพิ่มข้อมูลใหม่ต่อท้ายเข้าไป
            customers.push(userData);

            // เขียนข้อมูลทั้งหมดกลับลงไฟล์ json
            const fileData = { customer: customers };
            fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), "utf-8");
            
            return true;
        } catch (error) {
            console.error("Error writing to data.json:", error);
            return false;
        }
    }
};

export default UserModel;