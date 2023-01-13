import React, { forwardRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Bell,
  CaretRight,
  Phone,
  Prohibit,
  Star,
  Trash,
  VideoCamera,
  X,
} from "phosphor-react";
import { useDispatch } from "react-redux";
import { ToggleSidebar, updateSidebarType } from "../redux/slices/app";
import { faker } from "@faker-js/faker";
import AntSwitch from "./AntSwitch";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BlockDialog = ({ open, handleClose }) => {
  <Dialog
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={handleClose}
    aria-describedby="alert-dialog-slide-description"
  >
    <DialogTitle>{"Block this contact"}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-slide-description">
        Are you sure you want to delete this chat?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button onClick={handleClose}>Yes</Button>
    </DialogActions>
  </Dialog>;
};
const DeleteDialog = ({ open, handleClose }) => {
  <Dialog
    open={open}
    TransitionComponent={Transition}
    keepMounted
    onClose={handleClose}
    aria-describedby="alert-dialog-slide-description"
  >
    <DialogTitle>{"Delete this chat"}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-slide-description">
        Are you sure you want to block this contact?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose}>Cancel</Button>
      <Button onClick={handleClose}>Yes</Button>
    </DialogActions>
  </Dialog>;
};

const Contact = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [openBlock, setOpenBlock] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const handleCloseBlock = () => {
    setOpenBlock(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  return (
    <Box sx={{ width: 320, height: "100vh" }}>
      <Stack sx={{ height: "100%" }}>
        {/* header */}
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
            justifyContent={"space-between"}
            sx={{ p: 2, height: "100%" }}
            spacing={3}
          >
            <Typography variant="subtitle2">Contact Info</Typography>
            <IconButton
              onClick={() => {
                dispatch(ToggleSidebar());
              }}
            >
              <X />
            </IconButton>
          </Stack>
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
          spacing={3}
        >
          <Stack alignItems={"center"} direction="row" spacing={3}>
            <Avatar
              src={faker.image.avatar()}
              alt={faker.name.firstName()}
              sx={{ height: 64, width: 64 }}
            />
            <Stack spacing={0.5}>
              <Typography variant="article" fontWeight={600}>
                {faker.name.fullName()}
              </Typography>
              <Typography variant="article" fontWeight={500}>
                {"+234 805 437 0764"}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            direction={"row"}
            alignItems="center"
            justifyContent={"space-evenly"}
          >
            <Stack spacing={1} alignItems="center">
              <IconButton>
                <Phone />
              </IconButton>
              <Typography variant="overline">Voice</Typography>
            </Stack>
            <Stack spacing={1} alignItems="center">
              <IconButton>
                <VideoCamera />
              </IconButton>
              <Typography variant="overline">Video</Typography>
            </Stack>
          </Stack>
          <Divider />
          <Stack spacing={0.5}>
            <Typography variant="article">About</Typography>
            <Typography variant="body2">
              Lorem ipsum dolor sit amet consectetur.
            </Typography>
          </Stack>
          <Divider />

          <Stack
            direction={"row"}
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Typography variant="subtitle2">Media, Links and Docs</Typography>
            <Button
              onClick={() => {
                dispatch(updateSidebarType("SHARED"));
              }}
              endIcon={<CaretRight />}
            >
              401
            </Button>
          </Stack>
          <Stack direction={"row"} spacing={2} alignItems="center">
            {[1, 2, 3].map((el) => (
              <Box>
                <img
                  src={faker.image.food()}
                  alt={faker.name.fullName()}
                  srcset=""
                />
              </Box>
            ))}
          </Stack>
          <Divider />
          {/* ----------- Starred and right icon----------------- */}
          <Stack
            direction={"row"}
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Stack direction={"row"} alignItems="center" spacing={2}>
              <Star size={21} />
              <Typography variant="subtitle2">Starred messages</Typography>
            </Stack>
            <IconButton
              onClick={() => {
                dispatch(updateSidebarType("STARRED"));
              }}
            >
              <CaretRight />
            </IconButton>
          </Stack>
          <Divider />

          {/* -------------------------------- */}
          <Stack
            direction={"row"}
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Stack direction={"row"} alignItems="center" spacing={2}>
              <Bell size={21} />
              <Typography variant="subtitle2">Mute Notification</Typography>
            </Stack>
            <AntSwitch />
          </Stack>
          <Divider />

          {/* --------------------------------- */}
          <Typography>1 group in common</Typography>
          <Stack direction={"row"} spacing={2} alignItems="center">
            <Avatar src={faker.image.avatar()} alt={faker.name.fullName()} />
            <Stack spacing={0.5}>
              <Typography variant="subtitle2">Hello World</Typography>
              <Typography variant="caption">Hello, World, Cat, You </Typography>
            </Stack>
          </Stack>

          {/* ---- */}
          <Stack direction={"row"} alignItems="center" spacing={2}>
            <Button
              onClick={() => {
                setOpenBlock(true);
              }}
              startIcon={<Prohibit />}
              fullWidth
              variant="outlined"
            >
              Block
            </Button>
            <Button
              onClick={() => {
                setOpenDelete(true);
              }}
              startIcon={<Trash />}
              fullWidth
              variant="outlined"
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </Stack>
      {openBlock && (
        <BlockDialog open={openBlock} handleClose={handleCloseBlock} />
      )}
      {openDelete && (
        <DeleteDialog open={openBlock} handleClose={handleCloseDelete} />
      )}
    </Box>
  );
};

export default Contact;
