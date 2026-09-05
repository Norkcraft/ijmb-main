import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, RefreshCw, Mail, CheckCircle, XCircle } from 'lucide-react';

const TYPE_LABELS: Record<string, string> = {
  welcome: 'Welcome',
  application_submitted: 'App Submitted',
  account_update: 'Account Update',
  admission_offer: 'Admission Offer',
  admission_letter: 'Admission Letter',
  admin_new_registration: 'New Registration (Admin)',
  admin_direct_message: 'Direct Message',
  payment_confirmation: 'Payment Confirmation',
  rejection: 'Rejection',
  document_request: 'Document Request',
  centre_removed: 'Centre Removed',
  reminder_no_application: 'Reminder (No App)',
  reminder_abandoned_draft: 'Reminder (Draft)',
  reminder_payment_pending: 'Reminder (Payment)',
};

const TYPE_COLORS: Record<string, string> = {
  welcome: 'bg-green-100 text-green-800',
  application_submitted: 'bg-blue-100 text-blue-800',
  admission_offer: 'bg-emerald-100 text-emerald-800',
  admission_letter: 'bg-emerald-100 text-emerald-800',
  payment_confirmation: 'bg-purple-100 text-purple-800',
  rejection: 'bg-red-100 text-red-800',
  document_request: 'bg-amber-100 text-amber-800',
  admin_direct_message: 'bg-indigo-100 text-indigo-800',
};

export default function AdminEmailLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  const fetchLogs = async () => {
    setLoading(true);
    let query = supabase
      .from('email_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (filterType) query = query.eq('email_type', filterType);
    if (filterStatus) query = query.eq('status', filterStatus);
    if (search) query = query.or(`recipient.ilike.%${search}%,subject.ilike.%${search}%`);

    const { data, count } = await query;
    setLogs(data || []);
    setTotalCount(count || 0);
    setLoading(false);
  };

  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  useEffect(() => {
    fetchLogs();
  }, [page, filterType, filterStatus]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [filterType, filterStatus]);

  const handleSearch = () => {
    setPage(0);
    fetchLogs();
  };

  // Summary stats
  const sentCount = logs.filter(l => l.status === 'sent').length;
  const failedCount = logs.filter(l => l.status === 'failed').length;

  if (loading && logs.length === 0) {
    return <div className="p-4 text-center"><Loader2 className="animate-spin inline mr-2" /> Loading email logs...</div>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Total Emails</p>
            <p className="text-xl font-bold">{totalCount.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Sent (this page)</p>
            <p className="text-xl font-bold text-green-600">{sentCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase font-medium mb-1">Failed (this page)</p>
            <p className="text-xl font-bold text-red-600">{failedCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2"><Mail size={18} /> Email Logs</CardTitle>
              <CardDescription>Record of all emails sent from the portal via Resend.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
              <RefreshCw size={14} className={`mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
              <Input
                placeholder="Search email or subject..."
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              {Object.entries(TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
            <Button size="sm" onClick={handleSearch} className="h-10">
              <Search size={14} className="mr-1" /> Search
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No email logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium text-sm max-w-[200px] truncate">{log.recipient}</TableCell>
                      <TableCell className="text-sm max-w-[250px] truncate">{log.subject}</TableCell>
                      <TableCell>
                        <Badge className={TYPE_COLORS[log.email_type] || 'bg-gray-100 text-gray-700'}>
                          {TYPE_LABELS[log.email_type] || log.email_type || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.status === 'sent' ? (
                          <Badge className="bg-green-600 text-white">
                            <CheckCircle size={10} className="mr-1" /> Sent
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle size={10} className="mr-1" /> Failed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Page {page + 1} of {totalPages} ({totalCount} total)
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                  Previous
                </Button>
                <Button size="sm" variant="outline" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
