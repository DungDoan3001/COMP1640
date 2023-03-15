import React, { useEffect, useState } from 'react';
import { Avatar, Box, Divider, Grid, IconButton, Paper, Typography } from '@mui/material';
import Service from '../../app/utils/Service';
import { useTheme } from '@emotion/react';
import moment from 'moment';

import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import ThumbUpTwoToneIcon from '@mui/icons-material/ThumbUpTwoTone';
import ThumbDownTwoToneIcon from '@mui/icons-material/ThumbDownTwoTone';
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import ThumbDownIcon from '@mui/icons-material/ThumbDown';


import { postData } from "../../dataTest.js"
import { commentData } from '../../dataTest.js';
import { topicData } from "../../dataTest.js"

import PostAuthorInfo from '../../app/components/PostAuthorInfo';
import AppPagination from '../../app/components/AppPagination';
import Comment from '../../app/components/Comment';

const IdeaDetail = () => {
  const theme: any = useTheme();

  const [idea, setIdea] = useState([]);
  const [comments, setComments] = useState([]);
  const [topic] = useState(topicData[0]);

  useEffect(() => {
    Service.getData(postData, 0, 1).then((response: any) => {
      setIdea(response.data);
    })
  }, []);
  // display="flex" 
  return (
    <Box alignItems="center" justifyContent="center"
      width="100%"
      sx={{
        [theme.breakpoints.up('sm')]: {
          width: '80%',
          m: "1rem 6rem",
        },
        [theme.breakpoints.down('sm')]: {
          width: '110%',
          m: "1rem 2rem",
        },
      }}
    >
      <Box p="1rem 5%" mb="1rem" sx={{ backgroundColor: theme.palette.topic.main, borderRadius: "0.5rem" }}>
        <Grid
          display="bottom" alignItems="center" justifyContent="bottom"
          container spacing={1} columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <Grid item xs={3} sm={4} md={6}>
            <PostAuthorInfo top={false} data={topic} />
          </Grid>
        </Grid>
        <Typography
          variant="h2"
          color={theme.palette.content.main}
          fontWeight="bold"
        >
          sample-topic-1
        </Typography>
      </Box>
      <Box sx={{ backgroundColor: theme.palette.comment.main, borderRadius: "0.5rem" }}>
        {idea.map((item: any) => (
          <Box p="1rem 5%">
            <Grid
              display="bottom" alignItems="center" justifyContent="bottom"
              container spacing={1} columns={{ xs: 4, sm: 8, md: 12 }}
            >
              <Grid item xs={3} sm={4} md={6}>
                <PostAuthorInfo top={false} data={item} />
              </Grid>
            </Grid>
            <Typography
              mb="1rem"
              variant="h2"
              color={theme.palette.content.main}
              fontWeight="bold"
            >
              {item.title}
            </Typography>
            <Box m="2rem">
              <Box
                component="img"
                alt="thumbnail"
                src={item.img}
                height="100%"
                width="100%"
              >
              </Box>
            </Box>
            <Typography
              variant="h5"
              color={theme.palette.content.main}
              fontSize="1rem"
            >
              {item.content}
            </Typography>
            <Box m="1rem 0rem">
              <IconButton>
                <ThumbUpTwoToneIcon style={{ fontSize: "1.5rem", color: theme.palette.content.icon, paddingRight: "0.5rem" }} />
                <Box fontSize="1rem">
                  20
                </Box>
              </IconButton>
              <IconButton>
                <ThumbDownTwoToneIcon style={{ fontSize: "1.5rem", color: theme.palette.content.icon, paddingRight: "0.5rem" }} />
                <Box fontSize="1rem">
                  10
                </Box>
              </IconButton>
              <IconButton disabled>
                <ChatBubbleTwoToneIcon style={{ fontSize: "1.5rem", color: theme.palette.content.icon, paddingRight: "0.5rem" }} />
                <Box fontSize="1rem">
                  12
                </Box>
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
      <Typography
        m="1rem 0rem"
        variant="h3"
        color={theme.palette.content.main}
        fontWeight="semibold"
      >
        Comment
      </Typography>
      <Divider variant="fullWidth" />
      <Comment ideaId='8bc9ff66-f901-44da-b9e3-294e0de0ac15' />
    </Box >
  );
}

export default IdeaDetail