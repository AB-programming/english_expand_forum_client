import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Skeleton,
  SearchBar,
  Button,
  Sticky,
  Image,
  Grid,
  Row,
  Col,
  PullToRefresh,
  Ellipsis,
  Dialog,
  Form,
  TextArea,
  Uploader,
  Notify,
  WaterMark,
  Tag,
  Collapse,
  CollapseItem,
  Input,
  Divider,
} from "@nutui/nutui-react";
import config from "../../config/config";
import { FileType } from "@nutui/nutui-react/dist/esm/types/src/packages/uploader/uploader";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import Config from "../../config/config";
import { Topic } from "../../interface/Topic";
import { Comment } from "../../interface/Comment";
import "./index.less";

export default () => {
  //存取用户ID
  const { user } = useParams();
  if (user !== "null" && user !== undefined)
    window.localStorage.setItem("user", user);

  //所有话题
  const [topics, setTopics] = useState<Topic[]>([]);

  const [comments, setComments] = useState<Comment[]>([]);

  //发布弹出框是否展示
  const [visible, setVisible] = useState(false);

  //获取所有话题
  useEffect(() => {
    fetch(config.address + ":" + config.port + "/topic/getAllTopic")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setTopics(data.topics);
      })
      .catch((error) => {
        Notify.danger(error);
      });
  }, []);

  //获取所有评论
  useEffect(() => {
    fetch(config.address + ":" + config.port + "/comment/getAllComment")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setComments(data.comments);
      })
      .catch((error) => {
        Notify.danger(error);
      });
  }, []);

  //刷新
  const refresh = () => {
    setTimeout(() => {
      history.go(0);
    }, 1000);
    return new Promise<any>((resolve, reject) => {
      resolve("ok");
    });
  };

  //发布内容
  const [publishText, setPublishText] = useState<string>("");

  //发布的图片
  const uploadUrl =
    config.address +
    ":" +
    config.port +
    "/topic/publish?id=" +
    nanoid() +
    "&publishId=" +
    window.localStorage.getItem("user") +
    "&timer=" +
    dayjs().format("YYYY-MM-DD HH:mm:ss") +
    "&content=" +
    publishText;
  const defaultFileList: FileType<string>[] = [];

  //手动上传ref
  const uploadRef = useRef<any>(null);

  //发布帖子上传按钮
  const publish = () => {
    if (defaultFileList.length === 0) {
      fetch(
        config.address +
          ":" +
          config.port +
          "/topic/publish?id=" +
          nanoid() +
          "&publishId=" +
          window.localStorage.getItem("user") +
          "&timer=" +
          dayjs().format("YYYY-MM-DD HH:mm:ss") +
          "&content=" +
          publishText,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
        }
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.status === 1) {
            Notify.success(data.info);
            setTimeout(() => {
              history.go(0);
            }, 2000);
          } else {
            Notify.danger(data.info);
          }
        })
        .catch((error) => {
          Notify.danger(error);
        });
    }
    uploadRef.current.submit();
    setPublishText("");
    setVisible(false);
  };

  //成功回调
  const publishSuccess = (responseText: object | any) => {
    const data = JSON.parse(responseText.responseText);
    if (data.status === 1) {
      Notify.success(data.info);
      setTimeout(() => {
        history.go(0);
      }, 2000);
    } else {
      Notify.danger(data.info);
    }
  };

  //评论
  let commentText: string = "";

  const sendComment = async (topicId: string) => {
    const response = await fetch(
      config.address + ":" + config.port + "/comment/putComment",
      {
        method: "post",
        body: JSON.stringify({
          id: nanoid(),
          topicId: topicId,
          commenterId: window.localStorage.getItem("user"),
          commentText: commentText,
          commentTimer: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    if (data.status === 1) {
      Notify.success(data.info);
      setTimeout(() => {
        history.go(0);
      }, 2000);
    } else {
      Notify.danger(data.info);
    }
  };

  //话题发布者颜色
  const tagColor: any = ["danger", "success", "primary", "warning"];
  let tag: number = 0;

  return (
    <>
      <PullToRefresh onRefresh={refresh}>
        <SearchBar
          background="linear-gradient(to right, #9866F0, #EB4D50)"
          inputBackground="#999"
          align="left"
        />
        <br />
        {topics.map((topic: Topic) => {
          const images: string[] = topic.imageCount.split(";");
          return (
            <Skeleton
              width="250px"
              height="15px"
              row={3}
              title
              animated
              avatar
              avatarSize="100px"
              loading={true}
              key={topic.id}
            >
              <div className="container">
                <Avatar
                  size="50"
                  icon={
                    config.topicAvatar +
                    topic.publisherId +
                    ".jpg?" +
                    Date.now()
                  }
                />
                <div className="right-content">
                  <Row>
                    <Col span="12">
                      <span className="title">
                        {" "}
                        <Tag
                          type={tagColor[++tag % 4]}
                          round
                          style={{ width: "100px" }}
                        >
                          {topic.publisherName}
                        </Tag>
                      </span>
                    </Col>
                    <Col span="12">
                      <Tag type="success" round>
                        {topic.timer}
                      </Tag>
                    </Col>
                  </Row>
                  <div className="desc">
                    <Ellipsis
                      content={topic.content}
                      direction="end"
                      expandText="展开"
                      collapseText="收起"
                    />
                  </div>
                </div>
                <Grid>
                  {images.map((image, index) => {
                    return (
                      <Image
                        src={
                          config.topicImage + "/" + image + ".jpg?" + Date.now()
                        }
                        width="150"
                        height="150"
                        fit="contain"
                        position="left"
                        key={index}
                      />
                    );
                  })}
                </Grid>
                <br />
                <Input
                  label="评论"
                  placeholder="请输入内容"
                  defaultValue={commentText}
                  type="textarea"
                  showWordLimit
                  rows="2"
                  maxlength="50"
                  onChange={(value: string) => {
                    commentText = value;
                  }}
                  slotButton={
                    <Button
                      type={"success"}
                      onClick={() => sendComment(topic.id)}
                      style={{ width: "80px" }}
                    >
                      发送
                    </Button>
                  }
                />
                <Collapse icon="arrow-down" iconSize="16" iconColor="#999">
                  <CollapseItem title="评论区" name={topic.id}>
                    {comments.map((comment: Comment) => {
                      if (comment.topic_id === topic.id) {
                        return (
                          <Skeleton
                            width="250px"
                            height="15px"
                            title
                            animated
                            avatar
                            row={3}
                            loading
                            key={comment.id}
                          >
                            <div className="container">
                              <Avatar
                                size="50"
                                icon={
                                  Config.topicAvatar +
                                  comment.commenter_id +
                                  ".jpg?" +
                                  Date.now()
                                }
                              />
                              <div className="right-content">
                                <span className="title">
                                  {comment.commenter_name}
                                </span>
                                <span className="title">
                                  <Tag
                                    type={"success"}
                                    style={{
                                      width: "100px",
                                      margin: "0 70%",
                                    }}
                                  >
                                    {comment.comment_timer}
                                  </Tag>
                                </span>
                                <div className="desc">
                                  {comment.comment_text}
                                </div>
                              </div>
                            </div>
                            <Divider />
                          </Skeleton>
                        );
                      }
                    })}
                  </CollapseItem>
                </Collapse>
              </div>
              <br />
              <br />
            </Skeleton>
          );
        })}
      </PullToRefresh>
      <Sticky top={0} position="bottom" className={"bottom"}>
        <Button type="primary" onClick={() => setVisible(true)}>
          +发布帖子
        </Button>
      </Sticky>
      {/*发布弹框展示*/}
      <Dialog
        title="发布帖子"
        visible={visible}
        onOk={publish}
        onCancel={() => {
          setPublishText("");
          setVisible(false);
        }}
      >
        <Form>
          <TextArea
            defaultValue={publishText}
            className="text-1"
            style={{ fontSize: "12px" }}
            onChange={(value: string, event: Event) => {
              setPublishText(value);
            }}
          />
          <h2>请选择图片(限6张)</h2>
          <Uploader
            url={uploadUrl}
            defaultFileList={defaultFileList}
            maximum="6"
            multiple={true}
            uploadIcon="uploader"
            autoUpload={false}
            ref={uploadRef}
            method="post"
            onSuccess={publishSuccess}
            onFailure={(responseText: object) => {
              console.log(responseText);
            }}
          />
        </Form>
      </Dialog>
      <WaterMark
        className="mark1"
        zIndex={1}
        content="nut-ui-water-mark"
      ></WaterMark>
    </>
  );
};
