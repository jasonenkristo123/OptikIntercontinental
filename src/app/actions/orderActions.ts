'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { CreateOrderPayload, Order, OrderItem } from '@/shared/types/database';

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const supabase = await createClient();

  const orderId = `OPT-${Math.floor(100000 + Math.random() * 900000)}`;
  const reservedUntil = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        id: orderId,
        contact_info: payload.contactInfo,
        customer_profile: payload.customerProfile,
        prescription_data: payload.prescriptionData,
        items: payload.items,
        total_price: payload.totalPrice,
        status: 'PENDING_PAYMENT',
        reserved_until: reservedUntil,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);

  for (const item of payload.items as OrderItem[]) {
    if (item.frameId) {
      const { data: frame } = await supabase
        .from('frames')
        .select('stock')
        .eq('id', item.frameId)
        .single();

      if (frame && frame.stock > 0) {
        await supabase
          .from('frames')
          .update({ stock: frame.stock - 1 })
          .eq('id', item.frameId);
      }
    }
  }

  revalidatePath('/');
  revalidatePath('/admin');
  return data as Order;
}

export async function getAdminOrders(): Promise<Order[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []) as Order[];
}

export async function confirmOrder(orderId: string): Promise<boolean> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('orders')
    .update({ status: 'CONFIRMED' })
    .eq('id', orderId);

  if (error) throw new Error(error.message);
  revalidatePath('/admin');
  return true;
}

export async function cancelOrder(orderId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data: orderData } = await supabase.from('orders').select('*').eq('id', orderId).single();
  const order = orderData as Order | null;

  if (order && order.status === 'PENDING_PAYMENT') {
    for (const item of order.items) {
      if (item.frameId) {
        const { data: frame } = await supabase
          .from('frames')
          .select('stock')
          .eq('id', item.frameId)
          .single();

        if (frame) {
          await supabase
            .from('frames')
            .update({ stock: frame.stock + 1 })
            .eq('id', item.frameId);
        }
      }
    }

    await supabase.from('orders').update({ status: 'CANCELLED' }).eq('id', orderId);
  }

  revalidatePath('/');
  revalidatePath('/admin');
  return true;
}

export async function releaseExpiredOrders(): Promise<{ releasedCount: number }> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data: expiredOrders } = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'PENDING_PAYMENT')
    .lt('reserved_until', now);

  const orders = (expiredOrders || []) as Order[];

  if (orders.length > 0) {
    for (const order of orders) {
      await cancelOrder(order.id);
    }
  }

  return { releasedCount: orders.length };
}