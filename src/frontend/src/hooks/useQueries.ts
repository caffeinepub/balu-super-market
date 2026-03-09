import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product } from "../backend.d";
import { SAMPLE_PRODUCTS } from "../data/products";
import { useActor } from "./useActor";

const LOCAL_PRODUCTS_KEY = "balu_products_v3";

// Persist products to localStorage
function saveProductsLocally(products: Product[]): void {
  try {
    // Convert BigInt to string for JSON serialization
    const serializable = products.map((p) => ({
      ...p,
      id: p.id.toString(),
      price: p.price.toString(),
    }));
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(serializable));
  } catch {
    // localStorage unavailable
  }
}

// Load products from localStorage
function loadProductsLocally(): Product[] | null {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Array<{
      id: string;
      name: string;
      category: string;
      price: string;
      description: string;
      available: boolean;
    }>;
    return parsed.map((p) => ({
      ...p,
      id: BigInt(p.id),
      price: BigInt(p.price),
    }));
  } catch {
    return null;
  }
}

export function useInit() {
  // No-op: products are seeded locally on first load
  return { data: true, isLoading: false };
}

export function useProducts() {
  const { actor } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      // First check localStorage for persisted products
      const localData = loadProductsLocally();

      if (localData && localData.length > 0) {
        // We have local data -- try to sync from backend if available
        if (actor) {
          try {
            const backendProducts = await actor.getProducts();
            if (backendProducts && backendProducts.length > 0) {
              // Only use backend data if it has MORE or EQUAL products than local.
              // If local has more, user added products locally -- keep local data.
              if (backendProducts.length >= localData.length) {
                saveProductsLocally(backendProducts);
                return backendProducts;
              }
            }
          } catch {
            // Backend unavailable, use local data
          }
        }
        return localData;
      }

      // No local data -- seed from SAMPLE_PRODUCTS and save locally
      const seedData = SAMPLE_PRODUCTS as Product[];
      saveProductsLocally(seedData);
      return seedData;
    },
    placeholderData: loadProductsLocally() ?? (SAMPLE_PRODUCTS as Product[]),
    enabled: true,
    staleTime: 0,
  });
}

export function useProductsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "All") return actor.getProducts();
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateProductPrice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, newPrice }: { id: bigint; newPrice: bigint }) => {
      if (actor) {
        try {
          await actor.updateProductPrice(id, newPrice);
        } catch {
          // Backend call failed (e.g. auth), but we still persist locally
        }
      }
    },
    onMutate: async ({ id, newPrice }) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previous = queryClient.getQueryData<Product[]>(["products"]);
      const current = previous ?? (SAMPLE_PRODUCTS as Product[]);
      const updated = current.map((p) =>
        p.id === id ? { ...p, price: newPrice } : p,
      );
      saveProductsLocally(updated);
      queryClient.setQueryData(["products"], updated);
      return { previous };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        saveProductsLocally(context.previous);
        queryClient.setQueryData(["products"], context.previous);
      }
    },
  });
}

export function useToggleProductAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (actor) {
        try {
          await actor.toggleProductAvailability(id);
        } catch {
          // Backend call failed, still persist locally
        }
      }
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previous = queryClient.getQueryData<Product[]>(["products"]);
      const current = previous ?? (SAMPLE_PRODUCTS as Product[]);
      const updated = current.map((p) =>
        p.id === id ? { ...p, available: !p.available } : p,
      );
      saveProductsLocally(updated);
      queryClient.setQueryData(["products"], updated);
      return { previous };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        saveProductsLocally(context.previous);
        queryClient.setQueryData(["products"], context.previous);
      }
    },
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      name: string;
      category: string;
      price: bigint;
      description: string;
    }) => {
      if (actor) {
        try {
          await actor.addProduct(
            params.id,
            params.name,
            params.category,
            params.price,
            params.description,
          );
        } catch {
          // Backend call failed, still persist locally
        }
      }
    },
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previous = queryClient.getQueryData<Product[]>(["products"]);
      const current = previous ?? (SAMPLE_PRODUCTS as Product[]);
      const newProduct: Product = {
        id: params.id,
        name: params.name,
        category: params.category,
        price: params.price,
        description: params.description,
        available: true,
      };
      const updated = [...current, newProduct];
      saveProductsLocally(updated);
      queryClient.setQueryData(["products"], updated);
      return { previous };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        saveProductsLocally(context.previous);
        queryClient.setQueryData(["products"], context.previous);
      }
    },
  });
}

export function useRemoveProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (actor) {
        try {
          await actor.removeProduct(id);
        } catch {
          // Backend call failed, still persist locally
        }
      }
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previous = queryClient.getQueryData<Product[]>(["products"]);
      const current = previous ?? (SAMPLE_PRODUCTS as Product[]);
      const updated = current.filter((p) => p.id !== id);
      saveProductsLocally(updated);
      queryClient.setQueryData(["products"], updated);
      return { previous };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        saveProductsLocally(context.previous);
        queryClient.setQueryData(["products"], context.previous);
      }
    },
  });
}
