import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import { User } from "../../app/models/User";
import { useNavigate } from "react-router-dom";
import { router } from "../../app/routes/Routers";


interface AccountState {
    user: User | null
}

const initialState: AccountState = {
    user: null
}
const navigate = useNavigate
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
// export const fetchCurrentUser = createAsyncThunk<User>(
//     'account/fetchCurrentUser',
//     async (_, thunkAPI) => {
//         thunkAPI.dispatch(setUser(JSON.parse(sessionStorage.getItem('user')!)))
//         try {
//             const userDto = await agent.Account.currentUser();
//             const {basket, ...user} = userDto;
//             sessionStorage.setItem('user', JSON.stringify(user));
//             return user;
//         } catch (error) {
//             return thunkAPI.rejectWithValue(error);
//         }
//     },
//     {
//         condition: () => {
//             if (!sessionStorage.getItem('user')) return false;
//         }
//     }
// )
// export const accountSlice = createSlice({
//     name: 'account',
//     initialState,
//     reducers: {
//         signOut: (state) => {
//             state.user = null;
//             localStorage.removeItem('user');
//             router.navigate('/login');
//         },
//         setUser: (state, action) => {
//             let claims = JSON.parse(atob(action.payload.token.split('.')[1])); 
//             let roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
//             state.user = {...action.payload, roles: typeof(roles) === 'string' ? [roles] : roles}; 
//         }
//     },
//     extraReducers: (builder => {
//         builder.addCase(fetchCurrentUser.rejected, (state) => {
//             state.user = null;
//             localStorage.removeItem('user');
//             toast.error('Session expired - please login again');
//             router.navigate('/login');
//         })
//         builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
//             let claims = JSON.parse(atob(action.payload.token.split('.')[1])); 
//             let roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
//             state.user = {...action.payload, roles: typeof(roles) === 'string' ? [roles] : roles};  
//         });
//         builder.addMatcher(isAnyOf(signInUser.rejected), (state, action) => {
//             throw action.payload;
//         })
//     })
// })

// export const {signOut, setUser} = accountSlice.actions;
