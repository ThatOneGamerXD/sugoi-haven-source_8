import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const KEY = "sugoi-haven-cart-v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) ?? []; } catch { return []; }
  });
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* private mode */ } }, [items]);

  const api = useMemo(() => ({
    items,
    // one listing = one unique physical print, so qty is always 1
    add: listingId => setItems(cur => (cur.includes(listingId) ? cur : [...cur, listingId])),
    remove: listingId => setItems(cur => cur.filter(id => id !== listingId)),
    clear: () => setItems([]),
    has: listingId => items.includes(listingId),
    count: items.length,
  }), [items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
