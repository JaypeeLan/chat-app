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

const SharedMessages = () => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
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
            <Typography variant="subtitle2">Shared messages</Typography>
          </Stack>
        </Box>

        {/* --- */}
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <Tabs
            sx={{ px: 2, pt: 2 }}
            value={value}
            onChange={handleChange}
            centered
          >
            <Tab label="Media" />
            <Tab label="Links" />
            <Tab label="Docs" />
          </Tabs>
        </Box>
        {/* body */}
        <Stack
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflow: "scroll",
          }}
          p={3}
          spacing={value === 1 ? 1 : 3}
        >
          {(() => {
            switch (value) {
              case 0:
                // images
                return (
                  <Grid container spacing={2}>
                    {[0, 1, 2, 3, 4, 5, 6].map((elem) => {
                      return (
                        <Grid item xs={4}>
                          <img
                            src={faker.image.avatar()}
                            alt={faker.name.fullName()}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                );
              case 1:
                // links
                return SHARED_LINKS.map((elem) => <LinkMsg chat={elem} />);
              case 2:
                // Docs
                return SHARED_DOCS.map((elem) => <DocMsg chat={elem} />);

              default:
                break;
            }
          })()}
        </Stack>
      </Stack>
    </Box>
  );
};

export default SharedMessages;
