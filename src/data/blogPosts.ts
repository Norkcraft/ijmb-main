export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML or Markdown content
  author: string;
  date: string;
  image: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'what-is-ijmb-complete-guide',
    title: 'What is IJMB? A Complete Guide to Direct Entry Admission',
    excerpt: 'Everything you need to know about the Interim Joint Matriculation Board (IJMB) programme, how it works, and how to gain 200-level admission into Nigerian universities without JAMB.',
    content: `
      <h2>What is IJMB?</h2>
      <p>The <strong>Interim Joint Matriculation Board (IJMB)</strong> is an Advanced Level (A-Level) educational programme in Nigeria. It is designed to provide an alternative route for students to gain admission into the <strong>200 level (Direct Entry)</strong> of various Nigerian universities, bypassing the Joint Admissions and Matriculation Board (JAMB) Unified Tertiary Matriculation Examination (UTME).</p>

      <h2>How Does IJMB Work?</h2>
      <p>The programme runs for approximately <strong>9 to 12 months</strong> (two semesters). During this period, students receive intensive lectures in three subject combinations relevant to their intended course of study (e.g., Physics, Chemistry, Biology for Medicine).</p>
      
      <h3>Key Features:</h3>
      <ul>
        <li><strong>Duration:</strong> 9-12 months.</li>
        <li><strong>Eligibility:</strong> O-Level results (WAEC, NECO, GCE, or NABTEB) with at least 5 credits including Mathematics and English. Awaiting result is also accepted.</li>
        <li><strong>Examination:</strong> Conducted annually by the Ahmadu Bello University (ABU), Zaria.</li>
        <li><strong>Certificate:</strong> Recognized worldwide and does not expire.</li>
      </ul>

      <h2>Why Choose IJMB?</h2>
      <p>Many students prefer IJMB because it offers a <strong>higher chance of admission</strong> compared to JAMB. With JAMB, you compete with millions of students for 100-level admission. With IJMB, you compete with fewer students for Direct Entry admission.</p>

      <h2>Is IJMB Approved?</h2>
      <p>Yes, IJMB is fully approved by the <strong>Federal Government of Nigeria</strong> and the <strong>National Universities Commission (NUC)</strong>. It is accepted by over 80% of Nigerian federal, state, and private universities.</p>
    `,
    author: 'IJMB Admin',
    date: '2025-01-15',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
    tags: ['IJMB', 'Admission', 'Direct Entry', 'Education']
  },
  {
    id: '2',
    slug: 'ijmb-vs-jamb-difference',
    title: 'IJMB vs JAMB: Which is Better for Admission?',
    excerpt: 'Compare IJMB and JAMB side-by-side to decide which admission route is best for you. Learn about the advantages of Direct Entry over the traditional UTME process.',
    content: `
      <h2>Introduction</h2>
      <p>Choosing between <strong>IJMB</strong> and <strong>JAMB (UTME)</strong> can be difficult. While JAMB is the standard route for most secondary school leavers, IJMB offers a unique advantage for those seeking 200-level admission directly.</p>

      <h2>Comparison Table</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300 mt-4 mb-6">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2">Feature</th>
              <th class="border border-gray-300 px-4 py-2">JAMB (UTME)</th>
              <th class="border border-gray-300 px-4 py-2">IJMB (A-Level)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-300 px-4 py-2"><strong>Admission Level</strong></td>
              <td class="border border-gray-300 px-4 py-2">100 Level</td>
              <td class="border border-gray-300 px-4 py-2">200 Level (Direct Entry)</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-2"><strong>Result Expiry</strong></td>
              <td class="border border-gray-300 px-4 py-2">1 Year (Valid for current year only)</td>
              <td class="border border-gray-300 px-4 py-2">No Expiry (Lifetime validity)</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-2"><strong>Competition</strong></td>
              <td class="border border-gray-300 px-4 py-2">Very High (Millions of applicants)</td>
              <td class="border border-gray-300 px-4 py-2">Low (Fewer applicants)</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-2"><strong>Mode of Entry</strong></td>
              <td class="border border-gray-300 px-4 py-2">Exam Only</td>
              <td class="border border-gray-300 px-4 py-2">9 Months Lectures + Exam</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Which Should You Choose?</h2>
      <p>If you have written JAMB multiple times without success, or if you want to skip 100 level and graduate faster, <strong>IJMB is the better option</strong>. It requires dedication to study for 9 months, but the reward is a guaranteed pathway to university admission.</p>
    `,
    author: 'Education Consultant',
    date: '2025-02-10',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    tags: ['Comparison', 'JAMB', 'IJMB', 'Tips']
  },
  {
    id: '3',
    slug: 'how-to-apply-ijmb-2025',
    title: 'How to Apply for IJMB 2025/2026 Registration',
    excerpt: 'Step-by-step guide on how to register for the 2025/2026 IJMB academic session. Don\'t miss the deadline for the current academic session.',
    content: `
      <h2>Registration Process</h2>
      <p>Applying for IJMB is straightforward. Follow these steps to secure your admission into an accredited IJMB study centre.</p>

      <h3>Step 1: Visit the Registration Portal</h3>
      <p>Go to the official <a href="/ijmb-registration" class="text-primary underline">IJMB Registration Page</a> on our website.</p>

      <h3>Step 2: Fill the Form</h3>
      <p>Complete the online application form with your personal details, O-Level results (if available), and preferred course of study. You will need to upload a passport photograph.</p>

      <h3>Step 3: Make Payment</h3>
      <p>Pay the registration fee of <strong>₦8,500</strong>. Payment can be made online via card or bank transfer.</p>

      <h3>Step 4: Receive Admission Letter</h3>
      <p>Once your payment is confirmed, you will receive your admission letter and acceptance fee instructions via email. You will also be assigned to a study centre closest to your preferred location.</p>

      <h3>Step 5: Resume for Lectures</h3>
      <p>Print your admission letter and resume at your assigned study centre to begin lectures immediately.</p>
    `,
    author: 'Admissions Office',
    date: '2025-03-01',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800',
    tags: ['Registration', 'Guide', 'How-to']
  },
  {
    id: '4',
    slug: 'universities-accepting-ijmb',
    title: 'List of Universities Accepting IJMB for Direct Entry',
    excerpt: 'Comprehensive list of federal, state, and private universities in Nigeria that accept IJMB results for 200-level admission.',
    content: `
      <h2>Universities Accepting IJMB</h2>
      <p>IJMB is widely accepted across Nigeria. Below is a categorized list of some top universities that accept the programme.</p>

      <h3>Federal Universities</h3>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>University of Ilorin (UNILORIN)</li>
        <li>University of Abuja (UNIABUJA)</li>
        <li>Federal University of Technology, Minna (FUTMINNA)</li>
        <li>Ahmadu Bello University, Zaria (ABU)</li>
        <li>Bayero University, Kano (BUK)</li>
        <li>University of Jos (UNIJOS)</li>
        <li>Federal University, Lokoja (FULOKOJA)</li>
        <li>Alex Ekwueme Federal University, Ndufu-Alike (AE-FUNAI)</li>
      </ul>

      <h3>State Universities</h3>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>Lagos State University (LASU)</li>
        <li>Delta State University (DELSU)</li>
        <li>Ekiti State University (EKSU)</li>
        <li>Kwara State University (KWASU)</li>
        <li>Adekunle Ajasin University, Akungba-Akoko (AAUA)</li>
      </ul>

      <h3>Private Universities</h3>
      <p>Almost all private universities in Nigeria accept IJMB for Direct Entry admission, including:</p>
      <ul class="list-disc pl-5 space-y-2 mb-4">
        <li>Afe Babalola University (ABUAD)</li>
        <li>Babcock University</li>
        <li>Bowen University</li>
        <li>Caleb University</li>
        <li>Bells University of Technology</li>
      </ul>

      <p><em>Note: Admission requirements may vary by school. Always check the specific requirements of your preferred institution.</em></p>
    `,
    author: 'IJMB Admin',
    date: '2025-03-05',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800',
    tags: ['Universities', 'List', 'Admission']
  },
  {
    id: '5',
    slug: 'how-to-buy-ijmb-form-online-2026',
    title: 'How to Buy IJMB Form Online 2026: Step-by-Step Payment Guide',
    excerpt: 'A complete guide on how to purchase your IJMB form online securely. Learn about payment methods, form fees, and how to avoid registration scams.',
    content: `
      <h2>Buying IJMB Form Online</h2>
      <p>The IJMB registration form for the 2026/2027 academic session is now available online. This guide will walk you through the secure payment process to ensure your registration is valid.</p>

      <h3>Official Form Price</h3>
      <p>The official price for the IJMB registration form is <strong>₦8,500</strong>. Be wary of agents or websites claiming to sell the form for higher or lower prices. Always use the official portal.</p>

      <h3>Step-by-Step Payment Guide</h3>
      <ol class="list-decimal pl-5 space-y-4 mb-6">
        <li>
          <strong>Create an Account:</strong> 
          Visit the <a href="/register" class="text-primary font-medium">Registration Portal</a> and create a student account using your email and phone number.
        </li>
        <li>
          <strong>Login to Dashboard:</strong> 
          After creating your account, login to your student dashboard. You will see an option to "Pay Form Fee".
        </li>
        <li>
          <strong>Select Payment Method:</strong> 
          We accept all major debit cards (MasterCard, Visa, Verve) and bank transfers. All payments are processed securely via Paystack.
        </li>
        <li>
          <strong>Confirm Payment:</strong> 
          Once the transaction is successful, your dashboard will automatically update from "Draft" to "Payment Pending" or "Submitted".
        </li>
      </ol>

      <h3>Avoiding Scams</h3>
      <p>To avoid falling victim to scams:</p>
      <ul class="list-disc pl-5 space-y-2">
        <li>Do not pay into any personal bank account.</li>
        <li>Only pay through the official website dashboard.</li>
        <li>Verify the website URL ensures it is the official IJMB direct entry portal.</li>
      </ul>
    `,
    author: 'Bursary Department',
    date: '2026-01-20',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800',
    tags: ['Payment', 'Guide', 'Registration', 'Scam Alert']
  },
  {
    id: '6',
    slug: 'ijmb-registration-closing-date-2026',
    title: 'IJMB Registration Closing Date 2026/2027 Session',
    excerpt: 'When is the deadline for IJMB registration? Find out the official closing date for the 2026/2027 academic session and avoid late entry fees.',
    content: `
      <h2>Registration Deadline Update</h2>
      <p>This is an important announcement for all prospective candidates wishing to enroll for the 2026/2027 IJMB academic session.</p>

      <h3>Official Closing Date</h3>
      <p>The registration portal for the current session is scheduled to close on <strong>Friday, May 29th, 2026</strong>. Lectures at all accredited study centres will commence fully by June 2026.</p>

      <h3>Is Late Registration Available?</h3>
      <p>Late registration may be available for a short period after the closing date, but it usually attracts an additional <strong>Late Entry Fee of ₦5,000</strong>. To save cost and ensure you don't miss introductory lectures, we strongly advise registering before the deadline.</p>

      <h3>Action Required</h3>
      <p>If you have not yet registered, please visit the <a href="/ijmb-registration" class="text-primary font-medium">Application Page</a> immediately to start your process. You can fill the form and make payment instantly to secure your slot.</p>
    `,
    author: 'Registrar',
    date: '2026-02-15',
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800',
    tags: ['Deadline', 'News', 'Admission']
  },
  {
    id: '7',
    slug: 'ijmb-form-price-breakdown-2026',
    title: 'IJMB Form Price & Fee Breakdown 2026',
    excerpt: 'Detailed breakdown of IJMB fees for 2026 including form price, tuition, acceptance fees, and hostel accommodation. Plan your budget effectively.',
    content: `
      <h2>Understanding IJMB Fees (2026)</h2>
      <p>Budgeting for your education is crucial. Here is a transparent breakdown of all fees associated with the IJMB programme for the 2026 session.</p>

      <h3>1. Registration Form Fee</h3>
      <p><strong>Cost: ₦8,500</strong> (One-time payment)</p>
      <p>This is the fee paid to purchase the application form and create your student profile on the portal.</p>

      <h3>2. Acceptance Fee</h3>
      <p><strong>Cost: ₦20,000 - ₦30,000</strong> (Varies by Centre)</p>
      <p>Paid after admission is offered to confirm your acceptance of the provisional admission. This fee often covers administrative setup and ID card processing.</p>

      <h3>3. Tuition Fees</h3>
      <p><strong>Range: ₦180,000 - ₦250,000</strong></p>
      <p>This covers lectures, textbooks, and internal examinations for the entire 9-month duration. Most centres allow payment in installments (e.g., 50% upfront, then 25% + 25%).</p>

      <h3>4. Hostel Accommodation</h3>
      <p><strong>Range: ₦50,000 - ₦100,000</strong> (Optional)</p>
      <p>If you choose to stay in the school hostel, this fee applies. It usually covers accommodation for the full session.</p>

      <h3>Total Estimated Cost</h3>
      <p>On average, a student should budget between <strong>₦250,000 and ₦350,000</strong> for the entire programme, which is significantly cheaper than a year in many private universities.</p>
    `,
    author: 'Bursary Department',
    date: '2026-03-10',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    tags: ['Fees', 'Cost', 'Budget', 'Finance']
  }
];
