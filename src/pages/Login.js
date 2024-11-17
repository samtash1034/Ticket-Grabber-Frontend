// src/pages/Login.js
import React, { useState } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    alert("登入成功！");
    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          登入
        </Typography>
        <TextField
          label="電子郵件"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="密碼"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 2 }}
          onClick={handleLogin}
        >
          登入
        </Button>
      </Box>
    </Container>
  );
}

export default Login;
