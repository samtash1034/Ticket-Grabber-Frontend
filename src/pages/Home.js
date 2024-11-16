import React from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";

// 假設有一個活動數據列表
const events = [
  {
    id: 1,
    title: "庫拉皮卡丘演唱會",
    description: "精彩的演唱會，快來搶購門票！",
    image: "/images/concert/concert1.png",
    salesStart: "2024-11-01",
    salesEnd: "2024-12-01",
  },
  {
    id: 2,
    title: "六條悟演唱會",
    description: "精彩的演唱會，快來搶購門票！",
    image: "/images/concert/concert2.png",
    salesStart: "2099-01-01",
    salesEnd: "2099-12-31",
  },
  // 更多活動...
];

function Home() {
  const currentDate = new Date();

  return (
    <Grid container spacing={4} padding={4}>
      {events.map((event) => {
        const salesStartDate = new Date(event.salesStart);
        const salesEndDate = new Date(event.salesEnd);
        const isSalesOpen =
          currentDate >= salesStartDate && currentDate <= salesEndDate;

        return (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card>
              <CardMedia
                component="img"
                height="350"
                width="350"
                image={event.image}
                alt={event.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.description}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginTop: 1 }}
                >
                  售票時間：{event.salesStart} - {event.salesEnd}
                </Typography>
              </CardContent>
              <Button
                size="small"
                component={Link}
                to={`/purchase/${event.id}`}
                disabled={!isSalesOpen}
              >
                立即購票
              </Button>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default Home;
