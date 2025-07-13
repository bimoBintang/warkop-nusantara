import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export interface OrderData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress: string;
  notes?: string;
  orders: {
    productId: string;
    quantity: number;
  }[];
}

export interface Order {
  id: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress: string;
  notes?: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    desc?: string;
    image?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Create multiple orders (for checkout)
export async function createOrders(orderData: OrderData): Promise<{ success: boolean; orderIds?: string[]; error?: string }> {
  try {
    // Generate a unique guest ID for this order session
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const orderPromises = orderData.orders.map(async (orderItem) => {
      // For each quantity, create separate order records
      const orderRecords = [];
      for (let i = 0; i < orderItem.quantity; i++) {
        orderRecords.push({
          guestId,
          guestName: orderData.guestName,
          guestEmail: orderData.guestEmail,
          guestPhone: orderData.guestPhone,
          guestAddress: orderData.guestAddress,
          notes: orderData.notes,
          productId: orderItem.productId
        });
      }
      return orderRecords;
    });
    
    const allOrderRecords = (await Promise.all(orderPromises)).flat();
    
    // Create all orders in a transaction
    const createdOrders = await prisma.$transaction(
      allOrderRecords.map(order => 
        prisma.order.create({
          data: order
        })
      )
    );
    
    const orderIds = createdOrders.map(order => order.id);
    
    revalidatePath('/orders');
    return { success: true, orderIds };
  } catch (error) {
    console.error('Error creating orders:', error);
    return { success: false, error: 'Failed to create orders' };
  }
}

// Get all orders
export async function getOrders(): Promise<Order[]> {
  try {
    const orders = await prisma.order.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            desc: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
}

// Get orders by guest ID
export async function getOrdersByGuestId(guestId: string): Promise<Order[]> {
  try {
    const orders = await prisma.order.findMany({
      where: { guestId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            desc: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching orders by guest ID:', error);
    throw new Error('Failed to fetch orders');
  }
}

// Get order by ID
export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            desc: true,
            image: true
          }
        }
      }
    });
    
    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order');
  }
}

// Get orders by IDs (for order success page)
export async function getOrdersByIds(orderIds: string[]): Promise<Order[]> {
  try {
    const orders = await prisma.order.findMany({
      where: {
        id: {
          in: orderIds
        }
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            desc: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching orders by IDs:', error);
    throw new Error('Failed to fetch orders');
  }
}

// Update order
export async function updateOrder(id: string, data: Partial<OrderData>): Promise<Order> {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(data.guestName && { guestName: data.guestName }),
        ...(data.guestEmail && { guestEmail: data.guestEmail }),
        ...(data.guestPhone && { guestPhone: data.guestPhone }),
        ...(data.guestAddress && { guestAddress: data.guestAddress }),
        ...(data.notes !== undefined && { notes: data.notes })
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            desc: true,
            image: true
          }
        }
      }
    });
    
    revalidatePath('/orders');
    return order;
  } catch (error) {
    console.error('Error updating order:', error);
    throw new Error('Failed to update order');
  }
}

// Delete order
export async function deleteOrder(id: string): Promise<void> {
  try {
    await prisma.order.delete({
      where: { id }
    });
    
    revalidatePath('/orders');
  } catch (error) {
    console.error('Error deleting order:', error);
    throw new Error('Failed to delete order');
  }
}

// Get order statistics
export async function getOrderStats() {
  try {
    const totalOrders = await prisma.order.count();
    
    // Get orders with product prices for revenue calculation
    const ordersWithProducts = await prisma.order.findMany({
      include: {
        product: {
          select: {
            price: true
          }
        }
      }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const revenue = ordersWithProducts.reduce((sum: any, order: { product: { price: any; }; }) => sum + order.product.price, 0);
    
    const uniqueCustomers = await prisma.order.groupBy({
      by: ['guestId'],
      _count: {
        guestId: true
      }
    });
    
    return {
      totalOrders,
      totalRevenue: revenue,
      uniqueCustomers: uniqueCustomers.length
    };
  } catch (error) {
    console.error('Error fetching order stats:', error);
    throw new Error('Failed to fetch order statistics');
  }
}