import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Order() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = () => {
    axios
      .get(`${API_BASE_URL}/order/${orderId}`)
      .then((response) => {
        const { data } = response;
        if (data.status === "success" && data.code === 20000) {
          setOrder(data.result);
        } else {
          setSnackbar({
            open: true,
            message: data.message || "無法獲取訂單資訊",
            severity: "error",
          });
        }
      })
      .catch((error) => {
        console.error("訂單資訊請求失敗：", error);
        setSnackbar({
          open: true,
          message: "訂單資訊請求失敗，請稍後再試。",
          severity: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePayment = () => {
    setSnackbar({
      open: true,
      message: "付款功能尚未實現。",
      severity: "info",
    });
  };

  if (loading) {
    return (
      <Container sx={{ marginTop: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          載入訂單資訊中...
        </Typography>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container sx={{ marginTop: 4 }}>
        <Typography variant="h5">無法獲取訂單資訊。</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            訂單詳情
          </Typography>
          <Typography variant="h6" gutterBottom>
            演唱會名稱：{order.concertName}
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6">訂單編號：{order.orderId}</Typography>
            <Typography variant="h6">訂單狀態：成功</Typography>
            <Typography variant="h6">
              創建時間：{new Date(order.createTime).toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ marginTop: 4 }}>
            <Typography variant="h5" gutterBottom>
              座位資訊
            </Typography>
            {order.detailResponses && order.detailResponses.length > 0 ? (
              order.detailResponses.map((detail, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                  <Typography variant="body1">
                    訂單號碼：{detail.orderNo}
                  </Typography>
                  <Typography variant="body1">座位：{detail.seat}</Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body1">無座位資訊。</Typography>
            )}
          </Box>
          <Box sx={{ marginTop: 4, textAlign: "center" }}>
            <Button variant="contained" color="primary" onClick={handlePayment}>
              進行付款
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Order;
