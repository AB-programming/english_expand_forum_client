import React, { useState } from "react";
import { Tabs, TabPane, Icon } from "@nutui/nutui-react";

export default (props: any) => {
  const [tab7value, setTab7value] = useState("c1");
  const list6 = [
    {
      title: "首页",
      paneKey: "c1",
      icon: "dongdong",
    },
    {
      title: "消息",
      paneKey: "c2",
      icon: "comment",
    },
    {
      title: "我的",
      paneKey: "c3",
      icon: "my2",
    },
  ];

  return (
    <>
      <Tabs
        value={tab7value}
        titleNode={() => {
          return list6.map((item) => (
            <div
              onClick={() => {
                setTab7value(item.paneKey);
                props.router(item.paneKey);
              }}
              className={`nut-tabs__titles-item ${
                tab7value == item.paneKey ? "active" : ""
              }`}
              key={item.paneKey}
            >
              {item.icon && <Icon name={item.icon} />}
              <span className="nut-tabs__titles-item__text">{item.title}</span>
              <span className="nut-tabs__titles-item__line" />
            </div>
          ));
        }}
      ></Tabs>
    </>
  );
};
