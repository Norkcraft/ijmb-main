'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface DashboardPrintViewProps {
  application: any;
  profile: any;
  user: any;
  sessions: any[];
  centres: any[];
  combos: any[];
  olevelResults: any[];
  formFee: number;
}

export const DashboardPrintView = ({
  application,
  profile,
  user,
  sessions,
  centres,
  combos,
  olevelResults,
  formFee
}: DashboardPrintViewProps) => {
  const formFeeDisplay = `₦${formFee.toLocaleString()}`;
  const appDate = application?.created_at ? new Date(application.created_at).toLocaleDateString() : new Date().toLocaleDateString();

  const [passportUrl, setPassportUrl] = useState<string | null>(null);
  useEffect(() => {
    if (application?.passport_path) {
      supabase.storage.from('student-documents').createSignedUrl(application.passport_path, 3600)
        .then(({ data }) => { if (data?.signedUrl) setPassportUrl(data.signedUrl); });
    }
  }, [application?.passport_path]);

  return (
    <div className="hidden print:block p-10 bg-white text-black w-[210mm] min-h-[297mm] mx-auto">
      <style type="text/css" media="print">
        {`
          @page { size: A4 portrait; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        `}
      </style>
      {/* Header Section */}
      <div className="flex items-center justify-between border-b-2 border-black pb-6 mb-8">
        <div className="flex items-center gap-4">
           <div className="h-16 w-16 bg-primary text-white rounded flex items-center justify-center font-bold text-2xl tracking-tighter">IJMB</div>
           <div>
             <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900">Official Application Record</h1>
             <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">Direct Entry Admission Programme</p>
           </div>
        </div>
        <div className="text-right border-l-2 border-gray-200 pl-6">
           <p className="font-bold text-xl text-gray-900">{sessions.find(s => s.id === application?.session_id)?.name}</p>
           <p className="text-sm text-gray-600 uppercase font-medium">Academic Session</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-8 mb-8">
         {/* Main Details */}
         <div className="col-span-3 space-y-8">
            {/* Personal Information */}
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-2 mb-4">Personal Information</h2>
              <div className="grid grid-cols-3 gap-y-4 gap-x-6 text-sm">
                 <div>
                   <p className="text-xs text-gray-500 uppercase">Surname</p>
                   <p className="font-semibold text-base">{application?.surname || '-'}</p>
                 </div>
                 <div>
                   <p className="text-xs text-gray-500 uppercase">First Name</p>
                   <p className="font-semibold text-base">{application?.first_name || '-'}</p>
                 </div>
                 <div>
                   <p className="text-xs text-gray-500 uppercase">Middle Name</p>
                   <p className="font-semibold text-base">{application?.middle_name || '-'}</p>
                 </div>
                 
                 <div>
                   <p className="text-xs text-gray-500 uppercase">Gender</p>
                   <p className="font-semibold">{application?.gender || '-'}</p>
                 </div>
                 <div>
                   <p className="text-xs text-gray-500 uppercase">Date of Birth</p>
                   <p className="font-semibold">{application?.date_of_birth || '-'}</p>
                 </div>
                 <div>
                   <p className="text-xs text-gray-500 uppercase">State of Origin</p>
                   <p className="font-semibold">{application?.state_of_origin || '-'}</p>
                 </div>
                 <div>
                   <p className="text-xs text-gray-500 uppercase">LGA</p>
                   <p className="font-semibold">{application?.lga || '-'}</p>
                 </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-2 mb-4">Contact Information</h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                 <div>
                   <p className="text-xs text-gray-500 uppercase">Telephone Number</p>
                   <p className="font-semibold">{application?.guardian_phone || profile?.phone || '-'}</p>
                 </div>
                 <div>
                   <p className="text-xs text-gray-500 uppercase">Email Address</p>
                   <p className="font-semibold">{user?.email || '-'}</p>
                 </div>
                 <div className="col-span-2">
                   <p className="text-xs text-gray-500 uppercase">Residential Address</p>
                   <p className="font-semibold">{application?.residential_address || '-'}</p>
                 </div>
              </div>
            </section>

            {/* Programme Information */}
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-2 mb-4">Programme Information</h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                 <div>
                   <p className="text-xs text-gray-500 uppercase">Centre of Choice</p>
                   <p className="font-semibold">{centres.find(c => c.id === application?.preferred_centre_id)?.name || '-'}, {centres.find(c => c.id === application?.preferred_centre_id)?.state || '-'}</p>
                 </div>
                 <div>
                   <p className="text-xs text-gray-500 uppercase">Course of Choice</p>
                   <p className="font-semibold">{application?.intended_course || '-'}</p>
                 </div>
                 <div className="col-span-2">
                   <p className="text-xs text-gray-500 uppercase">Subject Combination</p>
                   <p className="font-semibold">{combos.find(c => c.id === application?.subject_combination_id)?.name || '-'}</p>
                 </div>
              </div>
            </section>
         </div>
         
         {/* Sidebar Details (Photo & Meta) */}
         <div className="col-span-1 space-y-6">
            <div className="w-full aspect-square border-2 border-gray-300 p-1 bg-gray-50 rounded shadow-sm">
               {application?.passport_path ? (
                  <img 
                    src={passportUrl || ''} 
                    alt="Passport" 
                    className="w-full h-full object-cover rounded-sm" 
                  /> 
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-4">
                    Passport Photograph Not Uploaded
                  </div>
               )}
            </div>
            <div className="border border-gray-200 rounded p-4 text-center bg-gray-50">
               <p className="text-xs text-gray-500 uppercase mb-1">Application ID</p>
               <p className="font-mono font-bold text-lg text-gray-900 tracking-wider mb-3">{application?.id?.split('-')[0].toUpperCase() || '-'}</p>
               
               <p className="text-xs text-gray-500 uppercase mb-1">Date of Registration</p>
               <p className="font-semibold text-sm mb-3">{appDate}</p>

               <div className="border-t border-gray-200 pt-3 mt-1">
                 <p className="text-xs text-gray-500 uppercase mb-1">Payment Status</p>
                 <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                    Paid
                 </div>
               </div>
            </div>
         </div>
      </div>

      <div className="mt-auto pt-16">
        <div className="grid grid-cols-2 gap-20 mb-8">
           <div>
             <p className="text-xs font-bold text-gray-900 uppercase mb-8">Student Signature & Date</p>
             <div className="border-b-2 border-gray-300"></div>
           </div>
           <div>
             <p className="text-xs font-bold text-gray-900 uppercase mb-4">Official Stamp</p>
             <div className="h-24 border-2 border-gray-200 rounded-lg bg-gray-50/50 flex items-center justify-center">
                <span className="text-gray-300 text-xs font-bold uppercase tracking-widest rotate-[-12deg]">Official Stamp Area</span>
             </div>
           </div>
        </div>

        <div className="border-t-2 border-gray-900 pt-4 text-center">
           <p className="font-bold text-sm text-gray-900 mb-1">IJMB Direct Entry Programme Application</p>
           <p className="text-xs text-gray-500">This document is a valid proof of registration. Please present this slip at your assigned study centre.</p>
           <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-widest">Generated on {new Date().toLocaleString()} • ID: {application?.id}</p>
        </div>
      </div>
    </div>
  );
};
