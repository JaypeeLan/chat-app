import {
  Avatar,
  Box,
  Stack,
  Badge,
  Typography,
  IconButton,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { faker } from "@faker-js/faker";
import React from "react";
import {
  CaretDown,
  LinkSimple,
  MagnifyingGlass,
  PaperPlaneTilt,
  Phone,
  Smiley,
  VideoCamera,
} from "phosphor-react";

// -------------- for footer -------------------------
const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px !important",
    paddingBottom: "12px !important",
  },
}));

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

const Conversation = () => {
  const theme = useTheme();
  return (
    <Stack height={"100%"} maxHeight="100vh" width="auto">
      {/* -------- chat header ------------ */}
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
          <Stack direction={"row"} spacing={2}>
            <Box>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  alt={faker.name.fullName()}
                  src={faker.image.avatar()}
                />
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

      {/*---------- msgs -------------------- */}
      <Box width="100%" sx={{ flexGrow: 1 }}></Box>

      {/* ---------- chat footer -------------- */}
      <Box
        p={2}
        sx={{
          width: "100%",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#fff"
              : theme.palette.background.paper,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Stack direction={"row"} alignItems="center" spacing={3}>
          <StyledInput
            fullWidth
            placeholder="write a message..."
            variant="filled"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment>
                  <IconButton>
                    <LinkSimple />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment>
                  <IconButton>
                    <Smiley />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box
            sx={{
              height: 48,
              width: 48,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 1.5,
            }}
          >
            <Stack
              sx={{
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconButton>
                <PaperPlaneTilt color="#fff" />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Conversation;