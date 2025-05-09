"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, RefreshCw, Key, FileText, Database, HardDrive } from "lucide-react"

export default function DataEncryption() {
  const [encryptionStatus, setEncryptionStatus] = useState({
    databaseEncryption: true,
    fileStorageEncryption: true,
    apiEncryption: true,
    keyRotation: true,
  })

  const [encryptionStrength, setEncryptionStrength] = useState("aes-256")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Data Encryption</h2>
        <p className="text-muted-foreground">
          Secure sensitive client information at rest and in transit with encryption.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Encryption Status</CardTitle>
            <CardDescription>Current status of encryption across the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span>Database Encryption (at rest)</span>
              </div>
              <Badge
                className={
                  encryptionStatus.databaseEncryption ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }
              >
                {encryptionStatus.databaseEncryption ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <span>File Storage Encryption</span>
              </div>
              <Badge
                className={
                  encryptionStatus.fileStorageEncryption ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }
              >
                {encryptionStatus.fileStorageEncryption ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>API Encryption (in transit)</span>
              </div>
              <Badge
                className={encryptionStatus.apiEncryption ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
              >
                {encryptionStatus.apiEncryption ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <span>Key Rotation</span>
              </div>
              <Badge
                className={encryptionStatus.keyRotation ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
              >
                {encryptionStatus.keyRotation ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Encryption Settings</CardTitle>
            <CardDescription>Configure encryption settings for the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Encryption Algorithm</Label>
              <Select value={encryptionStrength} onValueChange={setEncryptionStrength}>
                <SelectTrigger>
                  <SelectValue placeholder="Select encryption strength" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aes-128">AES-128</SelectItem>
                  <SelectItem value="aes-256">AES-256 (Recommended)</SelectItem>
                  <SelectItem value="aes-512">AES-512</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Database Encryption</Label>
                <Switch
                  checked={encryptionStatus.databaseEncryption}
                  onCheckedChange={(checked) =>
                    setEncryptionStatus({ ...encryptionStatus, databaseEncryption: checked })
                  }
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Encrypts all data stored in the database using {encryptionStrength.toUpperCase()}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>File Storage Encryption</Label>
                <Switch
                  checked={encryptionStatus.fileStorageEncryption}
                  onCheckedChange={(checked) =>
                    setEncryptionStatus({ ...encryptionStatus, fileStorageEncryption: checked })
                  }
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Encrypts all files stored in the platform using {encryptionStrength.toUpperCase()}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>API Encryption (TLS)</Label>
                <Switch
                  checked={encryptionStatus.apiEncryption}
                  onCheckedChange={(checked) => setEncryptionStatus({ ...encryptionStatus, apiEncryption: checked })}
                />
              </div>
              <p className="text-xs text-muted-foreground">Enforces TLS 1.3 for all API communications</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Automatic Key Rotation</Label>
                <Switch
                  checked={encryptionStatus.keyRotation}
                  onCheckedChange={(checked) => setEncryptionStatus({ ...encryptionStatus, keyRotation: checked })}
                />
              </div>
              <p className="text-xs text-muted-foreground">Automatically rotate encryption keys every 90 days</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Save Settings</Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="keys" className="space-y-4">
        <TabsList>
          <TabsTrigger value="keys">Encryption Keys</TabsTrigger>
          <TabsTrigger value="sensitive">Sensitive Data</TabsTrigger>
          <TabsTrigger value="logs">Encryption Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Encryption Keys</CardTitle>
                <Button variant="outline" size="sm">
                  <Key className="h-4 w-4 mr-2" />
                  Generate New Key
                </Button>
              </div>
              <CardDescription>Manage encryption keys used across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-xs">key-2023-10-16-001</TableCell>
                    <TableCell>Database</TableCell>
                    <TableCell>2023-10-16</TableCell>
                    <TableCell>2024-01-14</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Rotate
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">key-2023-10-16-002</TableCell>
                    <TableCell>File Storage</TableCell>
                    <TableCell>2023-10-16</TableCell>
                    <TableCell>2024-01-14</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Rotate
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">key-2023-07-18-001</TableCell>
                    <TableCell>Database</TableCell>
                    <TableCell>2023-07-18</TableCell>
                    <TableCell>2023-10-16</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-800">Archived</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" disabled>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Rotate
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-xs">key-2023-07-18-002</TableCell>
                    <TableCell>File Storage</TableCell>
                    <TableCell>2023-07-18</TableCell>
                    <TableCell>2023-10-16</TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-800">Archived</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" disabled>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Rotate
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Key Rotation Schedule</CardTitle>
                <CardDescription>Automatic key rotation schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Database Keys</span>
                    <span>Every 90 days</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Next rotation in 89 days</span>
                      <span>1%</span>
                    </div>
                    <Progress value={1} className="h-2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>File Storage Keys</span>
                    <span>Every 90 days</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Next rotation in 89 days</span>
                      <span>1%</span>
                    </div>
                    <Progress value={1} className="h-2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>API Keys</span>
                    <span>Every 30 days</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Next rotation in 15 days</span>
                      <span>50%</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Key Management</CardTitle>
                <CardDescription>Key management policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Key Storage</Label>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Secure</Badge>
                    <span className="text-sm">AWS KMS</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Keys are stored in AWS Key Management Service with strict access controls
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Key Access</Label>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Restricted</Badge>
                    <span className="text-sm">Admin Only</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Only administrators have access to encryption keys</p>
                </div>

                <div className="space-y-2">
                  <Label>Key Backup</Label>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    <span className="text-sm">Daily</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Keys are backed up daily to a secure offline location</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sensitive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sensitive Data Categories</CardTitle>
              <CardDescription>Categories of sensitive data that are encrypted</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Encryption Level</TableHead>
                    <TableHead>Storage Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Personal Information</TableCell>
                    <TableCell>Names, emails, phone numbers</TableCell>
                    <TableCell>AES-256</TableCell>
                    <TableCell>Database</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Encrypted</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Authentication</TableCell>
                    <TableCell>Passwords, tokens, keys</TableCell>
                    <TableCell>AES-256</TableCell>
                    <TableCell>Database</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Encrypted</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Financial Data</TableCell>
                    <TableCell>Payment info, billing details</TableCell>
                    <TableCell>AES-256</TableCell>
                    <TableCell>Database</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Encrypted</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Business Data</TableCell>
                    <TableCell>Campaign strategies, budgets</TableCell>
                    <TableCell>AES-256</TableCell>
                    <TableCell>Database</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Encrypted</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Documents</TableCell>
                    <TableCell>Uploaded files and documents</TableCell>
                    <TableCell>AES-256</TableCell>
                    <TableCell>File Storage</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Encrypted</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Alert className="bg-blue-100 border-blue-200">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-600">Data Protection Information</AlertTitle>
            <AlertDescription className="text-blue-600">
              All sensitive data is encrypted at rest and in transit. Personal data is processed in accordance with
              GDPR, CCPA, and other applicable regulations.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Encryption Activity Logs</CardTitle>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Logs
                </Button>
              </div>
              <CardDescription>Recent encryption and decryption activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Key ID</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2023-10-16 14:30:25</TableCell>
                    <TableCell>Encrypt</TableCell>
                    <TableCell>System</TableCell>
                    <TableCell>User Data</TableCell>
                    <TableCell className="font-mono text-xs">key-2023-10-16-001</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Success</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-10-16 14:15:10</TableCell>
                    <TableCell>Decrypt</TableCell>
                    <TableCell>john.doe@example.com</TableCell>
                    <TableCell>Campaign Data</TableCell>
                    <TableCell className="font-mono text-xs">key-2023-10-16-001</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Success</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-10-16 13:45:32</TableCell>
                    <TableCell>Key Rotation</TableCell>
                    <TableCell>System</TableCell>
                    <TableCell>Database Keys</TableCell>
                    <TableCell className="font-mono text-xs">key-2023-10-16-001</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Success</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-10-16 13:30:15</TableCell>
                    <TableCell>Encrypt</TableCell>
                    <TableCell>System</TableCell>
                    <TableCell>File Upload</TableCell>
                    <TableCell className="font-mono text-xs">key-2023-10-16-002</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Success</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2023-10-16 13:15:45</TableCell>
                    <TableCell>Decrypt</TableCell>
                    <TableCell>jane.smith@example.com</TableCell>
                    <TableCell>User Data</TableCell>
                    <TableCell className="font-mono text-xs">key-2023-10-16-001</TableCell>
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
