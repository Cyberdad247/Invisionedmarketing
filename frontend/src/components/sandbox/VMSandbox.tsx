// frontend/src/components/sandbox/VMSandbox.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Play, Square, Terminal, RefreshCw, Download } from 'lucide-react';

interface AgentEvent {
  id: string;
  type: 'deployment' | 'task' | 'progress' | 'result' | 'error' | 'termination';
  message: string;
  timestamp: Date;
  data?: any;
}

const VMSandbox: React.FC = () => {
  const [agentId, setAgentId] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<'idle' | 'running' | 'terminated'>('idle');
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [taskInput, setTaskInput] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const eventsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [events]);

  const scrollToBottom = () => {
    eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeployAgent = async () => {
    setIsDeploying(true);

    try {
      // In a real implementation, this would call the VM Sandbox API
      // For now, we'll simulate a response
      setTimeout(() => {
        const newAgentId = `agent_${Date.now()}`;
        setAgentId(newAgentId);
        setAgentStatus('running');

        const deploymentEvent: AgentEvent = {
          id: Date.now().toString(),
          type: 'deployment',
          message: `Agent ${newAgentId} deployed successfully`,
          timestamp: new Date()
        };

        setEvents(prev => [...prev, deploymentEvent]);
        setIsDeploying(false);
      }, 2000);
    } catch (error) {
      console.error('Error deploying agent:', error);
      setIsDeploying(false);

      const errorEvent: AgentEvent = {
        id: Date.now().toString(),
        type: 'error',
        message: `Deployment failed: ${error}`,
        timestamp: new Date()
      };

      setEvents(prev => [...prev, errorEvent]);
    }
  };

  const handleExecuteTask = async () => {
    if (!agentId || !taskInput.trim()) return;

    setIsExecuting(true);
    setProgress(0);
    setResult(null);

    try {
      // In a real implementation, this would call the VM Sandbox API
      // For now, we'll simulate a response

      const taskEvent: AgentEvent = {
        id: Date.now().toString(),
        type: 'task',
        message: `Task received: ${taskInput}`,
        timestamp: new Date(),
        data: { task: taskInput }
      };

      setEvents(prev => [...prev, taskEvent]);

      // Simulate progress updates
      setTimeout(() => {
        setProgress(30);

        const progressEvent: AgentEvent = {
          id: Date.now().toString(),
          type: 'progress',
          message: 'Task is 30% complete',
          timestamp: new Date(),
          data: { progress: 30 }
        };

        setEvents(prev => [...prev, progressEvent]);
      }, 1000);

      setTimeout(() => {
        setProgress(70);

        const progressEvent: AgentEvent = {
          id: Date.now().toString(),
          type: 'progress',
          message: 'Task is 70% complete',
          timestamp: new Date(),
          data: { progress: 70 }
        };

        setEvents(prev => [...prev, progressEvent]);
      }, 2000);

      setTimeout(() => {
        setProgress(100);

        const taskResult = {
          success: true,
          data: `Completed task: ${taskInput}`
        };

        setResult(taskResult);

        const resultEvent: AgentEvent = {
          id: Date.now().toString(),
          type: 'result',
          message: 'Task completed successfully',
          timestamp: new Date(),
          data: taskResult
        };

        setEvents(prev => [...prev, resultEvent]);
        setIsExecuting(false);
      }, 3000);
    } catch (error) {
      console.error('Error executing task:', error);
      setIsExecuting(false);

      const errorEvent: AgentEvent = {
        id: Date.now().toString(),
        type: 'error',
        message: `Task execution failed: ${error}`,
        timestamp: new Date()
      };

      setEvents(prev => [...prev, errorEvent]);
    }
  };

  const handleTerminateAgent = async () => {
    if (!agentId) return;

    try {
      // In a real implementation, this would call the VM Sandbox API
      // For now, we'll simulate a response
      setTimeout(() => {
        setAgentStatus('terminated');

        const terminationEvent: AgentEvent = {
          id: Date.now().toString(),
          type: 'termination',
          message: `Agent ${agentId} terminated successfully`,
          timestamp: new Date()
        };

        setEvents(prev => [...prev, terminationEvent]);
      }, 1000);
    } catch (error) {
      console.error('Error terminating agent:', error);

      const errorEvent: AgentEvent = {
        id: Date.now().toString(),
        type: 'error',
        message: `Termination failed: ${error}`,
        timestamp: new Date()
      };

      setEvents(prev => [...prev, errorEvent]);
    }
  };

  return (
    <Card className="w-full h-[calc(100vh-2rem)]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>VM Sandbox</CardTitle>
            <CardDescription>Secure agent execution environment</CardDescription>
          </div>

          <div className="flex items-center space-x-2">
            {agentId && (
              <Badge variant={agentStatus === 'running' ? 'default' : 'secondary'}>
                {agentStatus === 'running' ? 'Running' : 'Terminated'}
              </Badge>
            )}

            {agentId && agentStatus === 'running' ? (
              <Button variant="destructive" size="sm" onClick={handleTerminateAgent}>
                <Square className="h-4 w-4 mr-2" />
                Terminate
              </Button>
            ) : (
              <Button onClick={handleDeployAgent} disabled={isDeploying}>
                {isDeploying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Deploy Agent
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="console" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="console">Console</TabsTrigger>
            <TabsTrigger value="task">Task Execution</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="console" className="space-y-4">
            <ScrollArea className="h-[60vh] border rounded-md p-4 bg-black text-green-400 font-mono">
              {events.map(event => (
                <div key={event.id} className="mb-2">
                  <span className="text-gray-500">[{event.timestamp.toLocaleTimeString()}]</span>{' '}
                  <span className={`
                    ${event.type === 'error' ? 'text-red-400' : ''}
                    ${event.type === 'result' ? 'text-blue-400' : ''}
                    ${event.type === 'deployment' ? 'text-yellow-400' : ''}
                  `}>
                    {event.message}
                  </span>
                </div>
              ))}
              <div ref={eventsEndRef} />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="task" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Task Description</label>
              <Textarea
                value={taskInput}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTaskInput(e.target.value)}
                placeholder="Describe the task for the agent to execute..."
                className="h-[20vh]"
                disabled={!agentId || agentStatus !== 'running'}
              />
            </div>

            <Button
              onClick={handleExecuteTask}
              disabled={isExecuting || !agentId || agentStatus !== 'running' || !taskInput.trim()}
            >
              {isExecuting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Terminal className="h-4 w-4 mr-2" />
                  Execute Task
                </>
              )}
            </Button>

            {isExecuting && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {result ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Task Results</h3>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
                <RefreshCw className="h-12 w-12 mb-4" />
                <p>No results available yet</p>
                <p className="text-sm">Execute a task to see results here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VMSandbox;