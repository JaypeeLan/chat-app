import React from "react";
import { Outlet } from "react-router-dom";
import { Box, Divider, IconButton, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import logo from "../../assets/Images/logo.ico";

import { Nav_Buttons } from "../../data";
import { Gear } from "phosphor-react";

const DashboardLayout = () => {
  const theme = useTheme();
  return (
    <>
      <Box
        p={2}
        sx={{
          backgroundColor: theme.palette.background.paper,
          boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
          width: 100,
          height: "100vh",
        }}
      >
        {/* ====================================================== */}
        <Stack
          flexDirection="column"
          alignItems={"center"}
          spacing={3}
          sx={{ width: "100%" }}
        >
          <Box
            sx={{
              backgroundColor: theme.palette.main,
              height: 64,
              width: 64,
              borderRadius: 1.5,
            }}
          >
            <img src={logo} alt="logo" />
          </Box>

          {/* --------------------------------- */}
          <Stack spacing={3}>
            {Nav_Buttons.map((elem) => (
              <IconButton key={elem.index}>{elem.icon}</IconButton>
            ))}
          <Divider/>

          <IconButton>
            <Gear/>
          </IconButton>
          </Stack>


          {/* =========================================================== */}
        </Stack>
      </Box>

      <Outlet />
    </>
  );
};

export default DashboardLayout;
