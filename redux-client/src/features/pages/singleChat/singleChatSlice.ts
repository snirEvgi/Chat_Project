import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { postNewMessage } from "./singleChatAPI";
export interface IMessage{
    name: string;
    room: number;
    text: string;
    time:string
}

export const sendMessage = createAsyncThunk(
    "message/newMessage",
    async (message: IMessage, { rejectWithValue }) => {
      try {
        const response = await postNewMessage(message)
        return response
      } catch (error) {
        console.log(error);
        
        return rejectWithValue(error)
      }
    },
  )
  interface ISendMessage {
    message: null | any
    error: undefined | string
    status: "idle" | "loading" | "failed" | "fulfilled"
  }
  const initState: ISendMessage = {
    message: null,
    error: undefined,
    status: "idle",
  }
  const messageSlice = createSlice({
    name: "message",
    initialState: initState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(sendMessage.pending, (state) => {
          state.error = undefined
          state.status = "loading"
        })
        .addCase(sendMessage.fulfilled, (state, action) => {
          state.message = action.payload
          state.status = "fulfilled"
        })
        .addCase(sendMessage.rejected, (state, action) => {
          state.error = (action.error as Error | undefined)?.message
          state.status = "failed"
        })
    },
  })
  
  export default messageSlice.reducer