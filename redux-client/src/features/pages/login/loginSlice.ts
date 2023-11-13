import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { userLogin } from "./loginAPI"

interface LoginCredentials {
  email: string
  password: string
}

export const loginUser = createAsyncThunk(
  "user/login",
  async ({ email, password }: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await userLogin(email, password)
      return response
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

interface ILogin {
  user: null | any
  error: undefined | string
  status: "idle" | "loading" | "failed" | "fulfilled"
}

const initState: ILogin = {
  user: null,
  error: undefined,
  status: "idle",
}

const loginSlice = createSlice({
  name: "login",
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.error = undefined
        state.status = "loading"
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = "fulfilled"
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = (action.error as Error | undefined)?.message
        state.status = "failed"
      })
  },
})

export default loginSlice.reducer
