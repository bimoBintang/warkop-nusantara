import Checkout from '@/components/chackOut';
import { prisma } from '@/lib/prisma';

// Server action untuk memproses order berdasarkan schema yang diberikan
async function checkoutPage(orderData: {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress: string;
  notes?: string;
  orders: {
    productId: string;
    quantity: number;
  }[];
}) {
  'use server';
  
  try {
    // Generate guestId yang unik
    const guestId = `#ORD-${Date.now().toString().slice(-6)}`;
    
    // Mulai transaction untuk memastikan konsistensi data
    const result = await prisma.$transaction(async (tx) => {
      // Validasi produk-produk yang akan dipesan
      const productIds = orderData.orders.map(order => order.productId);
      const products = await tx.product.findMany({
        where: {
          id: {
            in: productIds
          }
        }
      });

      if (products.length !== productIds.length) {
        throw new Error('Beberapa produk tidak ditemukan');
      }

      // Buat order untuk setiap item di cart
      // Karena schema Order memiliki relasi one-to-one dengan Product,
      // kita perlu membuat order terpisah untuk setiap produk
      const createdOrders = [];
      
      for (const orderItem of orderData.orders) {
        // Untuk setiap quantity, buat order terpisah
        // Atau jika Anda ingin 1 order = 1 quantity, buat sebanyak quantity
        for (let i = 0; i < orderItem.quantity; i++) {
          const order = await tx.order.create({
            data: {
              guestId: guestId,
              guestName: orderData.guestName,
              guestEmail: orderData.guestEmail,
              guestPhone: orderData.guestPhone,
              guestAddress: orderData.guestAddress,
              notes: orderData.notes,
              productId: orderItem.productId,
            },
            include: {
              product: true
            }
          });
          
          createdOrders.push(order);
        }
      }

      return createdOrders;
    });

    console.log('Orders created successfully:', result.map(order => order.id));
    
    return {
      success: true,
      orderIds: result.map(order => order.id),
      message: 'Pesanan berhasil dibuat'
    };

  } catch (error) {
    console.error('Error creating orders:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return {
          success: false,
          error: 'Terjadi duplikasi data. Silakan coba lagi.'
        };
      }
      
      if (error.message.includes('Foreign key constraint')) {
        return {
          success: false,
          error: 'Produk tidak ditemukan. Silakan refresh halaman.'
        };
      }
      
      if (error.message.includes('tidak ditemukan')) {
        return {
          success: false,
          error: error.message
        };
      }
    }
    
    return {
      success: false,
      error: 'Terjadi kesalahan internal. Silakan coba lagi.'
    };
  }
}

// Komponen halaman checkout
export default async function CheckoutPage() {
  return (
    <Checkout 
      onSubmitOrder={checkoutPage}
    />
  );
}