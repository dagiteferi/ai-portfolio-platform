import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../Card';
import { ScrollArea } from '../../../ScrollArea';
import { Badge } from '../../../Badge';
import { getLogFiles, getLogContent } from '../../../../../services/api';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '../../../../../hooks/use-toast';
import { Terminal, FileText, RefreshCw, Search } from 'lucide-react';

const LogsTab = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { showToast } = useToast();

  const { data: logFiles, isLoading: filesLoading } = useQuery({
    queryKey: ['admin-log-files'],
    queryFn: getLogFiles,
  });

  const { data: logContent, isLoading: contentLoading } = useQuery({
    queryKey: ['admin-log-content', selectedFile],
    queryFn: () => selectedFile ? getLogContent(selectedFile) : null,
    enabled: !!selectedFile,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
      <Card className="lg:col-span-1 border-none shadow-xl bg-card/50 backdrop-blur-sm flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Log Files
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full px-4 pb-4">
            <div className="space-y-1">
              {logFiles?.map((file) => (
                <button
                  key={file}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors ${selectedFile === file
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {file}
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3 border-none shadow-xl bg-card/50 backdrop-blur-sm flex flex-col overflow-hidden">
        <CardHeader className="pb-4 border-b bg-muted/30 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-sm font-semibold">
                {selectedFile || 'Select a log file'}
              </CardTitle>
              {selectedFile && <p className="text-[10px] text-muted-foreground">Real-time system logs</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] h-5">Live</Badge>
            <button className="p-1.5 hover:bg-background rounded-md transition-colors">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 bg-black/5 font-mono">
          <ScrollArea className="h-full p-6">
            {selectedFile ? (
              <div className="space-y-2">
                {logContent ? (
                  <pre className="text-xs text-muted-foreground leading-relaxed">
                    {typeof logContent === 'string' ? logContent : JSON.stringify(logContent, null, 2)}
                  </pre>
                ) : contentLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <RefreshCw className="h-6 w-6 animate-spin text-primary/40" />
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No content found in this log file.</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-40 py-20">
                <Search className="h-12 w-12 mb-4" />
                <p className="text-sm">Select a file from the sidebar to view logs</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsTab;
