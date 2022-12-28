import React from "react";
import {
  Box,
  IconButton,
  Typography,
  Stack,
  Avatar,
  Badge,
  InputBase,
  Divider,
  Button,
} from "@mui/material";
import SimpleBar from "simplebar-react";
import { SimpleBarStyle } from "../../components/Scrollbar";
import { ChatList } from "../../data";
import { faker } from "@faker-js/faker";
import { useTheme, styled, alpha } from "@mui/material/styles";
import { ArchiveBox, MagnifyingGlass, CircleDashed } from "phosphor-react";

// -----------------------
// for the badge on the avatar
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

// -------------------------
const ChatElement = ({ id, name, img, msg, time, unread, online }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#fff"
            : theme.palette.background.default,
      }}
      p={2}
    >
      <Stack
        flexDirection={"row"}
        alignItems="center"
        justifyContent={"space-between"}
        sx={{ position: "relative" }}
      >
        <Stack flexDirection={"row"} alignItems="center" spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt="profile photo" src={faker.image.avatar()} />
            </StyledBadge>
          ) : (
            <Avatar alt="profile photo" src={faker.image.avatar()} />
          )}
          {/* ------------------------------------ */}
          <Stack
            spacing={0.3}
            sx={{ marginTop: "0px !important", marginLeft: "10px !important" }}
          >
            <Typography variant="caption">{name}</Typography>
            <Typography variant="caption">{msg}</Typography>
          </Stack>
          {/* ---------------------------------- */}

          <Stack
            spacing={2}
            alignItems={"center"}
            sx={{
              marginTop: "0px !important",
              position: "absolute",
              right: "0",
            }}
          >
            <Typography sx={{ fontWeight: 600 }} variant="caption">
              {time}
            </Typography>
            <Badge color="primary" badgeContent={unread}></Badge>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};
// -------------------

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 20,
  backgroundColor: alpha(theme.palette.background.default, 1),
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
  },
}));

const truncateText = (string, n) => {
  return string.length > n ? `${string.slice(0, n)}...` : string;
};

const StyledChatBox = styled(Box)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

// ---------------------------
const Chats = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: "relative",
        width: 320,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#f8faff"
            : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
      }}
    >
      <Stack p={3} spacing={2} sx={{ height: "100%" }}>
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5">Chats</Typography>
          <IconButton>
            <CircleDashed />
          </IconButton>
        </Stack>
        {/* ------------ Search Field ---------------- */}
        <Stack sx={{ width: "100%" }}>
          <Search>
            <SearchIconWrapper>
              <MagnifyingGlass color="#709ce6" />
            </SearchIconWrapper>
            <StyledInputBase placeholder="search..." />
          </Search>
        </Stack>
        {/* ----------------------------- */}
        <Stack spacing={1}>
          <Stack
            flexDirection={"row"}
            alignItems="center"
            spacing={1.5}
            sx={{ paddingTop: "10px" }}
          >
            <ArchiveBox size={24} />
            {/* There is a margin top coming from material ui emoticon */}
            <Button sx={{ marginTop: "0px !important" }}>Archive</Button>
          </Stack>
          <Divider />
        </Stack>
        {/* ------------------------------------ */}

        <Stack
          spacing={1}
          sx={{ flexGrow: 1, overflowY: "scroll", height: "100%" }}
        >
          <SimpleBarStyle timeout={500} clickOnTrack={false}>
            <Stack spacing={2.4}>
              <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                Pinned
              </Typography>
              {/* Chat List */}
              {ChatList.filter((el) => el.pinned).map((el) => {
                return <ChatElement {...el} key={el.id} />;
              })}
              <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                All Chats
              </Typography>
              {/* Chat List */}
              {ChatList.filter((el) => !el.pinned).map((el) => {
                return <ChatElement {...el} key={el.id} />;
              })}
            </Stack>
          </SimpleBarStyle>
        </Stack>
        {/* ------------------------------------------------ */}
      </Stack>
    </Box>
  );
};

export default Chats;
