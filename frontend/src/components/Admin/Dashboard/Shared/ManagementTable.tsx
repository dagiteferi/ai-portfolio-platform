import React from 'react';
import { Button } from '../../Button';
import { Card, CardContent } from '../../Card';
import { Input } from '../../Input';
import { ScrollArea } from '../../ScrollArea';
import { Plus, Search, Edit2, Trash2, MoreVertical, Loader2 } from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface Column<T> {
    header: string;
    accessor: (item: T) => React.ReactNode;
    className?: string;
}

interface ManagementTableProps<T> {
    title: string;
    data: T[];
    columns: Column<T>[];
    onAdd: () => void;
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
    isLoading?: boolean;
}

const ManagementTable = <T extends { id: string | number }>({
    title,
    data,
    columns,
    onAdd,
    onEdit,
    onDelete,
    isLoading = false
}: ManagementTableProps<T>) => {
    const [searchTerm, setSearchTerm] = React.useState('');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                    <p className="text-sm text-muted-foreground">Manage your portfolio {title.toLowerCase()} here.</p>
                </div>
                <Button onClick={onAdd} className="shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4 mr-2" /> Add New
                </Button>
            </div>

            <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="p-4 border-b bg-muted/30 flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={`Search ${title.toLowerCase()}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-background/50 border-none focus-visible:ring-1 h-9"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-medium">
                            Total: {data.length}
                        </span>
                    </div>
                </div>

                <ScrollArea className="h-[calc(100vh-350px)]">
                    <div className="min-w-full inline-block align-middle">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-muted/50 sticky top-0 z-10">
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th
                                            key={idx}
                                            className={cn(
                                                "px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                                                col.className
                                            )}
                                        >
                                            {col.header}
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border bg-transparent">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                <p className="text-sm text-muted-foreground">Loading data...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
                                            <p className="text-sm text-muted-foreground">No items found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((item) => (
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors group">
                                            {columns.map((col, idx) => (
                                                <td key={idx} className={cn("px-6 py-4 whitespace-nowrap", col.className)}>
                                                    {col.accessor(item)}
                                                </td>
                                            ))}
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => onEdit(item)}
                                                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => onDelete(item)}
                                                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="group-hover:hidden">
                                                    <MoreVertical className="h-4 w-4 text-muted-foreground ml-auto" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </ScrollArea>
            </Card>
        </div>
    );
};

export default ManagementTable;
