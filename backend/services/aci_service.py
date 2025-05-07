# backend/services/aci_service.py (updated)
"""Service layer for ACI integration with Merlin, Developer Realm, and VM Sandbox."""

import logging
from typing import Dict, List, Optional, Any, Callable
from fastapi import WebSocket

from backend.aci_integration.merlin.crawler import RepositoryAnalyzer
from backend.aci_integration.merlin.oracle import MerlinOracle
from backend.aci_integration.sandbox.vm_manager import VMSandbox

logger = logging.getLogger(__name__)

class ACIService:
    """Service for interacting with ACI components."""

    def __init__(self):
        """Initialize the ACI service."""
        self.vm_sandbox = None
        self.merlin_oracle = None
        self.knowledge_base = {}
        self.agent_websockets = {}
        self._initialized = False

    async def initialize(self):
        """Initialize all ACI components."""
        if self._initialized:
            return

        logger.info("Initializing ACI service")

        # Initialize VM Sandbox
        self.vm_sandbox = VMSandbox({
            "vm_type": "docker",
            "image": "invisionedmarketing/agent-sandbox:latest",
            "memory_limit": "2g",
            "cpu_limit": "1.0"
        })
        await self.vm_sandbox.initialize()

        # Initialize Merlin's Oracle with an empty knowledge base
        self.merlin_oracle = MerlinOracle(self.knowledge_base)

        self._initialized = True
        logger.info("ACI service initialized")

    # Merlin's Crawl4ai methods

    async def analyze_repository(self, repo_url: str) -> Dict[str, Any]:
        """Analyze a repository using Merlin's Crawl4ai."""
        if not self._initialized:
            await self.initialize()

        # Create a target directory for the repository
        import os
        import hashlib

        repo_hash = hashlib.md5(repo_url.encode()).hexdigest()
        target_dir = os.path.join("/tmp", f"repo_{repo_hash}")

        # Create the repository analyzer
        analyzer = RepositoryAnalyzer(repo_url, target_dir)

        # Clone the repository
        success = analyzer.clone_repository()
        if not success:
            raise Exception(f"Failed to clone repository {repo_url}")

        # Analyze the repository
        analysis_result = analyzer.analyze_python_files()

        # Extract best practices
        best_practices = analyzer.extract_best_practices(analysis_result)

        # Update the knowledge base
        self.knowledge_base[repo_url] = {
            "analysis": analysis_result,
            "best_practices": best_practices
        }

        # Update Merlin's Oracle with the new knowledge base
        self.merlin_oracle = MerlinOracle(self.knowledge_base)

        return {
            "repository": repo_url,
            "analysis": analysis_result,
            "best_practices": best_practices
        }

    # Merlin's Oracle methods

    async def select_best_framework(self, task_domain: str, requirements: Dict[str, Any]) -> Dict[str, Any]:
        """Select the best framework based on requirements."""
        if not self._initialized:
            await self.initialize()

        return self.merlin_oracle.select_best_framework(task_domain, requirements)

    async def select_best_tools(self, task_domain: str, framework: str) -> List[Dict[str, Any]]:
        """Select the best tools based on requirements."""
        if not self._initialized:
            await self.initialize()

        return self.merlin_oracle.select_best_tools(task_domain, framework)

    async def generate_agent_config(self,
                                  purpose: str,
                                  skills: List[str],
                                  tools: List[str],
                                  interaction_style: str,
                                  constraints: List[str]) -> Dict[str, Any]:
        """Generate an agent configuration based on user inputs."""
        if not self._initialized:
            await self.initialize()

        return self.merlin_oracle.generate_agent_config(
            purpose, skills, tools, interaction_style, constraints
        )

    # VM Sandbox methods

    async def deploy_agent_to_sandbox(self, agent_config: Dict[str, Any]) -> str:
        """Deploy an agent to the VM sandbox."""
        if not self._initialized:
            await self.initialize()

        # Create a callback for agent events
        async def agent_callback(message: Dict[str, Any]):
            agent_id = message.get("agent_id")
            if agent_id in self.agent_websockets:
                websockets = self.agent_websockets[agent_id]
                for websocket in websockets:
                    try:
                        await websocket.send_json(message)
                    except Exception as e:
                        logger.error(f"Failed to send message to websocket: {str(e)}")

        # Deploy the agent
        return await self.vm_sandbox.deploy_agent(agent_config, agent_callback)

    async def execute_task_in_sandbox(self, agent_id: str, task: Dict[str, Any]) -> bool:
        """Execute a task with the specified agent in the VM sandbox."""
        if not self._initialized:
            await self.initialize()

        return await self.vm_sandbox.execute_task(agent_id, task)

    async def terminate_agent_in_sandbox(self, agent_id: str) -> bool:
        """Terminate an agent in the VM sandbox."""
        if not self._initialized:
            await self.initialize()

        return await self.vm_sandbox.terminate_agent(agent_id)

    async def register_agent_events_websocket(self, agent_id: str, websocket: WebSocket):
        """Register a websocket for agent events."""
        if agent_id not in self.agent_websockets:
            self.agent_websockets[agent_id] = []

        self.agent_websockets[agent_id].append(websocket)

    async def unregister_agent_events_websocket(self, agent_id: str, websocket: WebSocket):
        """Unregister a websocket for agent events."""
        if agent_id in self.agent_websockets:
            if websocket in self.agent_websockets[agent_id]:
                self.agent_websockets[agent_id].remove(websocket)

            if not self.agent_websockets[agent_id]:
                del self.agent_websockets[agent_id]

    # Developer Realm methods

    async def generate_code(self, instructions: str, language: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate code based on natural language instructions."""
        if not self._initialized:
            await self.initialize()

        # In a real implementation, this would use an AI model to generate code
        # For now, we'll return mock data

        if language == "python":
            code = f"""
def main():
    \"\"\"
    {instructions}
    \"\"\"
    print("Implementing: {instructions}")

    # TODO: Implement the actual functionality

    return "Success!"

if __name__ == "__main__":
    main()
"""
        else:
            code = f"// Generated code for: {instructions}"

        return {
            "code": code,
            "language": language,
            "instructions": instructions
        }

    async def generate_tests(self, code: str, language: str, framework: str) -> Dict[str, Any]:
        """Generate unit tests for code."""
        if not self._initialized:
            await self.initialize()

        # In a real implementation, this would use an AI model to generate tests
        # For now, we'll return mock data

        if language == "python" and framework == "pytest":
            test_code = f"""
import pytest

def test_main():
    \"\"\"Test the main function.\"\"\"
    # TODO: Implement actual test
    assert True
"""
        else:
            test_code = f"// Generated tests for the provided code"

        return {
            "test_code": test_code,
            "language": language,
            "framework": framework
        }

    async def analyze_code(self, code: str, language: str) -> Dict[str, Any]:
        """Analyze code for improvements and issues."""
        if not self._initialized:
            await self.initialize()

        # In a real implementation, this would use an AI model to analyze code
        # For now, we'll return mock data

        return {
            "issues": [
                {
                    "type": "style",
                    "message": "Consider adding more comments",
                    "line": 1
                }
            ],
            "suggestions": [
                {
                    "type": "refactoring",
                    "message": "Consider breaking down large functions",
                    "line": None
                }
            ],
            "complexity": "medium"
        }

    async def generate_documentation(self, code: str, language: str, format: str) -> Dict[str, Any]:
        """Generate documentation for code."""
        if not self._initialized:
            await self.initialize()

        # In a real implementation, this would use an AI model to generate documentation
        # For now, we'll return mock data

        if format == "markdown":
            documentation = f"""
# Code Documentation

## Overview
This code implements a basic function.

## Functions
- `main()`: The main entry point of the program.

## Usage
```{language}
# Example usage
main()
```

"""
        else:
            documentation = "Generated documentation for the provided code"

        return {
            "documentation": documentation,
            "format": format,
            "language": language
        }

    async def save_file(self, filename: str, content: bytes) -> Dict[str, Any]:
        """Save a file to the Developer Realm."""
        if not self._initialized:
            await self.initialize()

        # In a real implementation, this would save the file to a storage system
        # For now, we'll simulate it

        return {
            "filename": filename,
            "size": len(content),
            "status": "saved"
        }

    async def get_file(self, file_path: str) -> Optional[str]:
        """Get a file from the Developer Realm."""
        if not self._initialized:
            await self.initialize()

        # In a real implementation, this would retrieve the file from a storage system
        # For now, we'll simulate it

        if file_path.endswith(".py"):
            return "# Python file content"
        elif file_path.endswith(".js"):
            return "// JavaScript file content"
        else:
            return None