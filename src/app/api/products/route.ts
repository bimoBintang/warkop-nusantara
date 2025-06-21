import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET() {
    try {
        const products = await prisma.product.findMany({orderBy: { createdAt: 'desc'}})
        return NextResponse.json(products, { status: 200})
    } catch (error) {
        return NextResponse.json({message: 'Failed to fetch products'}, { status: 500})
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, price, desc, image } = body;

        if(!name || !price || !desc || !image) {
            return NextResponse.json({message: 'Missing required fields'}, { status: 400})
        }

        const product = await prisma.product.create({
            data: {
                name,
                price: parseInt(price),
                desc,
                image
            }
        })

        return NextResponse.json(product, { status: 201})

    } catch (error) {
        return NextResponse.json({message: 'Failed to create product'}, { status: 500})
    }
}