import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { updateSidebarType } from "../redux/slices/app";
import { CaretLeft } from "phosphor-react";
import { faker } from "@faker-js/faker";
import { SHARED_DOCS, SHARED_LINKS } from "../data/index";
import { DocMsg, LinkMsg } from "./conversation/MsgTypes";
import Message from "./conversation/Message";

const StarredMessages = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  return (
    <Box sx={{ width: 320, height: "100vh" }}>
      <Stack sx={{ height: "100%" }}>
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0,0,0, 0.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#f8aff"
                : theme.palette.background,
          }}
        >
          <Stack
            direction={"row"}
            alignItems="center"
            spacing={3}
            sx={{ p: 2, height: "100%" }}
          >
            <IconButton
              onClick={() => {
                dispatch(updateSidebarType("CONTACT"));
              }}
            >
              <CaretLeft />
            </IconButton>
            <Typography variant="subtitle2">Starred messages</Typography>
          </Stack>
        </Box>

        {/* --- */}
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}></Box>
        {/* body */}
        <Stack
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflow: "scroll",
          }}
          p={3}
          spacing={2}
        >
         <Message/>
        </Stack>
      </Stack>
    </Box>
  );
};

export default StarredMessages;
