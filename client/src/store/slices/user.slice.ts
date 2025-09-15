    // src/store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// --- Types ---
interface UserState {
  name: string | null
  email: string | null
}

// --- Load from localStorage ---
const loadUserFromStorage = (): UserState => {
  try {
    const stored = localStorage.getItem("user")
    if (stored) return JSON.parse(stored)
  } catch (err) {
    console.error("Failed to parse user from localStorage:", err)
  }
  return { name: null, email: null }
}

// --- Initial State ---
const initialState: UserState = loadUserFromStorage()

// --- Slice ---
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.name = action.payload.name
      state.email = action.payload.email
      localStorage.setItem("user", JSON.stringify(state))
    },
    logout: (state) => {
      state.name = null
      state.email = null
      localStorage.removeItem("user")
    },
  },
})

// --- Exports ---
export const { login, logout } = userSlice.actions
export default userSlice.reducer