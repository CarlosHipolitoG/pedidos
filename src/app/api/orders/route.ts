
import {NextRequest, NextResponse} from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { NewOrderPayload, Order, OrderItem } from '@/lib/orders';

// IMPORTANT: Use service_role key for admin-level access
// Do not expose this key on the client side!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase URL and Service Key must be provided in .env");
}

const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!);

export async function POST(req: NextRequest) {
  try {
    const payload: NewOrderPayload = await req.json();

    const { data: existingOrders, error: countError } = await supabaseAdmin
        .from('orders')
        .select('id');

    if (countError) throw countError;

    const nextOrderId = (existingOrders || []).length + 1;
    const now = Date.now();

    const itemsWithTimestamp: OrderItem[] = payload.items.map(item => ({
        ...item,
        addedAt: now
    }));

    const newOrder: Omit<Order, 'id'> = {
      timestamp: now,
      customer: payload.customer,
      items: itemsWithTimestamp,
      total: payload.total,
      status: 'Pendiente',
      orderedBy: payload.orderedBy,
      attendedBy: payload.orderedBy.type === 'Mesero' ? payload.orderedBy.name : undefined,
    };
    
    // Insert the new order into the 'orders' table
    // The id will be auto-incremented by the database
    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert([newOrder])
      .select()
      .single();

    if (error) {
      console.error('Supabase error inserting order:', error);
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('API Error:', error.message);
    return NextResponse.json({ message: `Error creating order: ${error.message}` }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    try {
        const { data, error } = await supabaseAdmin.from('orders').select('*').order('timestamp', { ascending: false });
        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ message: `Error fetching orders: ${error.message}` }, { status: 500 });
    }
}
