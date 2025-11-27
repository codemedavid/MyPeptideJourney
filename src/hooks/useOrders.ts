import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Order, OrderItem } from '../types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (
              id,
              name,
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setOrders(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_zip_code: string;
    shipping_country: string;
    total_amount: number;
    shipping_fee?: number;
    payment_method_id?: string;
    payment_method_name?: string;
    notes?: string;
    items: Array<{
      product_id: string;
      product_name: string;
      product_price: number;
      variation_id?: string;
      variation_name?: string;
      quantity: number;
      unit_price: number;
      total_price: number;
    }>;
  }) => {
    try {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          customer_phone: orderData.customer_phone,
          shipping_address: orderData.shipping_address,
          shipping_city: orderData.shipping_city,
          shipping_state: orderData.shipping_state,
          shipping_zip_code: orderData.shipping_zip_code,
          shipping_country: orderData.shipping_country,
          total_amount: orderData.total_amount,
          shipping_fee: orderData.shipping_fee || 0,
          payment_method_id: orderData.payment_method_id,
          payment_method_name: orderData.payment_method_name,
          notes: orderData.notes,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      if (order && orderData.items.length > 0) {
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(
            orderData.items.map(item => ({
              order_id: order.id,
              product_id: item.product_id,
              product_name: item.product_name,
              product_price: item.product_price,
              variation_id: item.variation_id,
              variation_name: item.variation_name,
              quantity: item.quantity,
              unit_price: item.unit_price,
              total_price: item.total_price
            }))
          );

        if (itemsError) throw itemsError;
      }

      await fetchOrders();
      return { success: true, data: order };
    } catch (err) {
      console.error('Error creating order:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to create order' };
    }
  };

  const confirmOrder = async (orderId: string) => {
    try {
      // Fetch order with items
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('id', orderId)
        .single();

      if (fetchError) throw fetchError;
      if (!order) throw new Error('Order not found');

      // Check if order is already confirmed or completed
      if (order.status === 'confirmed' || order.status === 'completed') {
        return { success: false, error: 'Order is already confirmed or completed' };
      }

      // Update order status to confirmed
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'confirmed',
          confirmed_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateError) throw updateError;

      // Deduct stock from products/variations
      const orderItems = (order.order_items || []) as OrderItem[];
      for (const item of orderItems) {
        if (item.variation_id) {
          // Deduct from variation stock
          const { data: variation, error: varError } = await supabase
            .from('product_variations')
            .select('stock_quantity')
            .eq('id', item.variation_id)
            .single();

          if (!varError && variation) {
            const newStock = Math.max(0, variation.stock_quantity - item.quantity);
            const { error: updateStockError } = await supabase
              .from('product_variations')
              .update({ stock_quantity: newStock })
              .eq('id', item.variation_id);
            
            if (updateStockError) {
              console.error('Error updating variation stock:', updateStockError);
            }
          }
        } else {
          // Deduct from product stock
          const { data: product, error: prodError } = await supabase
            .from('products')
            .select('stock_quantity')
            .eq('id', item.product_id)
            .single();

          if (!prodError && product) {
            const newStock = Math.max(0, product.stock_quantity - item.quantity);
            const { error: updateStockError } = await supabase
              .from('products')
              .update({ stock_quantity: newStock })
              .eq('id', item.product_id);
            
            if (updateStockError) {
              console.error('Error updating product stock:', updateStockError);
            }
          }
        }
      }

      await fetchOrders();
      return { success: true };
    } catch (err) {
      console.error('Error confirming order:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to confirm order' };
    }
  };

  const completeOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      await fetchOrders();
      return { success: true };
    } catch (err) {
      console.error('Error completing order:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to complete order' };
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'cancelled'
        })
        .eq('id', orderId);

      if (error) throw error;

      await fetchOrders();
      return { success: true };
    } catch (err) {
      console.error('Error cancelling order:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Failed to cancel order' };
    }
  };

  return {
    orders,
    loading,
    error,
    refreshOrders: fetchOrders,
    createOrder,
    confirmOrder,
    completeOrder,
    cancelOrder
  };
}

