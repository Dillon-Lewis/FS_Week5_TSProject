import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const initialState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async () => {
    const response = await axios.get('http://localhost:5000/shopping_cart');
    return response.data;
});


const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: JSON.parse(sessionStorage.getItem('cart')) || [],
    },
    reducers: {
        addItem: (state, action) => {
            const existingItem = state.items.find(item => item.product_id === action.payload.product_id);
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        },
        increaseQuantity: (state, action) => {
            const item = state.items.find(item => item.product_id === action.payload);
            if (item) {
                item.quantity += 1;
            }
        },
        decreaseQuantity: (state, action) => {
            const itemIndex = state.items.findIndex(item => item.product_id === action.payload);
            if (itemIndex !== -1) {
                if (state.items[itemIndex].quantity > 1) {
                    state.items[itemIndex].quantity -= 1;
                } else {
                    state.items.splice(itemIndex, 1); 
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
    }
});

export const { addItem, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
