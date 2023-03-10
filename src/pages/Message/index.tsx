import {
  Avatar,
  Button,
  Collapse,
  CollapseItem,
  Notify,
  Skeleton,
  WaterMark,
} from "@nutui/nutui-react";
import config from "../../config/config";
import { Topic } from "../../interface/Topic";
import { useEffect, useState } from "react";
import { Comment } from "../../interface/Comment";

export default () => {
  interface Message {
    topic: Topic;
    comments: Comment[];
  }

  const initTopic: Topic = {
    id: "",
    publisherId: "",
    publisherName: "",
    content: "",
    imageCount: "",
    timer: "",
  };
  const initComments: Comment[] = [];
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    fetch(
      config.address +
        ":" +
        config.port +
        "/comment/getCommentByPublisherId?id=" +
        window.localStorage.getItem("user")
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 1) {
          setMessages(data.message);
        }
      });
  }, []);

  //删除你所在话题的评论
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
      {messages.map((message: Message) => {
        return (
          <Collapse
            icon="arrow-down"
            iconSize="16"
            iconColor="#999"
            key={message.topic.id}
          >
            <CollapseItem
              title={
                message.topic.content.length > 20
                  ? message.topic.content.substring(0, 20) + "..."
                  : message.topic.content
              }
              name={message.topic.id}
            >
              {message.comments.map((comment: Comment) => {
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
                      <Avatar
                        size="50"
                        icon={
                          config.topicAvatar +
                          comment.commenter_id +
                          ".jpg?" +
                          Date.now()
                        }
                      />
                      <div className="right-content">
                        <span className="title">{comment.commenter_name}</span>
                        <div className="desc">{comment.comment_text}</div>
                      </div>
                      <Button
                        type={"danger"}
                        onClick={() => deleteComment(comment.id)}
                      >
                        删除该评论
                      </Button>
                    </div>
                    <br />
                  </Skeleton>
                );
              })}
            </CollapseItem>
          </Collapse>
        );
      })}

      <WaterMark
        className="mark1"
        zIndex={1}
        content="nut-ui-water-mark"
      ></WaterMark>
    </>
  );
};
