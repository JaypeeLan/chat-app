import React from "react";
import {
  Divider,
  Stack,
  Typography,
  Box,
  Link,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DownloadSimple, Image } from "phosphor-react";

const DocMsg = ({ chat }) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} justifyContent={chat.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: chat.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction={"row"}
            p={2}
            spacing={3}
            alignItems="center"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Image size={48} />
            <Typography variant="caption">Abstract.png</Typography>
            <IconButton>
              <DownloadSimple />
            </IconButton>
          </Stack>
          <Typography variant="body2"
            sx={{
              backgroundColor: chat.incoming ?  theme.palette.text : "#fff" 
            }}
          >
            {chat.message}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

const LinkMsg = ({ chat }) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} justifyContent={chat.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: chat.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            spacing={3}
            // alignItems="center"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <img
              src={chat.preview}
              alt={chat.message}
              style={{ maxHeight: 210, borderRadius: "10px" }}
            />
            <Stack spacing={2}>
              <Typography variant="subtitle2">careating chat app</Typography>
              <Typography
                variant="subtitle2"
                component={Link}
                to="//https://www.youtube.com"
              >
                www.youtube.com
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              color={chat.incoming ? theme.palette.text : "#fff"}
            >
              {chat.message}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

const ReplyMsg = ({ chat }) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} justifyContent={chat.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: chat.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction={"column"}
            p={2}
            spacing={3}
            alignItems="center"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color={theme.palette.text}>
              {chat.message}
            </Typography>
          </Stack>

          <Typography
            variant="body2"
            color={chat.incoming ? theme.palette.text : "#fff"}
          >
            {chat.reply}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

// -------------------------------------------------

const MediaMsg = ({ chat }) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} justifyContent={chat.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: chat.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={1}>
          <img
            src={chat.img}
            alt={chat.message}
            style={{ maxHeight: 210, borderRadius: 10 }}
          />
          <Typography
            variant="body2"
            color={chat.incoming ? theme.palette.text : "#fff"}
          >
            {chat.message}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

const TextMsg = ({ chat }) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} justifyContent={chat.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          backgroundColor: chat.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Typography
          variant="body2"
          color={chat.incoming ? theme.palette.text : "#fff"}
        >
          {chat.message}
        </Typography>
      </Box>
    </Stack>
  );
};

const TimeLine = ({ chat }) => {
  const theme = useTheme();
  return (
    <Stack
      direction={"row"}
      alignItems="center"
      justifyContent={"space-between"}
    >
      <Divider width="46%" />
      <Typography variant="caption" sx={{ color: theme.palette.text }}>
        {chat?.text}
      </Typography>
      <Divider width="46%" />
    </Stack>
  );
};

export { TimeLine, TextMsg, MediaMsg, ReplyMsg, LinkMsg, DocMsg };
