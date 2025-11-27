import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, CheckCircle, XCircle, Clock, Package, Eye, Check } from 'lucide-react';
import type { Order } from '../types';
import { useOrders } from '../contexts/OrdersContext';
import { formatPrice } from '../utils/currency';

interface OrdersManagementProps {
  onBack: () => void;
}

const OrdersManagement: React.FC<OrdersManagementProps> = ({ onBack }) => {
  const { orders, loading, confirmOrder, completeOrder, cancelOrder, refreshOrders } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search filter
      const matchesSearch = 
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_phone.includes(searchQuery) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const pending = orders.filter(o => o.status === 'pending').length;
    const confirmed = orders.filter(o => o.status === 'confirmed').length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    const totalRevenue = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + Number(o.total_amount), 0);

    return { pending, confirmed, completed, cancelled, totalRevenue };
  }, [orders]);

  const handleConfirm = async (orderId: string) => {
    if (!confirm('Are you sure you want to confirm this order? This will deduct stock from inventory.')) {
      return;
    }

    const result = await confirmOrder(orderId);
    if (result.success) {
      alert('Order confirmed successfully! Stock has been deducted from inventory.');
      await refreshOrders();
    } else {
      alert(`Failed to confirm order: ${result.error}`);
    }
  };

  const handleComplete = async (orderId: string) => {
    if (!confirm('Mark this order as completed? This will add it to total sales income.')) {
      return;
    }

    const result = await completeOrder(orderId);
    if (result.success) {
      alert('Order marked as completed!');
      await refreshOrders();
    } else {
      alert(`Failed to complete order: ${result.error}`);
    }
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    const result = await cancelOrder(orderId);
    if (result.success) {
      alert('Order cancelled successfully.');
      await refreshOrders();
    } else {
      alert(`Failed to cancel order: ${result.error}`);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-300',
      completed: 'bg-green-100 text-green-700 border-green-300',
      cancelled: 'bg-red-100 text-red-700 border-red-300'
    };

    const icons = {
      pending: <Clock className="h-4 w-4" />,
      confirmed: <CheckCircle className="h-4 w-4" />,
      completed: <CheckCircle className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {icons[status]}
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b-2 border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2 group"
              >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Orders Management
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border-2 border-blue-100">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border-2 border-purple-100">
            <p className="text-sm text-gray-600 mb-1">Confirmed</p>
            <p className="text-2xl font-bold text-purple-600">{stats.confirmed}</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border-2 border-green-100">
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border-2 border-red-100">
            <p className="text-sm text-gray-600 mb-1">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border-2 border-pink-100">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">{formatPrice(stats.totalRevenue)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-6 border-2 border-blue-100">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by customer name, email, phone, or order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border-2 border-blue-100">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border-2 border-blue-100 hover:shadow-xl transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">Order #{order.id.slice(0, 8)}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleString('en-PH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Customer</p>
                        <p className="text-gray-900">{order.customer_name}</p>
                        <p className="text-sm text-gray-600">{order.customer_email}</p>
                        <p className="text-sm text-gray-600">{order.customer_phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Shipping Address</p>
                        <p className="text-gray-900">{order.shipping_address}</p>
                        <p className="text-sm text-gray-600">
                          {order.shipping_city}, {order.shipping_state} {order.shipping_zip_code}
                        </p>
                        <p className="text-sm text-gray-600">{order.shipping_country}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Order Items</p>
                      <div className="space-y-2">
                        {order.order_items?.map((item, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {item.product_name}
                                {item.variation_name && (
                                  <span className="text-blue-600 ml-2">({item.variation_name})</span>
                                )}
                              </p>
                              <p className="text-sm text-gray-600">
                                {item.quantity} x {formatPrice(item.unit_price)}
                              </p>
                            </div>
                            <p className="font-bold text-gray-900">{formatPrice(item.total_price)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment & Total */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-sm text-gray-600">
                          Payment: <span className="font-semibold">{order.payment_method_name || 'N/A'}</span>
                        </p>
                        {order.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            Notes: <span className="italic">{order.notes}</span>
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold text-blue-600">{formatPrice(order.total_amount)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleConfirm(order.id)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                        >
                          <Check className="h-5 w-5" />
                          Confirm Order
                        </button>
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                        >
                          Cancel Order
                        </button>
                      </>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={() => handleComplete(order.id)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="h-5 w-5" />
                        Mark as Completed
                      </button>
                    )}
                    {order.status === 'completed' && (
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-green-700">Order Completed</p>
                        {order.completed_at && (
                          <p className="text-xs text-green-600 mt-1">
                            {new Date(order.completed_at).toLocaleDateString('en-PH')}
                          </p>
                        )}
                      </div>
                    )}
                    {order.status === 'cancelled' && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
                        <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-red-700">Order Cancelled</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersManagement;

