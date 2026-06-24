import { NextResponse } from 'next/server';

// Lấy Key từ biến môi trường của Server
const API_KEY = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;

// Mặc định gọi Groq nếu cấu hình Groq Key, nếu lấy OpenAI Key thì đổi đường dẫn
const API_URL = process.env.GROQ_API_KEY 
  ? "https://api.groq.com/openai/v1/chat/completions" 
  : "https://api.openai.com/v1/chat/completions";
  
const MODEL_NAME = process.env.GROQ_API_KEY ? "llama-3.1-8b-instant" : "gpt-4o-mini";

export async function POST(req: Request) {
  if (!API_KEY) {
    // Trả về lỗi nếu lập trình viên chưa cài đặt ENV trên Server (VPS/Local)
    return NextResponse.json(
        { error: { message: "AI API Key is not configured on the server. Please add GROQ_API_KEY or OPENAI_API_KEY to your .env file." } }, 
        { status: 500 }
    );
  }

  try {
    const body = await req.json();
    
    // Gửi tiếp request của Client lên nhà cung cấp AI một cách ẩn danh
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: body.messages,
        temperature: body.temperature || 0.7,
        response_format: body.response_format
      })
    });

    const data = await response.json();
    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("/api/agent Route Error:", error);
    return NextResponse.json({ error: { message: "Internal server error connecting to AI Provider." } }, { status: 500 });
  }
}
