import { WebSocketServer } from "ws";

// Create WebSocket server
const wss = new WebSocketServer({ port: 8080 });

// Store active timers
const timers = {};
const intervals = {};
const clients = new Set();

console.log("WebSocket server started on port 8080");

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("Client connected");
  clients.add(ws);

  // Send current timer values to new client
  Object.keys(timers).forEach((questionId) => {
    ws.send(
      JSON.stringify({
        type: "TIMER_UPDATE",
        questionId,
        time: timers[questionId],
      })
    );
  });

  // Handle messages from clients
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case "START_TIMER":
          startTimer(data.questionId);
          break;
        case "STOP_TIMER":
          stopTimer(data.questionId);
          break;
        case "RESET_TIMER":
          resetTimer(data.questionId);
          break;
        default:
          console.log("Unknown message type:", data.type);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  // Handle client disconnection
  ws.on("close", () => {
    console.log("Client disconnected");
    clients.delete(ws);
  });
});

// Start a timer for a question
function startTimer(questionId) {
  // Initialize timer if it doesn't exist
  if (!timers[questionId]) {
    timers[questionId] = 0;
  }

  // Clear any existing interval
  if (intervals[questionId]) {
    clearInterval(intervals[questionId]);
  }

  // Start new interval
  intervals[questionId] = setInterval(() => {
    timers[questionId]++;

    // Broadcast timer update to all clients
    broadcastTimerUpdate(questionId);
  }, 1000);

  console.log(`Timer started for question ${questionId}`);
}

// Stop a timer
function stopTimer(questionId) {
  if (intervals[questionId]) {
    clearInterval(intervals[questionId]);
    delete intervals[questionId];
    console.log(
      `Timer stopped for question ${questionId} at ${timers[questionId]} seconds`
    );
  }
}

// Reset a timer
function resetTimer(questionId) {
  stopTimer(questionId);
  timers[questionId] = 0;
  broadcastTimerUpdate(questionId);
  console.log(`Timer reset for question ${questionId}`);
}

// Broadcast timer update to all connected clients
function broadcastTimerUpdate(questionId) {
  const message = JSON.stringify({
    type: "TIMER_UPDATE",
    questionId,
    time: timers[questionId],
  });

  clients.forEach((client) => {
    if (client.readyState === WebSocketServer.OPEN) {
      client.send(message);
    }
  });
}

// Clean up on server shutdown
process.on("SIGINT", () => {
  console.log("Shutting down WebSocket server");

  // Clear all intervals
  Object.keys(intervals).forEach((questionId) => {
    clearInterval(intervals[questionId]);
  });

  wss.close(() => {
    process.exit(0);
  });
});
