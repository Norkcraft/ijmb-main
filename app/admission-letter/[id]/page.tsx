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

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin' || profile?.role === 'coordinator';

      const { data: app, error: appError } = await supabase
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

      if (appError || !app) {
        setError('Application not found.');
        setLoading(false);
        return;
      }

      if (!isAdmin && app.user_id !== userId) {
        setError('You do not have permission to view this letter.');
        setLoading(false);
        return;
      }

      if (!['admitted', 'fees_pending', 'active'].includes(app.status)) {
        setError('Admission letter is not available yet.');
        setLoading(false);
        return;
      }

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
  const admissionDate = data.updated_at
    ? new Date(data.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

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
        <div className="max-w-[210mm] mx-auto bg-white print:shadow-none shadow-lg my-8 print:my-0 relative">

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <img
              src="/ijmb-logo.jpeg"
              alt=""
              className="w-[340px] h-[340px] object-contain opacity-[0.06]"
            />
          </div>

          <div className="relative z-10 px-10 py-8 sm:px-14 sm:py-10 print:px-[18mm] print:py-[12mm] text-[12.5px] leading-[1.5] text-gray-900 font-serif">

            {/* Header with logo */}
            <div className="flex items-center justify-center gap-4 border-b-2 border-green-800 pb-3 mb-4">
              <img src="/ijmb-logo.jpeg" alt="IJMB Logo" className="w-14 h-14 object-contain" />
              <div className="text-center">
                <h1 className="text-lg font-bold tracking-wide text-green-900 leading-tight">
                  DYNAMIC COLLEGE OF ADVANCED STUDIES
                </h1>
                <p className="text-[10px] text-gray-500 tracking-widest uppercase">
                  Interim Joint Matriculation Board (IJMB) Programme
                </p>
              </div>
              <img src="/ijmb-logo.jpeg" alt="IJMB Logo" className="w-14 h-14 object-contain" />
            </div>

            {/* Date */}
            <div className="text-right mb-3">
              <p className="text-[11px] text-gray-500">{admissionDate}</p>
            </div>

            {/* Candidate Details with Passport */}
            <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-[80px] h-[100px] border-2 border-gray-300 rounded overflow-hidden bg-white">
                    {passportUrl ? (
                      <img src={passportUrl} alt="Passport" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400">
                        No Photo
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[12px] flex-1 content-center">
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
            <div className="text-center mb-3">
              <h2 className="text-[12.5px] font-bold uppercase underline decoration-1 underline-offset-2">
                Provisional Letter of Admission to Dynamic College of Advanced Studies for the 2026/2027 Academic Session
              </h2>
            </div>

            {/* Body */}
            <div className="space-y-2.5">
              <p>
                I am pleased to inform you that you have been offered{' '}
                <strong>PROVISIONAL ADMISSION</strong> to{' '}
                <strong>DYNAMIC COLLEGE OF ADVANCED STUDIES</strong> to undertake the{' '}
                <strong>INTERIM JOINT MATRICULATION BOARD - IJMB PROGRAM</strong> with the following details:
              </p>

              <div className="pl-5 space-y-0.5">
                <p><strong>Programme:</strong> INTERIM JOINT MATRICULATION BOARD - IJMB</p>
                <p><strong>Award:</strong> IJMB ADVANCED LEVEL CERTIFICATE</p>
                <p><strong>Duration of Programme:</strong> 1 ACADEMIC YEAR</p>
              </div>

              <p>
                The confirmation of this provisional admission is subject to your possession of the
                minimum entry requirements for Direct Entry admission into 200 Level.
              </p>

              <div>
                <p className="font-bold mb-1">Conditions of Admission:</p>
                <ol className="list-decimal pl-5 space-y-1">
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
            <div className="pt-4">
              <p>Sincerely Yours,</p>
              <div className="pt-2 grid grid-cols-2 gap-6 items-end">

                {/* Director of Admissions — left (stamp + name) */}
                <div>
                  <div className="relative mb-1">
                    <img
                      src="/stamp.png"
                      alt="Official Stamp & Signature"
                      className="h-24 object-contain"
                    />
                    <span className="absolute bottom-[26%] left-1/2 -translate-x-1/2 text-[6.5px] font-bold text-[#1a1a6e] whitespace-nowrap">
                      {admissionDate}
                    </span>
                  </div>
                  <div className="border-t border-gray-900 pt-0.5 w-48">
                    <p className="font-bold text-[11px]">Mal. Muhammad Sani Usman</p>
                    <p className="text-[10px]">Director of Admissions</p>
                    <p className="text-[10px] italic">For: Management</p>
                    <p className="font-bold text-[10px]">Dynamic College of Advanced Studies</p>
                  </div>
                </div>

                {/* Student signature — right */}
                <div className="text-right">
                  <div className="h-24 mb-1" />
                  <div className="border-t border-gray-900 pt-0.5 ml-auto w-48">
                    <p className="font-bold text-[11px]">{fullName}</p>
                    <p className="text-[10px]">Student&apos;s Signature</p>
                    <p className="text-[10px] italic">Date: _______________</p>
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
          body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: A4; margin: 0; }
          /* Hide WhatsApp widgets and any floating elements */
          [class*="whatsapp"], [id*="whatsapp"], [class*="wa-"], [id*="wa-"],
          iframe[src*="whatsapp"], a[href*="wa.link"], a[href*="whatsapp"] {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
