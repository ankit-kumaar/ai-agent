import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { config } from '../config';

export function getModel(options: { temperature?: number } = {}) {
    const { temperature = 0.3 } = options;

    if (config.DEFAULT_PROVIDER === 'openrouter') {
        if (!config.OPENROUTER_API_KEY) {
            console.warn('OpenRouter API key is missing, falling back to Anthropic or OpenAI if available.');
            if (config.ANTHROPIC_API_KEY) {
                return new ChatAnthropic({
                    modelName: config.ANTHROPIC_MODEL,
                    temperature,
                    anthropicApiKey: config.ANTHROPIC_API_KEY,
                });
            }
            if (config.OPENAI_API_KEY) {
                return new ChatOpenAI({
                    modelName: config.OPENAI_MODEL,
                    temperature,
                    openAIApiKey: config.OPENAI_API_KEY,
                });
            }
            throw new Error('No LLM API keys found. Please provide OPENROUTER_API_KEY, ANTHROPIC_API_KEY, or OPENAI_API_KEY.');
        }

        return new ChatOpenAI({
            modelName: config.OPENROUTER_MODEL,
            temperature,
            openAIApiKey: config.OPENROUTER_API_KEY,
            configuration: {
                baseURL: 'https://openrouter.ai/api/v1',
                defaultHeaders: {
                    'HTTP-Referer': 'https://github.com/langchain-ai/langchainjs', // Required for OpenRouter
                    'X-Title': 'Logistics AI Agents',
                },
            },
        });
    }

    if (config.DEFAULT_PROVIDER === 'anthropic') {
        if (!config.ANTHROPIC_API_KEY) {
            console.warn('Anthropic API key is missing, falling back to OpenAI if available.');
            if (config.OPENAI_API_KEY) {
                return new ChatOpenAI({
                    modelName: config.OPENAI_MODEL,
                    temperature,
                    openAIApiKey: config.OPENAI_API_KEY,
                });
            }
            throw new Error('No LLM API keys found. Please provide ANTHROPIC_API_KEY or OPENAI_API_KEY.');
        }

        return new ChatAnthropic({
            modelName: config.ANTHROPIC_MODEL,
            temperature,
            anthropicApiKey: config.ANTHROPIC_API_KEY,
        });
    }

    // Default to OpenAI
    if (!config.OPENAI_API_KEY) {
        throw new Error('OpenAI API key is missing.');
    }

    return new ChatOpenAI({
        modelName: config.OPENAI_MODEL,
        temperature,
        openAIApiKey: config.OPENAI_API_KEY,
    });
}
