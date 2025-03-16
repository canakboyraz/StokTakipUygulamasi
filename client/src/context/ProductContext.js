import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Initial state
const initialState = {
  products: [],
  categories: [],
  stockOutHistory: [],
  loading: true,
  error: null
};

// Create context
export const ProductContext = createContext(initialState);

// Reducer
const productReducer = (state, action) => {
  switch (action.type) {
    case 'GET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
        loading: false
      };
    case 'GET_CATEGORIES':
      return {
        ...state,
        categories: action.payload
      };
    case 'GET_STOCK_OUT_HISTORY':
      return {
        ...state,
        stockOutHistory: action.payload
      };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [action.payload, ...state.products]
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload]
      };
    case 'ADD_STOCK_OUT_HISTORY':
      return {
        ...state,
        stockOutHistory: [action.payload, ...state.stockOutHistory]
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product => 
          product._id === action.payload._id ? action.payload : product
        )
      };
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product._id !== action.payload)
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category._id !== action.payload)
      };
    case 'PRODUCT_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

// Provider component
export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Get all products
  const getProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      dispatch({
        type: 'GET_PRODUCTS',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'PRODUCT_ERROR',
        payload: err.response?.data?.msg || 'Error fetching products'
      });
    }
  };

  // Get all categories
  const getCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      dispatch({
        type: 'GET_CATEGORIES',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'PRODUCT_ERROR',
        payload: err.response?.data?.msg || 'Error fetching categories'
      });
    }
  };

  // Get all stock out history
  const getStockOutHistory = async () => {
    try {
      const res = await axios.get('/api/stock-out-history');
      dispatch({
        type: 'GET_STOCK_OUT_HISTORY',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'PRODUCT_ERROR',
        payload: err.response?.data?.msg || 'Error fetching stock out history'
      });
    }
  };

  // Get stock out history by date
  const getStockOutHistoryByDate = async (date) => {
    try {
      const res = await axios.get(`/api/stock-out-history/date/${date}`);
      dispatch({
        type: 'GET_STOCK_OUT_HISTORY',
        payload: res.data
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'PRODUCT_ERROR',
        payload: err.response?.data?.msg || 'Error fetching stock out history'
      });
      throw err;
    }
  };

  // Get stock out history by date range
  const getStockOutHistoryByDateRange = async (startDate, endDate) => {
    try {
      const res = await axios.get(`/api/stock-out-history/range?startDate=${startDate}&endDate=${endDate}`);
      dispatch({
        type: 'GET_STOCK_OUT_HISTORY',
        payload: res.data
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'PRODUCT_ERROR',
        payload: err.response?.data?.msg || 'Error fetching stock out history'
      });
      throw err;
    }
  };

  // Add product
  const addProduct = async (product) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/products', product, config);
      dispatch({
        type: 'ADD_PRODUCT',
        payload: res.data
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'PRODUCT_ERROR',
        payload: err.response?.data?.msg || 'Error adding product'
      });
      throw err;
    }
  };

  // Add category
  const addCategory = async (category) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/categories', category, config);
      dispatch({
        type: 'ADD_CATEGORY',
        payload: res.data
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'PRODUCT_ERROR',
        payload: err.response?.data?.msg || 'Error adding category'
      });
      throw err;
    }
  };

  // Create stock out history
  const createStockOutHistory = async (items) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/stock-out-history', { items }, config);
      dispatch({
        type: 'ADD_STOCK_OUT_HISTORY',
        payload: res.data
      });
      
      // Update products in state
      getProducts();
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'PRODUCT_ERROR',
        payload: err.response?.data?.msg || 'Error creating stock out history'
      });
      throw err;
    }
  };

  // Update product
  const updateProduct = async (id, product) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(`/api/products/${id}`, product, config);
      dispatch({
        type: 'UPDATE_PRODUCT',
        payload: res.data
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'PRODUCT_ERROR',
        payload: err.response?.data?.msg || 'Error updating product'
      });
      throw err;
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      dispatch({
        type: 'DELETE_PRODUCT',
        payload: id
      });
    } catch (err) {
      dispatch({
        type: 'PRODUCT_ERROR',
        payload: err.response?.data?.msg || 'Error deleting product'
      });
      throw err;
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`/api/categories/${id}`);
      dispatch({
        type: 'DELETE_CATEGORY',
        payload: id
      });
    } catch (err) {
      dispatch({
        type: 'PRODUCT_ERROR',
        payload: err.response?.data?.msg || 'Error deleting category'
      });
      throw err;
    }
  };

  // Update product quantity (stock out)
  const updateQuantity = async (id, quantity, callback) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.patch(`/api/products/${id}/quantity`, { quantity }, config);
      dispatch({
        type: 'UPDATE_PRODUCT',
        payload: res.data
      });
      
      if (callback && typeof callback === 'function') {
        callback(res.data);
      }
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'PRODUCT_ERROR',
        payload: err.response?.data?.msg || 'Error updating quantity'
      });
      throw err;
    }
  };

  // Load products and categories when component mounts
  useEffect(() => {
    getProducts();
    getCategories();
    getStockOutHistory();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products: state.products,
        categories: state.categories,
        stockOutHistory: state.stockOutHistory,
        loading: state.loading,
        error: state.error,
        getProducts,
        getCategories,
        getStockOutHistory,
        getStockOutHistoryByDate,
        getStockOutHistoryByDateRange,
        addProduct,
        addCategory,
        createStockOutHistory,
        updateProduct,
        deleteProduct,
        deleteCategory,
        updateQuantity
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}; 