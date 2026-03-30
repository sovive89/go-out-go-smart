import { Outlet, NavLink } from 'react-router-dom';
import { BarChart3, ChefHat, LayoutDashboard, Settings2, Ticket } from 'lucide-react';

const ManagerLayout = () => {
  const navItems = [
    { to: '/staff', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/staff/sessoes', label: 'Sessões', icon: Ticket },
    { to: '/staff/cozinha', label: 'Cozinha', icon: ChefHat },
    { to: '/staff/relatorios', label: 'Relatórios', icon: BarChart3 },
    { to: '/staff/admin', label: 'Admin', icon: Settings2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-3 py-3 lg:px-6">
        <nav className="glass rounded-2xl border border-border/40 p-2 mb-4 flex flex-wrap gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/staff'}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <Outlet />
      </div>
    </div>
  );
};

export default ManagerLayout;
