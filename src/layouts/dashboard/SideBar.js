import { Box, Stack, IconButton, Divider, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Gear } from "phosphor-react";
import { faker } from "@faker-js/faker";
import useSettings from "../../hooks/useSettings";
import logo from "../../assets/Images/logo.ico";
import { Nav_Buttons } from "../../data";
import AntSwitch from "../../components/AntSwitch";
import React, { useState } from "react";

const SideBar = () => {
  const theme = useTheme();
  const [selected, setSelected] = useState();
  const { onToggleMode } = useSettings();
  return (
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
        justifyContent="space-between"
        spacing={3}
        sx={{ width: "100%", height: "100%" }}
      >
        <Stack alignItems="center" spacing={4}>
          <Box
            sx={{
              backgroundColor: theme.palette.primary.main,
              height: 64,
              width: 64,
              borderRadius: 1.5,
            }}
          >
            <img src={logo} alt="logo" />
          </Box>

          {/* --------------------------------- */}
          <Stack
            sx={{ width: "max-content" }}
            direction="column"
            alignItems="center"
            spacing={3}
          >
            {/* ------if the icon is selected, return it with a blue bg ---- */}
            {Nav_Buttons.map((elem) =>
              elem.index === selected ? (
                <Box
                  p={1}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 1.5,
                  }}
                >
                  <IconButton
                    sx={{ width: "max-content", color: "#fff" }}
                    key={elem.index}
                  >
                    {elem.icon}
                  </IconButton>
                </Box>
              ) : (
                <IconButton
                  onClick={() => setSelected(elem.index)}
                  sx={{
                    width: "max-content",
                    color:
                      theme.palette.mode === "light"
                        ? "#000"
                        : theme.palette.text.primary,
                  }}
                  key={elem.index}
                >
                  {elem.icon}
                </IconButton>
              )
            )}
            <Divider sx={{ width: "48px" }} />

            {/* put a blue bg if the gear icon is selected */}
            {selected === 3 ? (
              <Box
                p={1}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 1.5,
                }}
              >
                {/* hard coding the state since we are not mapping an array and the index is static */}
                <IconButton sx={{ width: "max-content", color: "#fff" }}>
                  <Gear />
                </IconButton>
              </Box>
            ) : (
              <IconButton
                onClick={() => setSelected(3)}
                sx={{
                  width: "max-content",
                  color:
                    theme.palette.mode === "light"
                      ? "#000"
                      : theme.palette.text.primary,
                }}
              >
                <Gear />
              </IconButton>
            )}
          </Stack>
        </Stack>
        {/* =========================================================== */}

        {/* ----------------------------------- */}
        <Stack spacing={4}>
          <AntSwitch
            onChange={() => {
              onToggleMode();
            }}
            defaultChecked
          />
          <Avatar src={faker.image.avatar()} />
        </Stack>
        {/* ----------------------------------- */}
      </Stack>
    </Box>
  );
};

export default SideBar;
