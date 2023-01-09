import { Stack, Box, useTheme } from "@mui/material";
import React from "react";
import Chats from "./Chats";
import Conversation from "../../components/conversation/Conversation";
import Contact from "../../components/Contact";
import { useSelector } from "react-redux";

const GeneralApp = () => {
  const theme = useTheme();
  const { sidebar } = useSelector((store) => store.app);
  return (
    <Stack direction={"row"} sx={{ width: "100%" }}>
      <Chats />
      {/* subtract total width from sidebar and chats and contact section width */}
      <Box
        sx={{
          height: "100%",
          width: sidebar.open ? "calc(100vw - 740px)" : "calc(100vw - 420px)",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#f0fafa"
              : theme.palette.background.default,
        }}
      >
        <Conversation />
      </Box>
      {/* ----- Contact ------- */}
      {sidebar.open && <Contact />}
    </Stack>
  );
};

export default GeneralApp;
