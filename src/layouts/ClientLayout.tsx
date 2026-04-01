import { Outlet } from 'react-router-dom';
import { CartProvider } from '@/contexts/CartContext';

const ClientLayout = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Outlet />
      </div>
    </CartProvider>
  );
};

export default ClientLayout;
