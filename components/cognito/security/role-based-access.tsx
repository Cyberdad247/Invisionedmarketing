"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { PlusCircle, Edit, Trash2, UserPlus, Users, Key } from "lucide-react"

export default function RoleBasedAccess() {
  // Sample roles data
  const [roles, setRoles] = useState([
    {
      id: "admin",
      name: "Administrator",
      description: "Full access to all system features and settings",
      userCount: 3,
      permissions: {
        agents: { view: true, create: true, edit: true, delete: true },
        workflows: { view: true, create: true, edit: true, delete: true },
        integrations: { view: true, create: true, edit: true, delete: true },
        security: { view: true, create: true, edit: true, delete: true },
        users: { view: true, create: true, edit: true, delete: true },
      },
    },
    {
      id: "manager",
      name: "Marketing Manager",
      description: "Access to manage marketing campaigns and view analytics",
      userCount: 8,
      permissions: {
        agents: { view: true, create: true, edit: true, delete: false },
        workflows: { view: true, create: true, edit: true, delete: false },
        integrations: { view: true, create: false, edit: false, delete: false },
        security: { view: false, create: false, edit: false, delete: false },
        users: { view: true, create: false, edit: false, delete: false },
      },
    },
    {
      id: "creator",
      name: "Content Creator",
      description: "Limited access to create and edit content",
      userCount: 12,
      permissions: {
        agents: { view: true, create: false, edit: true, delete: false },
        workflows: { view: true, create: false, edit: false, delete: false },
        integrations: { view: false, create: false, edit: false, delete: false },
        security: { view: false, create: false, edit: false, delete: false },
        users: { view: false, create: false, edit: false, delete: false },
      },
    },
    {
      id: "analyst",
      name: "Data Analyst",
      description: "Access to view and analyze data",
      userCount: 5,
      permissions: {
        agents: { view: true, create: false, edit: false, delete: false },
        workflows: { view: true, create: false, edit: false, delete: false },
        integrations: { view: true, create: false, edit: false, delete: false },
        security: { view: false, create: false, edit: false, delete: false },
        users: { view: false, create: false, edit: false, delete: false },
      },
    },
    {
      id: "reviewer",
      name: "Content Reviewer",
      description: "Access to review and approve content",
      userCount: 7,
      permissions: {
        agents: { view: true, create: false, edit: false, delete: false },
        workflows: { view: true, create: false, edit: false, delete: false },
        integrations: { view: false, create: false, edit: false, delete: false },
        security: { view: false, create: false, edit: false, delete: false },
        users: { view: false, create: false, edit: false, delete: false },
      },
    },
  ])

  // Sample users data
  const [users, setUsers] = useState([
    {
      id: "user1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "admin",
      status: "active",
      lastLogin: "2023-10-16T14:30:00Z",
    },
    {
      id: "user2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "manager",
      status: "active",
      lastLogin: "2023-10-16T12:15:00Z",
    },
    {
      id: "user3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      role: "creator",
      status: "active",
      lastLogin: "2023-10-15T16:45:00Z",
    },
    {
      id: "user4",
      name: "Alice Williams",
      email: "alice.williams@example.com",
      role: "analyst",
      status: "active",
      lastLogin: "2023-10-16T11:30:00Z",
    },
    {
      id: "user5",
      name: "Charlie Brown",
      email: "charlie.brown@example.com",
      role: "reviewer",
      status: "inactive",
      lastLogin: "2023-10-14T09:15:00Z",
    },
  ])

  const [selectedRole, setSelectedRole] = useState<any>(null)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Role-Based Access Control</h2>
        <p className="text-muted-foreground">
          Manage user roles and permissions to control access to platform features.
        </p>
      </div>

      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Defined Roles</h3>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{role.name}</CardTitle>
                    <Badge variant="outline">{role.userCount} users</Badge>
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Key Permissions</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            role.permissions.agents.edit ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <span>Edit Agents</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            role.permissions.workflows.create ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <span>Create Workflows</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            role.permissions.integrations.view ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <span>View Integrations</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            role.permissions.security.view ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                        <span>Security Settings</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Permissions
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px]">
                      <DialogHeader>
                        <DialogTitle>{role.name} Permissions</DialogTitle>
                        <DialogDescription>{role.description}</DialogDescription>
                      </DialogHeader>

                      <div className="mt-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Module</TableHead>
                              <TableHead>View</TableHead>
                              <TableHead>Create</TableHead>
                              <TableHead>Edit</TableHead>
                              <TableHead>Delete</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {Object.entries(role.permissions).map(([module, perms]) => (
                              <TableRow key={module}>
                                <TableCell className="font-medium capitalize">{module}</TableCell>
                                <TableCell>
                                  {perms.view ? (
                                    <div className="h-2 w-2 rounded-full bg-green-500 mx-auto"></div>
                                  ) : (
                                    <div className="h-2 w-2 rounded-full bg-gray-300 mx-auto"></div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {perms.create ? (
                                    <div className="h-2 w-2 rounded-full bg-green-500 mx-auto"></div>
                                  ) : (
                                    <div className="h-2 w-2 rounded-full bg-gray-300 mx-auto"></div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {perms.edit ? (
                                    <div className="h-2 w-2 rounded-full bg-green-500 mx-auto"></div>
                                  ) : (
                                    <div className="h-2 w-2 rounded-full bg-gray-300 mx-auto"></div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {perms.delete ? (
                                    <div className="h-2 w-2 rounded-full bg-green-500 mx-auto"></div>
                                  ) : (
                                    <div className="h-2 w-2 rounded-full bg-gray-300 mx-auto"></div>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <DialogFooter className="flex justify-between items-center mt-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Users className="h-4 w-4 mr-1" />
                            View Users
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          {role.id !== "admin" && (
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">User Management</h3>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Users</CardTitle>
                <div className="flex items-center gap-2">
                  <Input placeholder="Search users..." className="w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{roles.find((r) => r.id === user.role)?.name || user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }
                        >
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.lastLogin).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Key className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Audit Log</h3>
            <div className="flex items-center gap-2">
              <Input type="date" className="w-40" />
              <Button variant="outline">Filter</Button>
              <Button variant="outline">Export</Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2023-10-16 14:30:25</TableCell>
                    <TableCell>john.doe@example.com</TableCell>
                    <TableCell>CREATE</TableCell>
                    <TableCell>Role (Marketing Intern)</TableCell>
                    <TableCell>192.168.1.1</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Success</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-10-16 14:15:10</TableCell>
                    <TableCell>jane.smith@example.com</TableCell>
                    <TableCell>UPDATE</TableCell>
                    <TableCell>User (bob.johnson@example.com)</TableCell>
                    <TableCell>192.168.1.2</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Success</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-10-16 13:45:32</TableCell>
                    <TableCell>bob.johnson@example.com</TableCell>
                    <TableCell>LOGIN</TableCell>
                    <TableCell>User (bob.johnson@example.com)</TableCell>
                    <TableCell>192.168.1.3</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Success</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-10-16 13:30:15</TableCell>
                    <TableCell>alice.williams@example.com</TableCell>
                    <TableCell>DELETE</TableCell>
                    <TableCell>Workflow (Email Campaign)</TableCell>
                    <TableCell>192.168.1.4</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Success</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-10-16 13:15:45</TableCell>
                    <TableCell>unknown@example.com</TableCell>
                    <TableCell>LOGIN</TableCell>
                    <TableCell>User (unknown@example.com)</TableCell>
                    <TableCell>192.168.1.5</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-800">Failed</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
