'use strict';

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     ChatMessageRequest:
 *       type: object
 *       required: [message]
 *       properties:
 *         message:
 *           type: string
 *           example: "Can I exchange my seat?"
 *           maxLength: 2000
 *         sessionId:
 *           type: string
 *           default: "default"
 *           example: "session_xyz123"
 *         sessionName:
 *           type: string
 *           example: "My Train Journey"
 *
 *     ChatMessageResponse:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: true }
 *         message: { type: string, example: "Assistant reply generated successfully" }
 *         data:
 *           type: object
 *           properties:
 *             reply: { type: string, example: "Yes! You can exchange your seat from the Seat Exchange page." }
 *             timestamp: { type: string, format: date-time }
 *
 *     ChatHistoryItem:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         message: { type: string }
 *         reply: { type: string }
 *         role: { type: string, enum: [user, model] }
 *         sessionId: { type: string }
 *         sessionName: { type: string }
 *         language: { type: string }
 *         timestamp: { type: string, format: date-time }
 *
 *     ChatSession:
 *       type: object
 *       properties:
 *         sessionId: { type: string }
 *         sessionName: { type: string }
 *         lastMessage: { type: string }
 *         lastReply: { type: string }
 *         timestamp: { type: string, format: date-time }
 *         messageCount: { type: integer }
 */

/**
 * @openapi
 * /api/chat/message:
 *   post:
 *     summary: Send message to AI Railway Assistant
 *     description: Submits user query, fetches Gemini AI response with conversation context, saves to DB.
 *     tags: [AI Chatbot]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ChatMessageRequest' }
 *     responses:
 *       200:
 *         description: AI reply generated
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ChatMessageResponse' }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 *       429: { description: Rate limit or AI quota exceeded }
 *       500: { description: Server or AI error }
 *       504: { description: AI request timeout }
 */

/**
 * @openapi
 * /api/chat/sessions:
 *   get:
 *     summary: Get all chat sessions
 *     description: Returns all unique chat sessions for the authenticated user.
 *     tags: [AI Chatbot]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Sessions fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/ChatSession' }
 */

/**
 * @openapi
 * /api/chat/history:
 *   get:
 *     summary: Get conversation history
 *     tags: [AI Chatbot]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: sessionId
 *         schema: { type: string, default: "default" }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20, maximum: 100 }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *     responses:
 *       200:
 *         description: History fetched successfully
 *   delete:
 *     summary: Clear all messages in a session
 *     tags: [AI Chatbot]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: sessionId
 *         schema: { type: string, default: "default" }
 *     responses:
 *       200: { description: History cleared }
 */

/**
 * @openapi
 * /api/chat/session/{id}:
 *   put:
 *     summary: Rename a chat session
 *     tags: [AI Chatbot]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionName]
 *             properties:
 *               sessionName: { type: string, maxLength: 80 }
 *     responses:
 *       200: { description: Session renamed }
 *       404: { description: Session not found }
 */

/**
 * @openapi
 * /api/chat/{id}:
 *   delete:
 *     summary: Delete a single chat message
 *     tags: [AI Chatbot]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, pattern: '^[a-f0-9]{24}$' }
 *     responses:
 *       200: { description: Message deleted }
 *       404: { description: Message not found }
 */

const docsInfo = { moduleName: 'Chatbot' };
module.exports = { docsInfo };
