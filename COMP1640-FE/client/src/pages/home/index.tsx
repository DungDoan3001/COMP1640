import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import HomePageItem from '../../app/components/HomePageItem';
import HomePageTopItem from '../../app/components/HomePageTopItem';
import AppPagination from '../../app/components/AppPagination';
import Service from '../../app/utils/Service';
import CategoryButton from '../../app/components/CategoryButton';

import { postData } from "../../dataTest.js"

import { categoryData } from '../../dataTest.js';
import { useTheme } from '@emotion/react';  

const Home = () => {
  const theme: any = useTheme();

  const [idea, setIdea] = useState([]);
  const [topPost, setTopPost] = useState([]);

  useEffect(() => {
    Service.getData(postData,0, 1).then((response: any) => {
      setTopPost(response.data);
    })
  }, []);

  return (
    <Box  alignItems="center" justifyContent="center"
      width="100%"
      sx={{
        [theme.breakpoints.up('sm')]: {
          width: '90%',
          m : '3rem',
        },
        [theme.breakpoints.down('sm')]: {
          width: '100%',
          m : '3.5rem',
        },
      }}
    >
      {topPost.map((topPost: any) => (
        <HomePageTopItem data={topPost} />
      )
      )}
      <Box mt="5%" alignItems="center" justifyContent="center">
        <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
          {idea.map((item: any) => (
            <HomePageItem data={item} />
          )
          )}
        </Grid>
        <AppPagination
          setItem={(p: any) => setIdea(p)}
          data={postData}
          size={6}
        />
      </Box>
      <Box sx={{
        [theme.breakpoints.up('sm')]: {
          p: '4rem',
        },
        [theme.breakpoints.down('sm')]: {
          p: '1rem',
          pb: '4rem',
        },
      }}
      >
        <Grid container spacing={0.5}>
          {
            categoryData.map((item: any) => (
              <Grid item xs={6} sm={4} md={2.4}>
                <CategoryButton search={true} category={item.name} />
              </Grid>
            ))
          }
        </Grid>
      </Box>
    </Box >
  );
}

export default Home