import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import {
  Container,
  TextField,
  Button,
  CircularProgress,
  Box,
  CssBaseline,
  styled,
  IconButton,
  Typography,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import "highlight.js/styles/vs2015.css";

// Create dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7c4dff',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

const AnimatedBackground = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
  backgroundSize: '400% 400%',
  animation: 'gradient 15s ease infinite',
  '@keyframes gradient': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
});

const ChatContainer = styled(Container)(({ theme }) => ({
  height: "100vh",
  width:'100%',
  display: "flex",
  flexDirection: "column",
  padding: 0,
  background: 'rgba(10, 10, 10, 0.9)',
  backdropFilter: 'blur(10px)',
  maxWidth: '100% !important', 
  '::-webkit-scrollbar': { display: 'none' }
}));

const Header = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: 'linear-gradient(45deg, #7c4dff 30%, #e73c7e 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  borderBottom: `1px solid ${theme.palette.divider}`,
  '::-webkit-scrollbar': { display: 'none' }

}));

const MessageContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
  paddingTop: '80px',
  paddingBottom: "120px",
  "& > *": {
    marginBottom: theme.spacing(2),
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateX(5px)',
    },
  },
}));

const UserMessage = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  "& > div": {
    background: 'linear-gradient(145deg, #7c4dff, #693dff)',
    color: theme.palette.common.white,
    borderRadius: "18px 18px 4px 18px",
    padding: theme.spacing(2),
    maxWidth: "90%",
    fontSize: "1rem",
    boxShadow: theme.shadows[4],
    animation: 'slideInRight 0.3s ease',
  },
}));

const BotMessage = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-start",
  "& > div": {
    background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
    color: theme.palette.common.white,
    borderRadius: "18px 18px 18px 4px",
    padding: theme.spacing(2),
    maxWidth: "90%",
    fontSize: "1rem",
    lineHeight: 1.6,
    boxShadow: theme.shadows[4],
    animation: 'slideInLeft 0.3s ease',
  },
}));

const InputContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  background: 'rgba(26, 26, 26, 0.9)',
  backdropFilter: 'blur(8px)',
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const InputWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 'md',
  position: 'relative',
  margin: '0 auto',
}));

// Add global animations
const globalStyles = `
  @keyframes slideInLeft {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideInRight {
    from { transform: translateX(20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
`;

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChat = async () => {
    if (!input.trim()) return;
    try {
      setIsLoading(true);
      const userMessage = { type: "user", content: input };
      setMessages(prev => [...prev, userMessage]);
      
      const result = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_ENDPOINT}/api/chat`, { input });
      const botMessage = { type: "bot", content: result.data.message };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error with chat request:", error);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <style>{globalStyles}</style>
      <AnimatedBackground />
      <ChatContainer  disableGutters>
        <Header>
          <Typography variant="h3" component="h1" fontWeight="600">
            Python Tutor
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Your AI-powered coding mentor
          </Typography>
        </Header>

        <MessageContainer>
          {messages.map((msg, index) => (
            msg.type === "user" ? (
              <UserMessage key={index}>
                <div>{msg.content}</div>
              </UserMessage>
            ) : (
              <BotMessage key={index}>
                <div>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    children={msg.content}
                  />
                </div>
              </BotMessage>
            )
          ))}
          {isLoading && (
            <BotMessage>
              <div>
                <CircularProgress size={24} />
              </div>
            </BotMessage>
          )}
        </MessageContainer>

        <InputContainer>
          <InputWrapper>
            <TextField
              fullWidth
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about Python..."
              onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleChat()}
              disabled={isLoading}
              multiline
              maxRows={6}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "28px",
                  paddingRight: "56px",
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  },
                },
                "& .MuiInputBase-input": {
                  color: '#fff',
                },
              }}
            />
            <IconButton
              onClick={handleChat}
              disabled={isLoading}
              sx={{
                position: "absolute",
                right: 8,
                bottom: 8,
                background: 'linear-gradient(45deg, #7c4dff 30%, #e73c7e 90%)',
                color: "white",
                '&:hover': {
                  background: 'linear-gradient(45deg, #693dff 30%, #d4316c 90%)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <SendIcon />
            </IconButton>
          </InputWrapper>
        </InputContainer>
      </ChatContainer>
    </ThemeProvider>
  );
}

export default App;