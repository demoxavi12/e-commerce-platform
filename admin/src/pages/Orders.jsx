import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import assets from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        toast.error(response.data.message);
        setOrders([]);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      setOrders([]);
    }
  };


  const statusHandeler = async (event, OrderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { OrderId, status: event.target.value },
        { headers: { token } }
      );

      if (response.data.success) {
        await fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="w-full px-2 sm:px-6">
      <h2 className="text-xl font-semibold mb-6">All Orders</h2>

      {orders.length === 0 && (
        <p className="text-gray-500 text-sm">No orders found</p>
      )}

      <div className="flex flex-col gap-4">
        {orders.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-1 lg:grid-cols-[0.5fr_2fr_1.2fr_0.8fr_0.8fr] gap-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Icon */}
            <div className="flex justify-center lg:justify-start">
              <img
                src={assets.parcel_icon}
                alt="parcel"
                className="w-10 h-10"
              />
            </div>

            {/* Items + Address */}
            <div className="text-sm text-gray-700">
              <div className="mb-2">
                {order.items?.map((item, idx) => (
                  <p key={idx}>
                    {item.name} × {item.quantity}{" "}
                    <span className="text-gray-500">({item.size})</span>
                  </p>
                ))}
              </div>

              <p className="font-medium">
                {order.address.firstName} {order.address.lastName}
              </p>

              <p className="text-gray-500 text-xs">
                {order.address.Street}, {order.address.city},{" "}
                {order.address.state}, {order.address.country} -{" "}
                {order.address.zip}
              </p>

              <p className="text-xs mt-1">{order.address.phone}</p>
            </div>

            {/* Order Meta */}
            <div className="text-sm text-gray-700">
              <p>Items: {order.items.length}</p>
              <p>Method: {order.paymentMethod}</p>
              <p>
                Payment:{" "}
                <span
                  className={`font-medium ${order.payment ? "text-green-600" : "text-orange-500"
                    }`}
                >
                  {order.payment ? "Done" : "Pending"}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                {new Date(order.date).toLocaleString()}
              </p>
            </div>

            {/* Amount */}
            <div className="font-semibold text-sm">
              {currency}
              {order.amount}
            </div>

            {/* Status */}
            <div>
              <select onChange={(e)=>statusHandeler(e, order._id)} className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1 outline-black cursor-pointer hover:bg-gray-50 transition">
                <option>Order Placed</option>
                <option>Packing</option>
                <option>Shipped</option>
                <option>Out For Delivery</option>
                <option>Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
