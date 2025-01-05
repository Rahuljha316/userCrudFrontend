'use client';
import React, { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AddUserDialog = ({ isDialogOpen, setIsDialogOpen, handleSubmit, userForm, handleInputChange }) => {
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button>Add User</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                    Fill out the form to add a new user.
                </DialogDescription>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="userName"
                            placeholder="User Name"
                            className="input"
                            value={userForm.userName}
                            onChange={handleInputChange}
                        />
                        <input
                            type="email"
                            name="userEmail"
                            placeholder="Email"
                            className="input"
                            value={userForm.userEmail}
                            onChange={handleInputChange}
                        />
                        <input
                            type="password"
                            name="userPassword"
                            placeholder="Password"
                            className="input"
                            value={userForm.userPassword}
                            onChange={handleInputChange}
                        />
                        <input
                            type="url"
                            name="permalink"
                            placeholder="Perma Link"
                            className="input"
                            value={userForm.permalink}
                            onChange={handleInputChange}
                        />
                        <div>
                            <label htmlFor="enabled" className="mr-2">Enabled</label>
                            <input
                                type="checkbox"
                                name="enabled"
                                checked={userForm.enabled}
                                onChange={(e) => handleInputChange({ target: { name: 'enabled', value: e.target.checked } })}
                            />
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <DialogClose asChild>
                                <Button variant="default">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Submit</Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddUserDialog;
