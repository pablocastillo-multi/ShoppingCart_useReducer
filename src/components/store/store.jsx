import { create } from "zustand"; 
import { productsInitialState } from "../../constants/initialState";
import { persist, createJSONStorage } from "zustand/middleware";

export const useStore = create(persist(
    (set) => ({
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
  cart: [],
  totalPriceShoppingCart: 0,

  addToCart: (id) => { //esta funcion se encarga de agregar un producto a la lista de productos en el carrito
    set((state) => { //set es un hook de zustand que nos permite actualizar el estado del store
        let newProduct = state.products.find((product) => product.id === id) //buscamos el producto en el array de productos
        return {
            ...state, //devolvemos el estado actualizado
            cart: [...state.cart, newProduct] //agregamos el producto a la lista de productos en el carrito
        }
    })
  }, 

  deleteFromCart: (id) => { //esta funcion se encarga de eliminar un producto de la lista de productos en el carrito
    set((state) => {
      return {
        ...state,
        cart: state.cart.filter((product) => product.id !== id) //eliminamos el producto de la lista de productos en el carrito
      }
    })
  },

  clearCart : () => { //esta funcion se encarga de eliminar todos los productos de la lista de productos en el carrito
    set(() => productsInitialState)
  },

  calculateTotalPriceOfCart : () => {
    set((state) => {
        let totalPrice = state.cart.reduce((previousValue, product) => previousValue + product.price, 0)
        return {
            ...state,
            totalPriceShoppingCart: totalPrice
        }
    })
  }
}),
  {
    name: "carrito-compras",
    storage: createJSONStorage(() => localStorage)
  }
))