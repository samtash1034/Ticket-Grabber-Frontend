import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

const events = [
  {
    id: 1,
    title: "庫拉皮卡丘演唱會",
    description: "這是庫拉皮卡丘演唱會 的詳細信息。",
    image: "/images/concert/concert1.png",
    date: "2025-05-20",
    venue: "新北大巨蛋",
  },
  {
    id: 2,
    title: "演唱會 B",
    description: "這是演唱會 B 的詳細信息。",
    image: "https://via.placeholder.com/600x400",
    date: "2024-12-15",
    venue: "音樂廳",
  },
];

function EventDetail() {
  const { id } = useParams();
  const event = events.find((e) => e.id === parseInt(id));

  if (!event) {
    return <Typography variant="h5">找不到該活動。</Typography>;
  }

  return (
    <Container>
      <Card>
        <CardMedia
          component="img"
          height="400"
          image={event.image}
          alt={event.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h4" component="div">
            {event.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {event.description}
          </Typography>
          <Typography variant="h6" color="text.primary" sx={{ marginTop: 2 }}>
            日期：{event.date}
          </Typography>
          <Typography variant="h6" color="text.primary">
            地點：{event.venue}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/purchase/${event.id}`}
            sx={{ marginTop: 2 }}
          >
            搶購門票
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

export default EventDetail;
