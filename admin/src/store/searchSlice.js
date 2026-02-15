import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  keyword: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchKeyword: (state, action) => {
      state.keyword = action.payload;
    },
    clearSearch: (state) => {
      state.keyword = '';
    },
  },
});

export const { setSearchKeyword, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
