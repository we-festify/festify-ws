import { ITile } from '@analog-ui/types/canvas';
import { createSlice } from '@reduxjs/toolkit';
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
      state.tiles.push(action.payload);
    },
    removeTile(state, action) {
      state.tiles = state.tiles.filter((tile) => tile._id !== action.payload);
    },
    setLayout(state, action) {
      state.layout = action.payload;
    },
    updateTile(state, action) {
      const tile = (state.tiles as ITile[]).find(
        (tile) => tile._id === action.payload._id,
      );
      if (tile) {
        Object.assign(tile, action.payload);
      }
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

export const { addTile, removeTile, setLayout, updateTile } =
  canvasSlice.actions;

export default canvasSlice.reducer;
