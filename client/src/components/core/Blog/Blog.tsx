import {
  CircularProgress,
  Container,
  Divider,
  Typography,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { ArrowRightAlt } from "@material-ui/icons";
import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { getPosts, Post } from "../../../api/post";
import {
  displayDate,
  limitTextLength,
  newToken,
  useCancelToken,
} from "../../../helpers";
import { CustomButton } from "../../common";
import useBlogStyles from "./blog-styles";

interface State {
  posts: Post[];
  limit: number;
  skip: number;
  numberOfPosts: number;
  isSubmitting: boolean;
  loading: boolean;
}

const Blog: React.FC = () => {
  const classes = useBlogStyles();
  const cancelSource = useCancelToken();
  const [state, setState] = useState<State>({
    posts: [],
    limit: 10,
    skip: -10,
    numberOfPosts: 0,
    isSubmitting: false,
    loading: true,
  });

  const list = () => {
    cancelSource.current?.cancel();
    cancelSource.current = newToken();
    state.skip = state.skip + state.limit;
    state.isSubmitting = true;
    setState({ ...state });
    getPosts(state.limit, state.skip, cancelSource.current?.token)
      .then((response) => {
        setState({
          ...state,
          posts: [...state.posts, ...response.data.posts],
          numberOfPosts:
            state.skip === 0 ? response.data.count : state.numberOfPosts,
          isSubmitting: false,
          loading: false,
        });
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          console.log(err.response.data.error);
        }
      });
  };

  useEffect(
    () => {
      list();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Container maxWidth="md">
      <div className={classes.root}>
        <Typography className={classes.heading} variant="h4">
          Блог pc world
        </Typography>
        <Typography className={classes.subHeading} variant="subtitle1">
          Здесь вы можете найти последние новости в мире компьюетеров
        </Typography>
        {state.loading ? (
          <div className={classes.loading}>
            <CircularProgress disableShrink size={50} />
          </div>
        ) : (
          state.posts.map((post, i) => (
            <Fragment key={post._id}>
              <div className={classes.post}>
                <div className={classes.postHeader}>
                  <Typography className={classes.title} variant="h5">
                    {post.title}
                  </Typography>
                  <Typography className={classes.postedOnBy} variant="caption">
                    Дата новости <b>{displayDate(post.createdAt)}</b> Автор{" "}
                    <b>{post.postedBy}</b>
                  </Typography>
                </div>
                <Divider className={classes.headerSplitter} />
                <div className={classes.contentContainer}>
                  <Typography className={classes.content}>
                    {limitTextLength(post.content, 280)}
                  </Typography>
                  <CustomButton
                    component={RouterLink}
                    to={`/post/${post.slug}`}
                    variant="outlined"
                    color="primary"
                    endIcon={<ArrowRightAlt />}
                  >
                    продолжить чтение
                  </CustomButton>
                </div>
              </div>
              {i < state.posts.length - 1 && (
                <Divider className={classes.postSplitter} />
              )}
            </Fragment>
          ))
        )}
        {state.posts.length < state.numberOfPosts && (
          <CustomButton
            className={classes.showMore}
            variant="contained"
            color="primary"
            disabled={state.isSubmitting}
            isSubmitting={state.isSubmitting}
            onClick={list}
          >
            показать больше
          </CustomButton>
        )}
      </div>
    </Container>
  );
};

export default Blog;
