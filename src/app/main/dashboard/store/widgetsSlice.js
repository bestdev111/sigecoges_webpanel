import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectDashboardAppDB from './project-dashboard-db';

export const getWidgets = createAsyncThunk('Dashboard/widgets/getWidgets', async () => {
  const data = await projectDashboardAppDB.widgets;

  return data;
});

const widgetsAdapter = createEntityAdapter({});

export const { selectEntities: selectWidgets, selectById: selectWidgetById } =
  widgetsAdapter.getSelectors((state) => state.Dashboard.widgets);

const widgetsSlice = createSlice({
  name: 'Dashboard/widgets',
  initialState: widgetsAdapter.getInitialState(),
  reducers: {},
  extraReducers: {
    [getWidgets.fulfilled]: widgetsAdapter.setAll,
  },
});

export default widgetsSlice.reducer;
