// src/app/api/products/[productId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const productId = url.pathname.split("/").pop(); // Ambil id dari path

  if (!productId) {
    return NextResponse.json({ message: "Product ID not found" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch product in GET:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}


export async function PATCH(req: Request) {
  const url = new URL(req.url);
  const productId = url.pathname.split("/").pop();

  if (!productId) {
    return NextResponse.json({ message: "Product ID not found" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { name, price, desc, image } = body;

    if (!name || !price || !desc || !image) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: { name, price: parseInt(price), desc, image },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Failed to update product in PATCH:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
