// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { guestId, guestName, guestEmail, guestPhone, guestAddress, notes, productId } = body

    // Validasi input
    if (!guestId || !guestName || !guestEmail || !guestPhone || !guestAddress || !productId) {
      return NextResponse.json(
        { error: 'Semua field wajib harus diisi' },
        { status: 400 }
      )
    }

    // Validasi produk ada
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produk tidak ditemukan' },
        { status: 404 }
      )
    }

    // Buat order baru
    const order = await prisma.order.create({
      data: {
        guestId,
        guestName,
        guestEmail,
        guestPhone,
        guestAddress,
        notes: notes || null,
        productId,
      },
      include: {
        product: true
      }
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}