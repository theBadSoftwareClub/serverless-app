import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Container,
} from '@material-ui/core';



const Home = () => {

  return (
    <Container className="container">
      <Typography variant="h4">
        Landing Page
      </Typography>
      <Card>
        <CardContent>
          Public content can live on the landing page.
        </CardContent>
      </Card>
    </Container>
  );
};

export default Home;
