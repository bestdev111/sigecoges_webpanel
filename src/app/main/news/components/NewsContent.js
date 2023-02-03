/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardActions,
  Button,
  CardContent,
  Icon,
  List,
  ListItem,
  ListItemText,
  Typography,
  Grid
} from '@material-ui/core';
import FuseLoading from '@fuse/core/FuseLoading';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ImageView from 'react-single-image-viewer'
import clsx from 'clsx';
import { getAllNews, selectAllNews } from '../store/newsSlice';
import { allUsers, selectAllUser } from '../store/allUserSlice';
import 'react-single-image-viewer/dist/index.css'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  description: {
    width: '500px'
  },
  media: {
    width : '100px',
    height : '100px',
  }
}));

function NewsContent() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
  const allNews = useSelector(selectAllNews);
  const allUsersData = useSelector(selectAllUser);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    dispatch(getAllNews()).then(() => setLoading(false));
    dispatch(allUsers()).then(() => setLoading(false));
  }, [dispatch]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
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
  if (loading) {
    return <FuseLoading />;
  }
  if(!allNews && !allNews[0]) {
    return(
      <div className="md:flex flex justify-center">
        <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32 p-32 justify-center">
          <Typography className="mt-5" color="textSecondary" variant="h6" align="center">
            There are no News.
          </Typography>
        </div>
      </div>
    )
  }
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <div className="md:flex">
        <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32 p-32">
          {allNews && allNews[0] ?
            allNews[0].map((post, index) => (
              <Accordion key={index} expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  // eslint-disable-next-line prefer-template
                  aria-controls={'panel' + index + 'bh-content'}
                  id={`panel${index }bh-header`}
                >
                  {expanded === `panel${index}` ? 
                    <></>
                  : <div className='flex w-full justify-between'>
                      <div className='flex items-end'>
                        <img className={clsx(classes.media, 'object-cover mr-8')} aria-label="Recipe" src={ post.media ? post.media : ''} />
                        {post.description && (
                          <p className={clsx(classes.description, "truncate")}>
                            {post.description}
                          </p>
                        )}
                      </div>
                      <div className='flex items-end'>
                        <div className='flex items-end ml-12'>{post.date}</div>
                      </div>
                    </div>
                  }
                </AccordionSummary>
                <AccordionDetails>
                  <Card
                    component={motion.div}
                    variants={item}
                    key={index}
                    className="mb-4 overflow-hidden rounded-16 shadow"
                  >
                    <CardContent className="py-0">
                      <Grid container>
                        <Grid item>
                          <div>
                            {post.description && (
                              <Typography component="p" className="mb-16">
                                {post.description}
                              </Typography>
                            )}
                          </div>
                          <div className='flex justify-end'>
                            <div className='flex'>
                              <Avatar aria-label="Recipe" src={allUsersData && allUsersData[0] ? allUsersData[0][post.uid].photo : ''} />
                              <Typography component="p" className='flex items-center ml-2'>
                                {allUsersData && allUsersData[0] ? allUsersData[0][post.uid].name : ''}
                              </Typography>
                            </div>
                          </div>
                        </Grid>
                        <Grid item>
                            {post.media && <ImageView className='rounded-lg' src={post.media} height="100" width="200" callback=""/>}
                        </Grid>
                      </Grid>
                    </CardContent>

                    <CardActions disableSpacing className="px-12">
                      <Button size="small" aria-label="Add to favorites">
                        <Icon className="text-16" color="action">
                          thumb_up
                        </Icon>
                        <Typography>({post.like})</Typography>
                      </Button>
                      <Button aria-label="Share">
                        <Icon className="text-16" color="action">
                          thumb_down
                        </Icon>
                        <Typography>({post.dislike})</Typography>
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
                            {post.comments.map((comment) => (
                              <div key={comment._id}>
                                <ListItem className="px-0 -mx-8">
                                  <Avatar
                                    alt={comment.uid}
                                    src={
                                      allUsersData && allUsersData[0]
                                        ? allUsersData[0][comment.uid].photo
                                        : ''
                                    }
                                    className="object-cover mx-8"
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
                                          {allUsersData && allUsersData[0]
                                            ? allUsersData[0][comment.uid].name
                                            : ''}
                                        </Typography>
                                        <Typography className="mx-4" variant="caption">
                                          {comment.date}
                                        </Typography>
                                      </div>
                                    }
                                    secondary={comment.comment}
                                  />
                                </ListItem>
                              </div>
                            ))}
                          </List>
                        </div>
                      )}
                    </AppBar>
                  </Card>
                </AccordionDetails>
              </Accordion>
          )) : null
        }
        </div>
      </div>
    </motion.div>
  );
  
}
export default NewsContent;
