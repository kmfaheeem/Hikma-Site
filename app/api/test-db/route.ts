import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb'; // Adjust this import path if your file is not in 'lib'

export async function GET() {
  try {
    // This is the line that will trigger the connection
    await getDatabase();

    // If it gets here, the connection was successful
    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      { success: false, message: 'Database connection failed!' },
      { status: 500 }
    );
  }
}