'use client';

import { createContext, useState, useContext } from 'react';

const CartContext = createContext();


export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  
  // Função para adicionar ao carrinho
  const addToCart = (bolo, tipo, precoString) => {
    setCart((prevCart) => {
      // Verifica se o item (mesmo bolo e mesmo tipo) já está no carrinho
      const itemExistente = prevCart.find(
        (item) => item.id === bolo.id && item.tipo === tipo
      );

      if (itemExistente) {
        // Se já existe, apenas aumenta a quantidade
        return prevCart.map((item) =>
          item.id === bolo.id && item.tipo === tipo
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      //adicionar uma unidade do item ao carrinho
      const addOne = prevCart.map((item) =>
        item.id === bolo.id && item.tipo === tipo
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      );

      // Converte o preço de "R$ 15,00" para número para facilitar a soma no final
      const precoNumerico = parseFloat(
        precoString.replace('R$', '').replace(',', '.').trim()
      );

      // Se não existe, adiciona como novo item
      return [
        ...prevCart,
        {
          id: bolo.id,
          nome: bolo.nome,
          tipo: tipo, // 'fatia' ou 'inteiro'
          preco: precoNumerico,
          quantidade: 1,
          imagem: bolo.img,
        },
      ];
    });
  };

  const removeFromCart = (id, tipo) => {
    setCart((prevCart) => 
      prevCart.filter((item) => !(item.id === id && item.tipo === tipo))
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}