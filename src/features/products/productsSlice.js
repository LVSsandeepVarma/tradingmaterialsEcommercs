import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {},
  status: 'idle',
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchAllProducts: (state,action) => {

      state.value = action.payload 
    },

    updatingProducts : (state, action) =>{
      const filteredProducts = state.value?.products?.products?.filter((product) =>{
        action.payload?.subIds?.includes(product?.subcat_id)
      })
      
      return filteredProducts
    }
  },


});

export const { fetchAllProducts, updatingProducts } = productsSlice.actions;


export const products = (state) => state.products.value;

export const filteredProductsByIds = (state , ids) => {
  
  const filteredObject = Object.values(state?.products)?.filter( product => ids?.includes(product?.subcat_id))

  return filteredObject

}


export default productsSlice.reducer;
