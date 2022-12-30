import React from "react";
import { Box, Stack } from "@mui/material";
import { Chat_History } from "../../data";
import {
  TimeLine,
  TextMsg,
  MediaMsg,
  ReplyMsg,
  LinkMsg,
  DocMsg,
} from "./MsgTypes";

const Message = () => {
  return (
    <Box p={3}>
      <Stack spacing={3}>
        {Chat_History.map((chat) => {
          switch (chat?.type) {
            case "divider":
              // timeline
              return <TimeLine chat={chat} />;
            case "msg":
              switch (chat.subtype) {
                case "img":
                  return <MediaMsg chat={chat} />;
                case "doc":
                  return <DocMsg chat={chat} />;
                case "link":
                  return <LinkMsg chat={chat} />;
                case "reply":
                  return <ReplyMsg chat={chat} />;
                default:
                  // ordinary text
                  return <TextMsg chat={chat} />;
              }
            default:
              return <></>;
          }
        })}
      </Stack>
    </Box>
  );
};

export default Message;
