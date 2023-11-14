import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import loginReducer from "../features/pages/login/loginSlice"
import signUpReducer from "../features/pages/sign-up/signUpSlice"
import messageReducer from "../features/pages/singleChat/singleChatSlice"

export const store = configureStore({
  reducer: {
    login: loginReducer,
    signUp: signUpReducer,
    message: messageReducer
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
