"""Base class for AI model clients."""

from abc import ABC, abstractmethod
import requests
from .errors import APIError, InvalidResponseError, RateLimitError, AuthenticationError, ModelUnavailableError

class BaseAIClient(ABC):
    """Abstract base class for interacting with external AI models."""

    def __init__(self, api_key: str, base_url: str):
        """
        Initializes the base AI client.

        Args:
            api_key: The API key for authentication.
            base_url: The base URL of the AI model API.
        """
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def _make_request(self, method: str, endpoint: str, json_data: dict = None) -> dict:
        """
        Makes an HTTP request to the AI model API.

        Args:
            method: The HTTP method (e.g., 'POST', 'GET').
            endpoint: The API endpoint.
            json_data: The JSON data to send in the request body.

        Returns:
            The JSON response from the API.

        Raises:
            APIError: If the API call fails.
            RateLimitError: If rate limits are exceeded.
            AuthenticationError: If authentication fails.
            ModelUnavailableError: If the model is unavailable.
            InvalidResponseError: If the response is not valid JSON or unexpected.
        """
        url = f"{self.base_url}{endpoint}"
        try:
            response = requests.request(method, url, headers=self.headers, json=json_data)
            response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
            return response.json()
        except requests.exceptions.HTTPError as e:
            status_code = e.response.status_code
            response_data = e.response.json() if e.response.text else None
            if status_code == 401:
                raise AuthenticationError(f"Authentication failed: {e}", status_code, response_data) from e
            elif status_code == 429:
                raise RateLimitError(f"Rate limit exceeded: {e}", status_code, response_data) from e
            elif status_code == 503:
                 raise ModelUnavailableError(f"Model unavailable: {e}", status_code, response_data) from e
            else:
                raise APIError(f"API request failed: {e}", status_code, response_data) from e
        except requests.exceptions.RequestException as e:
            raise APIError(f"Request failed: {e}") from e
        except ValueError as e:
            raise InvalidResponseError(f"Invalid JSON response: {e}") from e


    @abstractmethod
    def generate_code(self, prompt: str, language: str) -> str:
        """
        Generates code based on a prompt.

        Args:
            prompt: The prompt for code generation.
            language: The programming language for the generated code.

        Returns:
            The generated code.
        """
        pass

    @abstractmethod
    def analyze_code(self, code: str) -> dict:
        """
        Analyzes code and provides insights.

        Args:
            code: The code to analyze.

        Returns:
            A dictionary containing the analysis results.
        """
        pass

    @abstractmethod
    def generate_documentation(self, code: str) -> str:
        """
        Generates documentation for code.

        Args:
            code: The code to generate documentation for.

        Returns:
            The generated documentation.
        """
        pass