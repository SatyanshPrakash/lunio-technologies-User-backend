import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { closeCart, removeFromCart, updateQuantity } from '../../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

export const CartDrawer = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, isOpen } = useAppSelector((state) => state.cart);

  const handleClose = () => {
    dispatch(closeCart());
  };

  const handleRemove = (id: number, selectedAttributes?: any) => {
    dispatch(removeFromCart({ id, selectedAttributes }));
  };

  const handleUpdateQuantity = (id: number, quantity: number, selectedAttributes?: any) => {
    dispatch(updateQuantity({ id, quantity, selectedAttributes }));
  };

  const handleCheckout = () => {
    handleClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Shopping Cart ({totalItems})
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-24 h-24 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Add some products to get started
                </p>
                <button
                  onClick={() => {
                    handleClose();
                    navigate('/products');
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${JSON.stringify(item.selectedAttributes)}`}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=200';
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate mb-1">
                        {item.name}
                      </h3>

                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.selectedAttributes?.color && (
                          <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                            {item.selectedAttributes.color}
                          </span>
                        )}
                        {item.selectedAttributes?.size && (
                          <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200">
                            {item.selectedAttributes.size}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.selectedAttributes)}
                            disabled={item.quantity <= 1}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.selectedAttributes)}
                            disabled={item.quantity >= item.maxQuantity}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                            </div>
                            {item.salePrice && (
                              <div className="text-xs text-gray-500 line-through">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => handleRemove(item.id, item.selectedAttributes)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t p-6 bg-gray-50">
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">Calculated at checkout</span>
                </div>
                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => {
                  handleClose();
                  navigate('/products');
                }}
                className="w-full mt-3 py-3 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors border border-gray-300"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};