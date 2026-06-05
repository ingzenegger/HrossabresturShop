import { useQuery } from '@tanstack/react-query';
import { useAppStore } from '@/shared/store/appStore';
import { getCartTotals } from '../api/cartApi';

export function useCartTotals() {
  const customerId = useAppStore((state) => state.customerId);
  const cartId = useAppStore((state) => state.cartId);

  return useQuery({
    queryKey: ['cartTotals', customerId],
    queryFn: () => getCartTotals(customerId!),
    enabled: !!customerId && !!cartId,
  });
}