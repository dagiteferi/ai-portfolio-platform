import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Admin/Card';
import { ScrollArea } from '@/components/Admin/ScrollArea';
import { useToast } from '@/hooks/use-toast';
import { getLogFiles, getLogContent } from '@/services/api';

const LogsTab = () => {
  const { showToast } = useToast();
  const [logFiles, setLogFiles] = useState<string[]>([]);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [logContent, setLogContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const data = await getLogFiles();
      setLogFiles(data);
    } catch (error) {
      showToast("Failed to fetch log files.", "error");
    }
  };

  const fetchContent = async (filename: string) => {
    try {
      setIsLoading(true);
      const data = await getLogContent(filename);
      setLogContent(data);
      setSelectedLog(filename);
    } catch (error) {
      showToast(`Failed to fetch log content for ${filename}.`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Log Files</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {logFiles.map((file, index) => (
                <div key={index}
                  className={`p-2 rounded-md cursor-pointer transition-colors ${selectedLog === file ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                  onClick={() => fetchContent(file)}>
                  {file}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>{selectedLog ? `Content of ${selectedLog}` : "Select a log file"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {logContent ? (
                Object.entries(logContent.logs).map(([level, entries]) => (
                  <div key={level} className="mb-6 last:mb-0">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">{level}</h3>
                    <div className="space-y-1">
                      {(entries as any[]).map((entry, i) => (
                        <div key={i} className="font-mono text-[11px] p-2 rounded bg-muted/30 border border-border/50 break-all">
                          {JSON.stringify(entry)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground italic text-sm">
                  No log file selected.
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogsTab;
