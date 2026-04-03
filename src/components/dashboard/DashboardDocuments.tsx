import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, User, Loader2, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface DashboardDocumentsProps {
  application: any;
  uploading: string | null;
  onFileUpload: (type: 'passport' | 'olevel') => void;
  locked?: boolean;
}

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'approved') return <Badge className="bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1" /> Approved</Badge>;
  if (status === 'rejected') return <Badge className="bg-red-100 text-red-800"><AlertCircle size={12} className="mr-1" /> Rejected</Badge>;
  return <Badge className="bg-yellow-100 text-yellow-800"><Clock size={12} className="mr-1" /> Pending Review</Badge>;
};

export const DashboardDocuments = ({
  application,
  uploading,
  onFileUpload,
  locked
}: DashboardDocumentsProps) => {

  const passportStatus = application?.passport_status || 'pending';
  const olevelStatus = application?.olevel_status || 'pending';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Document Manager</CardTitle>
          <CardDescription>Upload and manage your required admission documents.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Passport Section */}
          <div className="border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full shrink-0 ${application?.passport_path ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                <User size={24} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-lg">Passport Photograph</h3>
                  {application?.passport_path && <StatusBadge status={passportStatus} />}
                </div>
                <p className="text-sm text-muted-foreground mb-2">Recent passport-sized photograph with a white or red background. Max 5MB (JPG/PNG).</p>
                
                {passportStatus === 'rejected' && application?.passport_msg && (
                  <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm flex items-start gap-2 mt-2">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Revision Required</p>
                      <p>{application.passport_msg}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="shrink-0">
              <Button 
                variant={application?.passport_path && passportStatus !== 'rejected' ? "outline" : "default"}
                onClick={() => onFileUpload('passport')} 
                disabled={!!locked || uploading === 'passport' || passportStatus === 'approved'}
              >
                {uploading === 'passport' ? <Loader2 className="animate-spin mr-2" size={16} /> : <Upload className="mr-2" size={16} />}
                {application?.passport_path ? (passportStatus === 'rejected' ? 'Re-upload' : 'Update File') : 'Upload File'}
              </Button>
            </div>
          </div>

          {/* O-Level Section */}
          <div className="border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full shrink-0 ${application?.olevel_path ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                <FileText size={24} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-lg">O-Level Result</h3>
                  {application?.olevel_path && <StatusBadge status={olevelStatus} />}
                </div>
                <p className="text-sm text-muted-foreground mb-2">Scanned copy of your WAEC/NECO/NABTEB/GCE result. Max 5MB (JPG/PNG/PDF).</p>
                
                {olevelStatus === 'rejected' && application?.olevel_msg && (
                  <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm flex items-start gap-2 mt-2">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Revision Required</p>
                      <p>{application.olevel_msg}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="shrink-0">
              <Button 
                variant={application?.olevel_path && olevelStatus !== 'rejected' ? "outline" : "default"}
                onClick={() => onFileUpload('olevel')} 
                disabled={!!locked || uploading === 'olevel' || olevelStatus === 'approved'}
              >
                {uploading === 'olevel' ? <Loader2 className="animate-spin mr-2" size={16} /> : <Upload className="mr-2" size={16} />}
                {application?.olevel_path ? (olevelStatus === 'rejected' ? 'Re-upload' : 'Update File') : 'Upload File'}
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};
