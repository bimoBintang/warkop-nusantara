// src/app/api/products/[productId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Ensure the signature is EXACTLY as follows for GET
export async function GET(
    request: Request | NextRequest, // The actual Request object (first argument)
    { params }: { params: { productId: string } } // Context object destructuring for params (second argument)
) {
    try {
        const product = await prisma.product.findUnique({
            where: { id: params.productId }
        })

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 })
        }

        return NextResponse.json(product, { status: 200 })
    } catch (error) {
        console.error('Failed to fetch product in GET:', error); // More specific logging
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
    }
}

export async function PATCH(
    req: Request | NextRequest,
    { params }: { params: { productId: string } }
) {
    try {
        const body = await req.json()
        const { name, price, desc, image } = body;

        // Basic validation for required fields
        if (!name || !price || !desc || !image) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400})
        }

        const product = await prisma.product.update({
            where: { id: params.productId},
            data: {
                name,
                price: parseInt(price), // Ensure price is parsed to an integer
                desc,
                image
            }
        })

        return NextResponse.json(product, { status: 200})
    } catch (error) {
        console.error('Failed to update product in PATCH:', error); // More specific logging
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }
}

// Ensure the signature is EXACTLY as follows for DELETE
export async function DELETE(
    request: Request | NextRequest, // The Request object (first argument, even if not directly used)
    { params }: { params: { productId: string } } // Context object destructuring for params (second argument)
) {
    try {
        const { productId } = params;

        const product = await prisma.product.delete({
            where: { id: productId}
        })

        return NextResponse.json(product, { status: 200 })
    } catch (error) {
        console.error('Failed to delete product in DELETE:', error); // More specific logging
        // Check if the error is a Prisma client error (e.g., record not found)
        if (error instanceof Error && error.message.includes('RecordNotFound')) {
            return NextResponse.json({ error: 'Product not found for deletion' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }
}