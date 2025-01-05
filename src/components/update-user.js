'use client';
import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const UpdateUserDialog = ({ isDialogOpen, setIsDialogOpen, handleSubmit, userForm, handleInputChange, handleDelete, handleUserUpdate }) => {
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle className="text-xl font-semibold">Update User</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                    Fill out the form below to update the user's information.
                </DialogDescription>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="userName">Username</Label>
                            <Input
                                id="userName"
                                type="text"
                                name="userName"
                                placeholder="Enter username"
                                value={userForm.userName}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="userEmail">Email</Label>
                            <Input
                                id="userEmail"
                                type="email"
                                name="userEmail"
                                placeholder="Enter email address"
                                value={userForm.userEmail}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="permalink">Permalink</Label>
                            <Input
                                id="permalink"
                                type="url"
                                name="permalink"
                                placeholder="Enter permalink"
                                value={userForm.permalink}
                                onChange={handleInputChange}
                                className="w-full"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="enabled" className="font-medium">
                                Account Status
                            </Label>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="enabled"
                                    name="enabled"
                                    checked={userForm.enabled}
                                    onCheckedChange={(checked) => 
                                        handleInputChange({ target: { name: 'enabled', value: checked } })
                                    }
                                />
                                <Label htmlFor="enabled" className="text-sm text-muted-foreground">
                                    {userForm.enabled ? 'Enabled' : 'Disabled'}
                                </Label>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <DialogClose asChild>
                                <Button variant="outline" className="w-24">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button 
                                type="button" 
                                onClick={handleUserUpdate}
                                className="w-24"
                            >
                                Update
                            </Button>
                            <Button 
                                onClick={handleDelete} 
                                type="button" 
                                variant="destructive"
                                className="w-24"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateUserDialog;
