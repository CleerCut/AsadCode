import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import usersService from "./users.service";

const generalState = {
  data: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

const initialState = {
  getAllUsers: { ...generalState },
  discoverCreators: { ...generalState },
  updateUser: { ...generalState },
  getUserById: { ...generalState },
  updateCreatorPreferences: { ...generalState },
  updateCampaignDefaults: { ...generalState },
  toggleBlockUser: { ...generalState },
  adminToggleBlockUser: { ...generalState },
  getBlockedUsers: { ...generalState },
  isUserBlocked: { ...generalState },
  addUserToWaitlist: { ...generalState },
  connectSocialMedia: { ...generalState },
  getSocialAccounts: { ...generalState },
  disconnectSocialAccount: { ...generalState },
  // contact methods
  getContactMethods: { ...generalState },
  addContactMethod: { ...generalState },
  updateContactMethod: { ...generalState },
  deleteContactMethod: { ...generalState },
  verifyContactMethod: { ...generalState },
  setPrimaryContactMethod: { ...generalState },
  // email preferences
  getEmailPreferences: { ...generalState },
  updateEmailPreferences: { ...generalState },
  // data privacy
  getDataPrivacy: { ...generalState },
  updateDataPrivacy: { ...generalState },
  // blocked brands
  getBlockedBrands: { ...generalState },
  blockBrand: { ...generalState },
  unblockBrand: { ...generalState },
  // auto reply templates
  getAutoReplyTemplates: { ...generalState },
  createAutoReplyTemplate: { ...generalState },
  updateAutoReplyTemplate: { ...generalState },
  deleteAutoReplyTemplate: { ...generalState },
  // brief templates
  getBriefTemplates: { ...generalState },
  createBriefTemplate: { ...generalState },
  updateBriefTemplate: { ...generalState },
  deleteBriefTemplate: { ...generalState },
};

export const getAllUsers = createAsyncThunk("users/getAllUsers", async (payload, thunkAPI) => {
  try {
    const response = await usersService.getAllUsers(payload);
    if (response.success) {
      return response.data;
    }
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const discoverCreators = createAsyncThunk(
  "users/discoverCreators",
  async (payload, thunkAPI) => {
    try {
      const response = await usersService.discoverCreators(payload);
      if (response.success) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response.message || "Request failed");
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || "An error occurred");
    }
  }
);

export const updateUser = createAsyncThunk("users/updateUser", async (data, thunkAPI) => {
  try {
    const response = await usersService.updateUser(data);
    if (response.success) {
      return response;
    }
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const getUserById = createAsyncThunk("users/getUserById", async (userId, thunkAPI) => {
  try {
    const response = await usersService.getUserById(userId);
    if (response.success) {
      return response;
    }
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const updateCreatorPreferences = createAsyncThunk(
  "users/updateCreatorPreferences",
  async (preferences, thunkAPI) => {
    try {
      const response = await usersService.updateCreatorPreferences(preferences);
      if (response.success) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateCampaignDefaults = createAsyncThunk(
  "users/updateCampaignDefaults",
  async (defaults, thunkAPI) => {
    try {
      const response = await usersService.updateCampaignDefaults(defaults);
      if (response.success) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const toggleBlockUser = createAsyncThunk("users/toggleBlockUser", async (data, thunkAPI) => {
  try {
    const response = await usersService.toggleBlockUser(data);
    if (response.success) {
      return response;
    }
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const adminToggleBlockUser = createAsyncThunk(
  "users/adminToggleBlockUser",
  async (data, thunkAPI) => {
    try {
      const response = await usersService.adminToggleBlockUser(data);
      if (response.success) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getBlockedUsers = createAsyncThunk("users/getBlockedUsers", async (_, thunkAPI) => {
  try {
    const response = await usersService.getBlockedUsers();
    if (response.success) {
      return response;
    }
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const isUserBlocked = createAsyncThunk("users/isUserBlocked", async (userId, thunkAPI) => {
  try {
    const response = await usersService.isUserBlocked(userId);
    if (response.success) {
      return response;
    }
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const addUserToWaitlist = createAsyncThunk(
  "users/addUserToWaitlist",
  async (payload, thunkAPI) => {
    try {
      const response = await usersService.addUserToWaitlist(payload);
      if (response.success) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const connectSocialMedia = createAsyncThunk(
  "users/connectSocialMedia",
  async (platform, thunkAPI) => {
    try {
      const response = await usersService.connectSocialMedia(platform);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getSocialAccounts = createAsyncThunk(
  "users/getSocialAccounts",
  async (_, thunkAPI) => {
    try {
      const response = await usersService.getSocialAccounts();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const disconnectSocialAccount = createAsyncThunk(
  "users/disconnectSocialAccount",
  async (platform, thunkAPI) => {
    try {
      const response = await usersService.disconnectSocialAccount(platform);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Contact methods thunks
export const getContactMethods = createAsyncThunk(
  "users/getContactMethods",
  async (_, thunkAPI) => {
    try {
      const response = await usersService.getContactMethods();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Email preferences thunks
export const getEmailPreferences = createAsyncThunk(
  "users/getEmailPreferences",
  async (_, thunkAPI) => {
    try {
      const response = await usersService.getEmailPreferences();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateEmailPreferences = createAsyncThunk(
  "users/updateEmailPreferences",
  async (payload, thunkAPI) => {
    try {
      const response = await usersService.updateEmailPreferences(payload);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Data privacy thunks
export const getDataPrivacy = createAsyncThunk("users/getDataPrivacy", async (_, thunkAPI) => {
  try {
    const response = await usersService.getDataPrivacy();
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const updateDataPrivacy = createAsyncThunk(
  "users/updateDataPrivacy",
  async (payload, thunkAPI) => {
    try {
      const response = await usersService.updateDataPrivacy(payload);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Blocked brands thunks
export const getBlockedBrands = createAsyncThunk("users/getBlockedBrands", async (_, thunkAPI) => {
  try {
    const response = await usersService.getBlockedBrands();
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const blockBrand = createAsyncThunk("users/blockBrand", async (payload, thunkAPI) => {
  try {
    const response = await usersService.blockBrand(payload);
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const unblockBrand = createAsyncThunk("users/unblockBrand", async (payload, thunkAPI) => {
  try {
    const response = await usersService.unblockBrand(payload);
    if (response.success) return response;
    return thunkAPI.rejectWithValue(response);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

// Brief templates thunks
export const getBriefTemplates = createAsyncThunk(
  "users/getBriefTemplates",
  async (_, thunkAPI) => {
    try {
      const response = await usersService.getBriefTemplates();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createBriefTemplate = createAsyncThunk(
  "users/createBriefTemplate",
  async (payload, thunkAPI) => {
    try {
      const response = await usersService.createBriefTemplate(payload);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateBriefTemplate = createAsyncThunk(
  "users/updateBriefTemplate",
  async (payload, thunkAPI) => {
    try {
      const response = await usersService.updateBriefTemplate(payload);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteBriefTemplate = createAsyncThunk(
  "users/deleteBriefTemplate",
  async (id, thunkAPI) => {
    try {
      const response = await usersService.deleteBriefTemplate(id);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Auto reply templates thunks
export const getAutoReplyTemplates = createAsyncThunk(
  "users/getAutoReplyTemplates",
  async (_, thunkAPI) => {
    try {
      const response = await usersService.getAutoReplyTemplates();
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createAutoReplyTemplate = createAsyncThunk(
  "users/createAutoReplyTemplate",
  async (payload, thunkAPI) => {
    try {
      const response = await usersService.createAutoReplyTemplate(payload);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateAutoReplyTemplate = createAsyncThunk(
  "users/updateAutoReplyTemplate",
  async (payload, thunkAPI) => {
    try {
      const response = await usersService.updateAutoReplyTemplate(payload);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteAutoReplyTemplate = createAsyncThunk(
  "users/deleteAutoReplyTemplate",
  async (id, thunkAPI) => {
    try {
      const response = await usersService.deleteAutoReplyTemplate(id);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const addContactMethod = createAsyncThunk(
  "users/addContactMethod",
  async (payload, thunkAPI) => {
    try {
      const response = await usersService.addContactMethod(payload);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateContactMethod = createAsyncThunk(
  "users/updateContactMethod",
  async (payload, thunkAPI) => {
    try {
      const response = await usersService.updateContactMethod(payload);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteContactMethod = createAsyncThunk(
  "users/deleteContactMethod",
  async (id, thunkAPI) => {
    try {
      const response = await usersService.deleteContactMethod(id);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const verifyContactMethod = createAsyncThunk(
  "users/verifyContactMethod",
  async (payload, thunkAPI) => {
    try {
      const response = await usersService.verifyContactMethod(payload);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const setPrimaryContactMethod = createAsyncThunk(
  "users/setPrimaryContactMethod",
  async (id, thunkAPI) => {
    try {
      const response = await usersService.setPrimaryContactMethod(id);
      if (response.success) return response;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reset: (state) => {
      state.getAllUsers = { ...generalState };
      state.discoverCreators = { ...generalState };
      state.updateUser = { ...generalState };
      state.getUserById = { ...generalState };
      state.updateCreatorPreferences = { ...generalState };
      state.updateCampaignDefaults = { ...generalState };
      state.toggleBlockUser = { ...generalState };
      state.adminToggleBlockUser = { ...generalState };
      state.getBlockedUsers = { ...generalState };
      state.isUserBlocked = { ...generalState };
      state.addUserToWaitlist = { ...generalState };
      state.getContactMethods = { ...generalState };
      state.addContactMethod = { ...generalState };
      state.updateContactMethod = { ...generalState };
      state.deleteContactMethod = { ...generalState };
      state.verifyContactMethod = { ...generalState };
      state.setPrimaryContactMethod = { ...generalState };
      state.getEmailPreferences = { ...generalState };
      state.updateEmailPreferences = { ...generalState };
      state.getDataPrivacy = { ...generalState };
      state.updateDataPrivacy = { ...generalState };
      state.getBlockedBrands = { ...generalState };
      state.blockBrand = { ...generalState };
      state.unblockBrand = { ...generalState };
      state.getAutoReplyTemplates = { ...generalState };
      state.createAutoReplyTemplate = { ...generalState };
      state.updateAutoReplyTemplate = { ...generalState };
      state.deleteAutoReplyTemplate = { ...generalState };
      state.getBriefTemplates = { ...generalState };
      state.createBriefTemplate = { ...generalState };
      state.updateBriefTemplate = { ...generalState };
      state.deleteBriefTemplate = { ...generalState };
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllUsers
      .addCase(getAllUsers.pending, (state) => {
        state.getAllUsers.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.getAllUsers.isLoading = false;
        state.getAllUsers.isSuccess = true;
        state.getAllUsers.data = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.getAllUsers.isLoading = false;
        state.getAllUsers.isError = true;
        state.getAllUsers.message = action.payload;
      })
      // discoverCreators
      .addCase(discoverCreators.pending, (state) => {
        state.discoverCreators.isLoading = true;
      })
      .addCase(discoverCreators.fulfilled, (state, action) => {
        state.discoverCreators.isLoading = false;
        state.discoverCreators.isSuccess = true;
        state.discoverCreators.data = action.payload;
      })
      .addCase(discoverCreators.rejected, (state, action) => {
        state.discoverCreators.isLoading = false;
        state.discoverCreators.isError = true;
        state.discoverCreators.message = action.payload;
      })
      // updateUser
      .addCase(updateUser.pending, (state) => {
        if (state.updateUser) {
          state.updateUser.isLoading = true;
          state.updateUser.message = "";
          state.updateUser.isError = false;
          state.updateUser.isSuccess = false;
          state.updateUser.data = null;
        }
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        if (state.updateUser) {
          state.updateUser.isLoading = false;
          state.updateUser.isSuccess = true;
          state.updateUser.data = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        if (state.updateUser) {
          state.updateUser.isLoading = false;
          state.updateUser.isError = true;
          state.updateUser.message = action.payload;
        }
      })
      // getUserById
      .addCase(getUserById.pending, (state) => {
        state.getUserById.isLoading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.getUserById.isLoading = false;
        state.getUserById.isSuccess = true;
        state.getUserById.data = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.getUserById.isLoading = false;
        state.getUserById.isError = true;
        state.getUserById.message = action.payload;
      })
      // updateCreatorPreferences
      .addCase(updateCreatorPreferences.pending, (state) => {
        if (state.updateCreatorPreferences) {
          state.updateCreatorPreferences.isLoading = true;
        }
      })
      .addCase(updateCreatorPreferences.fulfilled, (state, action) => {
        if (state.updateCreatorPreferences) {
          state.updateCreatorPreferences.isLoading = false;
          state.updateCreatorPreferences.isSuccess = true;
          state.updateCreatorPreferences.data = action.payload;
        }
      })
      .addCase(updateCreatorPreferences.rejected, (state, action) => {
        if (state.updateCreatorPreferences) {
          state.updateCreatorPreferences.isLoading = false;
          state.updateCreatorPreferences.isError = true;
          state.updateCreatorPreferences.message = action.payload;
        }
      })
      // updateCampaignDefaults
      .addCase(updateCampaignDefaults.pending, (state) => {
        if (state.updateCampaignDefaults) {
          state.updateCampaignDefaults.isLoading = true;
        }
      })
      .addCase(updateCampaignDefaults.fulfilled, (state, action) => {
        if (state.updateCampaignDefaults) {
          state.updateCampaignDefaults.isLoading = false;
          state.updateCampaignDefaults.isSuccess = true;
          state.updateCampaignDefaults.data = action.payload;
        }
      })
      .addCase(updateCampaignDefaults.rejected, (state, action) => {
        if (state.updateCampaignDefaults) {
          state.updateCampaignDefaults.isLoading = false;
          state.updateCampaignDefaults.isError = true;
          state.updateCampaignDefaults.message = action.payload;
        }
      })
      // toggleBlockUser
      .addCase(toggleBlockUser.pending, (state) => {
        state.toggleBlockUser.isLoading = true;
      })
      .addCase(toggleBlockUser.fulfilled, (state, action) => {
        state.toggleBlockUser.isLoading = false;
        state.toggleBlockUser.isSuccess = true;
        state.toggleBlockUser.data = action.payload;
      })
      .addCase(toggleBlockUser.rejected, (state, action) => {
        state.toggleBlockUser.isLoading = false;
        state.toggleBlockUser.isError = true;
        state.toggleBlockUser.message = action.payload;
      })
      // adminToggleBlockUser
      .addCase(adminToggleBlockUser.pending, (state) => {
        state.adminToggleBlockUser.isLoading = true;
      })
      .addCase(adminToggleBlockUser.fulfilled, (state, action) => {
        state.adminToggleBlockUser.isLoading = false;
        state.adminToggleBlockUser.isSuccess = true;
        state.adminToggleBlockUser.data = action.payload;
      })
      .addCase(adminToggleBlockUser.rejected, (state, action) => {
        state.adminToggleBlockUser.isLoading = false;
        state.adminToggleBlockUser.isError = true;
        state.adminToggleBlockUser.message = action.payload;
      })
      // getBlockedUsers
      .addCase(getBlockedUsers.pending, (state) => {
        state.getBlockedUsers.isLoading = true;
      })
      .addCase(getBlockedUsers.fulfilled, (state, action) => {
        state.getBlockedUsers.isLoading = false;
        state.getBlockedUsers.isSuccess = true;
        state.getBlockedUsers.data = action.payload;
      })
      .addCase(getBlockedUsers.rejected, (state, action) => {
        state.getBlockedUsers.isLoading = false;
        state.getBlockedUsers.isError = true;
        state.getBlockedUsers.message = action.payload;
      })
      // isUserBlocked
      .addCase(isUserBlocked.pending, (state) => {
        state.isUserBlocked.isLoading = true;
      })
      .addCase(isUserBlocked.fulfilled, (state, action) => {
        state.isUserBlocked.isLoading = false;
        state.isUserBlocked.isSuccess = true;
        state.isUserBlocked.data = action.payload;
      })
      .addCase(isUserBlocked.rejected, (state, action) => {
        state.isUserBlocked.isLoading = false;
        state.isUserBlocked.isError = true;
        state.isUserBlocked.message = action.payload;
      })
      // add user to waiting list
      .addCase(addUserToWaitlist.pending, (state) => {
        if (state.addUserToWaitlist) {
          state.addUserToWaitlist.isLoading = true;
        }
      })
      .addCase(addUserToWaitlist.fulfilled, (state, action) => {
        if (state.addUserToWaitlist) {
          state.addUserToWaitlist.isLoading = false;
          state.addUserToWaitlist.isSuccess = true;
          state.addUserToWaitlist.data = action.payload;
        }
      })
      .addCase(addUserToWaitlist.rejected, (state, action) => {
        if (state.addUserToWaitlist) {
          state.addUserToWaitlist.isLoading = false;
          state.addUserToWaitlist.isError = true;
          state.addUserToWaitlist.message = action.payload;
        }
      })
      // connectSocialMedia
      .addCase(connectSocialMedia.pending, (state) => {
        if (state.connectSocialMedia) {
          state.connectSocialMedia.isLoading = true;
        }
      })
      .addCase(connectSocialMedia.fulfilled, (state, action) => {
        if (state.connectSocialMedia) {
          state.connectSocialMedia.isLoading = false;
          state.connectSocialMedia.isSuccess = true;
          state.connectSocialMedia.data = action.payload;
        }
      })
      .addCase(connectSocialMedia.rejected, (state, action) => {
        if (state.connectSocialMedia) {
          state.connectSocialMedia.isLoading = false;
          state.connectSocialMedia.isError = true;
          state.connectSocialMedia.message = action.payload;
        }
      })
      // getSocialAccounts
      .addCase(getSocialAccounts.pending, (state) => {
        if (state.getSocialAccounts) {
          state.getSocialAccounts.isLoading = true;
        }
      })
      .addCase(getSocialAccounts.fulfilled, (state, action) => {
        if (state.getSocialAccounts) {
          state.getSocialAccounts.isLoading = false;
          state.getSocialAccounts.isSuccess = true;
          state.getSocialAccounts.data = action.payload;
        }
      })
      .addCase(getSocialAccounts.rejected, (state, action) => {
        if (state.getSocialAccounts) {
          state.getSocialAccounts.isLoading = false;
          state.getSocialAccounts.isError = true;
          state.getSocialAccounts.message = action.payload;
        }
      })
      // disconnectSocialAccount
      .addCase(disconnectSocialAccount.pending, (state) => {
        if (state.disconnectSocialAccount) {
          state.disconnectSocialAccount.isLoading = true;
        }
      })
      .addCase(disconnectSocialAccount.fulfilled, (state, action) => {
        if (state.disconnectSocialAccount) {
          state.disconnectSocialAccount.isLoading = false;
          state.disconnectSocialAccount.isSuccess = true;
          state.disconnectSocialAccount.data = action.payload;
        }
      })
      .addCase(disconnectSocialAccount.rejected, (state, action) => {
        if (state.disconnectSocialAccount) {
          state.disconnectSocialAccount.isLoading = false;
          state.disconnectSocialAccount.isError = true;
          state.disconnectSocialAccount.message = action.payload;
        }
      })
      // contact methods reducers
      .addCase(getContactMethods.pending, (state) => {
        if (state.getContactMethods) {
          state.getContactMethods.isLoading = true;
        }
      })
      .addCase(getContactMethods.fulfilled, (state, action) => {
        if (state.getContactMethods) {
          state.getContactMethods.isLoading = false;
          state.getContactMethods.isSuccess = true;
          state.getContactMethods.data = action.payload;
        }
      })
      .addCase(getContactMethods.rejected, (state, action) => {
        if (state.getContactMethods) {
          state.getContactMethods.isLoading = false;
          state.getContactMethods.isError = true;
          state.getContactMethods.message =
            action.payload?.message || "Failed to get contact methods";
        }
      })
      .addCase(addContactMethod.pending, (state) => {
        if (state.addContactMethod) {
          state.addContactMethod.isLoading = true;
        }
      })
      .addCase(addContactMethod.fulfilled, (state, action) => {
        if (state.addContactMethod) {
          state.addContactMethod.isLoading = false;
          state.addContactMethod.isSuccess = true;
          state.addContactMethod.data = action.payload;
        }
      })
      .addCase(addContactMethod.rejected, (state, action) => {
        if (state.addContactMethod) {
          state.addContactMethod.isLoading = false;
          state.addContactMethod.isError = true;
          state.addContactMethod.message =
            action.payload?.message || "Failed to add contact method";
        }
      })
      .addCase(updateContactMethod.pending, (state) => {
        if (state.updateContactMethod) {
          state.updateContactMethod.isLoading = true;
        }
      })
      .addCase(updateContactMethod.fulfilled, (state, action) => {
        if (state.updateContactMethod) {
          state.updateContactMethod.isLoading = false;
          state.updateContactMethod.isSuccess = true;
          state.updateContactMethod.data = action.payload;
        }
      })
      .addCase(updateContactMethod.rejected, (state, action) => {
        if (state.updateContactMethod) {
          state.updateContactMethod.isLoading = false;
          state.updateContactMethod.isError = true;
          state.updateContactMethod.message =
            action.payload?.message || "Failed to update contact method";
        }
      })
      .addCase(deleteContactMethod.pending, (state) => {
        if (state.deleteContactMethod) {
          state.deleteContactMethod.isLoading = true;
        }
      })
      .addCase(deleteContactMethod.fulfilled, (state, action) => {
        if (state.deleteContactMethod) {
          state.deleteContactMethod.isLoading = false;
          state.deleteContactMethod.isSuccess = true;
          state.deleteContactMethod.data = action.payload;
        }
      })
      .addCase(deleteContactMethod.rejected, (state, action) => {
        if (state.deleteContactMethod) {
          state.deleteContactMethod.isLoading = false;
          state.deleteContactMethod.isError = true;
          state.deleteContactMethod.message =
            action.payload?.message || "Failed to delete contact method";
        }
      })
      .addCase(verifyContactMethod.pending, (state) => {
        if (state.verifyContactMethod) {
          state.verifyContactMethod.isLoading = true;
        }
      })
      .addCase(verifyContactMethod.fulfilled, (state, action) => {
        if (state.verifyContactMethod) {
          state.verifyContactMethod.isLoading = false;
          state.verifyContactMethod.isSuccess = true;
          state.verifyContactMethod.data = action.payload;
        }
      })
      .addCase(verifyContactMethod.rejected, (state, action) => {
        if (state.verifyContactMethod) {
          state.verifyContactMethod.isLoading = false;
          state.verifyContactMethod.isError = true;
          state.verifyContactMethod.message =
            action.payload?.message || "Failed to verify contact method";
        }
      })
      .addCase(setPrimaryContactMethod.pending, (state) => {
        if (state.setPrimaryContactMethod) {
          state.setPrimaryContactMethod.isLoading = true;
        }
      })
      .addCase(setPrimaryContactMethod.fulfilled, (state, action) => {
        if (state.setPrimaryContactMethod) {
          state.setPrimaryContactMethod.isLoading = false;
          state.setPrimaryContactMethod.isSuccess = true;
          state.setPrimaryContactMethod.data = action.payload;
        }
      })
      .addCase(setPrimaryContactMethod.rejected, (state, action) => {
        if (state.setPrimaryContactMethod) {
          state.setPrimaryContactMethod.isLoading = false;
          state.setPrimaryContactMethod.isError = true;
          state.setPrimaryContactMethod.message =
            action.payload?.message || "Failed to set primary contact method";
        }
      })
      // email preferences reducers
      .addCase(getEmailPreferences.pending, (state) => {
        if (state.getEmailPreferences) {
          state.getEmailPreferences.isLoading = true;
        }
      })
      .addCase(getEmailPreferences.fulfilled, (state, action) => {
        if (state.getEmailPreferences) {
          state.getEmailPreferences.isLoading = false;
          state.getEmailPreferences.isSuccess = true;
          state.getEmailPreferences.data = action.payload;
        }
      })
      .addCase(getEmailPreferences.rejected, (state, action) => {
        if (state.getEmailPreferences) {
          state.getEmailPreferences.isLoading = false;
          state.getEmailPreferences.isError = true;
          state.getEmailPreferences.message =
            action.payload?.message || "Failed to fetch email preferences";
        }
      })
      .addCase(updateEmailPreferences.pending, (state) => {
        if (state.updateEmailPreferences) {
          state.updateEmailPreferences.isLoading = true;
        }
      })
      .addCase(updateEmailPreferences.fulfilled, (state, action) => {
        if (state.updateEmailPreferences) {
          state.updateEmailPreferences.isLoading = false;
          state.updateEmailPreferences.isSuccess = true;
          state.updateEmailPreferences.data = action.payload;
        }
      })
      .addCase(updateEmailPreferences.rejected, (state, action) => {
        if (state.updateEmailPreferences) {
          state.updateEmailPreferences.isLoading = false;
          state.updateEmailPreferences.isError = true;
          state.updateEmailPreferences.message =
            action.payload?.message || "Failed to update email preferences";
        }
      })
      // data privacy reducers
      .addCase(getDataPrivacy.pending, (state) => {
        if (state.getDataPrivacy) {
          state.getDataPrivacy.isLoading = true;
        }
      })
      .addCase(getDataPrivacy.fulfilled, (state, action) => {
        if (state.getDataPrivacy) {
          state.getDataPrivacy.isLoading = false;
          state.getDataPrivacy.isSuccess = true;
          state.getDataPrivacy.data = action.payload;
        }
      })
      .addCase(getDataPrivacy.rejected, (state, action) => {
        if (state.getDataPrivacy) {
          state.getDataPrivacy.isLoading = false;
          state.getDataPrivacy.isError = true;
          state.getDataPrivacy.message = action.payload?.message || "Failed to get data privacy";
        }
      })
      .addCase(updateDataPrivacy.pending, (state) => {
        if (state.updateDataPrivacy) {
          state.updateDataPrivacy.isLoading = true;
        }
      })
      .addCase(updateDataPrivacy.fulfilled, (state, action) => {
        if (state.updateDataPrivacy) {
          state.updateDataPrivacy.isLoading = false;
          state.updateDataPrivacy.isSuccess = true;
          state.updateDataPrivacy.data = action.payload;
        }
      })
      .addCase(updateDataPrivacy.rejected, (state, action) => {
        if (state.updateDataPrivacy) {
          state.updateDataPrivacy.isLoading = false;
          state.updateDataPrivacy.isError = true;
          state.updateDataPrivacy.message =
            action.payload?.message || "Failed to update data privacy";
        }
      })
      // blocked brands reducers
      .addCase(getBlockedBrands.pending, (state) => {
        if (state.getBlockedBrands) {
          state.getBlockedBrands.isLoading = true;
        }
      })
      .addCase(getBlockedBrands.fulfilled, (state, action) => {
        if (state.getBlockedBrands) {
          state.getBlockedBrands.isLoading = false;
          state.getBlockedBrands.isSuccess = true;
          state.getBlockedBrands.data = action.payload;
        }
      })
      .addCase(getBlockedBrands.rejected, (state, action) => {
        if (state.getBlockedBrands) {
          state.getBlockedBrands.isLoading = false;
          state.getBlockedBrands.isError = true;
          state.getBlockedBrands.message =
            action.payload?.message || "Failed to get blocked brands";
        }
      })
      .addCase(blockBrand.pending, (state) => {
        if (state.blockBrand) {
          state.blockBrand.isLoading = true;
        }
      })
      .addCase(blockBrand.fulfilled, (state, action) => {
        if (state.blockBrand) {
          state.blockBrand.isLoading = false;
          state.blockBrand.isSuccess = true;
          state.blockBrand.data = action.payload;
        }
      })
      .addCase(blockBrand.rejected, (state, action) => {
        if (state.blockBrand) {
          state.blockBrand.isLoading = false;
          state.blockBrand.isError = true;
          state.blockBrand.message = action.payload?.message || "Failed to block brand";
        }
      })
      .addCase(unblockBrand.pending, (state) => {
        if (state.unblockBrand) {
          state.unblockBrand.isLoading = true;
        }
      })
      .addCase(unblockBrand.fulfilled, (state, action) => {
        if (state.unblockBrand) {
          state.unblockBrand.isLoading = false;
          state.unblockBrand.isSuccess = true;
          state.unblockBrand.data = action.payload;
        }
      })
      .addCase(unblockBrand.rejected, (state, action) => {
        if (state.unblockBrand) {
          state.unblockBrand.isLoading = false;
          state.unblockBrand.isError = true;
          state.unblockBrand.message = action.payload?.message || "Failed to unblock brand";
        }
      })
      // auto reply templates reducers
      .addCase(getAutoReplyTemplates.pending, (state) => {
        if (state.getAutoReplyTemplates) state.getAutoReplyTemplates.isLoading = true;
      })
      .addCase(getAutoReplyTemplates.fulfilled, (state, action) => {
        if (state.getAutoReplyTemplates) {
          state.getAutoReplyTemplates.isLoading = false;
          state.getAutoReplyTemplates.isSuccess = true;
          state.getAutoReplyTemplates.data = action.payload;
        }
      })
      .addCase(getAutoReplyTemplates.rejected, (state, action) => {
        if (state.getAutoReplyTemplates) {
          state.getAutoReplyTemplates.isLoading = false;
          state.getAutoReplyTemplates.isError = true;
          state.getAutoReplyTemplates.message =
            action.payload?.message || "Failed to fetch templates";
        }
      })
      .addCase(createAutoReplyTemplate.pending, (state) => {
        if (state.createAutoReplyTemplate) state.createAutoReplyTemplate.isLoading = true;
      })
      .addCase(createAutoReplyTemplate.fulfilled, (state, action) => {
        if (state.createAutoReplyTemplate) {
          state.createAutoReplyTemplate.isLoading = false;
          state.createAutoReplyTemplate.isSuccess = true;
          state.createAutoReplyTemplate.data = action.payload;
        }
      })
      .addCase(createAutoReplyTemplate.rejected, (state, action) => {
        if (state.createAutoReplyTemplate) {
          state.createAutoReplyTemplate.isLoading = false;
          state.createAutoReplyTemplate.isError = true;
          state.createAutoReplyTemplate.message =
            action.payload?.message || "Failed to create template";
        }
      })
      .addCase(updateAutoReplyTemplate.pending, (state) => {
        if (state.updateAutoReplyTemplate) state.updateAutoReplyTemplate.isLoading = true;
      })
      .addCase(updateAutoReplyTemplate.fulfilled, (state, action) => {
        if (state.updateAutoReplyTemplate) {
          state.updateAutoReplyTemplate.isLoading = false;
          state.updateAutoReplyTemplate.isSuccess = true;
          state.updateAutoReplyTemplate.data = action.payload;
        }
      })
      .addCase(updateAutoReplyTemplate.rejected, (state, action) => {
        if (state.updateAutoReplyTemplate) {
          state.updateAutoReplyTemplate.isLoading = false;
          state.updateAutoReplyTemplate.isError = true;
          state.updateAutoReplyTemplate.message =
            action.payload?.message || "Failed to update template";
        }
      })
      .addCase(deleteAutoReplyTemplate.pending, (state) => {
        if (state.deleteAutoReplyTemplate) state.deleteAutoReplyTemplate.isLoading = true;
      })
      .addCase(deleteAutoReplyTemplate.fulfilled, (state, action) => {
        if (state.deleteAutoReplyTemplate) {
          state.deleteAutoReplyTemplate.isLoading = false;
          state.deleteAutoReplyTemplate.isSuccess = true;
          state.deleteAutoReplyTemplate.data = action.payload;
        }
      })
      .addCase(deleteAutoReplyTemplate.rejected, (state, action) => {
        if (state.deleteAutoReplyTemplate) {
          state.deleteAutoReplyTemplate.isLoading = false;
          state.deleteAutoReplyTemplate.isError = true;
          state.deleteAutoReplyTemplate.message =
            action.payload?.message || "Failed to delete template";
        }
      })
      // brief templates reducers
      .addCase(getBriefTemplates.pending, (state) => {
        if (state.getBriefTemplates) state.getBriefTemplates.isLoading = true;
      })
      .addCase(getBriefTemplates.fulfilled, (state, action) => {
        if (state.getBriefTemplates) {
          state.getBriefTemplates.isLoading = false;
          state.getBriefTemplates.isSuccess = true;
          state.getBriefTemplates.data = action.payload;
        }
      })
      .addCase(getBriefTemplates.rejected, (state, action) => {
        if (state.getBriefTemplates) {
          state.getBriefTemplates.isLoading = false;
          state.getBriefTemplates.isError = true;
          state.getBriefTemplates.message =
            action.payload?.message || "Failed to fetch brief templates";
        }
      })
      .addCase(createBriefTemplate.pending, (state) => {
        if (state.createBriefTemplate) state.createBriefTemplate.isLoading = true;
      })
      .addCase(createBriefTemplate.fulfilled, (state, action) => {
        if (state.createBriefTemplate) {
          state.createBriefTemplate.isLoading = false;
          state.createBriefTemplate.isSuccess = true;
          state.createBriefTemplate.data = action.payload;
        }
      })
      .addCase(createBriefTemplate.rejected, (state, action) => {
        if (state.createBriefTemplate) {
          state.createBriefTemplate.isLoading = false;
          state.createBriefTemplate.isError = true;
          state.createBriefTemplate.message =
            action.payload?.message || "Failed to create brief template";
        }
      })
      .addCase(updateBriefTemplate.pending, (state) => {
        if (state.updateBriefTemplate) state.updateBriefTemplate.isLoading = true;
      })
      .addCase(updateBriefTemplate.fulfilled, (state, action) => {
        if (state.updateBriefTemplate) {
          state.updateBriefTemplate.isLoading = false;
          state.updateBriefTemplate.isSuccess = true;
          state.updateBriefTemplate.data = action.payload;
        }
      })
      .addCase(updateBriefTemplate.rejected, (state, action) => {
        if (state.updateBriefTemplate) {
          state.updateBriefTemplate.isLoading = false;
          state.updateBriefTemplate.isError = true;
          state.updateBriefTemplate.message =
            action.payload?.message || "Failed to update brief template";
        }
      })
      .addCase(deleteBriefTemplate.pending, (state) => {
        if (state.deleteBriefTemplate) state.deleteBriefTemplate.isLoading = true;
      })
      .addCase(deleteBriefTemplate.fulfilled, (state, action) => {
        if (state.deleteBriefTemplate) {
          state.deleteBriefTemplate.isLoading = false;
          state.deleteBriefTemplate.isSuccess = true;
          state.deleteBriefTemplate.data = action.payload;
        }
      })
      .addCase(deleteBriefTemplate.rejected, (state, action) => {
        if (state.deleteBriefTemplate) {
          state.deleteBriefTemplate.isLoading = false;
          state.deleteBriefTemplate.isError = true;
          state.deleteBriefTemplate.message =
            action.payload?.message || "Failed to delete brief template";
        }
      });
  },
});

export const { reset } = usersSlice.actions;
export default usersSlice.reducer;
