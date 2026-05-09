# Egytronic Agents Framework (EAF)

EAF is a powerful, extensible framework for building autonomous AI agents with advanced tool support and multi-LLM compatibility.

## Core Concepts

- **Agent**: The orchestrator that manages the conversation history, tool selection, and execution loop.
- **LLMAdapter**: A standardized interface for different LLM providers (Gemini, Cloudflare, etc.).
- **Tool**: A functional unit that the agent can call to perform actions (File system, Shell, Browser, etc.).

## Development Workflow

1.  **Initialize Adapter**: Choose your LLM provider and initialize with API keys.
2.  **Configure Agent**: Define system prompts and options.
3.  **Add Tools**: Attach instances of `Tool` classes to the agent.
4.  **Run**: Invoke `agent.run(input)` to start the autonomous loop.

## Author
**Egytronic**

## Features
- Multi-LLM Support (Gemini, Cloudflare, Local/Ollama)
- Extensible Tool System
- Autonomous Loop with Advanced Parsing
- Built-in tools for File System, Browser, GitHub, and Terminal
