import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, ArrowRight, ArrowLeft, Plus, Trash2, BookOpen, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  STATES_OF_NIGERIA, 
  NIGERIA_DATA,
  OLEVEL_SUBJECTS, 
  OLEVEL_GRADES, 
  UNIVERSITY_COURSES,
  OLevelResult 
} from '@/types/application';
import { Badge } from '@/components/ui/badge';

// Schema Definition
const formSchema = z.object({
  // Personal
  surname: z.string().min(1, "Surname is required"),
  first_name: z.string().min(1, "First Name is required"),
  middle_name: z.string().optional(),
  gender: z.string().min(1, "Gender is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  
  // Origin
  state_of_origin: z.string().min(1, "State of origin is required"),
  lga: z.string().min(1, "Local Government Area is required"),
  
  // Contact
  residential_address: z.string().min(5, "Address must be at least 5 characters"),
  guardian_phone: z.string().regex(/^[0-9]{10,14}$/, "Valid phone number required (10-14 digits)"),
  
  // Academic
  olevel_awaiting: z.boolean().default(false),
  olevel_exam_type: z.string().optional(),
  olevel_exam_year: z.string().optional(),
  olevel_exam_number: z.string().optional(),
  
  // Programme
  intended_course: z.string().min(1, "Intended course is required"),
  session_id: z.string().min(1, "Session is required"),
  preferred_centre_id: z.string().min(1, "Centre is required"),
  subject_combination_id: z.string().min(1, "Subject combination is required"),
});

interface ApplicationFormProps {
  application: any;
  initialOlevels: any[];
  user: any;
  sessions: any[];
  centres: any[];
  combos: any[];
  onSave: (data: any, submit?: boolean, silent?: boolean) => Promise<void>;
  onFileUpload?: (type: 'passport' | 'olevel' | 'admission_letter') => Promise<void>;
  uploading?: string | null;
  readOnly?: boolean;
}

export function ApplicationForm({ application, initialOlevels, user, sessions, centres, combos, onSave, onFileUpload, uploading, readOnly }: ApplicationFormProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);
  
  // Extended State
  const [olevels, setOlevels] = useState<OLevelResult[]>(initialOlevels || []);
  const [intendedCourse, setIntendedCourse] = useState(application?.intended_course || '');
  
  // Temporary state for adding a new subject
  const [newSubName, setNewSubName] = useState('');
  const [newSubGrade, setNewSubGrade] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      surname: application?.surname || '',
      first_name: application?.first_name || '',
      middle_name: application?.middle_name || '',
      gender: application?.gender || '',
      date_of_birth: application?.date_of_birth || '',
      state_of_origin: application?.state_of_origin || '',
      lga: application?.lga || '',
      residential_address: application?.residential_address || '',
      guardian_phone: application?.guardian_phone || '',
      olevel_awaiting: application?.olevel_status === 'awaiting',
      olevel_exam_type: application?.olevel_exam_type || '',
      olevel_exam_year: application?.olevel_exam_year || '',
      olevel_exam_number: application?.olevel_exam_number || '',
      intended_course: application?.intended_course || '',
      session_id: application?.session_id || '',
      preferred_centre_id: application?.preferred_centre_id || '',
      subject_combination_id: application?.subject_combination_id || '',
    },
  });

  // Load saved data when application changes
  useEffect(() => {
    if (application && application.id) {
      // Create a clean values object
      const values = {
        surname: application.surname || '',
        first_name: application.first_name || '',
        middle_name: application.middle_name || '',
        gender: application.gender || '',
        date_of_birth: application.date_of_birth || '',
        state_of_origin: application.state_of_origin || '',
        lga: application.lga || '',
        residential_address: application.residential_address || '',
        guardian_phone: application.guardian_phone || '',
        olevel_awaiting: application.olevel_status === 'awaiting',
        olevel_exam_type: application.olevel_exam_type || '',
        olevel_exam_year: application.olevel_exam_year || '',
        olevel_exam_number: application.olevel_exam_number || '',
        intended_course: application.intended_course || '',
        session_id: application.session_id || '',
        preferred_centre_id: application.preferred_centre_id || '',
        subject_combination_id: application.subject_combination_id || '',
      };
      
      // Force reset only if we are loading a different application ID or if the form is empty
      // We check if form is "touched" or has values.
      // But safer to rely on ID change.
      
      form.reset(values);
      if (application.intended_course) setIntendedCourse(application.intended_course);
    }
  }, [application?.id]); // Only run when ID changes (new application loaded)

  useEffect(() => {
    if (initialOlevels && initialOlevels.length > 0) {
      setOlevels(initialOlevels);
    }
  }, [initialOlevels]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSaving(true);
    try {
      // If we are on step 4, we consider it a final submission
      const isSubmit = step === 4;
      await onSave({ 
        ...values, 
        olevelResults: olevels,
        intended_course: intendedCourse
      }, isSubmit);
      
      // Update form state with latest values to ensure consistency
      // We don't need to reset if we are submitting because page will navigate or show success
      if (!isSubmit) {
        form.reset(values);
        toast({ title: "Progress Saved", description: "Your application has been saved as a draft." });
      } else {
        // If submitting, we might want to ensure we don't trigger validation errors again
        // But the form submission already validated.
      }
    } catch (error: any) {
      // Don't show a generic error if the mutation already showed a specific one
      const knownErrors = ['Passport required', 'O-Level result required', 'Application locked'];
      if (!knownErrors.includes(error?.message)) {
        toast({ title: "Submission failed", description: error?.message || "Something went wrong. Please try again.", variant: "destructive" });
      }
    } finally {
      setSaving(false);
    }
  };
  
  const addSubject = () => {
    if (!newSubName || !newSubGrade) return;
    if (olevels.find(o => o.subject === newSubName)) {
      toast({ title: "Duplicate Subject", description: "You have already added this subject.", variant: "destructive" });
      return;
    }
    
    // We use the exam type/year from the main form fields for simplicity, 
    // or we could make each row editable. 
    
    const examType = form.getValues('olevel_exam_type') || 'WAEC';
    const examYear = form.getValues('olevel_exam_year') || new Date().getFullYear().toString();
    
    setOlevels([...olevels, { 
      subject: newSubName, 
      grade: newSubGrade, 
      exam_type: examType, 
      exam_year: examYear 
    }]);
    setNewSubName('');
    setNewSubGrade('');
  };

  const removeSubject = (index: number) => {
    const newList = [...olevels];
    newList.splice(index, 1);
    setOlevels(newList);
  };

  const handleAutoSave = async () => {
    // Save progress silently
    // We only save if there are meaningful changes or valid partial data
    // For now, let's just ensure we don't block the UI
    const values = form.getValues();
    try {
      // Don't await this if you want it to be truly background, 
      // but waiting ensures data consistency. 
      // To make it "faster" for the user, we could debounce this or not await.
      // However, for reliability, we keep await but maybe catch errors silently.
      
      await onSave({ 
        ...values, 
        olevelResults: olevels,
        intended_course: intendedCourse
      }, false, true); // silent = true
      
      // Update form state with latest values so react-hook-form knows they are "saved"
      // This prevents defaultValues from overwriting current values on re-render if we were to reset
      form.reset(values);
    } catch (error) {
      console.error("Auto-save failed", error);
    }
  };

  const nextStep = async () => {
    setNextLoading(true);
    try {
      // Validate current step fields before moving
      let fieldsToValidate: any[] = [];
      if (step === 1) {
        fieldsToValidate = ['surname', 'first_name', 'middle_name', 'gender', 'date_of_birth', 'state_of_origin', 'lga', 'residential_address', 'guardian_phone'];
        const basicValid = await form.trigger(fieldsToValidate);

        // Basic age validation logic (must be at least 14 years old)
        const dob = form.getValues('date_of_birth');
        if (dob) {
          const birthDate = new Date(dob);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          if (age < 14) {
            form.setError('date_of_birth', { type: 'manual', message: 'You must be at least 14 years old' });
            return;
          }
        }

        if (!basicValid) return;
        await handleAutoSave();
        setStep(step + 1);
        return;
      }

      if (step === 2) {
        fieldsToValidate = ['olevel_awaiting'];
        const basicValid = await form.trigger(fieldsToValidate);
        if (!basicValid) return;

        const isAwaiting = form.getValues('olevel_awaiting');
        if (!isAwaiting) {
          let hasError = false;
          if (!form.getValues('olevel_exam_type')) {
            form.setError('olevel_exam_type', { type: 'manual', message: 'Exam type is required' });
            hasError = true;
          }
          if (!form.getValues('olevel_exam_year')) {
            form.setError('olevel_exam_year', { type: 'manual', message: 'Exam year is required' });
            hasError = true;
          }
          if (!form.getValues('olevel_exam_number')) {
            form.setError('olevel_exam_number', { type: 'manual', message: 'Exam number is required' });
            hasError = true;
          }

          if (hasError) return;

          // Custom Validation for O-Levels
          if (olevels.length < 5) {
            toast({ title: "Insufficient Subjects", description: "You must add at least 5 subjects.", variant: "destructive" });
            return;
          }
          const hasMath = olevels.some(o => o.subject.toLowerCase().includes('mathematics'));
          const hasEng = olevels.some(o => o.subject.toLowerCase().includes('english'));

          if (!hasMath || !hasEng) {
            toast({ title: "Required Subjects Missing", description: "Mathematics and English Language are required.", variant: "destructive" });
            return;
          }
        }
        await handleAutoSave();
        setStep(step + 1);
        return;
      }

      if (step === 3) {
        fieldsToValidate = ['intended_course', 'session_id', 'preferred_centre_id', 'subject_combination_id'];
        const isValid = await form.trigger(fieldsToValidate);
        if (isValid) {
          await handleAutoSave();
          setStep(step + 1);
        }
        return;
      }
    } finally {
      setNextLoading(false);
    }
  };

  const prevStep = () => setStep(step - 1);

  // Filter combinations based on intended course
  const recommendedCombos = combos.filter(c => 
    intendedCourse && c.recommended_course && 
    c.recommended_course.toLowerCase().includes(intendedCourse.toLowerCase())
  );
  
  const otherCombos = combos.filter(c => !recommendedCombos.includes(c));

  const onInvalid = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError) {
        toast({ title: "Validation Error", description: firstError.message || "Please check the form for errors.", variant: "destructive" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`flex items-center ${s < 4 ? 'flex-1' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 
                ${step >= s ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-muted'}`}>
                {s}
              </div>
              {s < 4 && <div className={`h-1 flex-1 mx-2 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Personal & Contact Information"}
              {step === 2 && "Academic Information"}
              {step === 3 && "Programme Information"}
              {step === 4 && "Document Upload"}
            </CardTitle>
            <CardDescription>Step {step} of 4</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Step 1: Personal & Contact */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="surname" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Surname</FormLabel>
                        <FormControl><Input placeholder="Surname" {...field} disabled={readOnly} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="first_name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl><Input placeholder="First Name" {...field} disabled={readOnly} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="middle_name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl><Input placeholder="Middle Name" {...field} disabled={readOnly} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="date_of_birth" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            max={new Date(new Date().setFullYear(new Date().getFullYear() - 14)).toISOString().split('T')[0]} 
                            {...field} 
                            disabled={readOnly} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Origin Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="state_of_origin" render={({ field }) => (
                      <FormItem>
                        <FormLabel>State of Origin</FormLabel>
                        <Select 
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.setValue('lga', ''); // Reset LGA when state changes
                          }} 
                          defaultValue={field.value} 
                          disabled={readOnly}
                        >
                          <FormControl><SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {Object.keys(NIGERIA_DATA).sort().map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="lga" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local Government Area</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value} 
                          disabled={readOnly || !form.watch('state_of_origin')}
                        >
                          <FormControl><SelectTrigger><SelectValue placeholder="Select LGA" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {(NIGERIA_DATA[form.watch('state_of_origin')] || []).sort().map(lga => (
                              <SelectItem key={lga} value={lga}>{lga}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="guardian_phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input placeholder="080..." {...field} disabled={readOnly} /></FormControl>
                        <p className="text-xs text-muted-foreground">E.g., 08012345678</p>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input value={user?.email || ''} disabled className="bg-muted" />
                    </div>
                  </div>
                  <FormField control={form.control} name="residential_address" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residential Address</FormLabel>
                      <FormControl><Input placeholder="Full residential address" {...field} disabled={readOnly} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>
            )}

            {/* Step 2: Academic & O-Level */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="olevel_awaiting" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Awaiting Result?</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Toggle this if you have not yet received your O-Level results.
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={readOnly}
                        />
                      </FormControl>
                    </FormItem>
                  )} />

                  {!form.watch('olevel_awaiting') && (
                    <>
                      <FormField control={form.control} name="olevel_exam_type" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Exam Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                            <FormControl><SelectTrigger><SelectValue placeholder="WAEC/NECO..." /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="WAEC">WAEC</SelectItem>
                              <SelectItem value="NECO">NECO</SelectItem>
                              <SelectItem value="NABTEB">NABTEB</SelectItem>
                              <SelectItem value="GCE">GCE</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <FormField control={form.control} name="olevel_exam_year" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exam Year</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <FormField control={form.control} name="olevel_exam_number" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exam Number</FormLabel>
                          <FormControl><Input placeholder="e.g. 4012345678" {...field} disabled={readOnly} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </>
                  )}
                </div>

                {!form.watch('olevel_awaiting') && (
                  <div className="border rounded-md p-4 bg-muted/20">
                    <h4 className="font-medium mb-3 flex items-center gap-2"><BookOpen size={16} /> O-Level Results</h4>
                    
                    {!readOnly && (
                      <div className="flex gap-2 mb-4 items-end">
                        <div className="flex-1 space-y-2">
                          <Label className="text-xs">Subject</Label>
                          <Select value={newSubName} onValueChange={setNewSubName}>
                            <SelectTrigger><SelectValue placeholder="Select Subject" /></SelectTrigger>
                            <SelectContent>
                              {OLEVEL_SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-24 space-y-2">
                          <Label className="text-xs">Grade</Label>
                          <Select value={newSubGrade} onValueChange={setNewSubGrade}>
                            <SelectTrigger><SelectValue placeholder="Grade" /></SelectTrigger>
                            <SelectContent>
                              {OLEVEL_GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="button" onClick={addSubject} size="icon"><Plus size={16} /></Button>
                      </div>
                    )}

                    <div className="space-y-2">
                      {olevels.length === 0 && <p className="text-sm text-muted-foreground italic">No subjects added yet. Add at least 5 subjects.</p>}
                      {olevels.map((o, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-background border rounded shadow-sm text-sm">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{o.subject}</span>
                            <Badge variant="outline">{o.grade}</Badge>
                            <span className="text-xs text-muted-foreground">({o.exam_type} {o.exam_year})</span>
                          </div>
                          {!readOnly && (
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeSubject(idx)} className="h-8 w-8 text-destructive">
                              <Trash2 size={14} />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {olevels.length > 0 && olevels.length < 5 && (
                      <p className="text-xs text-destructive mt-2 flex items-center gap-1"><AlertCircle size={12} /> Minimum 5 subjects required.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Programme */}
            {step === 3 && (
              <div className="space-y-6">
                 {/* Intended Course Selection */}
                <div className="space-y-2">
                  <FormField control={form.control} name="intended_course" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intended University Course</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={(val) => {
                          field.onChange(val);
                          setIntendedCourse(val);
                        }} 
                        disabled={readOnly}
                      >
                        <FormControl><SelectTrigger><SelectValue placeholder="What do you want to study?" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {UNIVERSITY_COURSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">We will recommend IJMB subject combinations based on your choice.</p>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="subject_combination_id" render={({ field }) => (
                  <FormItem>
                    <FormLabel>IJMB Subject Combination</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select combination" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {/* Recommended Section */}
                        {recommendedCombos.length > 0 && (
                          <>
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                              Recommended for {intendedCourse}
                            </div>
                            {recommendedCombos.map(c => (
                              <SelectItem key={c.id} value={c.id} className="font-medium text-primary">
                                {c.name} ({c.subject1}, {c.subject2}, {c.subject3})
                              </SelectItem>
                            ))}
                          </>
                        )}
                        
                        {/* All Combinations */}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50 mt-1">
                          Other Combinations
                        </div>
                        {otherCombos.map(c => (
                          <SelectItem key={c.id} value={c.id}>
                             {c.name} ({c.subject1}, {c.subject2}, {c.subject3})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="session_id" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Academic Session</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select session" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {sessions.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.code})</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="preferred_centre_id" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Study Centre</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={readOnly}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select centre" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {centres.map(c => <SelectItem key={c.id} value={c.id}>{c.name} – {c.state}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </div>
            )}

            {/* Step 4: Document Upload */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="p-4 border rounded-md bg-muted/20">
                  <h3 className="font-semibold text-lg mb-4">Document Upload</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Please upload your passport photograph and O-Level result (if available).
                    These documents are required to complete your application.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="mb-2 block">Passport Photograph <span className="text-destructive">*</span></Label>
                      {application?.passport_path ? (
                        <div className="flex items-center gap-2 p-3 border rounded-md bg-green-50/50 border-green-200">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <BookOpen size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-green-800">Passport Uploaded</p>
                            <Button type="button" variant="link" size="sm" className="h-auto p-0 text-green-700" onClick={() => window.open(`https://hmdsrxqftndohdcvxxyw.supabase.co/storage/v1/object/public/student-documents/${application.passport_path}`, '_blank')}>
                              View Document
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => onFileUpload?.('passport')}
                            disabled={readOnly || !!uploading}
                          >
                            Upload Passport
                          </Button>
                          {uploading === 'passport' && <Loader2 className="animate-spin text-primary" size={24} />}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="mb-2 block">O-Level Result {form.watch('olevel_awaiting') ? '(Optional)' : <span className="text-destructive">*</span>}</Label>
                      {application?.olevel_path ? (
                        <div className="flex items-center gap-2 p-3 border rounded-md bg-green-50/50 border-green-200">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <BookOpen size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-green-800">O-Level Result Uploaded</p>
                            <Button type="button" variant="link" size="sm" className="h-auto p-0 text-green-700" onClick={() => window.open(`https://hmdsrxqftndohdcvxxyw.supabase.co/storage/v1/object/public/student-documents/${application.olevel_path}`, '_blank')}>
                              View Document
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => onFileUpload?.('olevel')}
                            disabled={readOnly || !!uploading}
                          >
                            Upload O-Level Result
                          </Button>
                          {uploading === 'olevel' && <Loader2 className="animate-spin text-primary" size={24} />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep} disabled={saving || nextLoading}>
                  <ArrowLeft className="mr-2" size={16} /> Previous
                </Button>
              ) : (
                <div /> /* Spacer */
              )}

              <div className="flex gap-2">
                {!readOnly && step < 4 && (
                  <Button type="button" variant="ghost" onClick={handleAutoSave} disabled={saving || nextLoading}>
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} className="mr-2" />} Save Draft
                  </Button>
                )}
                
                {step < 4 ? (
                  <Button type="button" onClick={nextStep} disabled={nextLoading}>
                    {nextLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                    Next <ArrowRight className="ml-2" size={16} />
                  </Button>
                ) : (
                  !readOnly && (
                    <Button type="submit" disabled={saving || !!uploading}>
                      {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />}
                      {uploading ? 'Uploading…' : 'Submit Application'}
                    </Button>
                  )
                )}
              </div>
            </div>

          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
