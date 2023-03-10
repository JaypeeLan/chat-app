import React from "react";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CaretDown, MagnifyingGlass, Phone, VideoCamera } from "phosphor-react";
import { faker } from "@faker-js/faker";
import { dispatch } from "../../redux/store";
import { ToggleSidebar } from "../../redux/slices/app";
import { useDispatch } from "react-redux";
// import { useSearchParams } from "react-router-dom";
// import useResponsive from "../../hooks/useResponsive";

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

// const Conversation_Menu = [
//   {
//     title: "Contact info",
//   },
//   {
//     title: "Mute notifications",
//   },
//   {
//     title: "Clear messages",
//   },
//   {
//     title: "Delete chat",
//   },
// ];

const ChatHeader = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  // const isMobile = useResponsive("between", "md", "xs", "sm");
  // const [searchParams, setSearchParams] = useSearchParams();

  // const [conversationMenuAnchorEl, setConversationMenuAnchorEl] =
  //   React.useState(null);
  // const openConversationMenu = Boolean(conversationMenuAnchorEl);
  // const handleClickConversationMenu = (event) => {
  //   setConversationMenuAnchorEl(event.currentTarget);
  // };
  // const handleCloseConversationMenu = () => {
  //   setConversationMenuAnchorEl(null);
  // };

  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        height: 100,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#fff"
            : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems={"center"}
        sx={{ width: "100%", height: "100%" }}
      >
        {/* ---------------------------------- */}
        <Stack
          onClick={() => {
            dispatch(ToggleSidebar());
          }}
          direction={"row"}
          spacing={2}
        >
          <Box>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={faker.name.fullName()} src={faker.image.avatar()} />
            </StyledBadge>
            {/* --------------- */}
          </Box>
          <Stack spacing={0.2}>
            <Typography>{faker.name.fullName()}</Typography>
            <Typography variant="caption">online</Typography>
          </Stack>
        </Stack>
        {/* --------------------------------- */}
        <Stack direction={"row"} alignItems="center" spacing={3}>
          <IconButton>
            <VideoCamera />
          </IconButton>
          <IconButton>
            <Phone />
          </IconButton>
          <IconButton>
            <MagnifyingGlass />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <IconButton>
            <CaretDown />
          </IconButton>
        </Stack>

        {/* --------------------------------- */}
      </Stack>
    </Box>
  );
};

export default ChatHeader;
