import React, { useState, useEffect, useMemo } from 'react';
import { fetchProducts, fetchCategories, createTransaction } from '../api';
import { useSettings } from '../contexts/SettingsContext';
import { Search, ShoppingCart, Plus, Minus, X, CreditCard, Banknote, Package } from 'lucide-react';

const POS = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { formatCurrency } = useSettings();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetchProducts({ limit: 100 }),
          fetchCategories()
        ]);
        if (productsRes.data.success) {
          setProducts(productsRes.data.data.filter(p => p.quantity > 0));
        }
        if (categoriesRes.data.success) {
          setCategories(categoriesRes.data.data);
        }
      } catch (error) {
        console.error('Failed to load products for POS:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const searchMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = selectedCategory ? (p.category?._id === selectedCategory || p.category === selectedCategory) : true;
      return searchMatch && categoryMatch;
    });
  }, [products, searchTerm, selectedCategory]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product === product._id);
      if (existing) {
        if (existing.quantity >= product.quantity) return prev; // Cannot exceed stock
        return prev.map(item => 
          item.product === product._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        product: product._id,
        name: product.name,
        sku: product.sku,
        priceAtSale: product.price,
        quantity: 1,
        maxStock: product.quantity,
        image: product.image,
        color: product.category?.color || '#334155'
      }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.product === productId) {
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return item;
        if (newQuantity > item.maxStock) return item;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product !== productId));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.priceAtSale * item.quantity), 0);
  }, [cart]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    try {
      const payload = {
        items: cart.map(item => ({
          product: item.product,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          priceAtSale: item.priceAtSale
        })),
        paymentMethod,
        customerName: 'Walk-in Customer'
      };

      const response = await createTransaction(payload);
      if (response.data.success) {
        alert('Checkout successful!');
        setCart([]); // Clear cart
        // Update local stock silently
        setProducts(prev => prev.map(p => {
          const cartItem = cart.find(c => c.product === p._id);
          if (cartItem) {
            return { ...p, quantity: p.quantity - cartItem.quantity };
          }
          return p;
        }).filter(p => p.quantity > 0));
      }
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Checkout failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[85vh] gap-6">
      
      {/* Left Area: Product Grid */}
      <div className="flex-1 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 mb-1">Point of Sale</h1>
            <p className="text-slate-400">Ring up customers and process sales.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 py-3"
              placeholder="Search products by name or SKU..."
            />
          </div>
          <div className="relative flex items-center bg-[#1e293b] rounded-xl border border-slate-700/50 min-w-[200px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field py-3 bg-transparent border-none focus:ring-0 appearance-none cursor-pointer pl-4 pr-8"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-[400px] bg-[#1e293b] rounded-2xl border border-slate-800/60 p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500">
              No available products found.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredProducts.map(product => {
                const inCart = cart.find(item => item.product === product._id);
                const isMaxed = inCart && inCart.quantity >= product.quantity;

                return (
                  <div 
                    key={product._id}
                    onClick={() => !isMaxed && addToCart(product)}
                    className={`relative bg-slate-800/40 border rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                      isMaxed ? 'opacity-50 cursor-not-allowed border-rose-500/50' : 'border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="aspect-square flex items-center justify-center overflow-hidden bg-slate-900/50" style={{ backgroundColor: product.image ? 'transparent' : (product.category?.color || '#334155') }}>
                      {product.image ? (
                        <img src={`http://localhost:5000${product.image}`} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={40} className="text-white opacity-50" />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-slate-200 line-clamp-1">{product.name}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-indigo-400 font-bold">{formatCurrency(product.price)}</span>
                        <span className="text-xs text-slate-500">{product.quantity} left</span>
                      </div>
                    </div>
                    {inCart && (
                      <div className="absolute top-2 right-2 bg-indigo-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                        {inCart.quantity}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Area: Cart */}
      <div className="w-full lg:w-96 bg-[#1e293b] rounded-2xl border border-slate-800/60 flex flex-col h-[600px] lg:h-auto flex-shrink-0">
        <div className="p-4 border-b border-slate-800/60 bg-slate-900/20 flex items-center gap-2">
          <ShoppingCart className="text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-100">Current Order</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <ShoppingCart size={48} className="mb-4 opacity-20" />
              <p>Cart is empty</p>
              <p className="text-sm">Click products to add them</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product} className="flex items-center gap-3 p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0" style={{ backgroundColor: item.image ? 'transparent' : item.color }}>
                  {item.image ? (
                    <img src={`http://localhost:5000${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={20} className="text-white" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{item.name}</p>
                  <p className="text-xs font-bold text-indigo-400">{formatCurrency(item.priceAtSale)}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => removeFromCart(item.product)} className="text-slate-500 hover:text-rose-400 p-1">
                    <X size={14} />
                  </button>
                  <div className="flex items-center gap-2 bg-slate-900/50 rounded-lg p-1 border border-slate-700/50">
                    <button 
                      onClick={() => updateQuantity(item.product, -1)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold text-slate-200 w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product, 1)}
                      disabled={item.quantity >= item.maxStock}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-800/60 bg-slate-900/20">
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-slate-400 text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 text-sm">
              <span>Tax (0%)</span>
              <span>{formatCurrency(0)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-100 font-bold text-xl pt-3 border-t border-slate-800">
              <span>Total</span>
              <span className="text-emerald-400">{formatCurrency(cartTotal)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button 
              onClick={() => setPaymentMethod('cash')}
              className={`py-3 px-4 rounded-xl flex flex-col items-center gap-1 transition-all border ${
                paymentMethod === 'cash' 
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/10' 
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Banknote size={20} />
              <span className="text-xs font-medium uppercase tracking-wider">Cash</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('card')}
              className={`py-3 px-4 rounded-xl flex flex-col items-center gap-1 transition-all border ${
                paymentMethod === 'card' 
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/10' 
                  : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <CreditCard size={20} />
              <span className="text-xs font-medium uppercase tracking-wider">Card</span>
            </button>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className="w-full btn-primary py-4 text-lg shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            {isProcessing ? 'Processing...' : `Checkout ${formatCurrency(cartTotal)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
