import { Link, Outlet, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/users', name: '👥 Quản lý Users' },
    { path: '/admin/foods', name: '🍔 Quản lý Thực đơn' }, // Chuẩn bị cho các chức năng sau
    { path: '/admin/orders', name: '📦 Quản lý Đơn hàng' },
  ];

  return (
    <div className="flex flex-1 w-full bg-slate-100 overflow-hidden">
      {/* Sidebar bên trái */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col shadow-xl flex-shrink-0">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-black text-cyan-400 tracking-wider uppercase">Admin Panel</h2>
          <p className="text-slate-400 text-sm mt-1">Hệ thống quản trị</p>
        </div>
        
        <nav className="flex-1 py-4">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`block px-4 py-3 rounded-xl font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Khu vực Content bên phải */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Nơi render các component con (như AdminUsers) */}
        <Outlet /> 
      </main>
    </div>
  );
}