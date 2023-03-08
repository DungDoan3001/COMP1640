import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Grid, Box, Button, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, useTheme } from '@mui/material';
import React, { useEffect } from 'react'
import { useForm, FieldValues, Controller } from 'react-hook-form';
import * as z from 'zod';
import AppTextInput from '../../app/components/AppTextInput';
import { useAppDispatch } from '../../app/store/configureStore';
import { Role, User } from '../../app/models/User';
import './style.scss'
import AppSelect from '../../app/components/AppSelect';
import AppImageInput from '../../app/components/AppImageInput';
import { addUser, getUsers, updateUser } from './userSlice';
import { toast } from 'react-toastify';
import agent from '../../app/api/agent';
import { Department } from '../../app/models/Department';

interface Props {
  user?: User;
  cancelEdit: () => void;
  roles: Role[];
  departments: Department[];
}

const validationSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(2),
  email: z.string().email(),
  departmentId: z.string(),
  role: z.string(),
});

const StaffForm = ({ user, cancelEdit, departments, roles }: Props) => {
  const { control, reset, handleSubmit, formState: { isDirty, isSubmitting }, watch } = useForm({
    resolver: zodResolver(validationSchema),
  });
  const theme: any = useTheme();
  const dispatch = useAppDispatch();
  const watchFile = watch('file', null);

  useEffect(() => {
    if (user && !watchFile && !isDirty) reset(user);
    return () => {
      if (watchFile) URL.revokeObjectURL(watchFile.preview);
    }
  }, [user, reset, watchFile, isDirty]);
  async function handleSubmitData(data: FieldValues) {
    try {
      let response: User;
      console.log(data.password);
      if (user) {
        response = await agent.User.updateUser(data, user.id);
      } else {
        response = await agent.User.createUser(data);
      }
      toast.success('Successfully', {
        position: toast.POSITION.TOP_RIGHT,
      });
      dispatch(getUsers()).unwrap();
      cancelEdit();
    } catch (error: any) {
      toast.error('Failed to load resource: the server responded with a status of 409 (Conflict)', {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }
  return (
    <Box>
      <form onSubmit={handleSubmit(handleSubmitData)}>
        <Grid container spacing={0} sx={{ maxWidth: '800px', maxHeight: '420px', [theme.breakpoints.up('sm')]: { mt: 0.5, mb: 2 }, [theme.breakpoints.down('sm')]: { mt: 3, maxHeight: '90vh' } }}>
          <Grid item xs={12} sm={6} px={2}>
            <AppTextInput control={control} name='name' label='Name' multiline={true} />
          </Grid>
          <Grid item xs={12} md={6} px={2}>
            <AppTextInput control={control} name='username' label='User name' multiline={true} />
          </Grid>
          <Grid item xs={12} md={user ? 12 : 6} px={2}>
            <AppTextInput control={control} name='email' label='Email' multiline={true} />
          </Grid>
          {user ? ([]) : (
            <Grid item xs={12} md={6} px={2}>
              <AppTextInput control={control} name="password" label="Password" type="password" />
            </Grid>
          )}
          <Grid item xs={12} md={6} px={2}>
            <AppTextInput control={control} name='address' label='Address' multiline={true} />
          </Grid>
          <Grid item xs={12} md={6} px={2}>
            <AppTextInput control={control} name='phoneNumber' label='Phone Number' multiline={true} />
          </Grid>
          <Grid item xs={12} md={6} px={2}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Role</FormLabel>
              <Controller
                name="role"
                control={control}
                defaultValue={user?.role}
                render={({ field }) => (
                  <RadioGroup
                    aria-label="role"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                    style={{ display: 'flex', justifyContent: 'space-around' }}
                  >
                    {roles.map((role) => (
                      <FormControlLabel
                        key={role.name}
                        value={role.name.toString()}
                        control={<Radio />}
                        label={role.name}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6} px={2}>
            <FormControl>
              <AppSelect control={control} name='departmentId' label='Department' items={departments} defaultValue={user?.departmentId} />
            </FormControl>
          </Grid>
          <Grid container item xs={12} sm={12} marginTop={-2} display='flex' justifyContent='space-around' alignItems='center'>
            <Grid item>
              <AppImageInput control={control} name='file' />
            </Grid>
            <Grid item>
              {watchFile ? (
                <img src={watchFile.preview} alt="preview" style={{ height: '100px', width: 150, marginTop: -15 }} />
              ) : (
                <img src={user?.avatar} alt={user?.username} style={{ height: '100px', width: 150, marginTop: -15 }} />
              )}
            </Grid>
          </Grid>
        </Grid>
        <Box display='flex' justifyContent='space-between' sx={{ ml: 10, mt: 5, mb: 1, [theme.breakpoints.up('sm')]: { ml: 25 } }}>
          <Button onClick={cancelEdit} variant='contained' color='inherit' sx={{ marginRight: '0.5rem' }}>Cancel</Button>
          <LoadingButton loading={isSubmitting} type='submit' variant='contained' color='success'>Submit</LoadingButton>
        </Box>
      </form>
    </Box>
  );
};

export default StaffForm