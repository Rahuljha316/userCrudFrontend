'use client';
import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const UpdateUserDialog = ({ isDialogOpen, setIsDialogOpen, handleSubmit, userForm, handleInputChange, handleDelete, handleUserUpdate }) => {
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogTitle>Update User</DialogTitle>
                <DialogDescription>
                    Fill out the form to update user.
                </DialogDescription>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="userName" className="block mb-1 font-bold">User Name</label>
                            <input
                                type="text"
                                id="userName"
                                name="userName"
                                placeholder="User Name"
                                className="input"
                                value={userForm.userName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="userEmail" className="block mb-1 font-bold">Email</label>
                            <input
                                type="email"
                                id="userEmail"
                                name="userEmail"
                                placeholder="Email"
                                className="input"
                                value={userForm.userEmail}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="permalink" className="block mb-1 font-bold">Perma Link</label>
                            <input
                                type="url"
                                id="permalink"
                                name="permalink"
                                placeholder="Perma Link"
                                className="input"
                                value={userForm.permalink}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="enabled" className="mr-2 font-bold">Enabled</label>
                            <input
                                type="checkbox"
                                id="enabled"
                                name="enabled"
                                checked={userForm.enabled}
                                onChange={(e) => handleInputChange({ target: { name: 'enabled', value: e.target.checked } })}
                            />
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <DialogClose asChild>
                                <Button variant="default">Cancel</Button>
                            </DialogClose>
                            <Button type="button" onClick={handleUserUpdate}>Update</Button>
                            <Button onClick={handleDelete} type="button" variant="destructive">Delete</Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateUserDialog;
