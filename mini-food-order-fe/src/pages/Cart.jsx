import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderAPI, PaymentAPI } from '../services/api';

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  // LOGIC NÂNG CẤP: Thay đổi số lượng món ăn
  const updateQuantity = (id, delta) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + delta };
      }
      return item;
    }).filter(item => item.quantity > 0); // Xóa luôn nếu số lượng <= 0

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      alert("Bạn cần đăng nhập để tiếp tục!");
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(userString);
    setLoading(true);
    setMessage('Đang xử lý đơn hàng của bạn...');

    try {
      const orderPayload = {
        userId: user.id,
        totalPrice: totalAmount,
        status: "PENDING",
        items: cartItems.map(item => ({
          foodId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const orderRes = await OrderAPI.createOrder(orderPayload);
      const newOrderId = orderRes.data.id;

      setMessage(`Xác nhận đơn hàng #${newOrderId}. Đang kết nối cổng thanh toán...`);

      await PaymentAPI.processPayment({ orderId: newOrderId, paymentMethod });

      setMessage('🎉 Thanh toán thành công! Chuẩn bị món ngon cho bạn ngay đây.');
      
      localStorage.removeItem('cart');
      setCartItems([]);
      setTimeout(() => navigate('/'), 3000);

    } catch (error) {
      console.error("Lỗi Checkout:", error);
      setMessage(`❌ Lỗi: ${error.response?.data?.message || 'Không thể kết nối máy chủ.'}`);
    } finally {
      setLoading(false);
    }
  };

  // UI khi giỏ hàng trống
  if (cartItems.length === 0 && !message) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 p-8">
        <div className="text-6xl mb-4 opacity-50">🛒</div>
        <h2 className="text-2xl font-bold text-slate-700 mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-slate-500 mb-6">Hãy lấp đầy bụng đói bằng những món ngon nhé!</p>
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white font-medium px-8 py-3 rounded-full hover:bg-blue-700 shadow-lg transition">
          Khám phá thực đơn
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Cột trái: Danh sách món */}
      <div className="md:col-span-2">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-6 border-b-2 border-blue-100 pb-2">Chi tiết đơn hàng</h1>
        
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-md transition">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                <p className="text-blue-600 font-semibold">{item.price.toLocaleString()} đ</p>
              </div>
              
              <div className="flex items-center gap-4 bg-slate-50 rounded-lg p-1 border border-slate-200">
                <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white text-slate-600 rounded-md hover:bg-slate-200 shadow-sm font-bold">
                  -
                </button>
                <span className="font-bold text-slate-800 w-4 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white text-blue-600 rounded-md hover:bg-blue-100 shadow-sm font-bold">
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cột phải: Khung Thanh toán */}
      <div className="md:col-span-1">
        <div className="bg-slate-800 rounded-3xl p-6 text-white shadow-xl sticky top-24">
          <h2 className="text-xl font-bold mb-6 text-blue-100">Tổng kết</h2>
          
          <div className="flex justify-between items-center mb-6 border-b border-slate-600 pb-4">
            <span className="text-slate-300">Tạm tính:</span>
            <span className="text-2xl font-black text-cyan-400">{totalAmount.toLocaleString()} đ</span>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">Phương thức thanh toán</label>
            <select 
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="COD">💵 Thanh toán tiền mặt (COD)</option>
              <option value="BANKING">💳 Chuyển khoản ngân hàng</option>
            </select>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-xl font-medium text-sm ${message.includes('Lỗi') ? 'bg-red-500/20 text-red-200 border border-red-500/50' : 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/50'}`}>
              {message}
            </div>
          )}

          {cartItems.length > 0 && (
            <button 
              onClick={handleCheckout}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition transform 
                ${loading ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 hover:-translate-y-1'}`}
            >
              {loading ? 'Đang xử lý...' : 'Thanh Toán Ngay'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}