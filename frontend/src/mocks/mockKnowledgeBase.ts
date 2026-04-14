// src/mocks/mockKnowledgeBase.ts

export interface DistilledRule {
 id: string;
 trigger_keywords: string[];
 distilled_rule: string;
 timestamp: number;
}

const STORAGE_KEY = 'rl_sandbox_rules';

// Helper to get from local storage
const getStorageRules = (): DistilledRule[] => {
 if (typeof window === 'undefined') return [];
 const stored = localStorage.getItem(STORAGE_KEY);
 return stored ? JSON.parse(stored) : [];
};

// Helper to set to local storage
const setStorageRules = (rules: DistilledRule[]) => {
 if (typeof window !== 'undefined') {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
 }
};

export const saveRule = async (ruleObject: Omit<DistilledRule, 'id' | 'timestamp'>): Promise<DistilledRule> => {
 // Simulate DB delay
 await new Promise(resolve => setTimeout(resolve, 500));
 
 const newRule: DistilledRule = {
 ...ruleObject,
 id: `rule_${Math.random().toString(36).substring(2, 9)}`,
 timestamp: Date.now()
 };
 
 const rules = getStorageRules();
 rules.push(newRule);
 setStorageRules(rules);
 
 return newRule;
};

const MAX_CONTEXT_RULES = 2; // Fixed limit to prevent LLM context bloat

export const getRelevantRules = async (contextQuery: string): Promise<DistilledRule[]> => {
 // Simulate vector search latency
 await new Promise(resolve => setTimeout(resolve, 600));
 
 const rules = getStorageRules();
 if (rules.length === 0) return [];
 
 const queryLower = contextQuery.toLowerCase();
 
 // Try to find keyword matches to simulate semantic search/trigger words
 const keywordMatches = rules.filter(r => 
 r.trigger_keywords.some(keyword => queryLower.includes(keyword.toLowerCase()))
 );
 
 if (keywordMatches.length > 0) {
 return keywordMatches.slice(-MAX_CONTEXT_RULES); // Return up to MAX_CONTEXT_RULES
 }
 
 // Fallback: return most recently added rules
 return rules.slice(-MAX_CONTEXT_RULES);
};

export const clearRules = async () => {
 await new Promise(resolve => setTimeout(resolve, 200));
 setStorageRules([]);
}

export const getAllRules = async (): Promise<DistilledRule[]> => {
 return getStorageRules();
}
