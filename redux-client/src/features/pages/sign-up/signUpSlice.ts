import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { userSignUp } from "./signUpAPI"

interface ISignUp {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface ISignUpResponse {
  success: boolean
}

export const signUpUser = createAsyncThunk<
  ISignUpResponse,
  ISignUp,
  {
    rejectValue: { message: string }
  }
>("user/signUp", async (signUpPayload, { rejectWithValue }) => {
  try {
    const response = await userSignUp(signUpPayload)
    if (response.message === "user successfully added!") {
      return response
    } else {
      throw new Error("Sign-up failed")
    }
  } catch (error: any) {
    return rejectWithValue({ message: error.message })
  }
})
interface SignUpState {
  user: ISignUpResponse | null
  error: string | null
  success: boolean
}

const initialState: SignUpState = {
  user: null,
  error: null,
  success: false,
}

const signUpSlice = createSlice({
  name: "signUp",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.error = null
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.success = true
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.error = action.payload?.message || null
        state.success = false
      })
  },
})

export default signUpSlice.reducer
