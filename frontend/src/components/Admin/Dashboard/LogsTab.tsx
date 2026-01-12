import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import { ScrollArea } from '../ScrollArea';
import { useToast } from '../../../hooks/use-toast';
import { getLogFiles, getLogContent } from '../../../services/api';

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
        <Card>
          <CardHeader>
            <CardTitle>Log Files</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {logFiles.map((file, index) => (
                <div key={index}
                  className={`p-2 rounded-md cursor-pointer ${selectedLog === file ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                  onClick={() => fetchContent(file)}>
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
