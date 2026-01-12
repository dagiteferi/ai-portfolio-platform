import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Admin/Card';
import { Button } from '@/components/Admin/Button';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { Input } from '@/components/Admin/Input';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
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

function ManagementTable<T extends { id: number | string }>({
    title,
    data,
    columns,
    onAdd,
    onEdit,
    onDelete,
    isLoading
}: ManagementTableProps<T>) {
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredData = data.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <div>
                    <CardTitle className="text-2xl font-bold">{title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your {title.toLowerCase()} and content.
                    </p>
                </div>
                <Button onClick={onAdd} className="shadow-lg shadow-primary/20">
                    <Plus className="mr-2 h-4 w-4" /> Add New
                </Button>
            </CardHeader>
            <CardContent>
                <div className="flex items-center mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-background/50"
                        />
                    </div>
                </div>

                <div className="rounded-xl border bg-background/50 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted/50 border-b transition-colors">
                                {columns.map((col, i) => (
                                    <th key={i} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                        {col.header}
                                    </th>
                                ))}
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="h-24 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                            Loading...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="h-24 text-center text-muted-foreground">
                                        No results found.
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/30 transition-colors group">
                                        {columns.map((col, i) => (
                                            <td key={i} className="p-4 align-middle">
                                                {typeof col.accessor === 'function'
                                                    ? col.accessor(item)
                                                    : (item[col.accessor] as React.ReactNode)}
                                            </td>
                                        ))}
                                        <td className="p-4 align-middle text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onEdit(item)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => onDelete(item)}
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

export default ManagementTable;
