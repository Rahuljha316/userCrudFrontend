'use client';
import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead, TableCaption } from "./ui/table";
import { Button } from "@/components/ui/button";
import AddUserDialog from "./add-user";
import UpdateUserDialog from "./update-user";

const UserTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(2);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [sortKey, setSortKey] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("asc");
    const [totalPages, setTotalPages] = useState(0);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
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


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const query = new URLSearchParams({
                    limit: pageSize,
                    offset: page * pageSize,
                    search,
                    filter,
                    sortKey,
                    sortOrder,
                });

                const response = await fetch(`http://localhost:5000/api/users?${query.toString()}`);
                const result = await response.json();

                setData(result.data || []);
                setTotalPages(Math.ceil((result.meta?.total || 0) / pageSize));
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, pageSize, search, filter, sortKey, sortOrder]);

    const columns = [
        { accessorKey: "userId", header: "ID" },
        { accessorKey: "permalink", header: "Permalink" },
        { accessorKey: "userName", header: "Name" },
        { accessorKey: "userEmail", header: "Email" },
        { accessorKey: "enabled", header: "Enabled" },
        { accessorKey: "createdAt", header: "Created At" },
        { accessorKey: "updatedAt", header: "Updated At" },
    ];
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${selectedUser.userId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                console.log("User deleted successfully");
                setIsDialogOpen(false);
                setPage(0); // Reload data
            } else {
                console.error("Error deleting user", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting user:", error);
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
    const handleRowClick = async (user) => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${user.userId}`);
            const result = await response.json();
            setSelectedUser(user);
            setIsUpdateDialogOpen(true);
            setUserUpdateForm({
                userName: result.data.userName,
                userEmail: result.data.userEmail,
                userPassword: result.data.userPassword, // Not showing password on edit
                permalink: result.data.permalink,
                enabled: result.data.enabled,
            });

        } catch (error) {

        }

    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userForm),
            });
            console.log(response)

            if (response.ok) {
                const result = await response.json();
                console.log("User added successfully", result);
                setIsDialogOpen(false);
                setUserForm({
                    userName: "",
                    userEmail: "",
                    userPassword: "",
                    permalink: "",
                    enabled: true,
                })
                setPage(0);
            } else {
                console.error("Error adding user", response.statusText);
            }
        } catch (error) {
            console.error("Error submitting user form:", error);
        }
    };

    return (
        <div className="flex items-center justify-center mt-8">
            <div className="space-y-4">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Search User..."
                        className="input"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(0);
                        }}
                    />
                    {/* <AddUserDialog
                        isDialogOpen={isDialogOpen}
                        setIsDialogOpen={setIsDialogOpen}
                        handleSubmit={handleSubmit}
                        userForm={userForm}
                        handleInputChange={handleInputChange}
                    /> */}
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
                        handleSubmit={handleSubmit}
                        userForm={userUpdateForm}
                        handleInputChange={handleUpdateInputChange}
                        selectedUser={selectedUser}
                        handleDelete={handleDelete}
                    />
                </div>

                <Table>
                    <TableCaption>User Data</TableCaption>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column.accessorKey}>
                                    <button
                                        className="font-bold"
                                        onClick={() => {
                                            const isAsc =
                                                sortKey === column.accessorKey && sortOrder === "asc";
                                            setSortKey(column.accessorKey);
                                            setSortOrder(isAsc ? "desc" : "asc");
                                        }}
                                    >
                                        {column.header}{" "}
                                        {sortKey === column.accessorKey
                                            ? sortOrder === "asc"
                                                ? "↑"
                                                : "↓"
                                            : ""}
                                    </button>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : data.length > 0 ? (
                            data.map((row) => (
                                <TableRow key={row.userId} onClick={() => handleRowClick(row)}>
                                    {columns.map((column) => (
                                        <TableCell key={column.accessorKey}>
                                            {row[column.accessorKey]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    No data found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="flex justify-between items-center">
                    <button
                        disabled={page <= 0}
                        onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
                    >
                        Previous
                    </button>
                    <span>
                        Page {page + 1} of {totalPages}
                    </span>
                    <button
                        disabled={page + 1 >= totalPages}
                        onClick={() => setPage((prevPage) => prevPage + 1)}
                    >
                        Next
                    </button>
                </div>

                <div className="flex items-center space-x-2 mt-4">
                    <label htmlFor="pageSize" className="font-medium">
                        Rows per page
                    </label>
                    <select
                        id="pageSize"
                        className="input"
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPage(0);
                        }}
                    >
                        <option value={2}>2</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default UserTable;
