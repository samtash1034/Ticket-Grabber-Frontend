// src/components/NavBar.js
import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            搶票系統
          </Typography>
          <Button color="inherit" component={Link} to="/">
            首頁
          </Button>
          <Button color="inherit" component={Link} to="/user">
            用戶中心
          </Button>
          <Button color="inherit" component={Link} to="/login">
            登入
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavBar;
