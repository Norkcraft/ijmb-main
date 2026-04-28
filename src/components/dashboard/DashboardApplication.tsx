import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ApplicationForm } from '@/components/application/ApplicationForm';
import { DashboardDocuments } from '@/components/dashboard/DashboardDocuments';

interface DashboardApplicationProps {
  user: any;
  application: any;
  sessions: any[];
  centres: any[];
  combos: any[];
  olevelResults: any[];
  appSubmitted: boolean;
  uploading: string | null;
  onFileUpload: (type: 'passport' | 'olevel') => void;
  onSave: (data: any, submit?: boolean, silent?: boolean) => any;
}

export const DashboardApplication = ({
  user,
  application,
  sessions,
  centres,
  combos,
  olevelResults,
  appSubmitted,
  uploading,
  onFileUpload,
  onSave
}: DashboardApplicationProps) => {

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">My Application</CardTitle>
          <CardDescription>
             {appSubmitted ? "Your application is locked for review." : "Fill in your biodata and academic details."}
          </CardDescription>
        </CardHeader>
        <CardContent>
           <ApplicationForm 
              application={application}
              initialOlevels={olevelResults}
              user={user}
              sessions={sessions}
              centres={centres}
              combos={combos}
              onSave={onSave}
              readOnly={!!appSubmitted}
            />
        </CardContent>
      </Card>

      <DashboardDocuments
        application={application}
        uploading={uploading}
        onFileUpload={onFileUpload}
        locked={!!appSubmitted}
      />
    </div>
  );
};
