// ============================================
// IMPORTACIONES
// ============================================

// 'create' es la función principal de Zustand para crear un store (almacén de estado global)
import { create } from "zustand"; 

// Estado inicial del store (importado desde otro archivo)
import { productsInitialState } from "../../constants/initialState";

// 'persist' es un middleware que permite guardar el estado en localStorage automáticamente
// 'createJSONStorage' configura cómo se guardará el estado (en formato JSON)
import { persist, createJSONStorage } from "zustand/middleware";

// ============================================
// CREACIÓN DEL STORE
// ============================================

/**
 * useStore es un hook personalizado que contiene todo el estado global de la aplicación
 * 
 * Estructura:
 * - create(): crea el store de Zustand
 * - persist(): middleware que persiste el estado en localStorage
 * 
 * Este store maneja:
 * - Lista de productos disponibles
 * - Carrito de compras
 * - Precio total del carrito
 * - Funciones para manipular el carrito
 */
export const useStore = create(
  persist(
    // Esta función recibe 'set' como parámetro
    // 'set' es una función de Zustand que se usa para actualizar el estado
    (set) => ({
      
      // ============================================
      // ESTADO INICIAL
      // ============================================
      
      /**
       * products: Array con todos los productos disponibles en la tienda
       * Este array contiene objetos con: id, name, price
       */
      products: [
        {
          "id": 1,
          "name": "product 1",
          "price": 50
        },
        {
          "id": 2,
          "name": "product 2",
          "price": 30
        },
        {
          "id": 3,
          "name": "product 3",
          "price": 40
        },
        {
          "id": 4,
          "name": "product 4",
          "price": 78
        },
        {
          "id": 5,
          "name": "product 5",
          "price": 90
        },
        {
          "id": 6,
          "name": "product 6",
          "price": 60
        }
      ],
      
      /**
       * cart: Array que contiene los productos agregados al carrito
       * Inicia vacío []
       */
      cart: [],
      
      /**
       * totalPriceShoppingCart: Número que representa el precio total del carrito
       * Inicia en 0
       */
      totalPriceShoppingCart: 0,

      // ============================================
      // ACCIONES (FUNCIONES QUE MODIFICAN EL ESTADO)
      // ============================================

      /**
       * addToCart - Agrega un producto al carrito
       * 
       * @param {number} id - El ID del producto a agregar
       * 
       * Funcionamiento:
       * 1. Recibe el ID del producto
       * 2. Busca el producto en el array 'products'
       * 3. Agrega ese producto al array 'cart'
       */
      addToCart: (id) => {
        // set() recibe una función que tiene acceso al estado actual (state)
        set((state) => {
          // Buscamos el producto que coincida con el ID recibido
          let newProduct = state.products.find((product) => product.id === id);
          
          // Retornamos el nuevo estado
          return {
            ...state, // Mantenemos todo el estado anterior (spread operator)
            cart: [...state.cart, newProduct] // Agregamos el nuevo producto al carrito
            // Usamos spread operator para crear un NUEVO array (inmutabilidad)
          }
        })
      }, 

      /**
       * deleteFromCart - Elimina un producto del carrito
       * 
       * @param {number} id - El ID del producto a eliminar
       * 
       * Funcionamiento:
       * 1. Filtra el array 'cart'
       * 2. Mantiene solo los productos cuyo ID NO coincida con el recibido
       */
      deleteFromCart: (id) => {
        set((state) => {
          return {
            ...state, // Mantenemos el resto del estado
            // filter() crea un NUEVO array solo con productos que NO tienen el ID especificado
            cart: state.cart.filter((product) => product.id !== id)
          }
        })
      },

      /**
       * clearCart - Vacía completamente el carrito
       * 
       * Funcionamiento:
       * Resetea el estado al estado inicial importado (productsInitialState)
       * Esto vacía el carrito y resetea el precio total
       */
      clearCart: () => {
        // No necesitamos el estado actual, solo establecemos el estado inicial
        set(() => productsInitialState)
      },

      /**
       * calculateTotalPriceOfCart - Calcula el precio total de todos los productos en el carrito
       * 
       * Funcionamiento:
       * 1. Usa reduce() para sumar todos los precios del carrito
       * 2. Actualiza 'totalPriceShoppingCart' con el resultado
       */
      calculateTotalPriceOfCart: () => {
        set((state) => {
          // reduce() suma todos los precios:
          // - previousValue: acumulador (empieza en 0)
          // - product: cada producto del carrito
          // - 0: valor inicial del acumulador
          let totalPrice = state.cart.reduce(
            (previousValue, product) => previousValue + product.price, 
            0
          );
          
          return {
            ...state, // Mantenemos el resto del estado
            totalPriceShoppingCart: totalPrice // Actualizamos el total
          }
        })
      }
    }),
    
    // ============================================
    // CONFIGURACIÓN DE PERSISTENCIA
    // ============================================
    
    /**
     * Segundo parámetro de persist(): configuración de persistencia
     */
    {
      /**
       * name: Nombre de la clave en localStorage donde se guardará el estado
       * En este caso, se guardará como "carrito-compras" en localStorage
       */
      name: "carrito-compras",
      
      /**
       * storage: Especifica DÓNDE guardar el estado
       * createJSONStorage(() => localStorage) indica que:
       * - Se guardará en localStorage del navegador
       * - Se guardará en formato JSON (stringify/parse automático)
       * 
       * Alternativas: sessionStorage, AsyncStorage (React Native), etc.
       */
      storage: createJSONStorage(() => localStorage)
    }
  )
)

// ============================================
// CÓMO USAR ESTE STORE EN TUS COMPONENTES
// ============================================

/**
 * Ejemplo de uso en un componente:
 * 
 * import { useStore } from './ruta/al/store';
 * 
 * function ProductCard({ productId }) {
 *   // Extraemos solo lo que necesitamos del store
 *   const addToCart = useStore((state) => state.addToCart);
 *   const products = useStore((state) => state.products);
 *   
 *   return (
 *     <button onClick={() => addToCart(productId)}>
 *       Agregar al carrito
 *     </button>
 *   );
 * }
 * 
 * function Cart() {
 *   const cart = useStore((state) => state.cart);
 *   const totalPrice = useStore((state) => state.totalPriceShoppingCart);
 *   const calculateTotal = useStore((state) => state.calculateTotalPriceOfCart);
 *   const clearCart = useStore((state) => state.clearCart);
 *   
 *   return (
 *     <div>
 *       {cart.map(product => <div key={product.id}>{product.name}</div>)}
 *       <p>Total: ${totalPrice}</p>
 *       <button onClick={calculateTotal}>Calcular Total</button>
 *       <button onClick={clearCart}>Vaciar Carrito</button>
 *     </div>
 *   );
 * }
 */