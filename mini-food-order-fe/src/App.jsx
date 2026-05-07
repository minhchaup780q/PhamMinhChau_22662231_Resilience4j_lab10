import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Cart from './pages/Cart'
import AdminLayout from './pages/admin/AdminLayout' // Import Layout Admin
import AdminUsers from './pages/admin/AdminUsers'   // Import Trang quản lý Users
import Orders from './pages/Order'

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Component bảo vệ Route Admin
  const ProtectedAdminRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== 'ADMIN') {
      alert('Bạn không có quyền truy cập trang này!');
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />
      
      {/* Container chính flex-grow để đẩy footer (nếu có) xuống dưới */}
      <main className="flex-grow flex flex-col w-full">
        <Routes>
          {/* Các Route Public & User bình thường */}
          <Route path="/" element={
            <div className="container mx-auto px-4 py-8"><Home /></div>
          } />
          <Route path="/login" element={
            <div className="container mx-auto px-4 py-8"><Login onLoginSuccess={handleLoginSuccess} /></div>
          } />
          <Route path="/cart" element={
            <div className="container mx-auto px-4 py-8"><Cart /></div>
          } />
            <Route path="/orders" element={<Orders />} />


          {/* Nhóm Route dành riêng cho Admin */}
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }>
            {/* Tự động redirect /admin sang /admin/users */}
            <Route index element={<Navigate to="users" replace />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </main>
    </div>
  )
}

export default App