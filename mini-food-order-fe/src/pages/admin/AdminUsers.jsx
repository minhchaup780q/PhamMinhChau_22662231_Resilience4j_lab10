import { useState, useEffect } from 'react';
import { UserAPI } from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await UserAPI.getAllUsers();
      // Giả sử API trả về mảng trực tiếp hoặc nằm trong response.data
      setUsers(Array.isArray(response.data) ? response.data : []); 
    } catch (err) {
      console.error("Lỗi lấy danh sách user:", err);
      setError('Không thể tải danh sách người dùng. Vui lòng kiểm tra lại kết nối.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
      <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Danh Sách Người Dùng</h1>
          <p className="text-slate-500 mt-1 text-sm">Quản lý toàn bộ tài khoản trong hệ thống</p>
        </div>
        <button 
          onClick={fetchUsers}
          className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <span>🔄</span> Làm mới
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 text-slate-500 font-medium">
          Chưa có người dùng nào trong hệ thống.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-bold">ID</th>
                <th className="p-4 font-bold">Tên đăng nhập</th>
                <th className="p-4 font-bold">Vai trò (Role)</th>
                <th className="p-4 font-bold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-700">#{user.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-sm uppercase">
                        {user.userName?.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-800">{user.userName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold
                      ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}
                    `}>
                      {user.role || 'USER'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="text-slate-400 hover:text-red-500 transition-colors px-2 py-1" title="Xóa tài khoản (Chưa khả dụng)">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}