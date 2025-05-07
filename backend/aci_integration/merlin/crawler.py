# backend/aci_integration/merlin/crawler.py
"""Merlin's Advanced Crawl4ai for repository analysis."""

import logging
import os
import git
import ast
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

class RepositoryAnalyzer:
    """Analyzes source repositories to extract patterns and components."""

    def __init__(self, repo_url: str, target_dir: str):
        self.repo_url = repo_url
        self.target_dir = target_dir

    def clone_repository(self) -> bool:
        """Clone the repository to the target directory."""
        try:
            if os.path.exists(self.target_dir):
                logger.info(f"Repository already exists at {self.target_dir}")
                return True

            logger.info(f"Cloning repository {self.repo_url} to {self.target_dir}")
            git.Repo.clone_from(self.repo_url, self.target_dir)
            return True
        except Exception as e:
            logger.error(f"Failed to clone repository: {str(e)}")
            return False

    def analyze_python_files(self) -> Dict[str, Any]:
        """Analyze Python files in the repository."""
        result = {
            "frameworks": [],
            "components": [],
            "tools": [],
            "prompts": [],
            "configurations": [],
            "dependencies": []
        }

        if not os.path.exists(self.target_dir):
            logger.error(f"Target directory {self.target_dir} does not exist")
            return result

        for root, _, files in os.walk(self.target_dir):
            for file in files:
                if file.endswith(".py"):
                    file_path = os.path.join(root, file)
                    self._analyze_python_file(file_path, result)
                elif file.endswith((".json", ".yaml", ".yml")):
                    file_path = os.path.join(root, file)
                    self._analyze_config_file(file_path, result)

        return result

    def _analyze_python_file(self, file_path: str, result: Dict[str, Any]):
        """Analyze a Python file for patterns and components."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            tree = ast.parse(content)

            # Extract classes
            for node in ast.walk(tree):
                if isinstance(node, ast.ClassDef):
                    class_info = {
                        "name": node.name,
                        "file": file_path,
                        "methods": [],
                        "base_classes": [base.id for base in node.bases if isinstance(base, ast.Name)]
                    }

                    # Extract methods
                    for child in node.body:
                        if isinstance(child, ast.FunctionDef):
                            method_info = {
                                "name": child.name,
                                "args": [arg.arg for arg in child.args.args if arg.arg != 'self'],
                                "docstring": ast.get_docstring(child)
                            }
                            class_info["methods"].append(method_info)

                    # Categorize the class
                    if any(base in ["Agent", "BaseAgent", "Tool", "BaseTool"] for base in class_info["base_classes"]):
                        if "Tool" in class_info["name"] or any("Tool" in base for base in class_info["base_classes"]):
                            result["tools"].append(class_info)
                        else:
                            result["components"].append(class_info)

        except Exception as e:
            logger.error(f"Failed to analyze Python file {file_path}: {str(e)}")

    def _analyze_config_file(self, file_path: str, result: Dict[str, Any]):
        """Analyze a configuration file."""
        try:
            config_info = {
                "file": file_path,
                "type": os.path.splitext(file_path)[1],
                "name": os.path.basename(file_path)
            }

            result["configurations"].append(config_info)

        except Exception as e:
            logger.error(f"Failed to analyze config file {file_path}: {str(e)}")

    def extract_best_practices(self, analysis_result: Dict[str, Any]) -> Dict[str, Any]:
        """Extract best practices from the analysis result."""
        best_practices = {
            "modularity": [],
            "configurability": [],
            "patterns": []
        }

        # Analyze component sizes for modularity
        file_sizes = {}
        for component in analysis_result["components"]:
            file_path = component["file"]
            if file_path not in file_sizes:
                file_sizes[file_path] = os.path.getsize(file_path)

        # Find well-modularized files (smaller than 500 lines)
        for file_path, size in file_sizes.items():
            with open(file_path, 'r', encoding='utf-8') as f:
                line_count = len(f.readlines())

            if line_count < 500:
                best_practices["modularity"].append({
                    "file": file_path,
                    "lines": line_count,
                    "reason": "File is well-modularized (less than 500 lines)"
                })

        return best_practices