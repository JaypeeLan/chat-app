import { ChatHeader, ChatFooter } from "../Chat/";
import { Box, Stack, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";

import React from "react";
import Message from "./Message";

// for the badge on the avatar
// const StyledBadge = styled(Badge)(({ theme }) => ({
//   "& .MuiBadge-badge": {
//     backgroundColor: "#44b700",
//     color: "#44b700",
//     boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
//     "&::after": {
//       position: "absolute",
//       top: 0,
//       left: 0,
//       width: "100%",
//       height: "100%",
//       borderRadius: "50%",
//       animation: "ripple 1.2s infinite ease-in-out",
//       border: "1px solid currentColor",
//       content: '""',
//     },
//   },
//   "@keyframes ripple": {
//     "0%": {
//       transform: "scale(.8)",
//       opacity: 1,
//     },
//     "100%": {
//       transform: "scale(2.4)",
//       opacity: 0,
//     },
//   },
// }));

const Conversation = () => {
  return (
    <Stack height={"100%"} maxHeight="100vh" width="auto">
      {/* -------- chat header ------------ */}
      <ChatHeader />
      {/*---------- msgs -------------------- */}
      <Box
        width="100%"
        sx={{ flexGrow: 1, height: "100%", overflowY: "scroll" }}
      >
        <Message menu={true} />
      </Box>

      {/* ---------- chat footer -------------- */}
      <ChatFooter />
    </Stack>
  );
};

export default Conversation;
