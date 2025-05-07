"""Custom exceptions for AI client interactions."""

class AIClientError(Exception):
    """Base exception for AI client errors."""
    pass

class APIError(AIClientError):
    """Exception raised for errors from the AI model API."""
    def __init__(self, message, status_code=None, response_data=None):
        super().__init__(message)
        self.status_code = status_code
        self.response_data = response_data

class InvalidResponseError(AIClientError):
    """Exception raised for unexpected or unparsable API responses."""
    pass

class RateLimitError(APIError):
    """Exception raised when rate limits are exceeded."""
    pass

class AuthenticationError(APIError):
    """Exception raised for authentication failures."""
    pass

class ModelUnavailableError(APIError):
    """Exception raised when the requested model is unavailable."""
    pass