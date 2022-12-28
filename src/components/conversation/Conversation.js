import { Box, Stack } from "@mui/material";
import React from "react";

const Conversation = () => {
  return (
    <Stack height={"100%"} maxHeight="100vh" width="auto">
      {/* -------- chat header ------------ */}
      <Box
        sx={{
          height: 100,
          width: "100%",
          backgroundColor: "#f8faff",
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      ></Box>

      {/*---------- msgs -------------------- */}
      <Box width="100%" sx={{ flexGrow: 1 }}></Box>

      {/* ---------- chat footer -------------- */}
      <Box
        sx={{
          height: 100,
          width: "100%",
          backgroundColor: "#f8faff",
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      ></Box>
    </Stack>
  );
};

export default Conversation;
