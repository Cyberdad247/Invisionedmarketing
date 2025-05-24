import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface EnhancedAgentConfigurationPanelProps {
  className?: string;
}

const EnhancedAgentConfigurationPanel: React.FC<EnhancedAgentConfigurationPanelProps> = ({ 
  className = '' 
}) => {
  const [temperature, setTemperature] = React.useState([0.7]);
  const [maxTokens, setMaxTokens] = React.useState(1000);
  const [topP, setTopP] = React.useState([0.9]);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [frequencyPenalty, setFrequencyPenalty] = React.useState([0.0]);
  const [presencePenalty, setPresencePenalty] = React.useState([0.0]);
  const [stopSequences, setStopSequences] = React.useState('');

  return (
    <div className={`flex flex-col bg-white rounded-lg shadow-md ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-primary">Agent Configuration</h2>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <Tabs defaultValue="basic">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="basic" className="flex-1">Basic</TabsTrigger>
            <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model Selection
              </label>
              <Select defaultValue="gpt-4">
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="claude">Claude</SelectItem>
                  <SelectItem value="llama">Llama</SelectItem>
                  <SelectItem value="mistral">Mistral</SelectItem>
                  <SelectItem value="palm">PaLM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature: {temperature[0].toFixed(1)}
              </label>
              <Slider
                value={temperature}
                min={0}
                max={1}
                step={0.1}
                onValueChange={setTemperature}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Tokens
              </label>
              <input
                type="number"
                min="1"
                max="8000"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Top P: {topP[0].toFixed(1)}
              </label>
              <Slider
                value={topP}
                min={0}
                max={1}
                step={0.1}
                onValueChange={setTopP}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency Penalty: {frequencyPenalty[0].toFixed(1)}
              </label>
              <Slider
                value={frequencyPenalty}
                min={0}
                max={2}
                step={0.1}
                onValueChange={setFrequencyPenalty}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Presence Penalty: {presencePenalty[0].toFixed(1)}
              </label>
              <Slider
                value={presencePenalty}
                min={0}
                max={2}
                step={0.1}
                onValueChange={setPresencePenalty}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stop Sequences
              </label>
              <input
                type="text"
                value={stopSequences}
                onChange={(e) => setStopSequences(e.target.value)}
                placeholder="Comma-separated sequences"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="streaming" />
              <label htmlFor="streaming" className="text-sm font-medium text-gray-700">
                Enable streaming responses
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="cache" defaultChecked />
              <label htmlFor="cache" className="text-sm font-medium text-gray-700">
                Enable response caching
              </label>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button
          className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default EnhancedAgentConfigurationPanel;
