import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || '';

export interface User {
  id: string;
  email: string;
  name: string;
}


export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    return decoded;
  } catch {
    return null;
  }
}

export async function createUser(email: string, password: string, name: string): Promise<User> {
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    },
    select: {
      id: true,
      email: true,
      name: true
    }
  })
  return user;
}

export async function findUserByEmail(email: string): Promise<(User & { password: string }) | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      password: true
    }
  });

  return user;
}

export async function findUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
    }
  });

  return user;
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const token = (await cookieStore).get('auth-token')?.value;
  
  if (!token) return null;
  
  const decoded = verifyToken(token);
  if (!decoded) return null;

  const user = await findUserById(decoded.id);
  return user;
}

export async function updateUser(id: string, data: Partial<Pick<User, 'name' | 'email'>>): Promise<User | null> {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
      }
    });

    return user;
  } catch {
    return null;
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    await prisma.user.delete({
      where: { id }
    });
    return true;
  } catch {
    return false;
  }
}