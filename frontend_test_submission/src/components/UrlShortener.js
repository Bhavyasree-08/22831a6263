import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";

function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortData, setShortData] = useState(null);

  const handleSubmit = async () => {
    if (!url) return;

    try {
      const response = await axios.post("http://localhost:3001/shorturls", {
        longUrl: url, // ✅ backend expects longUrl
      });

      setShortData(response.data);
    } catch (error) {
      alert("Error shortening URL");
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      <TextField
        label="Enter URL"
        variant="outlined"
        fullWidth
        margin="normal"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSubmit}
      >
        Shorten
      </Button>

      {shortData && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6">Shortened Link:</Typography>
            <a
              href={shortData.shortLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {shortData.shortLink}
            </a>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Expires At: {shortData.expiry}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default UrlShortener;
