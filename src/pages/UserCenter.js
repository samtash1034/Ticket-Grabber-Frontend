import React from "react";
import { Container, Typography, Card, CardContent, Grid } from "@mui/material";

const userTickets = [
  {
    eventId: 1,
    eventTitle: "庫拉皮卡丘演唱會",
    quantity: 2,
    purchaseDate: "2024-11-01",
  },
  {
    eventId: 2,
    eventTitle: "演唱會 B",
    quantity: 1,
    purchaseDate: "2024-11-05",
  },
];

function UserCenter() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ marginTop: 4 }}>
        用戶中心
      </Typography>
      {userTickets.length === 0 ? (
        <Typography variant="body1">您尚未購買任何票務。</Typography>
      ) : (
        <Grid container spacing={4}>
          {userTickets.map((ticket, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h5">{ticket.eventTitle}</Typography>
                  <Typography variant="body1">
                    購票數量：{ticket.quantity}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    購票日期：{ticket.purchaseDate}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default UserCenter;
