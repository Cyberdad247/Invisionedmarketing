from datetime import datetime

class StateSnapshot:
    """Class for managing state snapshots and versioning"""
    def __init__(self, data: dict, version: int = 1):
        self.data = data
        self.version = version
        self.timestamp = datetime.utcnow()

    def to_dict(self) -> dict:
        return {
            "data": self.data,
            "version": self.version,
            "timestamp": self.timestamp.isoformat()
        }

class ToolExecutionError(Exception):
    """Base exception for tool execution errors."""
    def __init__(self, message: str, severity: str = "Critical", details: dict = None):
        self.message = message
        self.severity = severity
        self.details = details if details is not None else {}
        self.recovery_state = None  # Stores state for recovery attempts
        super().__init__(self.message)

    def set_recovery_state(self, state: dict):
        """Store state snapshot for recovery purposes"""
        self.recovery_state = StateSnapshot(state)

class TransientError(ToolExecutionError):
    """Represents a temporary error that might resolve on retry."""
    def __init__(self, message: str = "Transient error during tool execution.", details: dict = None):
        super().__init__(message, severity="Warning", details=details)

class CriticalError(ToolExecutionError):
    """Represents a severe error requiring immediate attention."""
    def __init__(self, message: str = "Critical error during tool execution.", details: dict = None):
        super().__init__(message, severity="Critical", details=details)

class ServiceUnavailableError(TransientError):
    """Represents an external service being temporarily unavailable."""
    def __init__(self, message: str = "External service is temporarily unavailable.", details: dict = None):
        super().__init__(message, details=details)

class CircuitBreakerOpenError(CriticalError):
    """Represents an error when the circuit breaker is open."""
    def __init__(self, message: str = "Circuit breaker is open for this service.", details: dict = None):
        super().__init__(message, severity="Warning", details=details) # Classify as Warning as it might recover

class ToolNotFoundError(CriticalError):
    """Represents a tool not being found."""
    def __init__(self, message: str = "Tool not found.", details: dict = None):
        super().__init__(message, severity="Critical", details=details)

class InvalidRequestError(CriticalError):
    """Represents an invalid request to the tool service."""
    def __init__(self, message: str = "Invalid tool request.", details: dict = None):
        super().__init__(message, severity="Critical", details=details)

# Add more specific error types as needed based on ACI integration responses

class TaskError(ToolExecutionError):
    """Base class for all task-related errors"""
    def __init__(self, message: str, severity: str = "Critical", details: dict = None, retryable: bool = False):
        super().__init__(message, severity, details)
        self.retryable = retryable
        self.recovery_actions = []  # List of recovery procedures to attempt

    def add_recovery_action(self, action: callable):
        """Add a recovery procedure to attempt"""
        self.recovery_actions.append(action)

class TaskNotFoundError(TaskError):
    """Raised when a task cannot be found"""
    def __init__(self, message: str = "Task not found", details: dict = None):
        super().__init__(message, "Critical", details, retryable=False)

class TaskRateLimitError(TransientError):
    """Raised when task rate limits are exceeded"""
    def __init__(self, message: str = "Task rate limit exceeded", retry_after: int = 60, details: dict = None):
        details = details or {}
        details['retry_after'] = retry_after
        super().__init__(message, details)

class TaskDependencyError(TransientError):
    """Raised when a task dependency fails"""
    def __init__(self, message: str = "Task dependency failed", dependency: str = None, details: dict = None):
        details = details or {}
        details['dependency'] = dependency
        super().__init__(message, details)

class TaskBatchError(CriticalError):
    """Raised when batch task processing fails"""
    def __init__(self, message: str = "Batch task processing failed", batch_id: str = None, details: dict = None):
        details = details or {}
        details['batch_id'] = batch_id
        super().__init__(message, details)