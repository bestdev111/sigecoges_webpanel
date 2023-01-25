import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AppBar,
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Icon,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core';
import profileDB from '../../../news/components/fakeNewsData';

function NewsTab() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fakeData = profileDB;
    setData(fakeData.news);
  }, []);

  if (!data) {
    return null;
  }

  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <div className="md:flex">
        <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
          <Card
            component={motion.div}
            variants={item}
            className="w-full overflow-hidden rounded-16 shadow mb-32"
          >
            <Input
              className="p-16 w-full"
              classes={{ root: 'text-14' }}
              placeholder="Write something.."
              multiline
              rows="6"
              margin="none"
              disableUnderline
            />
            <AppBar
              className="card-footer flex flex-row border-t-1 justify-end"
              position="static"
              color="default"
              elevation={0}
            >
              {/* <div className="flex-1 items-center">
                <IconButton aria-label="Add photo">
                  <Icon>photo</Icon>
                </IconButton>
                <IconButton aria-label="Mention somebody">
                  <Icon>person</Icon>
                </IconButton>
                <IconButton aria-label="Add location">
                  <Icon>location_on</Icon>
                </IconButton>
              </div> */}

              <div className="p-8">
                <Button variant="contained" color="primary" size="small" aria-label="post">
                  Post
                </Button>
              </div>
            </AppBar>
          </Card>

          {data.posts.map((post) => (
            <Card
              component={motion.div}
              variants={item}
              key={post.id}
              className="mb-32 overflow-hidden rounded-16 shadow"
            >
              <CardHeader
                avatar={<Avatar aria-label="Recipe" src={post.user.avatar} />}
                action={
                  <IconButton aria-label="more">
                    <Icon>more_vert</Icon>
                  </IconButton>
                }
                title={
                  <span className="flex">
                    <Typography className="font-normal" color="primary" paragraph={false}>
                      {post.user.name}
                    </Typography>
                    <span className="mx-4">
                      {post.type === 'post' && 'posted on your timeline'}
                      {post.type === 'something' && 'shared something with you'}
                      {post.type === 'video' && 'shared a video with you'}
                      {post.type === 'article' && 'shared an article with you'}
                    </span>
                  </span>
                }
                subheader={post.time}
              />

              <CardContent className="py-0">
                {post.message && (
                  <Typography component="p" className="mb-16">
                    {post.message}
                  </Typography>
                )}

                {post.media && <img src={post.media.preview} alt="post" className="rounded-8" />}

                {post.article && (
                  <div className="border-1 rounded-8 overflow-hidden">
                    <img
                      className="w-full border-b-1"
                      src={post.article.media.preview}
                      alt="article"
                    />
                    <div className="p-16">
                      <Typography variant="subtitle1">{post.article.title}</Typography>
                      <Typography variant="caption">{post.article.subtitle}</Typography>
                      <Typography className="mt-16">{post.article.excerpt}</Typography>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardActions disableSpacing className="px-12">
                <Button size="small" aria-label="Add to favorites">
                  <Icon className="text-16" color="action">
                    favorite
                  </Icon>
                  <Typography className="mx-4">Like</Typography>
                  <Typography>({post.like})</Typography>
                </Button>
                <Button aria-label="Share">
                  <Icon className="text-16" color="action">
                    share
                  </Icon>
                  <Typography className="mx-4">Share</Typography>
                  <Typography>({post.share})</Typography>
                </Button>
              </CardActions>

              <AppBar
                className="card-footer flex flex-column p-16"
                position="static"
                color="default"
                elevation={0}
              >
                {post.comments && post.comments.length > 0 && (
                  <div className="">
                    <div className="flex items-center">
                      <Typography>{post.comments.length} comments</Typography>
                      <Icon className="text-16 mx-4" color="action">
                        keyboard_arrow_down
                      </Icon>
                    </div>

                    <List>
                      {post.comments
                        ? post.comments.map((comment) => (
                            <div key={comment.id}>
                              <ListItem className="px-0 -mx-8">
                                <Avatar
                                  alt={comment.user.name}
                                  src={comment.user.avatar}
                                  className="mx-8"
                                />
                                <ListItemText
                                  className="px-4"
                                  primary={
                                    <div className="flex">
                                      <Typography
                                        className="font-normal"
                                        color="initial"
                                        paragraph={false}
                                      >
                                        {comment.user.name}
                                      </Typography>
                                      <Typography className="mx-4" variant="caption">
                                        {comment.time}
                                      </Typography>
                                    </div>
                                  }
                                  secondary={comment.message}
                                />
                              </ListItem>
                              <div className="flex items-center mx-52 mb-8">
                                <Button>Reply</Button>
                                <Icon className="text-14 mx-8 cursor-pointer">flag</Icon>
                              </div>
                            </div>
                          ))
                        : null}
                    </List>
                  </div>
                )}

                <div className="flex flex-auto -mx-4">
                  <Avatar className="mx-4" src="assets/images/avatars/profile.jpg" />
                  <div className="flex-1 mx-4">
                    <Paper className="w-full mb-16 shadow-0">
                      <Input
                        className="p-8 w-full border-1 rounded-8"
                        classes={{ root: 'text-13' }}
                        placeholder="Add a comment.."
                        multiline
                        rows="6"
                        margin="none"
                        disableUnderline
                      />
                    </Paper>
                    <Button variant="contained" color="primary" size="small">
                      Post Comment
                    </Button>
                  </div>
                </div>
              </AppBar>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default NewsTab;
