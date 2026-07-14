/**
 * @openapi
 * components:
 *   schemas:
 *     ChatMessageRequest:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           example: "Can I exchange my seat?"
 *           description: The user query to send to the Railway Assistant chatbot.
 *         sessionId:
 *           type: string
 *           default: "default"
 *           example: "default"
 *           description: Optional identifier to segregate different conversation logs.
 * 
 *     ChatMessageResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Assistant reply generated successfully"
 *         data:
 *           type: object
 *           properties:
 *             reply:
 *               type: string
 *               example: "Yes. You can exchange your seat by creating a Seat Exchange Request from the Seat Exchange page."
 * 
 *     ChatHistoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Chat history fetched successfully"
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "64b0f948bf813b194cfc6230"
 *               message:
 *                 type: string
 *                 example: "Can I exchange my seat?"
 *               reply:
 *                 type: string
 *                 example: "Yes. You can exchange your seat by creating a Seat Exchange Request from the Seat Exchange page."
 *               role:
 *                 type: string
 *                 example: "user"
 *               sessionId:
 *                 type: string
 *                 example: "default"
 *               timestamp:
 *                 type: string
 *                 example: "2026-07-13T10:00:00.000Z"
 */

/**
 * @openapi
 * /api/chat/message:
 *   post:
 *     summary: Send Message to AI Railway Assistant
 *     description: Submits user query, fetches context-aware AI response from Google Gemini, saves interaction logs, and returns the response. Secure endpoint.
 *     tags:
 *       - AI Chatbot
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChatMessageRequest'
 *     responses:
 *       200:
 *         description: Assistant reply generated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatMessageResponse'
 *       400:
 *         description: Empty message or invalid payload formatting.
 *       401:
 *         description: Unauthorized. Missing JWT bearer token.
 *       500:
 *         description: Downstream API or model completion failure.
 */

/**
 * @openapi
 * /api/chat/history:
 *   get:
 *     summary: Get Conversation Logs
 *     description: Retrieves the complete sequence of recent conversational turns executed by the user. Secure endpoint.
 *     tags:
 *       - AI Chatbot
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *           default: "default"
 *         description: Partition session identifier to isolate conversations.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Total turns to pull.
 *     responses:
 *       200:
 *         description: Conversation history fetched.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatHistoryResponse'
 *       401:
 *         description: Unauthorized.
 * 
 *   delete:
 *     summary: Clear Chat Logs
 *     description: Purges all persisted conversation turns associated with the authenticated user. Secure endpoint.
 *     tags:
 *       - AI Chatbot
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sessionId
 *         schema:
 *           type: string
 *           default: "default"
 *         description: Partition session identifier.
 *     responses:
 *       200:
 *         description: History cleared successfully.
 *       401:
 *         description: Unauthorized.
 */
export const docsInfo = { moduleName: 'Chatbot' };
