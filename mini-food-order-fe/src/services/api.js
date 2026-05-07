import axios from 'axios';
import { API_URLS } from './config';

// Hàm helper để tự động gắn Token vào tất cả các request
const addAuthInterceptor = (client) => {
  client.interceptors.request.use(
    (config) => {
      // Lấy thông tin user từ localStorage
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        
        // CHÚ Ý: Đổi 'user.token' thành đúng tên trường chứa token mà Backend trả về lúc login nhé
        // Ví dụ có team để là user.accessToken, user.jwt...
        const token = user.token || user.accessToken; 
        
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return client;
};

// ==========================================
// 1. USER SERVICE (Port 8081)
// ==========================================
const userClient = axios.create({ baseURL: API_URLS.USER });
addAuthInterceptor(userClient); // Gắn bảo vệ vào User Client

export const UserAPI = {
  // API không cần token
  register: (data) => userClient.post('/register', data),
  login: (data) => userClient.post('/login', data),
  
  // API CẦN TOKEN
  getAllUsers: () => userClient.get('/users'),
};

// ==========================================
// 2. FOOD SERVICE (Port 8082)
// ==========================================
const foodClient = axios.create({ baseURL: API_URLS.FOOD });
addAuthInterceptor(foodClient); // Gắn bảo vệ vào Food Client

export const FoodAPI = {
  // GET thường không cần token, nhưng các thao tác thêm/sửa/xóa thì cần
  getAllFoods: () => foodClient.get('/foods'),
  createFood: (data) => foodClient.post('/foods', data),
  updateFood: (id, data) => foodClient.put(`/foods/${id}`, data),
  deleteFood: (id) => foodClient.delete(`/foods/${id}`),
};

// ==========================================
// 3. ORDER SERVICE (Port 8083)
// ==========================================
const orderClient = axios.create({ baseURL: API_URLS.ORDER });
addAuthInterceptor(orderClient); // Gắn bảo vệ vào Order Client

export const OrderAPI = {
  createOrder: (data) => orderClient.post('/orders', data),
  getAllOrders: () => orderClient.get('/orders'),
  
  // MỚI THÊM: Get order theo user
  // (Tùy Backend của bạn thiết kế URL như thế nào, nếu xài query param thì đổi thành `/orders?userId=${userId}`)
  getOrdersByUser: (userId) => orderClient.get(`/orders/user/${userId}`),
};

// ==========================================
// 4. PAYMENT SERVICE (Port 8084)
// ==========================================
const paymentClient = axios.create({ baseURL: API_URLS.PAYMENT });
addAuthInterceptor(paymentClient); // Gắn bảo vệ vào Payment Client

export const PaymentAPI = {
  processPayment: (data) => paymentClient.post('/payments', data),
};