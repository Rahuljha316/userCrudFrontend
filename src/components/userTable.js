'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead, TableCaption } from "./ui/table";
import AddUserDialog from "./add-user";
import UpdateUserDialog from "./update-user";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card } from "./ui/card";
import { Loader2 } from "lucide-react";

const UserTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [sortKey, setSortKey] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("asc");
    const [totalPages, setTotalPages] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [userForm, setUserForm] = useState({
        userName: "",
        userEmail: "",
        userPassword: "",
        permalink: "",
        enabled: true,
    });
    const [userUpdateForm, setUserUpdateForm] = useState({
        userName: "",
        userEmail: "",
        userPassword: "",
        permalink: "",
        enabled: true,
    });

    const { toast } = useToast();

    const fetchData = async () => {
        setLoading(true);
        try {
            const query = {
                limit: pageSize,
                offset: page * pageSize,
                search,
                filter,
                sortKey,
                sortOrder,
            };

            const response = await axios.get("http://localhost:5000/api/users", { params: query });
            const result = response.data;

            setData(result.data || []);
            setTotalPages(Math.ceil((result.meta?.total || 0) / pageSize));
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error fetching data",
                description: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchData();
    }, [page, pageSize, debouncedSearch, filter, sortKey, sortOrder]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${selectedUser.userId}`);
            toast({
                title: "User deleted successfully",
                variant: "success"
            });
            setIsUpdateDialogOpen(false);
            fetchData();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed to delete user",
                description: error.response?.data?.error || error.message,
            });
        }
    };

    const handleRowClick = async (user) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/users/${user.userId}`);
            const result = response.data;

            setSelectedUser(user);
            setIsUpdateDialogOpen(true);
            setUserUpdateForm({
                userName: result.data.userName,
                userEmail: result.data.userEmail,
                userPassword: result.data.userPassword,
                permalink: result.data.permalink,
                enabled: result.data.enabled,
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error fetching user details",
                description: error.message
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/users", userForm);
            if (response.status === 200 || response.status === 201) {
                toast({
                    title: 'User added successfully',
                    variant: "success"
                });
                setIsDialogOpen(false);
                setUserForm({
                    userName: "",
                    userEmail: "",
                    userPassword: "",
                    permalink: "",
                    enabled: true,
                });
                setPage(0);
                fetchData();
            }
        } catch (error) {
            console.error("Error submitting user form:", error);
            toast({
                variant: "destructive",
                title: "Failed to add user",
                description: error.response?.data?.error || error.message,
            });
        }
    };

    const handleUserUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/users/${selectedUser.userId}`, userUpdateForm);
            if (response.status === 200 || response.status === 201) {
                toast({
                    title: 'User updated successfully',
                    variant: "success"
                });
                setIsUpdateDialogOpen(false);
                fetchData();
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast({
                variant: "destructive",
                title: "Failed to update user",
                description: error.response?.data?.error || error.message,
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleUpdateInputChange = (e) => {
        const { name, value } = e.target;
        setUserUpdateForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const columns = [
        { accessorKey: "userId", header: "ID" },
        { accessorKey: "permalink", header: "Permalink" },
        { accessorKey: "userName", header: "Name" },
        { accessorKey: "userEmail", header: "Email" },
        { accessorKey: "createdAt", header: "Created At" },
        { accessorKey: "updatedAt", header: "Updated At" },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex-1 max-w-sm">
                        <Input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(0);
                            }}
                            className="w-full"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <AddUserDialog
                            isDialogOpen={isDialogOpen}
                            setIsDialogOpen={setIsDialogOpen}
                            handleSubmit={handleSubmit}
                            userForm={userForm}
                            handleInputChange={handleInputChange}
                        />
                        <UpdateUserDialog
                            isDialogOpen={isUpdateDialogOpen}
                            setIsDialogOpen={setIsUpdateDialogOpen}
                            handleUserUpdate={handleUserUpdate}
                            userForm={userUpdateForm}
                            handleInputChange={handleUpdateInputChange}
                            selectedUser={selectedUser}
                            handleDelete={handleDelete}
                        />
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableHead key={column.accessorKey}>
                                        <button
                                            className="flex items-center space-x-1 font-bold hover:text-primary"
                                            onClick={() => {
                                                const isAsc = sortKey === column.accessorKey && sortOrder === "asc";
                                                setSortKey(column.accessorKey);
                                                setSortOrder(isAsc ? "desc" : "asc");
                                            }}
                                        >
                                            <span>{column.header}</span>
                                            {sortKey === column.accessorKey && (
                                                <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                                            )}
                                        </button>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                            <span className="ml-2">Loading...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : data.length > 0 ? (
                                data.map((row) => (
                                    <TableRow
                                        key={row.userId}
                                        onClick={() => handleRowClick(row)}
                                        className="cursor-pointer hover:bg-muted"
                                    >
                                        {columns.map((column) => (
                                            <TableCell key={column.accessorKey}>
                                                {row[column.accessorKey]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Rows per page</span>
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(value) => {
                                setPageSize(Number(value));
                                setPage(0);
                            }}
                        >
                            <SelectTrigger className="w-[70px]">
                                <SelectValue placeholder={pageSize} />
                            </SelectTrigger>
                            <SelectContent>
                                {[2, 5, 10, 20].map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {page + 1} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page + 1 >= totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default UserTable;
