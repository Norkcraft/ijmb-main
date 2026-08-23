'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Loader2, Printer, ArrowLeft } from 'lucide-react';

export default function AdmissionLetterPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);
  const [passportUrl, setPassportUrl] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setError('Please log in to view your admission letter.');
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      // Check if user is admin/coordinator
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin' || profile?.role === 'coordinator';

      // Fetch application with related data
      const query = supabase
        .from('applications')
        .select(`
          *,
          profiles:user_id(full_name, email),
          session:session_id(name, code),
          preferred_centre:preferred_centre_id(name, state, address),
          assigned_centre:assigned_centre_id(name, state, address),
          subject_combo:subject_combination_id(name, track)
        `)
        .eq('id', id)
        .single();

      const { data: app, error: appError } = await query;

      if (appError || !app) {
        setError('Application not found.');
        setLoading(false);
        return;
      }

      // Only the student who owns this application or an admin can view it
      if (!isAdmin && app.user_id !== userId) {
        setError('You do not have permission to view this letter.');
        setLoading(false);
        return;
      }

      // Must be admitted
      if (!['admitted', 'fees_pending', 'active'].includes(app.status)) {
        setError('Admission letter is not available yet.');
        setLoading(false);
        return;
      }

      // Get passport photo URL
      if (app.passport_path) {
        const { data: signedData } = await supabase.storage
          .from('student-documents')
          .createSignedUrl(app.passport_path, 3600);
        if (signedData?.signedUrl) setPassportUrl(signedData.signedUrl);
      }

      setData(app);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={32} className="animate-spin text-green-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
        <p className="text-red-600 font-semibold text-center">{error}</p>
        <button onClick={() => router.push('/dashboard')} className="text-sm text-primary underline">
          Go to Dashboard
        </button>
      </div>
    );
  }

  const fullName = [data.surname, data.first_name, data.middle_name].filter(Boolean).join(' ').toUpperCase();
  const regNumber = data.application_number || data.id.split('-')[0].toUpperCase();
  const dob = data.date_of_birth
    ? new Date(data.date_of_birth).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—';
  const centre = data.assigned_centre || data.preferred_centre;
  const centreName = centre?.name?.toUpperCase() || 'DYNAMIC COLLEGE OF ADVANCED STUDIES';
  const admissionDate = data.updated_at
    ? new Date(data.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const todayDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      {/* Print controls - hidden when printing */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
        >
          <Printer size={16} /> Print / Save as PDF
        </button>
      </div>

      {/* Letter content */}
      <div className="pt-16 print:pt-0">
        <div className="max-w-[210mm] mx-auto bg-white print:shadow-none shadow-lg my-8 print:my-0">
          <div className="p-12 sm:p-16 print:p-[20mm] space-y-8 text-[14px] leading-relaxed text-gray-900 font-serif">

            {/* Header */}
            <div className="text-center space-y-2 border-b-2 border-green-800 pb-6">
              <h1 className="text-2xl font-bold tracking-wide text-green-900">
                DYNAMIC COLLEGE OF ADVANCED STUDIES
              </h1>
              <p className="text-sm text-gray-600 tracking-wider uppercase">
                Interim Joint Matriculation Board (IJMB) Programme
              </p>
            </div>

            {/* Date */}
            <div className="text-right">
              <p className="text-sm text-gray-600">{todayDate}</p>
            </div>

            {/* Candidate Details with Passport */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <div className="flex gap-5">
                {/* Passport photo */}
                <div className="shrink-0">
                  <div className="w-[100px] h-[120px] border-2 border-gray-300 rounded overflow-hidden bg-white">
                    {passportUrl ? (
                      <img src={passportUrl} alt="Passport" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                        No Photo
                      </div>
                    )}
                  </div>
                </div>
                {/* Details */}
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm flex-1">
                  <span className="font-bold">Name of Candidate:</span>
                  <span className="font-bold text-green-900">{fullName}</span>

                  <span className="font-bold">Date of Birth:</span>
                  <span>{dob}</span>

                  <span className="font-bold">Reg. Number:</span>
                  <span className="font-mono font-bold">{regNumber}</span>

                  <span className="font-bold">Programme:</span>
                  <span>INTERIM JOINT MATRICULATION BOARD - IJMB</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center">
              <h2 className="text-base font-bold uppercase underline decoration-2 underline-offset-4">
                Provisional Letter of Admission to Dynamic College of Advanced Studies
                for the 2026/2027 Academic Session
              </h2>
            </div>

            {/* Body */}
            <div className="space-y-5">
              <p>
                I am pleased to inform you that you have been offered{' '}
                <strong>PROVISIONAL ADMISSION</strong> to{' '}
                <strong>DYNAMIC COLLEGE OF ADVANCED STUDIES</strong> to undertake the{' '}
                <strong>INTERIM JOINT MATRICULATION BOARD - IJMB PROGRAM</strong> with the following details:
              </p>

              <div className="pl-6 space-y-1">
                <p><strong>Programme:</strong> INTERIM JOINT MATRICULATION BOARD - IJMB</p>
                <p><strong>Award:</strong> IJMB ADVANCED LEVEL CERTIFICATE</p>
                <p><strong>Duration of Programme:</strong> 1 ACADEMIC YEAR</p>
              </div>

              <p>
                The confirmation of this provisional admission is subject to your possession of the
                minimum entry requirements for Direct Entry admission into 200 Level.
              </p>

              {/* Conditions */}
              <div>
                <p className="font-bold mb-2">Conditions of Admission:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    At the point of registration, you will be required to present original copies of your
                    credentials/certificates and other acceptable evidence of qualifications upon which this
                    offer of admission is based.
                  </li>
                  <li>
                    You are expected to complete your registration and documentation on or before{' '}
                    <strong>30th September, 2026</strong>. Academic activities will commence immediately after.
                  </li>
                  <li>
                    Further information regarding resumption date, tuition, accommodation facilities, and
                    other institutional policies will be communicated to you directly by the college.
                  </li>
                  <li>
                    You are required to present, at registration, a letter of reference from a person of
                    reputable standing in society who can vouch for your character.
                  </li>
                </ol>
              </div>

              <p>
                We congratulate you on this achievement and look forward to welcoming you to{' '}
                <strong>Dynamic College of Advanced Studies</strong> as you begin your journey toward
                university admission.
              </p>
            </div>

            {/* Signatures & Stamp */}
            <div className="pt-8">
              <p>Sincerely Yours,</p>
              <div className="pt-4 grid grid-cols-2 gap-8 items-end">

                {/* Director of Admissions — left (stamp + name) */}
                <div>
                  {/* Stamp with signature & date */}
                  <div className="relative mb-2">
                    <img
                      src="/stamp.png"
                      alt="Official Stamp & Signature"
                      className="h-32 object-contain"
                    />
                    {/* Admission date overlay on stamp */}
                    <span className="absolute bottom-[28%] left-1/2 -translate-x-1/2 text-[7px] font-bold text-[#1a1a6e] whitespace-nowrap">
                      {admissionDate}
                    </span>
                  </div>
                  <div className="border-t border-gray-900 pt-1 w-56">
                    <p className="font-bold text-sm">Mal. Muhammad Sani Usman</p>
                    <p className="text-xs">Director of Admissions</p>
                    <p className="text-xs italic">For: Management</p>
                    <p className="font-bold text-xs mt-1">Dynamic College of Advanced Studies</p>
                  </div>
                </div>

                {/* Student signature — right */}
                <div className="text-right">
                  <div className="h-32 mb-2" /> {/* spacer to match stamp height */}
                  <div className="border-t border-gray-900 pt-1 ml-auto w-56">
                    <p className="font-bold text-sm">{fullName}</p>
                    <p className="text-xs">Student&apos;s Signature</p>
                    <p className="text-xs italic">Date: _______________</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body { margin: 0; padding: 0; }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </>
  );
}
