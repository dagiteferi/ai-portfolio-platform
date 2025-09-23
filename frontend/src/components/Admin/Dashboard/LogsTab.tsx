import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

const LogsTab = () => {
  const { toast } = useToast();
  const [logFiles, setLogFiles] = useState<string[]>([]);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [logContent, setLogContent] = useState<any>(null);

  useEffect(() => {
    fetchLogFiles();
  }, []);

  const fetchLogFiles = async () => {
    try {
      const response = await fetch('/api/admin/logs');
      if (response.ok) {
        const data = await response.json();
        setLogFiles(data);
      } else {
        toast({ title: "Error", description: "Failed to fetch log files." });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred while fetching log files." });
    }
  };

  const fetchLogContent = async (filename: string) => {
    try {
      const response = await fetch(`/api/admin/logs/${filename}`);
      if (response.ok) {
        const data = await response.json();
        setLogContent(data);
        setSelectedLog(filename);
      } else {
        toast({ title: "Error", description: `Failed to fetch log content for ${filename}.` });
      }
    } catch (error) {
      toast({ title: "Error", description: `An error occurred while fetching log content for ${filename}.` });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Log Files</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {logFiles.map((file, index) => (
                <div key={index} 
                     className={`p-2 rounded-md cursor-pointer ${selectedLog === file ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                     onClick={() => fetchLogContent(file)}>
                  {file}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{selectedLog ? `Content of ${selectedLog}` : "Select a log file"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {logContent ? (
                Object.entries(logContent.logs).map(([level, entries]) => (
                  <div key={level}>
                    <h3 className="font-bold text-lg capitalize">{level}</h3>
                    <ul>
                      {(entries as any[]).map((entry, i) => (
                        <li key={i} className="font-mono text-sm p-2 border-b">
                          {JSON.stringify(entry)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p>No log file selected.</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LogsTab;
