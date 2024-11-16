// src/pages/Register.js
import React, { useState } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    // 在此處處理註冊邏輯，如調用後端 API
    // 假設註冊成功後導航到登入頁
    alert("註冊成功！");
    navigate("/login");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          註冊
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
          onClick={handleRegister}
        >
          註冊
        </Button>
      </Box>
    </Container>
  );
}

export default Register;
