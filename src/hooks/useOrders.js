// frontend/src/hooks/useOrders.js

import { useQuery } from '@tanstack/react-query'
import { getOrders, getOrder } from '../services/orders'

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn : getOrders,
  })
}

export const useOrder = (id) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn : () => getOrder(id),
    enabled : !!id,
  })
}