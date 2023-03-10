import {
  Skeleton,
  Avatar,
  Collapse,
  CollapseItem,
  Button,
  Notify,
  WaterMark,
} from "@nutui/nutui-react";
import config from "../../config/config";
import { useEffect, useState } from "react";
import { User } from "../../interface/User";
import { Topic } from "../../interface/Topic";
import { Comment } from "../../interface/Comment";

export default () => {
  const [myTopics, setMyTopics] = useState<Topic[]>([]);

  const [mine, setMine] = useState<User>({
    id: "0",
    name: "未登录",
    image: "",
    signature: "未登录用户",
  });

  const [myComments, setMyComments] = useState<Comment[]>([]);

  //获取我的信息
  useEffect(() => {
    fetch(config.address + ":" + config.port + "/user/getUserById", {
      method: "post",
      body: JSON.stringify({ id: window.localStorage.getItem("user") }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status === 1) {
          setMine(data.user);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //获取我的话题
  useEffect(() => {
    fetch(
      config.address +
        ":" +
        config.port +
        "/topic/getTopicListByPublisherId?id=" +
        window.localStorage.getItem("user")
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 1) {
          setMyTopics(data.topics);
        }
      });
  }, []);

  //获取我的评论
  useEffect(() => {
    fetch(
      config.address +
        ":" +
        config.port +
        "/comment/getCommentByCommenterId?id=" +
        window.localStorage.getItem("user")
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 1) {
          setMyComments(data.comments);
        }
      });
  }, []);

  const deleteTopic = (topicId: string) => {
    fetch(config.address + ":" + config.port + "/topic/deleteTopicById", {
      method: "post",
      body: JSON.stringify({ id: topicId }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 1) {
          Notify.success(data.info);
          setTimeout(() => {
            history.go(0);
          }, 1500);
        }
      });
  };

  //删除评论
  const deleteComment = (commentId: string) => {
    fetch(config.address + ":" + config.port + "/comment/deleteCommentById", {
      method: "post",
      body: JSON.stringify({ id: commentId }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 1) {
          Notify.success(data.info);
          setTimeout(() => {
            history.go(0);
          }, 1500);
        }
      });
  };

  return (
    <>
      <Skeleton
        width="250px"
        height="15px"
        title
        animated
        avatar
        row={3}
        loading={true}
      >
        <div className="container">
          <Avatar size="50" icon={mine.image + "?" + Date.now()} />
          <div className="right-content">
            <span className="title">{mine.name}</span>
            <div className="desc">{mine.signature}</div>
          </div>
        </div>
      </Skeleton>
      <br />
      <br />

      <Collapse activeName={["1"]} accordion icon="arrow-down">
        <CollapseItem
          title="我的发布"
          name="1"
          titleIcon="order"
          titleIconSize="16"
          titleIconColor="red"
          titleIconPosition="left"
        >
          {myTopics.map((topic: Topic) => {
            return (
              <Skeleton
                width="250px"
                height="15px"
                title
                animated
                avatar
                row={3}
                loading={true}
                key={topic.id}
              >
                <div className="container">
                  <div className="right-content">
                    <span className="title">{topic.timer}</span>
                    <div className="desc">{topic.content}</div>
                  </div>
                  <Button type={"danger"} onClick={() => deleteTopic(topic.id)}>
                    删除
                  </Button>
                </div>
                <br />
              </Skeleton>
            );
          })}
        </CollapseItem>
        <CollapseItem
          title="我的评论 "
          name="2"
          titleIcon="s-follow"
          titleIconSize="16"
          titleIconColor="red"
          titleIconPosition="left"
        >
          {myComments.map((comment: Comment) => {
            return (
              <Skeleton
                width="250px"
                height="15px"
                title
                animated
                avatar
                row={3}
                loading={true}
                key={comment.id}
              >
                <div className="container">
                  <div className="right-content">
                    <span className="title">{comment.comment_timer}</span>
                    <div className="desc">{comment.comment_text}</div>
                  </div>
                  <Button
                    type={"danger"}
                    onClick={() => deleteComment(comment.id)}
                  >
                    删除
                  </Button>
                </div>
                <br />
              </Skeleton>
            );
          })}
        </CollapseItem>
      </Collapse>

      <WaterMark
        className="mark1"
        zIndex={1}
        content="nut-ui-water-mark"
      ></WaterMark>
    </>
  );
};
