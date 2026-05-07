import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderAPI } from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      navigate('/login');
      return;
    }
  
    const user = JSON.parse(userString);
    
    // KIỂM TRA: Backend của Tấn trả về 'id' hay 'userId'? 
    // Thêm dấu || để lấy cái nào cũng được
    const currentId = user.id || user.userId || user.userName; 
  
    if (!currentId) {
      console.error("Không tìm thấy ID người dùng trong localStorage!", user);
      return;
    }
  
    setLoading(true);
    OrderAPI.getOrdersByUser(currentId)
      .then(res => {
        setOrders(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi lấy đơn hàng:", err);
        setLoading(false);
      });
  }, [navigate]);
  // Hàm helper để hiển thị màu sắc cho từng trạng thái
  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'PENDING':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-blue-600 font-bold animate-pulse">Đang truy xuất dữ liệu biển cả...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Header Trang */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <span className="text-blue-600">📦</span> LỊCH SỬ ĐƠN HÀNG
          </h1>
          <p className="text-slate-500 font-medium mt-1">Theo dõi hành trình những món ngon của bạn</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1 active:scale-95"
        >
          Tiếp tục mua sắm
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 mb-8 text-center font-bold">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        /* Giao diện khi chưa có đơn hàng */
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
          <div className="text-8xl mb-6">🌊</div>
          <h2 className="text-2xl font-bold text-slate-700">Biển lặng sóng êm...</h2>
          <p className="text-slate-500 mt-2 mb-8">Bạn chưa có đơn hàng nào trong lịch sử.</p>
          <button 
            onClick={() => navigate('/')}
            className="text-blue-600 font-black hover:underline text-lg"
          >
            Đến nhà hàng ngay ➜
          </button>
        </div>
      ) : (
        /* Danh sách Card Đơn hàng */
        <div className="grid gap-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
              
              {/* Top Bar của Card */}
              <div className="bg-slate-50 px-8 py-5 flex flex-wrap justify-between items-center border-b border-slate-100 gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 text-white p-2 rounded-xl shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-black uppercase tracking-widest">Mã định danh</span>
                    <h3 className="text-lg font-mono font-black text-blue-600 leading-none">#{order.id}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-5 py-1.5 rounded-full text-xs font-black uppercase border-2 shadow-sm ${getStatusStyle(order.status)}`}>
                    {order.status || 'PROCESSING'}
                  </span>
                </div>
              </div>

              {/* Nội dung chi tiết đơn hàng */}
              <div className="p-8">
                <div className="space-y-4 mb-8">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-blue-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-blue-600 shadow-sm border border-slate-100">
                          {item.quantity}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">Món ăn ID: {item.foodId}</p>
                          <p className="text-xs text-slate-400 font-medium">Đơn giá: {item.price?.toLocaleString()} đ</p>
                        </div>
                      </div>
                      <span className="font-black text-slate-700">
                        {(item.price * item.quantity).toLocaleString()} đ
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer của Card */}
                <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center pt-6 border-t border-dashed border-slate-200 gap-4">
                  <div className="flex items-center gap-3 text-slate-400">
                    <span className="text-2xl">💳</span>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-tighter">Phương thức</p>
                      <p className="text-sm font-bold text-slate-600">Thanh toán khi nhận hàng</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-black uppercase mb-1">Tổng cộng đơn hàng</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-blue-600 tabular-nums">
                        {order.totalPrice?.toLocaleString()}
                      </span>
                      <span className="text-blue-600 font-bold text-xl underline decoration-cyan-400">đ</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}