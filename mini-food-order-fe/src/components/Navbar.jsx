import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout(); // Xóa state tại App.jsx và localStorage
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 shadow-lg sticky top-0 z-50 border-b border-blue-500">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo OceanFood */}
        <Link to="/" className="text-white text-2xl font-extrabold tracking-tighter flex items-center gap-2 group">
          <span className="group-hover:rotate-12 transition-transform">🌊</span> OceanFood
        </Link>

        <div className="flex space-x-8 items-center">
          <Link to="/" className="text-blue-100 font-semibold hover:text-white transition-colors">Thực đơn</Link>
          
          {/* Menu hiển thị dựa trên trạng thái đăng nhập */}
          {user && (
            <>
              <Link to="/cart" className="text-blue-100 font-semibold hover:text-white transition-colors">Giỏ hàng</Link>
              <Link to="/orders" className="text-blue-100 font-semibold hover:text-white transition-colors">Đơn hàng của tôi</Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="text-cyan-300 font-bold hover:underline">Quản trị</Link>
              )}
            </>
          )}

          {user ? (
            <div className="flex items-center gap-6 pl-6 border-l border-blue-400">
              <div className="flex flex-col items-end leading-none">
                <span className="text-white font-black text-sm uppercase">{user.userName}</span>
                {/* Badge hiển thị Role */}
                <span className={`text-[10px] font-black px-2 py-0.5 rounded mt-1 shadow-sm ${
                  user.role === 'ADMIN' ? 'bg-cyan-400 text-blue-900' : 'bg-blue-400 text-white'
                }`}>
                  {user.role}
                </span>
              </div>
              
              <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-blue-800 font-black shadow-inner border-2 border-blue-400 uppercase">
                {user.userName?.charAt(0)}
              </div>

              <button 
                onClick={handleLogoutClick}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold shadow-lg hover:bg-blue-50 transition-all transform hover:-translate-y-0.5">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}