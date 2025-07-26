import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService';
import { toast } from 'react-toastify';
import axios from 'axios';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const API_URL = `${REACT_APP_API_URL}/api/v1/users/`;

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));
const initialState = {
  user: user ? user : null,
  users: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    try {
      return await authService.register(user)
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || { message: "Something went wrong" })
    }
  })

// Register user
export const adduser = createAsyncThunk(
  'auth/adduser',
  async (user, thunkAPI) => {
    try {
      return await authService.adduser(user)
    } catch (error) {
      const message = error.response.data
      return thunkAPI.rejectWithValue(message)
    }
  })



// Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    return await authService.login(user)
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data || { message: "Something went wrong" })
  }
})

// forgot password
export const forgotPasswordRequest = createAsyncThunk('auth/forgot-password', async (data, thunkAPI) => {
  try {
    return await authService.forgotPasswordRequest(data)
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data || { message: "Something went wrong" })
  }
})

export const resetPasswordRequest = createAsyncThunk('auth/reset-password', async (data, thunkAPI) => {
  try {
    return await authService.resetPasswordRequest(data)
  } catch (error) {
    return thunkAPI.rejectWithValue(error?.response?.data || { message: "Something went wrong" });
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    return await authService.logout();
  } catch (error) {

  }
});


export const profileUpdate = createAsyncThunk('auth/profile', async (userData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
    const response = await axios.put(API_URL + 'profile', userData, config)
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
  } catch (error) {
    if (error.response.status === 401) {
      localStorage.removeItem('user')
    }
    const message = error.response.data;
    return thunkAPI.rejectWithValue(message)
  }
});

export const updateUserDetails = createAsyncThunk('auth/updateUserDetails',
  async ({ id, updatedUserData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await authService.updateUserDetails(updatedUserData, id, token)
    } catch (error) {
      const message = error.response.data;
      return thunkAPI.rejectWithValue(message);
    }
  });

// Fetch all users by admin 
export const getUsers = createAsyncThunk('auth/all',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await authService.getUsers(token)
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  });

// Get a User
export const getUser = createAsyncThunk(
  "auth/getUser",
  async (user, thunkAPI) => {
    try {
      // const token = thunkAPI.getState().auth.user.token;
      // return await authService.getUser(id, token);
      if (!user || !user?.token) {
        // Log out the user and redirect to login page
        thunkAPI.dispatch(logout());
        window.location.href = "/login";
        return thunkAPI.rejectWithValue({ message: "No token found. User logged out." });
      }

      const response = await axios.get(`${API_URL}auth/check`, {
        headers: {
          Authorization: `Bearer ${user?.token}`
        },
      });
      return response.data;
    } catch (error) {
      // if (error?.response?.status === 401) {
      //   thunkAPI.dispatch(logout());
      //   window.location.href = "/login";
      //   return thunkAPI.rejectWithValue(error?.response?.data || { message: "Invalid or expired token. User logged out." });
      // }
      // return thunkAPI.rejectWithValue(error?.response?.data || { message: "Something went wrong" });
    }
  }
);

export const updatedUserPassword = createAsyncThunk("auth/changePassword", async (data, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await authService.updatedUserPassword(data, token);
  } catch (error) {
    let message;
    if (error?.response?.data?.message) {
      message = error.response.data.message;
    } else {
      message = error.response.data.message;
    }
    toast.error(message);
    return thunkAPI.rejectWithValue(message);
  }

})
// const dispatch = useDispatch();
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (data, thunkAPI) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }
      const response = await axios.post(`${API_URL}panelist/verify-otp`, data, config);
      if (response.data) {
        localStorage.removeItem('otp__email');
        localStorage.setItem("user", JSON.stringify(response?.data));
      }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || { message: "Something went wrong" });
    }
  }
);

export const checkAuth = createAsyncThunk("auth/check", async (_, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const user = state.auth.user;

    // Check if user exists before accessing token
    if (!user || !user.token) {
      return thunkAPI.rejectWithValue({ message: "No token found, please login" });
    }
    const response = await axios.get(`${API_URL}auth/check`, {
      headers: { Authorization: `Bearer ${user?.token}`, "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { message: "Authorization check failed" });
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action?.payload?.message
      })

      .addCase(adduser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(adduser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        // state.user = action.payload
      })
      .addCase(adduser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action?.payload?.message
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
      .addCase(profileUpdate.pending, (state) => {
        state.isLoading = true
      })
      .addCase(profileUpdate.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
        toast.success('Profile updated successfully')
      })
      .addCase(profileUpdate.rejected, (state, action) => {
        state.isLoading = false
      })
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      // get single User
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.user = action?.payload
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action?.payload?.message;
        state.user = null
        toast.error(state.message);
      })
      .addCase(updateUserDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.users = state.users.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
        toast.success('User update Success')

      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        toast.error(action.payload);
      })
      .addCase(updatedUserPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatedUserPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action?.payload?.message
        toast.success(state.message)
        state.isSuccess = true;

      })
      .addCase(updatedUserPassword.rejected, (state, action) => {
        state.isLoading = false;
      })
      // forgot password request
      .addCase(forgotPasswordRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPasswordRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action?.payload?.message;
        state.isSuccess = true;
      })
      .addCase(forgotPasswordRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action?.payload?.message;
        state.isError = true;
      })
      // reset password request
      .addCase(resetPasswordRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPasswordRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action?.payload?.message;
        state.isSuccess = true;
      })
      .addCase(resetPasswordRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action?.payload?.message;
        state.isError = true;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action?.payload;
        state.isSuccess = true;
        state.message = 'Verification Successful';
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true
        state.message = action?.payload?.message;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.message = action?.payload?.message;
        state.user = null
      });



  },
})

export const { reset } = authSlice.actions
export default authSlice.reducer
