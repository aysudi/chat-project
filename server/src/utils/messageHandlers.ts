import { Server } from "socket.io";
import {
  AuthenticatedSocket,
  EditMessageData,
  SendMessageData,
} from "../types/socketType.js";
import {
  createMessage,
  deleteMessage,
  updateMessage,
  markMessageAsRead,
} from "../services/messageService.js";

const validateMessageData = (data: SendMessageData) => {
  if (!data.chatId || !data.content) {
    return { isValid: false, error: "Chat ID and content are required" };
  }
  if (data.content.length > 1000) {
    return { isValid: false, error: "Message content too long" };
  }
  return { isValid: true };
};

export const registerMessageHandlers = (
  io: Server,
  socket: AuthenticatedSocket
) => {
  socket.on("message:send", async (data: SendMessageData) => {
    try {
      const validation = validateMessageData(data);
      if (!validation.isValid) {
        socket.emit("error", { message: validation.error });
        return;
      }

      io.to(`chat:${data.chatId}`).emit("message:new", {
        id: data.tempId || new Date().getTime().toString(),
        content: data.content,
        senderId: socket.user.id,
        senderName: socket.user.username,
        chatId: data.chatId,
        timestamp: new Date().toISOString(),
        seenBy: [socket.user.id],
        tempId: data.tempId,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("message:edit", async (data: EditMessageData) => {
    try {
      const result = await updateMessage(
        data.messageId,
        { content: data.content },
        socket.user.id
      );

      if (!result.success || !result.data) {
        socket.emit("error", {
          message: result.message || "Failed to edit message",
        });
        return;
      }

      const message = result.data;
      io.to(`chat:${message.chat}`).emit("message:updated", {
        id: message._id.toString(),
        content: message.content,
        senderId: socket.user.id,
        senderName: socket.user.username,
        chatId: message.chat.toString(),
        timestamp: message.createdAt,
        editedAt: message.updatedAt,
        seenBy: message.seenBy.map((id: any) => id.toString()),
      });
    } catch (error) {
      console.error("Error editing message:", error);
      socket.emit("error", { message: "Failed to edit message" });
    }
  });

  socket.on("message:delete", async (data: { messageId: string }) => {
    try {
      const result = await deleteMessage(data.messageId, socket.user.id);

      if (!result.success || !result.data) {
        socket.emit("error", {
          message: result.message || "Failed to delete message",
        });
        return;
      }

      const message = result.data;
      io.to(`chat:${message.chat}`).emit("message:deleted", {
        messageId: data.messageId,
        chatId: message.chat.toString(),
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      socket.emit("error", { message: "Failed to delete message" });
    }
  });

  socket.on("message:typing", (data: { chatId: string }) => {
    socket.to(`chat:${data.chatId}`).emit("message:typing", {
      userId: socket.user.id,
      username: socket.user.username,
      chatId: data.chatId,
    });
  });

  socket.on("message:stopTyping", (data: { chatId: string }) => {
    socket.to(`chat:${data.chatId}`).emit("message:stopTyping", {
      userId: socket.user.id,
      username: socket.user.username,
      chatId: data.chatId,
    });
  });

  socket.on(
    "message:markAsRead",
    async (data: { messageId: string; chatId: string }) => {
      try {
        const result = await markMessageAsRead(data.messageId, socket.user.id);

        if (result.success) {
          io.to(`chat:${data.chatId}`).emit("message:read", {
            messageId: data.messageId,
            chatId: data.chatId,
            userId: socket.user.id,
          });
        }
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  );
};
