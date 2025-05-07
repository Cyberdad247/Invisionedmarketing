import docker
import os
import threading
import time

class DockerSandbox:
    def __init__(self, image: str = "python:3.9-slim", name_prefix: str = "agent_sandbox_"):
        """
        Initializes the Docker Sandbox manager.

        Args:
            image: The Docker image to use for the sandbox.
            name_prefix: Prefix for sandbox container names.
        """
        self.client = docker.from_env()
        self.image = image
        self.name_prefix = name_prefix
        self.container = None
        self.container_name = None
        self.ipc_volume_host_path = None
        self.ipc_volume_container_path = "/sandbox_ipc"
        self.ipc_input_file = "input.txt"
        self.ipc_output_file = "output.txt"


    def create_sandbox(self, command: list[str], resource_limits: dict = None, volumes: dict = None, environment: dict = None, ipc_volume_host_path: str = None):
        """
        Creates and starts a Docker container sandbox with an optional IPC volume.

        Args:
            command: The command to run inside the container.
            resource_limits: Dictionary of resource limits (e.g., {'cpu_shares': 512, 'mem_limit': '128m'}).
            volumes: Dictionary of additional volumes to mount (e.g., {'/host/path': {'bind': '/container/path', 'mode': 'rw'}}).
            environment: Dictionary of environment variables to set in the container.
            ipc_volume_host_path: The host path for the IPC volume. If provided, an IPC volume will be mounted.
        """
        self.container_name = f"{self.name_prefix}{int(time.time())}_{os.urandom(4).hex()}"
        
        # Prepare volumes, including the IPC volume if specified
        all_volumes = volumes if volumes is not None else {}
        if ipc_volume_host_path:
            self.ipc_volume_host_path = ipc_volume_host_path
            # Ensure the host directory exists
            os.makedirs(self.ipc_volume_host_path, exist_ok=True)
            all_volumes[self.ipc_volume_host_path] = {'bind': self.ipc_volume_container_path, 'mode': 'rw'}
            print(f"IPC volume mounted: {self.ipc_volume_host_path} -> {self.ipc_volume_container_path}")

        try:
            print(f"Creating container {self.container_name} from image {self.image}...")
            self.container = self.client.containers.run(
                self.image,
                command,
                name=self.container_name,
                detach=True, # Run in detached mode
                auto_remove=False, # Don't auto-remove yet, we'll do it manually
                resources=resource_limits,
                volumes=all_volumes, # Use the combined volumes dictionary
                environment=environment,
                network_mode="none", # Isolate network access by default
                security_opt=["no-new-privileges"], # Prevent privilege escalation
                cap_drop=["ALL"], # Drop all capabilities
            )
            print(f"Container {self.container_name} created and started.")
        except docker.errors.ImageNotFound:
            print(f"Error: Docker image '{self.image}' not found. Pulling image...")
            self.client.images.pull(self.image)
            # Retry creating the container after pulling the image
            self.create_sandbox(command, resource_limits, volumes, environment)
        except docker.errors.APIError as e:
            print(f"Error creating container: {e}")
            self.container = None

    def run_command(self, command: list[str], timeout: int = 60):
        """
        Executes a command in the running sandbox container.

        Args:
            command: The command to execute.
            timeout: Timeout in seconds for the command execution.

        Returns:
            Tuple of (exit_code, output) or (None, None) if container is not running.
        """
        if not self.container:
            print("Error: Sandbox container is not running.")
            return None, None

        try:
            print(f"Executing command in {self.container_name}: {' '.join(command)}")
            exec_result = self.container.exec_run(command, stream=True)
            output = ""
            for chunk in exec_result.output:
                output += chunk.decode('utf-8')

            # Wait for the execution to complete and get the exit code
            # This requires checking the low-level API result
            exec_info = self.client.api.exec_inspect(exec_result.id)
            exit_code = exec_info.get('ExitCode')

            print(f"Command execution finished with exit code {exit_code}.")
            return exit_code, output
        except docker.errors.NotFound:
            print(f"Error: Container {self.container_name} not found.")
            return None, None
        except docker.errors.APIError as e:
            print(f"Error executing command in container: {e}")
            return None, None

    def get_logs(self):
        """
        Retrieves logs from the sandbox container.

        Returns:
            String containing the container logs.
        """
        if not self.container:
            print("Error: Sandbox container is not running.")
            return ""

        try:
            print(f"Fetching logs for {self.container_name}...")
            logs = self.container.logs().decode('utf-8')
            print("Logs fetched.")
            return logs
        except docker.errors.NotFound:
            print(f"Error: Container {self.container_name} not found.")
            return ""
        except docker.errors.APIError as e:
            print(f"Error fetching container logs: {e}")
            return ""

    def stop_sandbox(self):
        """
        Stops the sandbox container.
        """
        if not self.container:
            print("Error: No sandbox container to stop.")
            return

        try:
            print(f"Stopping container {self.container_name}...")
            self.container.stop()
            print(f"Container {self.container_name} stopped.")
        except docker.errors.NotFound:
            print(f"Error: Container {self.container_name} not found.")
        except docker.errors.APIError as e:
            print(f"Error stopping container: {e}")

    def remove_sandbox(self):
        """
        Removes the sandbox container.
        """
        if not self.container:
            print("Error: No sandbox container to remove.")
            return

        try:
            print(f"Removing container {self.container_name}...")
            self.container.remove()
            print(f"Container {self.container_name} removed.")
            self.container = None
            self.container_name = None
        except docker.errors.NotFound:
            print(f"Error: Container {self.container_name} not found.")
        except docker.errors.APIError as e:
            print(f"Error removing container: {e}")

    def __del__(self):
        """
        Ensures the container is removed when the object is garbage collected.
        """
        if self.container:
            print(f"Cleaning up container {self.container_name}...")
            try:
                self.container.remove(force=True) # Force remove in case it's still running
                print(f"Container {self.container_name} cleaned up.")
            except docker.errors.NotFound:
                pass # Container already removed
            except docker.errors.APIError as e:
                print(f"Error during container cleanup: {e}")

    def send_to_sandbox(self, data: str):
        """
        Sends data to the sandbox by writing to the input file in the mounted volume.

        Args:
            data: The string data to send.
        """
        if not self.ipc_volume_host_path:
            print("Error: IPC volume not configured for this sandbox.")
            return

        input_file_path = os.path.join(self.ipc_volume_host_path, self.ipc_input_file)
        try:
            with open(input_file_path, "w") as f:
                f.write(data)
            print(f"Data written to sandbox input file: {input_file_path}")
        except IOError as e:
            print(f"Error writing to sandbox input file: {e}")

    def receive_from_sandbox(self) -> str:
        """
        Receives data from the sandbox by reading from the output file in the mounted volume.

        Returns:
            The string data read from the output file, or an empty string if an error occurs or no data is present.
        """
        if not self.ipc_volume_host_path:
            print("Error: IPC volume not configured for this sandbox.")
            return ""

        output_file_path = os.path.join(self.ipc_volume_host_path, self.ipc_output_file)
        try:
            if os.path.exists(output_file_path):
                with open(output_file_path, "r") as f:
                    data = f.read()
                print(f"Data read from sandbox output file: {output_file_path}")
                return data
            else:
                print(f"Sandbox output file not found: {output_file_path}")
                return ""
        except IOError as e:
            print(f"Error reading from sandbox output file: {e}")
            return ""


# Example Usage (for testing purposes)
if __name__ == "__main__":
    sandbox = DockerSandbox()

    # Define resource limits (e.g., 0.5 CPU, 128MB memory)
    resource_limits = {
        'cpu_quota': 50000, # 50% of one CPU
        'cpu_period': 100000,
        'mem_limit': '128m',
        'blkio_weight': 500, # Adjust I/O priority
    }

    # Define a simple command to run that uses the IPC files
    # This command will read from input.txt, write to output.txt, and then exit
    command_to_run = [
        "sh", "-c",
        f"cat {sandbox.ipc_volume_container_path}/{sandbox.ipc_input_file} > {sandbox.ipc_volume_container_path}/{sandbox.ipc_output_file} && echo 'Sandbox processing complete.' && exit 0"
    ]

    # Define a host path for the IPC volume (create a temporary directory)
    import tempfile
    ipc_dir = tempfile.mkdtemp(prefix="sandbox_ipc_")
    print(f"Using temporary directory for IPC: {ipc_dir}")

    # Create and start the sandbox with the IPC volume
    sandbox.create_sandbox(command=command_to_run, resource_limits=resource_limits, ipc_volume_host_path=ipc_dir)

    # Give the container a moment to start
    time.sleep(2)

    # Send data to the sandbox
    data_to_send = "Hello from the host!"
    sandbox.send_to_sandbox(data_to_send)

    # Give the sandbox time to process (adjust as needed based on the sandbox command)
    time.sleep(3)

    # Receive data from the sandbox
    received_data = sandbox.receive_from_sandbox()
    print(f"\n--- Received Data from Sandbox ---")
    print(received_data)
    print("----------------------------------\n")

    # Get logs to see the sandbox output
    logs = sandbox.get_logs()
    print("\n--- Sandbox Logs ---")
    print(logs)
    print("--------------------\n")

    # Stop and remove the sandbox
    sandbox.stop_sandbox()
    sandbox.remove_sandbox()

    # Clean up the temporary IPC directory
    import shutil
    shutil.rmtree(ipc_dir)
    print(f"Cleaned up temporary IPC directory: {ipc_dir}")

    print("Sandbox lifecycle complete.")