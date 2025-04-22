import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  followers: string[];
  following: string[];
  posts: string[];
}

interface AuthState {
  user: User | null;
  suggestedUsers: User[];
  userProfile: User | null;
  selectedUser: User | null;
}

const initialState: AuthState = {
  user: null,
  suggestedUsers: [],
  userProfile: null,
  selectedUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setSuggestedUsers: (state, action: PayloadAction<User[]>) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action: PayloadAction<User | null>) => {
      state.userProfile = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
  },
});

export const {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
  setSelectedUser,
} = authSlice.actions;

export default authSlice.reducer;