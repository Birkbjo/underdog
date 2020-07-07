import React from 'react';
import { Box, Card, Typography } from '@material-ui/core';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return (
        <Card>
          <Box my={10}>
            <Typography align="center" variant="h4" color="error">
              Ooops... Something went wrong
            </Typography>
          </Box>
        </Card>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
