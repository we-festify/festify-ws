import { createSlice } from '@reduxjs/toolkit';
import { ITile } from '@sharedtypes/analog';
import { Layout } from 'react-grid-layout';

export interface CanvasState {
  tiles: ITile[];
  layout: Layout[];
}

const initialState: CanvasState = {
  tiles: [],
  layout: [],
};

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    addTile(state, action) {
      const tile: ITile = action.payload;
      state.tiles.push(tile);
    },
    removeTile(state, action) {
      state.tiles = state.tiles.filter((tile) => tile._id !== action.payload);
    },
    setLayout(state, action) {
      state.layout = action.payload;
    },
  },
});

interface State {
  canvas: CanvasState;
}

export const selectTiles = (state: State) => state.canvas.tiles;
export const selectLayout = (state: State) => state.canvas.layout;
export const selectTileById = (id: string) => (state: State) =>
  state.canvas.tiles.find((tile) => tile._id === id);

export const { addTile, removeTile, setLayout } = canvasSlice.actions;

export default canvasSlice.reducer;
