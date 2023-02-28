import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import { User } from "../../app/models/User";
import { router } from "../../app/routes/Routers";


interface AccountState {
    user: User | null
}

const initialState: AccountState = {
    user: null
}
export const signInUser = createAsyncThunk<User, FieldValues>(
    'account/signInUser',
    async (data, thunkAPI) => {
        try {
            const userDto = await agent.Account.login(data);
            const { ...user} = userDto;
            sessionStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)
export const fetchCurrentUser = createAsyncThunk<User>(
    'account/fetchCurrentUser',
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(sessionStorage.getItem('user')!)))
        try {
            const userDto = await agent.Account.currentUser();
            const { ...user} = userDto;
            sessionStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    },
    {
        condition: () => {
            if (!sessionStorage.getItem('user')) return false;
        }
    }
)
export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        signOut: (state) => {
            state.user = null;
            sessionStorage.removeItem('user');
            router.navigate('/login');
        },
        setUser: (state, action) => {
            let claims = JSON.parse((action.payload.token.split('.')[1])); 
            let role = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            state.user = {...action.payload, role: typeof(role) === 'string' ? [role] : role}; 
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchCurrentUser.rejected, (state) => {
            state.user = null;
            sessionStorage.removeItem('user');
            toast.error('Session expired - please login again');
            router.navigate('/login');
        })
        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            let claims = JSON.parse((action.payload.token.split('.')[1])); 
            let role = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            state.user = {...action.payload, role: typeof(role) === 'string' ? [role] : role};  
        });
        builder.addMatcher(isAnyOf(signInUser.rejected), (state, action) => {
            throw action.payload;
        })
    })
})

export const {signOut, setUser} = accountSlice.actions;
