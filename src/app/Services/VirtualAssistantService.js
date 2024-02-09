require("dotenv").config();

const {
  chatBot,
  getAssistant,
  saveAssistant,
  getThread,
  createThread,
  deleteThread,
  getFileInfo,
} = require("../Utils/openai");

const { throwError, isObjectId } = require("../Utils/index");
const { getById } = require("./CommonService");

const { VirtualAssistant } = require("../Models/VirtualAssistant");
const { User } = require("../Models/User");

module.exports = {
  chat: async (data) => {
    try {
      if (!isObjectId(data.userId)) {
        throwError(401, "Không tồn tại bản ghi!");
      }

      const assistant = await VirtualAssistant.findOne({
        userId: data.userId,
      });

      if (!assistant) {
        throwError(401, "Bot chưa được cấu hình!");
      }

      const result = await chatBot({
        threadId: data.threadId,
        userMessage: data.content,
        assistantId: assistant.assistantId,
      });

      return result.reverse();
    } catch (error) {
      throw error;
    }
  },

  getTrain: async (userId) => {
    try {
      return getById(userId, User, "người dùng", async (value) => {
        if (!value) {
          throwError(401, "Bản ghi không tồn tại!");
        }

        const assistant = await VirtualAssistant.findOne({
          userId: value._id,
        });

        if (!assistant) {
          return null;
        }

        const assistantResult = await getAssistant(assistant.assistantId);

        const assistantResultMap = [{ ...assistantResult }].map(
          async (item) => ({
            id: item.id,
            name: item.name,
            instructions: item.instructions,
            files: (await getFileInfo(item.file_ids)).reverse(),
          })
        )[0];

        return assistantResultMap;
      });
    } catch (error) {
      throw error;
    }
  },

  saveTrain: async ({ userId, name, instructions, files = [] }) => {
    try {
      return getById(userId, User, "người dùng", async (value) => {
        let assistantResult;

        const assistant = await VirtualAssistant.findOne({
          userId: value._id,
        });

        if (assistant) {
          const id = assistant.assistantId;
          assistantResult = await saveAssistant({
            id,
            name,
            instructions,
            files,
          });
        } else {
          assistantResult = await saveAssistant({ name, instructions, files });
          await VirtualAssistant.create({
            userId,
            assistantId: assistantResult.id,
          });
        }

        return assistantResult;
      });
    } catch (error) {
      throw error;
    }
  },

  getChatContainer: async (id) => {
    try {
      const getThreadResult = await getThread(id);

      return getThreadResult.reverse();
    } catch (error) {
      throw error;
    }
  },

  createChatContainer: async () => {
    try {
      const createThreadResult = await createThread();

      return createThreadResult;
    } catch (error) {
      throw error;
    }
  },

  deleteChatContainer: async (id) => {
    try {
      const deleteThreadResult = await deleteThread(id);

      return deleteThreadResult;
    } catch (error) {
      throw error;
    }
  },

  checkLinkChat: async (userId) => {
    try {
      return getById(userId, User, "người dùng", async (value) => {
        return {
          fullName: value.fullName,
          email: value.email,
        };
      });
    } catch (error) {
      throw error;
    }
  },
};
