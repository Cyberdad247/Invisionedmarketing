"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, FileText, RefreshCw, Clock, Info, ExternalLink, Search, Filter } from "lucide-react"

export default function ComplianceChecks() {
  // Sample compliance issues
  const [complianceIssues, setComplianceIssues] = useState([
    {
      id: "issue-1",
      severity: "high",
      regulation: "GDPR",
      description: "Missing consent for data processing in EU region",
      resource: "User Registration Form",
      detected: "2023-10-15T14:30:00Z",
      status: "open",
    },
    {
      id: "issue-2",
      severity: "medium",
      regulation: "CCPA",
      description: "Privacy policy missing required CCPA disclosures",
      resource: "Privacy Policy",
      detected: "2023-10-14T10:15:00Z",
      status: "in_progress",
    },
    {
      id: "issue-3",
      severity: "low",
      regulation: "GDPR",
      description: "Data retention period not specified for analytics data",
      resource: "Analytics Module",
      detected: "2023-10-13T16:45:00Z",
      status: "resolved",
    },
    {
      id: "issue-4",
      severity: "high",
      regulation: "HIPAA",
      description: "Unencrypted health-related data detected",
      resource: "Customer Survey Responses",
      detected: "2023-10-12T09:30:00Z",
      status: "open",
    },
    {
      id: "issue-5",
      severity: "medium",
      regulation: "CCPA",
      description: "Missing mechanism for users to request data deletion",
      resource: "User Account Settings",
      detected: "2023-10-11T11:20:00Z",
      status: "in_progress",
    },
  ])

  // Sample compliance scans
  const [complianceScans, setComplianceScans] = useState([
    {
      id: "scan-1",
      type: "Automated",
      startTime: "2023-10-16T00:00:00Z",
      endTime: "2023-10-16T01:30:00Z",
      issuesFound: 2,
      status: "completed",
    },
    {
      id: "scan-2",
      type: "Manual",
      startTime: "2023-10-15T10:00:00Z",
      endTime: "2023-10-15T14:00:00Z",
      issuesFound: 3,
      status: "completed",
    },
    {
      id: "scan-3",
      type: "Automated",
      startTime: "2023-10-14T00:00:00Z",
      endTime: "2023-10-14T01:45:00Z",
      issuesFound: 1,
      status: "completed",
    },
    {
      id: "scan-4",
      type: "Automated",
      startTime: "2023-10-13T00:00:00Z",
      endTime: "2023-10-13T01:30:00Z",
      issuesFound: 0,
      status: "completed",
    },
    {
      id: "scan-5",
      type: "Manual",
      startTime: "2023-10-10T09:00:00Z",
      endTime: "2023-10-10T15:00:00Z",
      issuesFound: 4,
      status: "completed",
    },
  ])

  // Compliance settings
  const [complianceSettings, setComplianceSettings] = useState({
    automatedScans: true,
    scanFrequency: "daily",
    gdprCompliance: true,
    ccpaCompliance: true,
    hipaaCompliance: false,
    pciCompliance: false,
    dataRetentionPeriod: 90,
    notifyOnIssues: true,
  })

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">High</Badge>
      case "medium":
        return <Badge className="bg-amber-100 text-amber-800">Medium</Badge>
      case "low":
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>
      default:
        return <Badge>{severity}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-red-100 text-red-800">Open</Badge>
      case "in_progress":
        return <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getScanStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "in_progress":
        return <Badge className="bg-amber-100 text-amber-800">In Progress</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Automated Compliance Checks</h2>
        <p className="text-muted-foreground">Automatically detect and flag potential regulatory compliance issues.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Compliance Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>GDPR Compliance</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CCPA Compliance</span>
                <span>90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>HIPAA Compliance</span>
                <span>70%</span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>PCI DSS Compliance</span>
                <span>95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Open Issues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">High Severity</div>
                  <div className="text-xs text-muted-foreground">2 issues</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Medium Severity</div>
                  <div className="text-xs text-muted-foreground">2 issues</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Info className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Low Severity</div>
                  <div className="text-xs text-muted-foreground">1 issue</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Run Compliance Scan
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Next Scheduled Scan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Daily Automated Scan</div>
                <div className="text-xs text-muted-foreground">Scheduled for 00:00 UTC</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Scan Coverage</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>GDPR</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>CCPA</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                  <span>HIPAA</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                  <span>PCI DSS</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Last Scan Results</div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
                <span className="text-xs text-muted-foreground">2 issues found</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              View Scan History
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="issues" className="space-y-4">
        <TabsList>
          <TabsTrigger value="issues">Compliance Issues</TabsTrigger>
          <TabsTrigger value="scans">Scan History</TabsTrigger>
          <TabsTrigger value="settings">Compliance Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Detected Compliance Issues</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Severity</TableHead>
                    <TableHead>Regulation</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Detected</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell>{getSeverityBadge(issue.severity)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{issue.regulation}</Badge>
                      </TableCell>
                      <TableCell>{issue.description}</TableCell>
                      <TableCell>{issue.resource}</TableCell>
                      <TableCell>{new Date(issue.detected).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(issue.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Alert className="bg-amber-100 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-600">Compliance Warning</AlertTitle>
            <AlertDescription className="text-amber-600">
              There are 2 high-severity compliance issues that require immediate attention. Please review and resolve
              these issues to ensure regulatory compliance.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="scans" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Compliance Scan History</h3>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Run New Scan
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Scan Type</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Issues Found</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceScans.map((scan) => (
                    <TableRow key={scan.id}>
                      <TableCell>{scan.type}</TableCell>
                      <TableCell>{new Date(scan.startTime).toLocaleString()}</TableCell>
                      <TableCell>{new Date(scan.endTime).toLocaleString()}</TableCell>
                      <TableCell>{scan.issuesFound}</TableCell>
                      <TableCell>{getScanStatusBadge(scan.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          View Report
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Scan Settings</CardTitle>
                <CardDescription>Configure automated compliance scans</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automated Scans</Label>
                    <p className="text-sm text-muted-foreground">Run automated compliance scans</p>
                  </div>
                  <Switch
                    checked={complianceSettings.automatedScans}
                    onCheckedChange={(checked) =>
                      setComplianceSettings({ ...complianceSettings, automatedScans: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Scan Frequency</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={complianceSettings.scanFrequency}
                    onChange={(e) => setComplianceSettings({ ...complianceSettings, scanFrequency: e.target.value })}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Data Retention Period (days)</Label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={complianceSettings.dataRetentionPeriod}
                    onChange={(e) =>
                      setComplianceSettings({
                        ...complianceSettings,
                        dataRetentionPeriod: Number.parseInt(e.target.value),
                      })
                    }
                    min="1"
                    max="365"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notify on Issues</Label>
                    <p className="text-sm text-muted-foreground">Send notifications for new issues</p>
                  </div>
                  <Switch
                    checked={complianceSettings.notifyOnIssues}
                    onCheckedChange={(checked) =>
                      setComplianceSettings({ ...complianceSettings, notifyOnIssues: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Compliance Frameworks</CardTitle>
                <CardDescription>Select which compliance frameworks to check against</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>GDPR (EU)</Label>
                    <p className="text-sm text-muted-foreground">General Data Protection Regulation</p>
                  </div>
                  <Switch
                    checked={complianceSettings.gdprCompliance}
                    onCheckedChange={(checked) =>
                      setComplianceSettings({ ...complianceSettings, gdprCompliance: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>CCPA (California)</Label>
                    <p className="text-sm text-muted-foreground">California Consumer Privacy Act</p>
                  </div>
                  <Switch
                    checked={complianceSettings.ccpaCompliance}
                    onCheckedChange={(checked) =>
                      setComplianceSettings({ ...complianceSettings, ccpaCompliance: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>HIPAA (US Healthcare)</Label>
                    <p className="text-sm text-muted-foreground">Health Insurance Portability and Accountability Act</p>
                  </div>
                  <Switch
                    checked={complianceSettings.hipaaCompliance}
                    onCheckedChange={(checked) =>
                      setComplianceSettings({ ...complianceSettings, hipaaCompliance: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>PCI DSS</Label>
                    <p className="text-sm text-muted-foreground">Payment Card Industry Data Security Standard</p>
                  </div>
                  <Switch
                    checked={complianceSettings.pciCompliance}
                    onCheckedChange={(checked) =>
                      setComplianceSettings({ ...complianceSettings, pciCompliance: checked })
                    }
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Settings</Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Compliance Resources</CardTitle>
              <CardDescription>Helpful resources for maintaining regulatory compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">GDPR Compliance Guide</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive guide to ensuring GDPR compliance in your marketing operations.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Guide
                  </Button>
                </div>
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">CCPA Compliance Checklist</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Step-by-step checklist for CCPA compliance in marketing activities.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Checklist
                  </Button>
                </div>
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Data Protection Templates</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Templates for privacy policies, consent forms, and data processing agreements.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Templates
                  </Button>
                </div>
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-2">Compliance Training</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Training materials for team members on data protection and compliance.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Training
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
