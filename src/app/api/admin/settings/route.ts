// src/app/api/route.ts
import { NextResponse } from 'next/server';

// ดึงข้อมูลด้วย GET Method
export async function GET() {
    return NextResponse.json({ 
        message: "Hello from Settings Admin API!",
        status: "success" 
    });
}

// ส่งข้อมูลด้วย POST Method
export async function POST(request: Request) {
    const data = await request.json();
    return NextResponse.json({ 
        message: "Data received", 
        yourData: data 
    });
}