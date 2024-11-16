import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import PlaceIcon from "@mui/icons-material/Place";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import axios from "axios";

const events = [
  {
    id: 1,
    title: "庫拉皮卡演唱會",
    description: "這是庫拉皮卡演唱會 的詳細信息。",
    image: "/images/seat/concert1_seat.png",
    date: "2025-05-20",
    venue: "新北大巨蛋",
    seats: {
      A: { total: 100, remaining: 0, price: 5000 },
      B: { total: 150, remaining: 0, price: 3600 },
      C: { total: 200, remaining: 0, price: 2200 },
    },
  },
  {
    id: 2,
    title: "演唱會 B",
    description: "這是演唱會 B 的詳細信息。",
    image: "https://via.placeholder.com/600x400",
    date: "2024-12-15",
    venue: "音樂廳",
    seats: {
      A: { total: 100, remaining: 0, price: 5000 },
      B: { total: 150, remaining: 0, price: 3600 },
      C: { total: 200, remaining: 0, price: 2200 },
    },
  },
];

function Purchase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find((e) => e.id === parseInt(id));
  const [quantity, setQuantity] = useState(1);
  const [selectedArea, setSelectedArea] = useState("A");
  const [remainingSeat, setRemainingSeat] = useState(0);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // 用於儲存是否組件已卸載，防止內存洩漏
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (event && selectedArea) {
      fetchRemainingSeats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, selectedArea]);

  const fetchRemainingSeats = () => {
    axios
      .get(`http://localhost:8080/api/ticket/seat`, {
        params: { concertId: event.id, seatArea: selectedArea },
      })
      .then((response) => {
        const { data } = response;
        if (data.status === "success") {
          setRemainingSeat(data.result.remainingSeat);
        } else {
          console.error("Failed to fetch remaining seats");
          setRemainingSeat(0);
        }
      })
      .catch((error) => {
        console.error("API error:", error);
        setRemainingSeat(0);
      });
  };

  if (!event) {
    return <Typography variant="h5">找不到該活動。</Typography>;
  }

  const handlePurchase = () => {
    setLoading(true);
    const payload = {
      concertId: event.id.toString(),
      seatArea: selectedArea,
      quantity: quantity,
    };

    axios
      .post("http://localhost:8080/api/ticket/grab", payload)
      .then((response) => {
        const { data } = response;
        if (data.status === "success" && data.result.orderId) {
          setSnackbar({
            open: true,
            message: "購票成功！正在確認訂單狀態...",
            severity: "success",
          });
          // 開始輪詢訂單狀態
          pollOrderStatus(data.result.orderId);
        } else {
          setSnackbar({
            open: true,
            message: data.message || "購票失敗！",
            severity: "error",
          });
        }
      })
      .catch((error) => {
        console.error("購票請求失敗：", error);
        setSnackbar({
          open: true,
          message: "購票請求失敗，請稍後再試。",
          severity: "error",
        });
      })
      .finally(() => {
        if (isMounted.current) {
          setLoading(false);
        }
      });
  };

  const pollOrderStatus = (orderId) => {
    // 設置輪詢狀態為 true
    setPolling(true);

    const poll = () => {
      axios
        .get(`http://localhost:8080/api/order/${orderId}`)
        .then((response) => {
          const { data } = response;
          if (data.status === "success" && data.code === 20000) {
            setSnackbar({
              open: true,
              message: "訂單確認成功！",
              severity: "success",
            });
            if (isMounted.current) {
              setPolling(false);
              navigate(`/order/${orderId}`);
            }
          } else if (data.code === -40008) {
            // 訂單處理中，繼續輪詢
            console.log("訂單處理中，繼續輪詢...");
            if (isMounted.current) {
              setTimeout(poll, 5000); // 每5秒輪詢一次
            }
          } else if (data.code === -40009) {
            // 訂單失敗，停止輪詢並顯示錯誤
            setSnackbar({
              open: true,
              message: data.message || "搶購失敗！",
              severity: "error",
            });
            if (isMounted.current) {
              setPolling(false);
            }
          } else {
            // 其他錯誤情況，停止輪詢並顯示錯誤
            setSnackbar({
              open: true,
              message: data.message || "訂單狀態查詢失敗！",
              severity: "error",
            });
            if (isMounted.current) {
              setPolling(false);
            }
          }
        })
        .catch((error) => {
          console.error("訂單狀態查詢失敗：", error);
          // 錯誤時繼續輪詢
          if (isMounted.current) {
            setTimeout(poll, 5000); // 每5秒輪詢一次
          }
        });
    };

    poll(); // 開始輪詢
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const selectedSeat = event.seats[selectedArea];
  const totalPrice = selectedSeat.price * quantity;

  return (
    <Container sx={{ marginTop: 4 }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          padding: 2,
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: { xs: "100%", md: 300 },
            height: "auto",
            borderRadius: 2,
          }}
          image={event.image}
          alt={event.title}
        />
        <CardContent
          sx={{
            flex: "1 0 auto",
            paddingLeft: { md: 4 },
            paddingTop: { xs: 2, md: 0 },
          }}
        >
          <Typography variant="h4" gutterBottom>
            {event.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {event.description}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
            <EventIcon color="action" sx={{ marginRight: 1 }} />
            <Typography variant="body1" color="text.secondary">
              演出時間：{event.date}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
            <PlaceIcon color="action" sx={{ marginRight: 1 }} />
            <Typography variant="body1" color="text.secondary">
              地點：{event.venue}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", marginTop: 3 }}>
            <AttachMoneyIcon color="action" sx={{ marginRight: 1 }} />
            <Typography variant="h6">
              每張票價：${selectedSeat.price}
            </Typography>
          </Box>

          <FormControl fullWidth sx={{ marginTop: 3 }}>
            <InputLabel>區域</InputLabel>
            <Select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              label="區域"
            >
              {Object.keys(event.seats).map((area) => (
                <MenuItem key={area} value={area}>
                  {area} 區
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginTop: 1 }}
          >
            剩餘座位：{remainingSeat} 張
          </Typography>

          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>購票數量</InputLabel>
            <Select
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              label="購票數量"
            >
              {Array.from(
                { length: Math.min(4, remainingSeat) },
                (_, i) => i + 1
              ).map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="h6" sx={{ marginTop: 3 }}>
            總計：${totalPrice}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handlePurchase}
            fullWidth
            sx={{ marginTop: 3 }}
            disabled={
              quantity > remainingSeat ||
              remainingSeat === 0 ||
              loading ||
              polling
            }
          >
            {loading || polling ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress
                  size={24}
                  color="inherit"
                  sx={{ marginRight: 1 }}
                />
                處理中...
              </Box>
            ) : (
              "確認購票"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 全屏輪播覆蓋層 */}
      {polling && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <CircularProgress size={80} />
          <Typography variant="h6" sx={{ color: "white", marginTop: 2 }}>
            訂單處理中，請稍後...
          </Typography>
        </Box>
      )}

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

export default Purchase;
