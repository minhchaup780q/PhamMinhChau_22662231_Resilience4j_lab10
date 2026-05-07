import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAPI } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  
  // State quản lý UI
  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // State quản lý form data
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    role: 'USER' // Mặc định khi đăng ký là USER
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isLoginView) {
        // GỌI API ĐĂNG NHẬP
        const response = await UserAPI.login({
          userName: formData.userName,
          password: formData.password
        });
        
        // Lưu tạm vào localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        
        // Cập nhật state lên App.jsx để Navbar đổi ngay lập tức
        onLoginSuccess(response.data);
        
        // Chuyển hướng về trang chủ
        navigate('/');
        
      } else {
        // GỌI API ĐĂNG KÝ
        await UserAPI.register(formData);
        
        setSuccessMsg('Đăng ký thành công! Đăng nhập để thưởng thức đồ ăn.');
        setIsLoginView(true); // Chuyển về màn hình đăng nhập
        setFormData(prev => ({ ...prev, password: '' })); // Xóa trắng password
      }
    } catch (error) {
      console.error("Lỗi API:", error);
      setErrorMsg(error.response?.data?.message || 'Kết nối thất bại. Vui lòng kiểm tra lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-10">
        
        {/* Tiêu đề & Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4 text-3xl">
            {isLoginView ? '👋' : '✨'}
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {isLoginView ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
          </h2>
          <p className="text-slate-500 mt-2">
            {isLoginView ? 'Đăng nhập để đặt những món ăn tuyệt vời.' : 'Gia nhập cộng đồng sành ăn của chúng tôi.'}
          </p>
        </div>
        
        {/* Hiển thị thông báo lỗi / thành công */}
        {errorMsg && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-medium text-sm text-center">{errorMsg}</div>}
        {successMsg && <div className="mb-6 p-4 bg-green-50 text-green-600 border border-green-100 rounded-xl font-medium text-sm text-center">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input: Username */}
          <div>
            <label className="block text-slate-700 text-sm font-bold mb-2">Tên đăng nhập</label>
            <input 
              type="text" 
              name="userName"
              required
              value={formData.userName}
              onChange={handleInputChange}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" 
              placeholder="Nhập tên đăng nhập..."
            />
          </div>
          
          {/* Input: Password */}
          <div>
            <label className="block text-slate-700 text-sm font-bold mb-2">Mật khẩu</label>
            <input 
              type="password" 
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" 
              placeholder="••••••••"
            />
          </div>

          {/* Input: Role (Chỉ hiện khi Đăng ký) */}
          {!isLoginView && (
            <div>
              <label className="block text-slate-700 text-sm font-bold mb-2">Loại tài khoản</label>
              <select 
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="USER">Thực khách (Mua hàng)</option>
                <option value="ADMIN">Quản lý (Bán hàng)</option>
              </select>
            </div>
          )}

          {/* Khu vực Nút bấm */}
          <div className="flex flex-col gap-3 mt-8">
            {/* Nút Submit Chính */}
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full text-white font-bold py-3.5 rounded-xl shadow-lg transition-all transform
                ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5'}`}
            >
              {loading ? 'Đang xử lý...' : (isLoginView ? 'Đăng Nhập' : 'Tạo Tài Khoản')}
            </button>

            {/* Nút Phụ: Chuyển đổi Đăng nhập / Đăng ký */}
            <button 
              type="button"
              onClick={() => {
                setIsLoginView(!isLoginView);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="w-full bg-white text-blue-600 font-bold py-3.5 rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              {isLoginView ? 'Đăng Ký Tài Khoản Mới' : 'Quay Lại Đăng Nhập'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}