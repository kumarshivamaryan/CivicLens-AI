import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  // 1. LocalStorage se user ka data uthao
  const user = JSON.parse(localStorage.getItem('user')); 

  // 2. Agar user nahi hai ya uska role admin nahi hai, toh use Home page par fek do
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 3. Agar sab sahi hai, toh Admin Page dikhao (children)
  return children;
};

export default AdminRoute;