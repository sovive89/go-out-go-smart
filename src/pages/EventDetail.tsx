import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { events, menuItems } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ShoppingCart, 
  MapPin, 
  Calendar, 
  Clock,
  Plus,
  Minus,
  CreditCard,
  Smartphone,
  QrCode,
  Wallet,
  Ticket
} from 'lucide-react';
import { CartItem, PurchasedItem } from '@/types';
import { toast } from 'sonner';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart, hasEventAccess, setHasEventAccess, setCurrentEvent, addPurchasedItems, clearCart } = useApp();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentType, setPaymentType] = useState<'ticket' | 'bar'>('ticket');
  const [courtesyCode, setCourtesyCode] = useState('');

  const event = events.find(e => e.id === id);
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Evento não encontrado</p>
      </div>
    );
  }

  const handleBuyTicket = () => {
    setPaymentType('ticket');
    setShowPayment(true);
  };

  const handleCourtesyCode = () => {
    if (courtesyCode.toLowerCase() === 'vip2024') {
      setHasEventAccess(true);
      setCurrentEvent(event);
      toast.success('Código de cortesia aplicado!');
      setCourtesyCode('');
    } else {
      toast.error('Código inválido');
    }
  };

  const handlePayment = (method: string) => {
    if (paymentType === 'ticket') {
      setHasEventAccess(true);
      setCurrentEvent(event);
      toast.success(`Ingresso comprado via ${method}!`);
    } else {
      const purchasedItems: PurchasedItem[] = cart.map(item => ({
        ...item,
        purchaseId: `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        purchasedAt: new Date().toISOString(),
        used: false,
      }));
      addPurchasedItems(purchasedItems);
      clearCart();
      toast.success(`Compra realizada via ${method}!`);
      navigate('/sacola');
    }
    setShowPayment(false);
  };

  const handleAddToCart = (item: typeof menuItems[0]) => {
    addToCart({ ...item, quantity: 1 });
    toast.success(`${item.name} adicionado ao carrinho`);
  };

  const handleFinishPurchase = () => {
    if (cart.length === 0) return;
    setPaymentType('bar');
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header Image */}
      <div className="relative h-64 sm:h-80">
        <img 
          src={event.image} 
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Navigation */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <Button 
            variant="glass" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Button 
            variant="glass" 
            size="icon"
            onClick={() => navigate('/sacola')}
            className="relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-semibold">
                {cartItemsCount}
              </span>
            )}
          </Button>
        </div>

        {/* Event Info Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">{event.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-primary" />
              {event.location}
            </span>
            {event.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-primary" />
                {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        <p className="text-muted-foreground mb-6">{event.description}</p>

        {/* Ticket Section */}
        {!hasEventAccess && event.type === 'event' && (
          <div className="glass rounded-2xl p-6 mb-8 animate-slide-up">
            <h2 className="text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-primary" />
              Ingresso
            </h2>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">Entrada</span>
              <span className="text-2xl font-bold text-primary">R$ {event.price.toFixed(2)}</span>
            </div>

            <Button variant="gold" size="full" onClick={handleBuyTicket} className="mb-4">
              Comprar Ingresso
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-4 text-muted-foreground">ou</span>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Código de cortesia"
                value={courtesyCode}
                onChange={(e) => setCourtesyCode(e.target.value)}
                className="flex-1 h-12 px-4 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button variant="outline" onClick={handleCourtesyCode}>
                Aplicar
              </Button>
            </div>
          </div>
        )}

        {/* Access Granted Badge */}
        {hasEventAccess && (
          <div className="glass rounded-2xl p-4 mb-8 border-primary/50 bg-primary/10 animate-scale-in">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Ticket className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Acesso Liberado</p>
                <p className="text-sm text-muted-foreground">Você tem acesso ao bar deste evento</p>
              </div>
            </div>
          </div>
        )}

        {/* Bar Menu */}
        {(hasEventAccess || event.type === 'establishment') && (
          <section>
            <h2 className="text-2xl font-display font-semibold text-foreground mb-4">Cardápio do Bar</h2>
            
            <div className="grid gap-4">
              {menuItems.map((item, index) => (
                <div
                  key={item.id}
                  className="glass rounded-2xl overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <span className="text-xs text-primary uppercase tracking-wide">{item.category}</span>
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-primary">R$ {item.price.toFixed(2)}</span>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                          className="h-8 px-3"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Bottom Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 glass border-t border-border/30 animate-slide-up">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{cartItemsCount} itens</p>
              <p className="text-xl font-bold text-foreground">R$ {cartTotal.toFixed(2)}</p>
            </div>
            <Button variant="gold" onClick={handleFinishPurchase}>
              Finalizar Compra
            </Button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
          <div className="w-full max-w-md glass rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up">
            <h2 className="text-xl font-display font-semibold text-foreground mb-2">
              {paymentType === 'ticket' ? 'Comprar Ingresso' : 'Finalizar Compra'}
            </h2>
            <p className="text-muted-foreground mb-6">
              Total: <span className="text-primary font-bold">
                R$ {paymentType === 'ticket' ? event.price.toFixed(2) : cartTotal.toFixed(2)}
              </span>
            </p>

            <div className="space-y-3">
              <Button variant="social" size="full" onClick={() => handlePayment('Apple Pay')}>
                <Apple className="w-5 h-5 mr-2" /> Apple Pay
              </Button>
              <Button variant="social" size="full" onClick={() => handlePayment('Google Pay')}>
                <Smartphone className="w-5 h-5 mr-2" /> Google Pay
              </Button>
              <Button variant="social" size="full" onClick={() => handlePayment('Cartão')}>
                <CreditCard className="w-5 h-5 mr-2" /> Cartão Cadastrado
              </Button>
              <Button variant="social" size="full" onClick={() => handlePayment('PIX')}>
                <QrCode className="w-5 h-5 mr-2" /> PIX
              </Button>
              <Button variant="social" size="full" onClick={() => handlePayment('Carteira')}>
                <Wallet className="w-5 h-5 mr-2" /> Crédito na Carteira
              </Button>
            </div>

            <Button 
              variant="ghost" 
              size="full" 
              className="mt-4"
              onClick={() => setShowPayment(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Apple icon component
const Apple = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

export default EventDetail;
