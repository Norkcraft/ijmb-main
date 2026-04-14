'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';
import ijmbLogo from '@/assets/ijmb-logo.jpeg';

export default function AdminApplicationPrint() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<any>(null);
  const [passportUrl, setPassportUrl] = useState<string | null>(null);
  const [passportReady, setPassportReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const { data: app } = await supabase
        .from('applications')
        .select(`
          *,
          profiles:user_id(full_name, phone),
          session:session_id(name, code),
          preferred_centre:preferred_centre_id(name, state),
          subject_combo:subject_combination_id(name, track),
          olevel_results(*)
        `)
        .eq('id', id)
        .single();

      if (app) {
        setData(app);
        if (app.passport_path) {
          const { data: signed } = await supabase.storage
            .from('student-documents')
            .createSignedUrl(app.passport_path, 3600);
          if (signed?.signedUrl) setPassportUrl(signed.signedUrl);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!loading && data) {
      // If no passport, print immediately after short delay
      if (!data.passport_path) {
        const timer = setTimeout(() => window.print(), 500);
        return () => clearTimeout(timer);
      }
      // Passport exists — wait for it to load via passportReady state,
      // but also set a 4 second hard fallback in case the signed URL is slow
      const hardFallback = setTimeout(() => setPassportReady(true), 4000);
      return () => clearTimeout(hardFallback);
    }
  }, [loading, data]);

  useEffect(() => {
    if (passportReady) {
      const timer = setTimeout(() => window.print(), 300);
      return () => clearTimeout(timer);
    }
  }, [passportReady]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-sm">Loading application data…</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-sm">Application not found.</p>
      </div>
    );
  }

  const appDate = data.created_at
    ? new Date(data.created_at).toLocaleDateString()
    : new Date().toLocaleDateString();

  const fullName = [data.surname, data.first_name, data.middle_name].filter(Boolean).join(' ') || data.profiles?.full_name || '—';

  return (
    <>
      <style>{`
        @page { size: A4 portrait; margin: 10mm; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: Arial, sans-serif; }
        @media screen {
          body { background: #f5f5f5; }
          .page { max-width: 210mm; margin: 20px auto; background: white; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        }
        @media print {
          body { background: white; }
          .no-print { display: none !important; }
          .page { padding: 0; box-shadow: none; }
        }
      `}</style>

      {/* Screen-only controls */}
      <div className="no-print flex gap-3 justify-center py-4 bg-gray-100 border-b">
        <button onClick={() => window.print()}
          className="px-6 py-2 bg-green-700 text-white text-sm font-bold rounded-lg hover:bg-green-800">
          Print / Save as PDF
        </button>
        <button onClick={() => window.close()}
          className="px-6 py-2 bg-gray-600 text-white text-sm font-bold rounded-lg hover:bg-gray-700">
          Close
        </button>
      </div>

      <div className="page p-10 bg-white text-black w-full">

        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-6 mb-8">
          <div className="flex items-center gap-4">
            <Image src={ijmbLogo} alt="IJMB Logo" width={64} height={64} className="rounded-full object-cover" />
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-tight">Official Application Record</h1>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Direct Entry Admission Programme</p>
            </div>
          </div>
          <div className="text-right border-l-2 border-gray-200 pl-6">
            <p className="font-bold text-lg">{data.session?.name || '—'}</p>
            <p className="text-sm text-gray-600 uppercase font-medium">Academic Session</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8 mb-8">
          {/* Main details */}
          <div className="col-span-3 space-y-6">

            {/* Personal Info */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-2 mb-4">Personal Information</h2>
              <div className="grid grid-cols-3 gap-y-4 gap-x-6 text-sm">
                <div><p className="text-xs text-gray-500 uppercase">Surname</p><p className="font-semibold text-base">{data.surname || '—'}</p></div>
                <div><p className="text-xs text-gray-500 uppercase">First Name</p><p className="font-semibold text-base">{data.first_name || '—'}</p></div>
                <div><p className="text-xs text-gray-500 uppercase">Middle Name</p><p className="font-semibold text-base">{data.middle_name || '—'}</p></div>
                <div><p className="text-xs text-gray-500 uppercase">Gender</p><p className="font-semibold">{data.gender || '—'}</p></div>
                <div><p className="text-xs text-gray-500 uppercase">Date of Birth</p><p className="font-semibold">{data.date_of_birth || '—'}</p></div>
                <div><p className="text-xs text-gray-500 uppercase">State of Origin</p><p className="font-semibold">{data.state_of_origin || '—'}</p></div>
                <div><p className="text-xs text-gray-500 uppercase">LGA</p><p className="font-semibold">{data.lga || '—'}</p></div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-2 mb-4">Contact Information</h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div><p className="text-xs text-gray-500 uppercase">Phone</p><p className="font-semibold">{data.guardian_phone || data.profiles?.phone || '—'}</p></div>
                <div><p className="text-xs text-gray-500 uppercase">Email</p><p className="font-semibold">{data.profiles?.email || '—'}</p></div>
                <div className="col-span-2"><p className="text-xs text-gray-500 uppercase">Residential Address</p><p className="font-semibold">{data.residential_address || '—'}</p></div>
              </div>
            </section>

            {/* Programme */}
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-2 mb-4">Programme Information</h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div><p className="text-xs text-gray-500 uppercase">Centre of Choice</p><p className="font-semibold">{data.preferred_centre?.name || '—'}, {data.preferred_centre?.state || '—'}</p></div>
                <div><p className="text-xs text-gray-500 uppercase">Course of Choice</p><p className="font-semibold">{data.intended_course || '—'}</p></div>
                <div className="col-span-2"><p className="text-xs text-gray-500 uppercase">Subject Combination</p><p className="font-semibold">{data.subject_combo?.name || '—'}</p></div>
              </div>
            </section>

            {/* O-Level */}
            {data.olevel_results?.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-2 mb-4">O-Level Results</h2>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {data.olevel_results.map((r: any, i: number) => (
                    <div key={i} className="p-2 border rounded bg-gray-50">
                      <p className="font-semibold text-xs">{r.subject}</p>
                      <p className="text-xs text-gray-500">{r.grade} · {r.exam_type} {r.exam_year}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-span-1 space-y-4">
            <div className="w-full aspect-square border-2 border-gray-300 p-1 bg-gray-50 rounded shadow-sm">
              {passportUrl ? (
                <img
                  src={passportUrl}
                  alt="Passport"
                  className="w-full h-full object-cover rounded-sm"
                  onLoad={() => setPassportReady(true)}
                  onError={() => setPassportReady(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-4">
                  Passport Not Uploaded
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded p-4 text-center bg-gray-50">
              <p className="text-xs text-gray-500 uppercase mb-1">Application ID</p>
              <p className="font-mono font-bold text-lg text-gray-900 tracking-wider mb-3">
                {data.application_number || data.id?.split('-')[0].toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 uppercase mb-1">Date Registered</p>
              <p className="font-semibold text-sm mb-3">{appDate}</p>
              <div className="border-t border-gray-200 pt-3">
                <p className="text-xs text-gray-500 uppercase mb-1">Payment Status</p>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase ${data.form_fee_paid ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                  {data.form_fee_paid ? 'Paid' : 'Pending'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signature area */}
        <div className="mt-auto pt-12">
          <div className="grid grid-cols-2 gap-20 mb-8">
            <div>
              <p className="text-xs font-bold text-gray-900 uppercase mb-8">Student Signature & Date</p>
              <div className="border-b-2 border-gray-300"></div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 uppercase mb-4">Official Stamp</p>
              <div className="h-24 border-2 border-gray-200 rounded-lg bg-gray-50/50 flex items-center justify-center">
                <span className="text-gray-300 text-xs font-bold uppercase tracking-widest" style={{ transform: 'rotate(-12deg)', display: 'block' }}>Official Stamp Area</span>
              </div>
            </div>
          </div>
          <div className="border-t-2 border-gray-900 pt-4 text-center">
            <p className="font-bold text-sm text-gray-900 mb-1">IJMB Direct Entry Programme Application</p>
            <p className="text-xs text-gray-500">This document is a valid proof of registration. Please present this slip at your assigned study centre.</p>
            <p className="text-gray-400 mt-3 text-xs uppercase tracking-widest" style={{ fontSize: '9px' }}>
              Generated on {new Date().toLocaleString()} · ID: {data.id}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
