// src/mocks/agentServices.ts
import { DistilledRule } from './mockKnowledgeBase';

// ==========================================
// ✅ ĐÃ BẢO MẬT: BROWSER (CLIENT-SIDE) COMPONENT
// File này giờ chỉ gọi vào server cục bộ qua `/api/agent`. 
// Không còn lộ API Key ra ngoài mạng lưới internet.
// ==========================================

export const runExecutorAgent = async (task: string, injectedRules: DistilledRule[]) => {
 let systemPrompt = `You are an expert PR, Marketing, and Content AI Agent. Your task is to execute the user's request.`;
 
 if (injectedRules.length > 0) {
 const rulesText = injectedRules.map(r => `- ${r.distilled_rule}`).join('\n');
 systemPrompt += `\n\nCRITICAL KNOWLEDGE BASE (HISTORICAL RULES):\nYou MUST strictly adhere to the following rules based on past feedback. Do not repeat these mistakes:\n${rulesText}`;
 }

 try {
 const response = await fetch("/api/agent", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 messages: [
 { role: "system", content: systemPrompt },
 { role: "user", content: `Execute this task: "${task}"` }
 ],
 temperature: 0.7,
 })
 });

 const data = await response.json();
 if (data.error) throw new Error(data.error.message);
 
 let baseOutput = data.choices[0].message.content;
 
 // Giữ lại phần cấu trúc [SYSTEM LOG] cắm vào đuôi đoạn chat để dễ track trên UI
 if (injectedRules.length > 0) {
 const rulesText = injectedRules.map(r => `- ${r.distilled_rule}`).join('\n');
 baseOutput += `\n\n[SYSTEM LOG] Output generated applying these rules:\n${rulesText}`;
 } else {
 baseOutput += `\n\n[SYSTEM LOG] No specific historical rules applied. Used default system prompt.`;
 }
 
 return baseOutput;
 } catch (err: any) {
 console.error("Executor API Error:", err);
 return `[ERROR] Failed to connect to secure API Route. Please check your network or Server ENV. Details: ${err.message}`;
 }
};

export const runLearnerAgent = async (originalOutput: string, feedback: string) => {
 const systemPrompt = `You are a Learner Agent (Knowledge Distiller).
Your job is to analyze the User's Feedback regarding an Original Output.

If the User's Feedback is too short, vague, abstract, or purely emotional (e.g., "khá chán", "không thích", "bad", "sửa lại") WITHOUT specifying exactly WHAT to fix, you must return a clarifying question in Vietnamese.
If the feedback is actionable, concisely extract a SINGLE, universal rule (under 25 words) that future agents must avoid or follow. Also extract 2 to 3 trigger keywords for categorizing this rule in a Vector Database.

Respond STRICTLY in the following JSON format:
{
 "needs_clarification": boolean,
 "clarifying_question": "string (empty if false, must be in Vietnamese)",
 "trigger_keywords": ["keyword1", "keyword2"],
 "distilled_rule": "The concise, actionable, and timeless rule to follow in English."
}`;

 try {
 const response = await fetch("/api/agent", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 messages: [
 { role: "system", content: systemPrompt },
 { role: "user", content: `Original Output: "${originalOutput}"\n\nUser Feedback: "${feedback}"\n\nAnalyze and distill the rule in strict JSON.` }
 ],
 temperature: 0.1,
 // Dùng JSON Mode để 100% trả về dạng Schema chuẩn
 response_format: { type: "json_object" }
 })
 });

 const data = await response.json();
 if (data.error) throw new Error(data.error.message);
 
 const result = JSON.parse(data.choices[0].message.content);
 return {
 needs_clarification: result.needs_clarification || false,
 clarifying_question: result.clarifying_question || "",
 trigger_keywords: result.trigger_keywords || ["general_feedback"],
 distilled_rule: result.distilled_rule || "Incorporate feedback based on user instructions."
 };
 } catch (err: any) {
 console.error("Learner API Error:", err);
 // Fallback an toàn nếu API lỗi
 return {
 needs_clarification: false,
 trigger_keywords: ["error"],
 distilled_rule: "Failed to connect to AI API Route. Check Server Env."
 };
 }
};
