import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import Tittle from "../components/Tittle";
import { CheckCircle, Truck, Package, Clock } from "lucide-react";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "text-yellow-600 bg-yellow-100",
    icon: Clock,
  },
  shipped: {
    label: "Shipped",
    color: "text-blue-600 bg-blue-100",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "text-green-600 bg-green-100",
    icon: CheckCircle,
  },
};

const formatDate = (timestamp) =>
  new Date(timestamp).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const Orders = () => {
  const { backendUrl, token, currecy } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      if (!token) return;

      const res = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    loadOrders();

    const interval = setInterval(() => {
      loadOrders();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [token]);


  return (
    <div className="min-h-[80vh] border-t border-gray-200 px-4 sm:px-8 pt-8 sm:pt-14">
      <div className="text-center mb-12">
        <Tittle text1="MY" text2="ORDERS" />
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {loading && (
          <p className="text-center text-gray-500">Loading orders...</p>
        )}

        {!loading && orders.length === 0 && (
          <p className="text-center text-gray-500">No orders found.</p>
        )}

        {orders.map((order, index) => {
          const status = statusConfig[order.status] || statusConfig.pending;
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-md p-5"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-xs text-gray-400 break-all">
                    {order._id}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Ordered on {formatDate(order.date)}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                >
                  <StatusIcon size={14} /> {status.label}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {order.items.map((product, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 items-center border rounded-xl p-3"
                  >
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {currecy} {product.price}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Qty: {product.quantity} • Size: {product.size}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-sm font-medium text-gray-700">
                  Total: {currecy} {order.amount}
                </p>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg text-xs bg-black text-white tracking-widest"
                  >
                    TRACK ORDER
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;