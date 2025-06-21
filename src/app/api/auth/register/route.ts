import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, dan name diperlukan' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User sudah terdaftar' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await createUser(email, password, name);

    return NextResponse.json({
      message: 'User berhasil didaftarkan',
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
