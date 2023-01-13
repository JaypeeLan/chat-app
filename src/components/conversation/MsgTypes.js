import React, { useState } from "react";
import {
  Divider,
  Stack,
  Typography,
  Box,
  Link,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DotsThreeVertical, DownloadSimple, Image } from "phosphor-react";

// ---------------------------
import { Message_options } from "../../data/index";
// -----------------------------------------

const DocMsg = ({ chat, menu }) => {
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
          <Typography
            variant="body2"
            sx={{
              backgroundColor: chat.incoming ? theme.palette.text : "#fff",
            }}
          >
            {chat.message}
          </Typography>
        </Stack>
      </Box>
      {menu && <MessageOptions />}
    </Stack>
  );
};

//
const LinkMsg = ({ chat, menu }) => {
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
      {menu && <MessageOptions />}
    </Stack>
  );
};

// ------------
const ReplyMsg = ({ chat, menu }) => {
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
      {menu && <MessageOptions />}
    </Stack>
  );
};

// -------------------------------------------------

const MediaMsg = ({ chat, menu }) => {
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
      {menu && <MessageOptions />}
    </Stack>
  );
};

const TextMsg = ({ chat, menu }) => {
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
      {/* vertical icon */}
      {menu && <MessageOptions />}
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

const MessageOptions = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  return (
    <>
      <DotsThreeVertical
        size={20}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack spacing={1} px={1}>
          {Message_options.map((elem) => (
            <MenuItem onClick={handleClick}>{elem.title}</MenuItem>
          ))}
        </Stack>
      </Menu>
    </>
  );
};

export { TimeLine, TextMsg, MediaMsg, ReplyMsg, LinkMsg, DocMsg };
