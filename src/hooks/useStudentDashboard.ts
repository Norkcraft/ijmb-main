'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const calculateApplicationStatus = (
  currentStatus: string | undefined,
  submit: boolean,
  formFeePaid: boolean,
  isFeePaidNow: boolean
): string => {
  if (submit) {
    return (currentStatus === 'submitted' || formFeePaid || isFeePaidNow) ? 'submitted' : 'payment_pending';
  }
  return currentStatus || 'draft';
};

export const useStudentDashboard = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Local UI state
  const [uploading, setUploading] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);

  // Sync profile to local state
  useEffect(() => {
    if (profile) {
      setEditName(profile.full_name || '');
      setEditPhone(profile.phone || '');
    }
  }, [profile]);

  // Query: Static Data (Sessions, Centres, Combos, Fees)
  const { data: staticData, isLoading: loadingStatic } = useQuery({
    queryKey: ['dashboard-static'],
    queryFn: async () => {
      const [sessRes, centreRes, comboRes, feeRes] = await Promise.all([
        supabase.from('sessions').select('*').eq('status', 'open'),
        supabase.from('centres').select('*').eq('active', true),
        supabase.from('subject_combinations').select('*').eq('active', true),
        supabase.from('fees').select('amount').eq('name', 'form_fee').single(),
      ]);
      return {
        sessions: sessRes.data || [],
        centres: centreRes.data || [],
        combos: comboRes.data || [],
        formFee: feeRes.data?.amount ? Number(feeRes.data.amount) : 5500
      };
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Query: User Application Data (single query with joined O-level results)
  const { data: userData, isLoading: loadingUser } = useQuery({
    queryKey: ['dashboard-user', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data: appData } = await supabase
        .from('applications')
        .select('*, olevel_results(*)')
        .eq('user_id', user.id)
        .maybeSingle();
      return {
        application: appData ? { ...appData, olevel_results: undefined } : null,
        olevelResults: appData?.olevel_results || [],
      };
    },
    enabled: !!user,
  });

  const loading = loadingStatic || loadingUser;
  const application = userData?.application || null;
  const olevelResults = userData?.olevelResults || [];
  const sessions = staticData?.sessions || [];
  const centres = staticData?.centres || [];
  const combos = staticData?.combos || [];
  const formFee = staticData?.formFee || 5500;

  // Mutation: Save Application
  const saveMutation = useMutation({
    mutationFn: async ({ data, submit, silent }: { data: any, submit: boolean, silent: boolean }) => {
      if (!user) return;
      const lockedStatuses = ['submitted', 'review', 'admitted', 'fees_pending', 'active', 'rejected'];
      const isLocked = application?.status && lockedStatuses.includes(application.status);
      if (isLocked && !submit) {
        if (!silent) toast({ title: 'Application locked', description: 'Your application has been submitted and can no longer be edited.', variant: 'destructive' });
        return;
      }
  
      if (submit) {
        // Re-fetch fresh application data from DB to avoid stale cache issues
        const { data: freshApp } = await supabase
          .from('applications')
          .select('passport_path, olevel_path')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!freshApp?.passport_path) {
          toast({ title: 'Passport required', description: 'Please upload your passport photo before submitting.', variant: 'destructive' });
          throw new Error('Passport required');
        }
        if (!data.olevel_awaiting && !freshApp?.olevel_path) {
          toast({ title: 'O-Level result required', description: 'Please upload your O-Level result before submitting.', variant: 'destructive' });
          throw new Error('O-Level result required');
        }
      }
  
      // Extract O-Level results from data
      const { olevelResults: newOlevels, olevel_awaiting, ...appData } = data;

      const currentStatus = application?.status;
      const formFeePaid = !!application?.form_fee_paid;
      const isFeePaidNow = !!appData.form_fee_paid;

      const statusForSave = calculateApplicationStatus(currentStatus, submit, formFeePaid, isFeePaidNow);

      // Construct the payload exactly matching Supabase columns
      const payload: any = {
        user_id: user.id,
        status: statusForSave,
        updated_at: new Date().toISOString(),
      };

      // Only add fields to payload if they have a truthy value or are booleans
      const textFields = [
        'surname', 'first_name', 'middle_name', 'gender', 'state_of_origin', 
        'lga', 'residential_address', 'guardian_phone', 'intended_course',
        'olevel_exam_type', 'olevel_exam_year', 'olevel_exam_number'
      ];
      
      textFields.forEach(field => {
        if (appData[field] !== undefined && appData[field] !== "") {
          payload[field] = appData[field];
        }
      });

      // Handle UUID foreign keys
      const uuidFields = ['session_id', 'preferred_centre_id', 'subject_combination_id'];
      uuidFields.forEach(field => {
        if (appData[field] && appData[field] !== "") {
          payload[field] = appData[field];
        } else {
          payload[field] = null; // Explicitly set to null if missing
        }
      });

      // Handle Dates
      if (appData.date_of_birth && appData.date_of_birth !== "") {
        payload.date_of_birth = appData.date_of_birth;
      }

      // Handle Booleans and specific logic
      if (appData.olevel_awaiting !== undefined) {
         payload.olevel_status = appData.olevel_awaiting ? 'awaiting' : 'uploaded';
      }

      let res;
      // Always check DB for existing application — cache may be stale
      const existingId = application?.id || (await supabase
        .from('applications')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()
      ).data?.id;

      if (existingId) {
        res = await supabase.from('applications').update(payload).eq('id', existingId).select().single();
      } else {
        res = await supabase.from('applications').insert(payload).select().single();
      }

      if (res.error) {
        throw res.error;
      }

      const savedApp = res.data;

      // Save O-Level Results if provided and changed
      if (savedApp && newOlevels && Array.isArray(newOlevels)) {
        await supabase.from('olevel_results').delete().eq('application_id', savedApp.id);
        
        if (newOlevels.length > 0) {
            const resultsToInsert = newOlevels.map((r: any) => ({
              application_id: savedApp.id,
              subject: r.subject,
              exam_type: r.exam_type,
              exam_year: r.exam_year,
              grade: r.grade
            }));
            
            await supabase.from('olevel_results').insert(resultsToInsert);
        }
      }

      return { submit, silent };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-user', user?.id] });
      if (data?.submit) {
        toast({ title: 'Application submitted for review!' });
        window.scrollTo(0, 0);
      } else if (!data?.silent) {
        toast({ title: 'Application saved successfully.' });
      }
    },
    onError: (error: any, variables) => {
        // Always show error if there's no existing application (first save) — silent failures here leave users stuck
        const isFirstSave = !variables.data?.id;
        if (!variables.silent || isFirstSave) {
            console.error('Save error:', error);
            toast({ title: 'Error saving', description: error.message || 'Failed to save application. Please try again.', variant: 'destructive' });
        }
    }
  });

  const saveApplication = async (data: any, submit = false, silent = false) => {
    await saveMutation.mutateAsync({ data, submit, silent });
  };

  const handleFileUpload = async (type: 'passport' | 'olevel') => {
    if (!user) return;

    // Ensure application exists before upload
    if (!application?.id) {
      const { data, error } = await supabase.from('applications').insert({
        user_id: user.id,
        status: 'draft',
      }).select().single();
      if (error || !data) {
        toast({ title: 'Error', description: 'Could not initialize application. Please try saving the form first.', variant: 'destructive' });
        return;
      }
      queryClient.setQueryData(['dashboard-user', user.id], (old: any) => ({ ...old, application: data }));
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jpg,.jpeg,.png,.pdf';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'File too large', description: 'Max 5MB allowed', variant: 'destructive' });
        return;
      }

      const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowed.includes(file.type)) {
        toast({ title: 'Invalid file type', description: 'Only JPG, PNG, and PDF are allowed', variant: 'destructive' });
        return;
      }

      setUploading(type);

      // Upload directly from browser to Supabase Storage (session already available in browser client)
      const ext = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'pdf';
      const path = `${user.id}/${type}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('student-documents')
        .upload(path, file, { contentType: file.type, upsert: true });

      if (uploadError) {
        toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
        setUploading(null);
        return;
      }

      // Update the application record with the file path
      const appId = application?.id || (await supabase.from('applications').select('id').eq('user_id', user.id).maybeSingle()).data?.id;
      if (appId) {
        const column = type === 'passport' ? 'passport_path' : 'olevel_path';
        await supabase.from('applications').update({
          [column]: path,
          updated_at: new Date().toISOString(),
        }).eq('id', appId);
      }

      queryClient.invalidateQueries({ queryKey: ['dashboard-user', user.id] });
      toast({ title: `${type === 'passport' ? 'Passport photo' : 'O-Level result'} uploaded successfully!` });
      setUploading(null);
    };
    input.click();
  };

  const updateProfile = async () => {
    if (!user) return;
    // We handle saving state locally here since it's simple
    const { error } = await supabase.from('profiles').update({ full_name: editName, phone: editPhone }).eq('id', user.id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated!' });
      await refreshProfile();
      setEditingProfile(false);
    }
  };

  const handlePaymentSuccess = async () => {
    if (application?.id) {
       await supabase.from('applications').update({
         form_fee_paid: true,
         status: 'submitted', // Update status to submitted upon payment success
         updated_at: new Date().toISOString()
       }).eq('id', application.id);
       queryClient.invalidateQueries({ queryKey: ['dashboard-user', user?.id] });
    }
    toast({ title: "Payment Successful", description: "Your application has been submitted and is now under review." });
  };

  const fetchData = async () => {
    await queryClient.invalidateQueries({ queryKey: ['dashboard-user', user?.id] });
    await queryClient.invalidateQueries({ queryKey: ['dashboard-static'] });
  };

  return {
    user,
    profile,
    application,
    olevelResults,
    sessions,
    centres,
    combos,
    formFee,
    loading,
    saving: saveMutation.isPending,
    uploading,
    editName,
    setEditName,
    editPhone,
    setEditPhone,
    editingProfile,
    setEditingProfile,
    saveApplication,
    handleFileUpload,
    updateProfile,
    handlePaymentSuccess,
    fetchData
  };
};
