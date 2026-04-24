import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read from the data directory (two levels up from frontend)
    const jsonPath = path.join(process.cwd(), '..', 'data', 'sample_marketing_plan.json');
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load marketing plan data' },
      { status: 500 }
    );
  }
}
