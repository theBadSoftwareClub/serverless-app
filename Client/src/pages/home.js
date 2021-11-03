import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Container,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';



const Home = () => {
  const app_theme = useTheme();

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
