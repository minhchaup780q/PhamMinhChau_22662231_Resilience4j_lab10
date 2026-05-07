import { useState, useEffect } from 'react';
import { FoodAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null); // Quản lý Toast Notification
  const navigate = useNavigate();

  useEffect(() => {
    FoodAPI.getAllFoods()
      .then((response) => {
        setFoods(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi tải món ăn:", error);
        setLoading(false);
      });
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000); // Tự động ẩn sau 3 giây
  };

  const handleAddToCart = (food) => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = existingCart.findIndex(item => item.id === food.id);
    
    if (existingItemIndex >= 0) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push({
        id: food.id,
        name: food.name,
        price: food.price,
        quantity: 1
      });
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    showToast(`Đã thêm "${food.name}" vào giỏ hàng!`); // Gọi Toast thay vì alert()
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="relative pb-10">
      <div className="flex justify-between items-end mb-8 border-b-2 border-blue-100 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Khám Phá Hương Vị</h1>
          <p className="text-slate-500 mt-1">Hải sản tươi ngon & Ẩm thực đa dạng</p>
        </div>
        <button 
          onClick={() => navigate('/cart')}
          className="bg-slate-800 text-white px-5 py-2.5 rounded-lg hover:bg-slate-700 shadow-md font-medium transition flex items-center gap-2"
        >
          <span>🛒</span> Xem giỏ hàng
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {foods.map((food) => (
          <div key={food.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col transform hover:-translate-y-1">
            <div className="overflow-hidden h-48 relative bg-slate-50">
              <img 
                src={food.imageUrl || 'https://placehold.co/400x300?text=Food'} 
                alt={food.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-slate-800 leading-tight">{food.name}</h3>
              <p className="text-sm text-slate-500 mt-2 line-clamp-2">{food.description}</p>
              
              <div className="mt-auto pt-4 flex items-center justify-between">
                <p className="text-blue-600 font-black text-lg">{food.price.toLocaleString()} đ</p>
                <button 
                  onClick={() => handleAddToCart(food)}
                  className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white p-2 px-4 rounded-lg font-bold transition-colors duration-200"
                >
                  Thêm +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toast Notification Góc màn hình */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="text-green-400">✔</span>
          <p className="font-medium">{toast}</p>
        </div>
      )}
    </div>
  );
}