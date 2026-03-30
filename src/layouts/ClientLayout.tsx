import { Outlet, Link } from 'react-router-dom';
import pop9Logo from '@/assets/pop9-logo.png';

const ClientLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <header className="w-full py-5 px-4 flex items-center justify-center">
        <Link to="/cliente" className="inline-flex items-center gap-3">
          <img src={pop9Logo} alt="POP9" className="w-10 h-10 rounded-xl object-contain" />
          <span className="text-sm font-semibold text-foreground">Área do Cliente</span>
        </Link>
      </header>

      <main className="pb-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;
