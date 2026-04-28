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
      <h2>IJMB Fees 2026 – Full Breakdown</h2>
      <p>Here is a clear and transparent breakdown of all fees for the IJMB programme for the 2026/2027 session.</p>

      <h3>1. Registration Form Fee</h3>
      <p><strong>₦10,000</strong> (one-time, paid online at registration)</p>
      <p>This is the fee paid to purchase the application form and create your student profile on the portal.</p>

      <h3>2. Tuition Fee</h3>
      <p><strong>₦350,000</strong> per session</p>
      <p>Covers the full 9-month academic programme including lectures and internal examinations. Most centres allow instalment payments.</p>

      <h3>3. Hostel Accommodation</h3>
      <p><strong>₦150,000</strong> per session (optional)</p>
      <p>For students who require on-campus accommodation. Students living off-campus do not pay this fee.</p>

      <h3>Total Cost Summary</h3>
      <table>
        <thead><tr><th>Fee</th><th>Amount</th></tr></thead>
        <tbody>
          <tr><td>Registration Form</td><td>₦10,000</td></tr>
          <tr><td>Tuition Fee</td><td>₦350,000</td></tr>
          <tr><td>Hostel (optional)</td><td>₦150,000</td></tr>
          <tr><td><strong>Total (without hostel)</strong></td><td><strong>₦360,000</strong></td></tr>
          <tr><td><strong>Total (with hostel)</strong></td><td><strong>₦510,000</strong></td></tr>
        </tbody>
      </table>
    `,
    author: 'Bursary Department',
    date: '2026-03-10',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    tags: ['Fees', 'Cost', 'Budget', 'Finance']
  },
  {
    id: '8',
    slug: 'ijmb-vs-jupeb-which-is-better',
    title: 'IJMB vs JUPEB 2026: Which is Better for Direct Entry?',
    excerpt: 'Confused between IJMB and JUPEB? This side-by-side comparison breaks down the key differences in cost, university acceptance, exam difficulty, and which programme gives you a better chance of admission.',
    content: `
      <h2>IJMB vs JUPEB: What's the Difference?</h2>
      <p>Both <strong>IJMB</strong> and <strong>JUPEB</strong> are Advanced Level (A-Level) programmes in Nigeria that qualify candidates for Direct Entry admission into 200 Level. However, they are run by different institutions and have important differences that could affect your admission chances.</p>

      <ul>
        <li><strong>IJMB</strong> — Interim Joint Matriculation Board, administered by <strong>Ahmadu Bello University (ABU), Zaria</strong></li>
        <li><strong>JUPEB</strong> — Joint Universities Preliminary Examinations Board, administered by the <strong>University of Lagos (UNILAG)</strong></li>
      </ul>

      <h2>Side-by-Side Comparison</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300 mt-4 mb-6">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2 text-left">Feature</th>
              <th class="border border-gray-300 px-4 py-2 text-left">IJMB</th>
              <th class="border border-gray-300 px-4 py-2 text-left">JUPEB</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="border border-gray-300 px-4 py-2 font-medium">Administered By</td><td class="border border-gray-300 px-4 py-2">ABU Zaria</td><td class="border border-gray-300 px-4 py-2">University of Lagos</td></tr>
            <tr><td class="border border-gray-300 px-4 py-2 font-medium">Duration</td><td class="border border-gray-300 px-4 py-2">9–12 months</td><td class="border border-gray-300 px-4 py-2">9 months</td></tr>
            <tr><td class="border border-gray-300 px-4 py-2 font-medium">Grading System</td><td class="border border-gray-300 px-4 py-2">Points (A=5, max 15)</td><td class="border border-gray-300 px-4 py-2">GPA (A=4.0, max 5.0)</td></tr>
            <tr><td class="border border-gray-300 px-4 py-2 font-medium">Centres Available</td><td class="border border-gray-300 px-4 py-2">All 36 states (200+ centres)</td><td class="border border-gray-300 px-4 py-2">Mainly southern states</td></tr>
            <tr><td class="border border-gray-300 px-4 py-2 font-medium">University Acceptance</td><td class="border border-gray-300 px-4 py-2">200+ universities nationwide</td><td class="border border-gray-300 px-4 py-2">100+ mainly UNILAG affiliates</td></tr>
            <tr><td class="border border-gray-300 px-4 py-2 font-medium">Northern Nigeria Acceptance</td><td class="border border-gray-300 px-4 py-2">Excellent — preferred choice</td><td class="border border-gray-300 px-4 py-2">Limited acceptance</td></tr>
            <tr><td class="border border-gray-300 px-4 py-2 font-medium">Certificate Validity</td><td class="border border-gray-300 px-4 py-2">Lifetime (no expiry)</td><td class="border border-gray-300 px-4 py-2">Lifetime (no expiry)</td></tr>
            <tr><td class="border border-gray-300 px-4 py-2 font-medium">Form Fee</td><td class="border border-gray-300 px-4 py-2">₦10,000</td><td class="border border-gray-300 px-4 py-2">₦10,000–₦15,000</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Which is More Widely Accepted?</h2>
      <p><strong>IJMB has broader acceptance across Nigeria.</strong> Since it is administered by ABU Zaria — a northern federal university — it is especially well-regarded by universities in the North, Middle Belt, and nationally. JUPEB, while strong in the South-West (particularly for UNILAG and its affiliates), has limited acceptance in northern institutions.</p>

      <h2>Which is Easier to Pass?</h2>
      <p>Both programmes are academically demanding, but students generally report that IJMB is slightly more accessible because:</p>
      <ul>
        <li>IJMB centres are available in nearly every state, so students can study closer to home</li>
        <li>The 0–15 points grading system is straightforward to understand</li>
        <li>ABU's examination has been conducted consistently for decades, making past questions widely available</li>
      </ul>

      <h2>Which Should You Choose?</h2>
      <p>Choose <strong>IJMB if:</strong></p>
      <ul>
        <li>Your target university is in Northern or Middle-Belt Nigeria</li>
        <li>You want the widest possible choice of universities nationwide</li>
        <li>You want the lower registration cost</li>
        <li>You're in a state where JUPEB centres are unavailable</li>
      </ul>
      <p>Choose <strong>JUPEB if:</strong></p>
      <ul>
        <li>Your primary target is UNILAG or a JUPEB-affiliated southern university</li>
        <li>You are in Lagos or nearby and the centre is conveniently located</li>
      </ul>

      <p>For most students across Nigeria, <strong>IJMB remains the safer and more flexible choice</strong> due to its nationwide reach and broader acceptance.</p>
    `,
    author: 'Education Consultant',
    date: '2026-03-20',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800',
    tags: ['IJMB', 'JUPEB', 'Comparison', 'Direct Entry']
  },
  {
    id: '9',
    slug: 'ijmb-subject-combinations-all-courses',
    title: 'IJMB Subject Combinations for All Courses 2026: Complete Guide',
    excerpt: 'Not sure which three subjects to choose for IJMB? Here is the complete guide to IJMB subject combinations for Medicine, Engineering, Law, Accounting, Mass Communication, Computer Science, and all other courses.',
    content: `
      <h2>Why Your IJMB Subject Combination Matters</h2>
      <p>The three subjects you choose for your IJMB A-Level programme must match the faculty requirements of the university course you want to study. Choosing the wrong combination could disqualify you from your desired course even if you score highly. This guide covers every major course area.</p>

      <h2>Science & Health Courses</h2>

      <h3>Medicine & Surgery / Dentistry</h3>
      <p><strong>Subjects:</strong> Biology, Chemistry, Physics</p>
      <p>This is the most competitive IJMB combination. You will need very high scores — most medical schools require <strong>13–15 points</strong> and your O-Level must include Biology, Chemistry, Physics, English, and Mathematics.</p>

      <h3>Pharmacy</h3>
      <p><strong>Subjects:</strong> Biology, Chemistry, Physics <em>or</em> Biology, Chemistry, Mathematics</p>

      <h3>Nursing / Medical Laboratory Science / Physiotherapy</h3>
      <p><strong>Subjects:</strong> Biology, Chemistry, Physics</p>

      <h3>Biochemistry / Microbiology / Biotechnology</h3>
      <p><strong>Subjects:</strong> Biology, Chemistry, Mathematics <em>or</em> Biology, Chemistry, Physics</p>

      <h3>Agricultural Science / Food Science</h3>
      <p><strong>Subjects:</strong> Biology, Chemistry, Agricultural Science <em>or</em> Biology, Chemistry, Mathematics</p>

      <h2>Engineering & Technology Courses</h2>

      <h3>Electrical / Mechanical / Civil / Chemical Engineering</h3>
      <p><strong>Subjects:</strong> Mathematics, Physics, Chemistry</p>
      <p>Engineering is one of the most popular IJMB combinations. Strong performance in Mathematics is essential.</p>

      <h3>Computer Science / Computer Engineering</h3>
      <p><strong>Subjects:</strong> Mathematics, Physics, Chemistry <em>or</em> Mathematics, Physics, Further Mathematics</p>

      <h3>Architecture / Quantity Surveying / Estate Management</h3>
      <p><strong>Subjects:</strong> Mathematics, Physics, Chemistry <em>or</em> Mathematics, Physics, Fine Art</p>

      <h2>Arts & Law Courses</h2>

      <h3>Law</h3>
      <p><strong>Subjects:</strong> Literature in English, Government, CRS/IRS <em>or</em> Literature in English, Government, Economics</p>
      <p>Law is highly competitive. Most universities require <strong>13–15 points</strong> for IJMB candidates. Your O-Level must include Literature in English.</p>

      <h3>English Language / Linguistics</h3>
      <p><strong>Subjects:</strong> Literature in English, Government, French <em>or</em> Literature in English, Government, History</p>

      <h3>History / International Relations</h3>
      <p><strong>Subjects:</strong> History, Government, Economics <em>or</em> History, Government, Literature in English</p>

      <h3>Mass Communication / Journalism</h3>
      <p><strong>Subjects:</strong> Literature in English, Government, Economics <em>or</em> Government, Economics, Geography</p>

      <h2>Social Science & Commercial Courses</h2>

      <h3>Economics / Development Economics</h3>
      <p><strong>Subjects:</strong> Economics, Mathematics, Government <em>or</em> Economics, Mathematics, Geography</p>

      <h3>Accounting / Banking & Finance</h3>
      <p><strong>Subjects:</strong> Accounting, Economics, Commerce <em>or</em> Accounting, Economics, Mathematics</p>

      <h3>Business Administration / Management</h3>
      <p><strong>Subjects:</strong> Economics, Accounting, Commerce <em>or</em> Economics, Government, Mathematics</p>

      <h3>Political Science / Public Administration</h3>
      <p><strong>Subjects:</strong> Government, Economics, History <em>or</em> Government, Literature in English, Economics</p>

      <h3>Psychology / Sociology</h3>
      <p><strong>Subjects:</strong> Government, Economics, Biology <em>or</em> Biology, Chemistry, Economics</p>

      <h3>Geography / Urban & Regional Planning</h3>
      <p><strong>Subjects:</strong> Geography, Economics, Mathematics <em>or</em> Geography, Government, Economics</p>

      <h2>Education Courses</h2>

      <h3>Education (Science)</h3>
      <p><strong>Subjects:</strong> Mathematics, Physics, Chemistry <em>or</em> Biology, Chemistry, Physics</p>

      <h3>Education (Arts)</h3>
      <p><strong>Subjects:</strong> Literature in English, Government, History</p>

      <h3>Education (Social Science)</h3>
      <p><strong>Subjects:</strong> Economics, Government, Mathematics</p>

      <h2>Key Rules to Remember</h2>
      <ul>
        <li>You must choose <strong>exactly 3 subjects</strong> from the IJMB approved subject list</li>
        <li>Your O-Level credits must include at least <strong>3 subjects that match your IJMB combination</strong></li>
        <li>English Language and Mathematics O-Level credits are required for almost all courses</li>
        <li>If unsure, always check the specific requirements of your target university's prospectus</li>
        <li>You cannot change your subject combination after registration without penalty</li>
      </ul>
    `,
    author: 'Academic Affairs',
    date: '2026-03-25',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    tags: ['Subject Combinations', 'Guide', 'Courses', 'IJMB']
  },
  {
    id: '10',
    slug: 'ijmb-grading-system-points-explained',
    title: 'IJMB Grading System Explained: How Points Are Calculated',
    excerpt: 'How does the IJMB marking scheme work? Learn how A-Level grades are converted to points, the minimum scores needed for different universities and courses, and what score you need to aim for.',
    content: `
      <h2>How IJMB Results Are Graded</h2>
      <p>The IJMB programme uses a <strong>points-based grading system</strong>, similar to the British A-Level system. Your performance in each of your three subjects is graded from A to F, and each grade carries a specific number of points. Your total points out of 15 determine your eligibility for Direct Entry admission.</p>

      <h2>IJMB Grade Points Table</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300 mt-4 mb-6">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-6 py-3 text-left">Grade</th>
              <th class="border border-gray-300 px-6 py-3 text-left">Points</th>
              <th class="border border-gray-300 px-6 py-3 text-left">Performance</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-green-50"><td class="border border-gray-300 px-6 py-3 font-bold text-green-700">A</td><td class="border border-gray-300 px-6 py-3 font-bold">5 points</td><td class="border border-gray-300 px-6 py-3">Distinction / Excellent</td></tr>
            <tr><td class="border border-gray-300 px-6 py-3 font-bold text-blue-700">B</td><td class="border border-gray-300 px-6 py-3 font-bold">4 points</td><td class="border border-gray-300 px-6 py-3">Very Good</td></tr>
            <tr><td class="border border-gray-300 px-6 py-3 font-bold text-yellow-700">C</td><td class="border border-gray-300 px-6 py-3 font-bold">3 points</td><td class="border border-gray-300 px-6 py-3">Good / Credit</td></tr>
            <tr><td class="border border-gray-300 px-6 py-3 font-bold text-orange-700">D</td><td class="border border-gray-300 px-6 py-3 font-bold">2 points</td><td class="border border-gray-300 px-6 py-3">Satisfactory / Pass</td></tr>
            <tr><td class="border border-gray-300 px-6 py-3 font-bold text-red-600">E</td><td class="border border-gray-300 px-6 py-3 font-bold">1 point</td><td class="border border-gray-300 px-6 py-3">Marginal Pass</td></tr>
            <tr class="bg-red-50"><td class="border border-gray-300 px-6 py-3 font-bold text-red-800">F</td><td class="border border-gray-300 px-6 py-3 font-bold">0 points</td><td class="border border-gray-300 px-6 py-3">Fail</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Maximum Possible Score</h2>
      <p>Since you sit 3 subjects and the highest grade in each is A (5 points), the <strong>maximum total is 15 points</strong> (A+A+A = 5+5+5). This is also referred to as achieving <em>"triple A"</em> and is extremely competitive.</p>

      <h2>How to Calculate Your IJMB Points</h2>
      <p>Simply add the points for your three subject grades:</p>
      <ul>
        <li>A in Biology + B in Chemistry + C in Physics = 5 + 4 + 3 = <strong>12 points</strong></li>
        <li>B in Mathematics + B in Physics + A in Chemistry = 4 + 4 + 5 = <strong>13 points</strong></li>
        <li>C in Government + D in Economics + B in Literature = 3 + 2 + 4 = <strong>9 points</strong></li>
      </ul>

      <h2>Minimum Points Required by Course & University</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300 mt-4 mb-6">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2 text-left">Course Category</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Typical Minimum</th>
              <th class="border border-gray-300 px-4 py-2 text-left">Recommended Score</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="border border-gray-300 px-4 py-2">Medicine, Law, Pharmacy</td><td class="border border-gray-300 px-4 py-2">12–13 points</td><td class="border border-gray-300 px-4 py-2">14–15 points</td></tr>
            <tr><td class="border border-gray-300 px-4 py-2">Engineering, Architecture</td><td class="border border-gray-300 px-4 py-2">10–12 points</td><td class="border border-gray-300 px-4 py-2">12–13 points</td></tr>
            <tr><td class="border border-gray-300 px-4 py-2">Sciences (Biochem, Micro)</td><td class="border border-gray-300 px-4 py-2">9–10 points</td><td class="border border-gray-300 px-4 py-2">11–12 points</td></tr>
            <tr><td class="border border-gray-300 px-4 py-2">Social Sciences, Arts</td><td class="border border-gray-300 px-4 py-2">8–9 points</td><td class="border border-gray-300 px-4 py-2">10–11 points</td></tr>
            <tr><td class="border border-gray-300 px-4 py-2">Education, Agriculture</td><td class="border border-gray-300 px-4 py-2">6–8 points</td><td class="border border-gray-300 px-4 py-2">9–10 points</td></tr>
          </tbody>
        </table>
      </div>
      <p><em>Note: These are general guidelines. Each university sets its own cut-off. Always check your target university's requirements.</em></p>

      <h2>What Happens if You Score Below the Minimum?</h2>
      <p>If your total points are below the minimum required for your chosen course, you have two options:</p>
      <ol>
        <li><strong>Re-sit the IJMB examination</strong> in the next session to improve your score</li>
        <li><strong>Apply for a less competitive course</strong> that your current score qualifies you for</li>
      </ol>
      <p>Your IJMB result is permanent — it never expires. You can use a past result for Direct Entry at any time in the future.</p>

      <h2>Tips for Maximising Your IJMB Points</h2>
      <ul>
        <li>Attend all lectures — the IJMB syllabus directly maps to the exam</li>
        <li>Study past questions thoroughly; ABU tends to repeat question patterns</li>
        <li>Focus on your strongest subject first to secure maximum points there</li>
        <li>Aim for at least B in every subject to hit 12 points minimum</li>
        <li>Never attempt to guess in MCQ sections — negative marking may apply</li>
      </ul>
    `,
    author: 'Academic Affairs',
    date: '2026-04-01',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
    tags: ['Grading', 'Points', 'Results', 'IJMB']
  },
  {
    id: '11',
    slug: 'can-you-study-medicine-with-ijmb',
    title: 'IJMB for Medicine 2026: Can You Study Medicine with IJMB?',
    excerpt: 'Can IJMB get you into Medicine? Yes — but it requires very high scores. Here is everything MBBS hopefuls need to know: subject combinations, cut-off points, which medical schools accept IJMB, and how to prepare.',
    content: `
      <h2>Yes — You Can Study Medicine with IJMB</h2>
      <p>Medicine is one of the most competitive courses in Nigeria, but <strong>IJMB is a legitimate and accepted pathway into MBBS (Medicine & Surgery)</strong> at many Nigerian universities. Thousands of students have gained medical school admission through IJMB Direct Entry.</p>
      <p>The key difference is that unlike JAMB — where even a score of 280+ may not guarantee admission into Medicine — IJMB gives you a full academic session to demonstrate your capability. Your effort directly determines your result.</p>

      <h2>Subject Combination for Medicine</h2>
      <p>For Medicine, Dentistry, Veterinary Medicine, and related health courses, your IJMB subject combination must be:</p>
      <ul>
        <li><strong>Biology</strong></li>
        <li><strong>Chemistry</strong></li>
        <li><strong>Physics</strong></li>
      </ul>
      <p>Some universities also accept Biology, Chemistry, and Mathematics — but Biology, Chemistry, Physics is the safest and most universally accepted combination for Medical Sciences.</p>

      <h2>O-Level Requirements for Medicine</h2>
      <p>Your O-Level (WAEC, NECO, or NABTEB) must include credits in the following subjects for Medicine:</p>
      <ul>
        <li>English Language</li>
        <li>Mathematics</li>
        <li>Biology</li>
        <li>Chemistry</li>
        <li>Physics</li>
      </ul>
      <p>All five of these must be obtained at credit level (C6 or better) in not more than two sittings.</p>

      <h2>Minimum IJMB Points for Medicine</h2>
      <p>Medicine is the most competitive course for IJMB candidates. Here are typical cut-off points at various institutions:</p>
      <ul>
        <li><strong>University of Ilorin (UNILORIN) MBBS:</strong> 14–15 points (very competitive)</li>
        <li><strong>Ahmadu Bello University (ABU) MBBS:</strong> 13–15 points</li>
        <li><strong>University of Jos (UNIJOS) MBBS:</strong> 12–14 points</li>
        <li><strong>Bayero University Kano (BUK) MBBS:</strong> 12–14 points</li>
        <li><strong>Most other federal universities:</strong> 12–15 points</li>
      </ul>
      <p>The target should be <strong>at least 14 points</strong> (e.g., A+A+B or A+B+B grades) if you are serious about gaining Medicine admission. 15 points (triple A) gives you the best chance.</p>

      <h2>Federal Universities Accepting IJMB for Medicine</h2>
      <ul>
        <li>Ahmadu Bello University (ABU), Zaria — MBBS</li>
        <li>University of Ilorin (UNILORIN) — MBBS</li>
        <li>University of Jos (UNIJOS) — MBBS</li>
        <li>Bayero University, Kano (BUK) — MBBS</li>
        <li>University of Maiduguri — MBBS</li>
        <li>Usmanu Danfodiyo University, Sokoto — MBBS</li>
        <li>Federal University, Lokoja — MBBS (newly established)</li>
        <li>University of Calabar — MBBS</li>
        <li>University of Benin — MBBS</li>
        <li>University of Port Harcourt — MBBS</li>
      </ul>

      <h2>What Does the Admission Process Look Like?</h2>
      <ol>
        <li>Register and complete the IJMB programme (9 months)</li>
        <li>Sit the IJMB A-Level examinations conducted by ABU Zaria</li>
        <li>Collect your IJMB certificate/result (usually released 3–4 months after the exam)</li>
        <li>Register for JAMB Direct Entry (DE) form — select Medicine and choose up to 3 universities</li>
        <li>Attend Direct Entry screening at your preferred university</li>
        <li>Gain admission into 200 Level MBBS</li>
      </ol>

      <h2>Is IJMB Harder Than JAMB for Medicine?</h2>
      <p>IJMB requires sustained effort over 9 months, while JAMB is a single exam day. However:</p>
      <ul>
        <li>With JAMB, a technical glitch or bad day can ruin everything</li>
        <li>With IJMB, your grade reflects consistent study over the entire session</li>
        <li>IJMB students entering Medicine are often <em>better prepared</em> for 200 Level work because they have covered much of the 100 Level curriculum already</li>
      </ul>
      <p>For dedicated students, IJMB is the <strong>more reliable pathway into Medicine</strong>.</p>
    `,
    author: 'Academic Affairs',
    date: '2026-04-03',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
    tags: ['Medicine', 'MBBS', 'Direct Entry', 'IJMB']
  },
  {
    id: '12',
    slug: 'what-to-do-after-ijmb-university-admission-guide',
    title: 'What to Do After IJMB: Complete Guide to Getting University Admission',
    excerpt: 'You have passed your IJMB exams — what next? This step-by-step guide walks you through everything: collecting your result, registering for JAMB Direct Entry, choosing a university, and finally getting admitted into 200 level.',
    content: `
      <h2>Congratulations — Now What?</h2>
      <p>Passing your IJMB A-Level examinations is a major milestone, but the work is not yet done. There are several important steps between receiving your result and sitting in a 200 Level lecture hall. This guide walks you through every step clearly.</p>

      <h2>Step 1: Collect Your IJMB Result</h2>
      <p>IJMB examination results are released by <strong>Ahmadu Bello University (ABU), Zaria</strong> approximately <strong>3–5 months</strong> after the examination date. Results can be collected from:</p>
      <ul>
        <li>Your registered IJMB study centre</li>
        <li>The ABU Zaria IJMB office directly</li>
        <li>Online result checkers (where available)</li>
      </ul>
      <p>Ensure you collect both your result slip and your <strong>original IJMB certificate</strong> — you will need the original document for university screening exercises.</p>

      <h2>Step 2: Verify Your Result is Authentic</h2>
      <p>Before proceeding, confirm your result is directly from ABU Zaria and not a fraudulent slip. Legitimate IJMB results:</p>
      <ul>
        <li>Bear the ABU Zaria official seal</li>
        <li>Are verifiable at the ABU IJMB office</li>
        <li>Show exactly 3 subject grades with corresponding points</li>
      </ul>

      <h2>Step 3: Register for JAMB Direct Entry (DE) Form</h2>
      <p>Even though you do not need JAMB <em>UTME</em>, you still need the <strong>JAMB Direct Entry (DE) form</strong> to apply for admission into any Nigerian university. This is a separate form from UTME.</p>
      <ul>
        <li>The DE form is purchased from JAMB accredited CBT centres or online at jamb.gov.ng</li>
        <li>Current cost is approximately <strong>₦3,500</strong></li>
        <li>You will upload your IJMB result as your qualifying certificate</li>
        <li>You can select <strong>up to 3 universities</strong> and specify the course at each</li>
      </ul>

      <h2>Step 4: Choose Your University and Course</h2>
      <p>When filling your JAMB DE form, carefully choose:</p>
      <ul>
        <li>Your first choice university (the one you most want to attend)</li>
        <li>Your second and third choices as backups</li>
        <li>The specific course at each university that your IJMB combination qualifies you for</li>
      </ul>
      <p>Ensure your IJMB subject combination matches the departmental requirements at your chosen university. The JAMB Direct Entry brochure (available for purchase) lists all university requirements.</p>

      <h2>Step 5: Attend the University Screening</h2>
      <p>After submitting your JAMB DE form, you will receive a notification to attend a <strong>Direct Entry screening exercise</strong> at your chosen university. This typically involves:</p>
      <ul>
        <li>Submission of original and photocopied credentials</li>
        <li>Verification of your IJMB result and O-Level certificates</li>
        <li>Some universities (like UNILAG and UI) may conduct a written test or oral interview</li>
        <li>Payment of acceptance fee if offered admission</li>
      </ul>

      <h2>Step 6: Check JAMB Admission Status</h2>
      <p>After screening, check your admission status regularly on:</p>
      <ul>
        <li>The JAMB admission status checker at jamb.gov.ng</li>
        <li>Your chosen university's admission portal</li>
      </ul>
      <p>Once your name appears on the admission list, you will proceed to complete your university matriculation and course registration.</p>

      <h2>Documents You Need Throughout This Process</h2>
      <ul>
        <li>Original IJMB certificate and result slip</li>
        <li>O-Level certificate (WAEC, NECO, or NABTEB) — original and photocopies</li>
        <li>Birth certificate or age declaration</li>
        <li>JAMB Direct Entry admission letter (after result)</li>
        <li>Passport photographs (white background, 10–20 copies)</li>
        <li>Valid means of identification (NIN slip, national ID, or international passport)</li>
        <li>Certificate of local government of origin</li>
      </ul>

      <h2>Timeline Overview</h2>
      <ul>
        <li><strong>IJMB Exams:</strong> Typically April–June</li>
        <li><strong>Results Released:</strong> Approximately September–November</li>
        <li><strong>JAMB DE Registration:</strong> Opens January–March annually</li>
        <li><strong>University Screening:</strong> Varies by institution (typically March–June)</li>
        <li><strong>Admission Confirmed:</strong> Typically July–September</li>
        <li><strong>200 Level Resumption:</strong> October–November</li>
      </ul>
    `,
    author: 'Admissions Office',
    date: '2026-04-05',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800',
    tags: ['After IJMB', 'Admission', 'JAMB Direct Entry', 'Guide']
  },
  {
    id: '13',
    slug: 'does-unilag-accept-ijmb-requirements',
    title: 'Does UNILAG Accept IJMB? Cut-Off Points, Requirements & Application Process',
    excerpt: 'The University of Lagos is one of Nigeria\'s most prestigious institutions. Find out if UNILAG accepts IJMB for Direct Entry, what points you need, which courses are available, and how to apply.',
    content: `
      <h2>Yes — UNILAG Accepts IJMB for Direct Entry</h2>
      <p>The <strong>University of Lagos (UNILAG)</strong> officially accepts IJMB A-Level results for <strong>Direct Entry admission into 200 Level</strong>. However, UNILAG is one of the most competitive universities in Nigeria, and the requirements are strict.</p>

      <h2>Minimum IJMB Points Required by UNILAG</h2>
      <p>UNILAG's general minimum for Direct Entry via IJMB is <strong>12 points out of 15</strong>. However, for competitive courses, the effective cut-off is higher:</p>
      <ul>
        <li><strong>Medicine & Surgery (MBBS):</strong> 14–15 points</li>
        <li><strong>Law:</strong> 13–15 points</li>
        <li><strong>Pharmacy:</strong> 13–14 points</li>
        <li><strong>Engineering (all types):</strong> 12–13 points</li>
        <li><strong>Computer Science:</strong> 12–13 points</li>
        <li><strong>Accounting / Finance:</strong> 11–12 points</li>
        <li><strong>Economics:</strong> 11–12 points</li>
        <li><strong>Mass Communication:</strong> 11–13 points</li>
        <li><strong>Other Social Sciences / Arts:</strong> 10–11 points</li>
      </ul>
      <p><em>Note: Cut-off points can vary by session based on competition. These are indicative figures based on historical trends.</em></p>

      <h2>O-Level Requirements for UNILAG Direct Entry</h2>
      <p>In addition to your IJMB result, UNILAG requires:</p>
      <ul>
        <li>Minimum of <strong>5 O-Level credits</strong> at not more than <strong>2 sittings</strong></li>
        <li>Credits must include <strong>English Language</strong> and <strong>Mathematics</strong></li>
        <li>Subject-specific credits relevant to your chosen faculty (e.g., Biology and Chemistry for Medicine)</li>
      </ul>

      <h2>Does UNILAG Conduct Post-UTME for DE Candidates?</h2>
      <p>Yes. UNILAG typically conducts a <strong>Direct Entry screening</strong> — this may include a written test or credential verification exercise. The exact format varies per session. Check the UNILAG admissions portal each year for the current process.</p>

      <h2>Popular Faculties at UNILAG Accepting IJMB</h2>
      <ul>
        <li>Faculty of Medicine (College of Medicine) — requires Biology, Chemistry, Physics</li>
        <li>Faculty of Law — requires Literature, Government, Economics/CRS</li>
        <li>Faculty of Engineering — requires Mathematics, Physics, Chemistry</li>
        <li>Faculty of Science — requires relevant science subjects</li>
        <li>Faculty of Social Sciences — requires Economics, Government/Mathematics</li>
        <li>Faculty of Arts — requires Literature, Government, History/French</li>
        <li>Faculty of Business Administration — requires Accounting, Economics, Commerce</li>
      </ul>

      <h2>How to Apply to UNILAG via IJMB</h2>
      <ol>
        <li>Complete and pass your IJMB A-Level examinations with strong scores</li>
        <li>Collect your official IJMB certificate from ABU Zaria</li>
        <li>Purchase the JAMB Direct Entry form and select UNILAG as your first choice</li>
        <li>Complete the UNILAG online post-UTME / Direct Entry registration</li>
        <li>Submit credentials at the designated UNILAG screening date</li>
        <li>Check admission status on the UNILAG and JAMB portals</li>
      </ol>

      <h2>Key Tips for UNILAG IJMB Applicants</h2>
      <ul>
        <li>Aim for <strong>13 points minimum</strong> to be competitive across most UNILAG faculties</li>
        <li>Register early — UNILAG screening slots fill quickly</li>
        <li>Ensure all your O-Level results are verified and ready before screening</li>
        <li>UNILAG also accepts <strong>JUPEB</strong> results — if you are based in Lagos, compare both options</li>
      </ul>
    `,
    author: 'Admissions Office',
    date: '2026-04-07',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800',
    tags: ['UNILAG', 'Direct Entry', 'Requirements', 'IJMB']
  },
  {
    id: '14',
    slug: 'how-to-pass-ijmb-exams-study-tips',
    title: 'How to Pass IJMB Exams: 10 Proven Study Tips for High Scores',
    excerpt: 'Want to score 12–15 points in your IJMB A-Level exams? These 10 practical study strategies from past students and educators will help you study smarter, stay consistent, and pass with confidence.',
    content: `
      <h2>IJMB Exams Are Passable — With the Right Approach</h2>
      <p>The IJMB A-Level examination is conducted by Ahmadu Bello University (ABU) Zaria and covers three subjects over a 9-month academic session. Many students fail not because the content is too difficult, but because of poor preparation habits. Here are 10 strategies that work.</p>

      <h2>1. Attend All Lectures Without Fail</h2>
      <p>This is the single most impactful thing you can do. IJMB lectures are structured specifically around the ABU Zaria examination syllabus. Your tutors know exactly what topics appear in the exam — <strong>missing a lecture can mean missing a 5-mark question</strong>. Treat every class as non-negotiable.</p>

      <h2>2. Get the IJMB/ABU A-Level Syllabus</h2>
      <p>Download or obtain a copy of the official ABU A-Level syllabus for each of your three subjects. This tells you every topic that could be examined. Cross-check it with what your tutors teach and fill in any gaps with self-study.</p>

      <h2>3. Use IJMB Past Questions Extensively</h2>
      <p>ABU Zaria tends to recycle question formats and topics. Past questions (available at most IJMB centres and academic bookshops) are one of your most powerful revision tools. Aim to practice at least <strong>5 years of past questions per subject</strong>.</p>

      <h2>4. Create a Study Schedule and Follow It</h2>
      <p>Divide your 9 months into phases: foundation (first 3 months), development (next 3 months), and intensive revision (final 3 months). Allocate specific hours daily to each subject. Students who score A's typically study at least <strong>4–6 hours per day</strong> outside of class.</p>

      <h2>5. Form Study Groups (But Stay Focused)</h2>
      <p>Study groups are effective for difficult topics — especially for working through calculations in Mathematics, Physics, or Chemistry. However, keep groups small (3–5 students), structured, and focused. A poorly managed group can waste more time than it saves.</p>

      <h2>6. Prioritise Your Strongest Subject First</h2>
      <p>Identify the subject you are most confident in and work to secure an A (5 points) in it first. A guaranteed 5 points gives you a strong foundation. Then focus on securing B's (4 points) in the other two — that already puts you at 13 points.</p>

      <h2>7. Understand the Exam Paper Format</h2>
      <p>IJMB examinations typically include:</p>
      <ul>
        <li><strong>Multiple Choice (Objective):</strong> Usually 50 questions — speed and accuracy matter</li>
        <li><strong>Theory/Essay:</strong> Usually 2–4 questions requiring detailed written answers</li>
        <li><strong>Practical:</strong> Applicable for Science subjects (Biology, Chemistry, Physics)</li>
      </ul>
      <p>Knowing the format prevents surprises on exam day and helps you allocate time correctly.</p>

      <h2>8. Do Not Neglect Practicals (Science Students)</h2>
      <p>Science subjects include a practical examination that carries significant marks. Many students focus heavily on theory and neglect practicals — this is a costly mistake. Practise titration, microscopy, circuit diagrams, and other lab procedures regularly.</p>

      <h2>9. Revise Regularly, Not Just Before Exams</h2>
      <p>Cramming the week before exams rarely works for A-Level content. The volume is too large. Instead, revise each topic <strong>within 24 hours of learning it</strong>, then again after a week, and once more in the final revision phase. Spaced repetition is scientifically proven to improve long-term retention.</p>

      <h2>10. Take Care of Your Health and Mental State</h2>
      <p>Sleep deprivation, poor nutrition, and stress are academic performance killers. Aim for 7–8 hours of sleep nightly during exam preparation. Physical exercise — even 30 minutes of walking per day — significantly improves focus and memory. If you feel overwhelmed, speak to a tutor or counsellor at your centre.</p>

      <h2>Final Word</h2>
      <p>Students who score 12–15 points in IJMB are not necessarily more intelligent than others — they are more <em>consistent</em>. Consistent attendance, consistent practice, consistent revision. Start early, stay disciplined, and your score will reflect it.</p>
    `,
    author: 'Education Consultant',
    date: '2026-04-08',
    image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=800',
    tags: ['Study Tips', 'Exam Prep', 'IJMB', 'Academic Success']
  },
  {
    id: '15',
    slug: 'ijmb-in-abuja-centres-registration',
    title: 'IJMB in Abuja 2026: Best Study Centres and How to Register',
    excerpt: 'Looking for IJMB centres in Abuja and the FCT? This guide lists the best IJMB study centres in Abuja, what to expect, fee ranges, and how to register online from wherever you are in Nigeria.',
    content: `
      <h2>IJMB in Abuja — Federal Capital Territory</h2>
      <p>Abuja (the Federal Capital Territory) has some of the best IJMB study centres in Nigeria. With a highly educated population, competitive academic culture, and proximity to key federal institutions, IJMB in Abuja is a popular choice for students aiming at top universities.</p>

      <h2>Why Choose an Abuja IJMB Centre?</h2>
      <ul>
        <li><strong>Strong academic environment:</strong> Centres in Abuja maintain high standards due to competitive student populations</li>
        <li><strong>Proximity to federal institutions:</strong> Easy access to federal universities in and around the FCT</li>
        <li><strong>Well-resourced centres:</strong> Many Abuja centres have science labs, libraries, and hostel facilities</li>
        <li><strong>Regular supervision:</strong> ABU Zaria maintains oversight of centres in the North-Central zone</li>
      </ul>

      <h2>Areas With IJMB Centres in Abuja FCT</h2>
      <ul>
        <li><strong>Garki:</strong> Several established centres, good transport links</li>
        <li><strong>Wuse:</strong> Commercial hub area, popular with students from various parts of the FCT</li>
        <li><strong>Gwagwalada:</strong> Home to University of Abuja — ideal for students targeting UNIABUJA</li>
        <li><strong>Nyanya/Karu:</strong> Affordable boarding options available, large student population</li>
        <li><strong>Kubwa:</strong> Growing residential area with newer IJMB centres</li>
        <li><strong>Bwari:</strong> Quieter environment, suited for students who prefer less urban settings</li>
      </ul>

      <h2>What Are the Fees for IJMB in Abuja?</h2>
      <p>Due to the higher cost of living in Abuja, IJMB programme fees tend to be slightly higher than in other Nigerian cities:</p>
      <ul>
        <li><strong>Registration Form:</strong> ₦10,000 (standard nationwide)</li>
        <li><strong>Acceptance Fee:</strong> ₦25,000 – ₦40,000</li>
        <li><strong>Tuition Fee:</strong> ₦350,000 per session</li>
        <li><strong>Hostel:</strong> ₦150,000 per session</li>
      </ul>

      <h2>Universities Close to Abuja That Accept IJMB</h2>
      <ul>
        <li><strong>University of Abuja (UNIABUJA)</strong> — direct entry into 200 level, located in Gwagwalada</li>
        <li><strong>Ahmadu Bello University (ABU), Zaria</strong> — approximately 2 hours from Abuja</li>
        <li><strong>Nasarawa State University, Keffi</strong> — approximately 45 minutes from Abuja</li>
        <li><strong>Federal University, Lafia</strong> — accepts IJMB, about 2 hours away</li>
        <li><strong>Bingham University, Karu</strong> — private university in the FCT region</li>
      </ul>

      <h2>How to Register for IJMB in Abuja</h2>
      <ol>
        <li>Visit our <a href="/register" class="text-primary font-medium underline">online registration portal</a> and create an account</li>
        <li>Fill in your personal and academic details</li>
        <li>Select your preferred subject combination</li>
        <li>Pay the ₦10,000 registration form fee securely online</li>
        <li>You will be contacted with your centre assignment and resumption date</li>
      </ol>
      <p>You do not need to physically visit any office to start — the entire registration process is online. Once your form fee is confirmed, your admission letter will be processed and sent to you via email.</p>

      <h2>Can I Do IJMB in Abuja and Apply to Universities Outside Abuja?</h2>
      <p>Absolutely. Your study centre location has no effect on which universities you can apply to. A student registered in Abuja can apply for direct entry admission at UNILAG in Lagos, ABU in Zaria, UNIBEN in Benin, or any other university in Nigeria. Your IJMB result is a national qualification.</p>
    `,
    author: 'Admissions Office',
    date: '2026-04-09',
    image: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&q=80&w=800',
    tags: ['Abuja', 'Study Centres', 'FCT', 'IJMB']
  },
  {
    id: '16',
    slug: 'ijmb-result-checker-how-to-check',
    title: 'IJMB Result Checker 2026: How to Check Your IJMB Result',
    excerpt: 'Waiting for your IJMB results? Learn how IJMB results are released, how to check your result online and at your centre, what the result slip looks like, and what to do if there is an error.',
    content: `
      <h2>When Are IJMB Results Released?</h2>
      <p>IJMB examinations are conducted by <strong>Ahmadu Bello University (ABU), Zaria</strong> typically between <strong>April and June</strong> each year. Results are usually released <strong>3 to 5 months after</strong> the final examination — so candidates can expect their results between <strong>September and November</strong> of the same year.</p>
      <p>The exact release date varies each session. ABU does not always announce a specific date in advance, so candidates should check regularly through the channels below.</p>

      <h2>How to Check Your IJMB Result</h2>

      <h3>Method 1: Check at Your Study Centre</h3>
      <p>The most reliable way to get your IJMB result is through your <strong>registered study centre</strong>. Once ABU Zaria releases results, centres receive official result slips for their registered candidates. Your centre administrator will notify you when results arrive.</p>
      <p>You will need to visit the centre in person with:</p>
      <ul>
        <li>Your original registration slip or student ID</li>
        <li>A valid means of identification</li>
      </ul>

      <h3>Method 2: Visit ABU Zaria IJMB Office Directly</h3>
      <p>If you cannot reach your centre, you can visit the <strong>ABU Zaria IJMB division</strong> directly with your original registration documents. This is useful if your centre has closed or changed hands since you registered.</p>

      <h3>Method 3: Online Result Checker (Where Available)</h3>
      <p>ABU Zaria periodically releases results through an online portal. When available, you will need:</p>
      <ul>
        <li>Your IJMB registration number (found on your registration slip)</li>
        <li>Your surname</li>
        <li>Your examination year</li>
      </ul>
      <p>Check the official ABU Zaria website and announcements for the current online checker link. Be cautious of unofficial websites claiming to offer result checking — always use official channels.</p>

      <h2>What Does an IJMB Result Slip Look Like?</h2>
      <p>An authentic IJMB result slip will show:</p>
      <ul>
        <li>Your full name and registration number</li>
        <li>Your three subject grades (e.g., A, B, C)</li>
        <li>Your corresponding points (e.g., 5, 4, 3 = 12 total)</li>
        <li>The ABU Zaria official stamp and signature</li>
        <li>The examination session (e.g., 2025/2026)</li>
      </ul>
      <p>Anything without the ABU Zaria seal is not an official IJMB result.</p>

      <h2>What if My Result Has an Error?</h2>
      <p>Result errors (wrong name, missing grades, or incorrect score) do occur and can be corrected. If you notice an error:</p>
      <ol>
        <li>Do not use the erroneous result for any university application</li>
        <li>Visit your study centre with your original registration documents</li>
        <li>Your centre will escalate the correction to ABU Zaria on your behalf</li>
        <li>Corrections can take 4–8 weeks — start early to avoid delays in your admission process</li>
      </ol>

      <h2>What if My Result is Not Released?</h2>
      <p>Occasionally, results for specific candidates are withheld due to examination malpractice investigations, incomplete payments, or administrative issues. If your result is not included in the batch release:</p>
      <ul>
        <li>Contact your study centre immediately</li>
        <li>Ensure all centre fees are fully paid — outstanding fees sometimes delay result release</li>
        <li>If malpractice is alleged, attend any ABU hearing notices promptly</li>
      </ul>

      <h2>Can I Use My Result Slip Immediately for University Application?</h2>
      <p>Yes. A signed and stamped IJMB result slip is sufficient for the JAMB Direct Entry process and most university screenings. However, for <strong>final matriculation</strong> at your chosen university, you will eventually need your <strong>original IJMB certificate</strong>, which is issued separately (and may take additional months to arrive).</p>
    `,
    author: 'Registrar',
    date: '2026-04-09',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    tags: ['Results', 'Result Checker', 'IJMB', 'ABU Zaria']
  },
  {
    id: '17',
    slug: 'ijmb-for-law-universities-requirements',
    title: 'IJMB for Law 2026: Universities That Accept IJMB and Score Requirements',
    excerpt: 'Can you study Law with IJMB? Absolutely. Find out which law schools in Nigeria accept IJMB, what subject combination to use, the minimum scores required, and tips for getting into a top Nigerian law faculty.',
    content: `
      <h2>Is Law Possible Through IJMB?</h2>
      <p>Yes — many of Nigeria's best law faculties accept IJMB A-Level results for Direct Entry admission into 200 Level LLB. Law is one of the most competitive courses in Nigeria regardless of entry route, but IJMB gives you a structured, reliable pathway that avoids the unpredictability of JAMB UTME.</p>

      <h2>IJMB Subject Combination for Law</h2>
      <p>For Law and related courses, the accepted IJMB subject combinations are:</p>
      <ul>
        <li><strong>Literature in English + Government + Economics</strong> (most widely accepted)</li>
        <li><strong>Literature in English + Government + CRS/IRS</strong></li>
        <li><strong>Literature in English + History + Government</strong></li>
      </ul>
      <p><strong>Important:</strong> <em>Literature in English</em> is a mandatory subject for Law in most Nigerian universities. Government is also strongly recommended. Ensure your O-Level results include Literature in English and at least one other Arts or Social Science subject.</p>

      <h2>O-Level Requirements for Law</h2>
      <p>To apply for Law at most universities via IJMB Direct Entry, your O-Level must include:</p>
      <ul>
        <li>English Language (credit)</li>
        <li>Literature in English (credit)</li>
        <li>Mathematics (credit)</li>
        <li>Government or History (credit)</li>
        <li>One other relevant subject (Economics, CRS, etc.) at credit level</li>
      </ul>

      <h2>Minimum IJMB Points for Law</h2>
      <p>Law is highly competitive — particularly at federal universities. Here are typical minimum scores:</p>
      <ul>
        <li><strong>University of Lagos (UNILAG) Law:</strong> 13–15 points</li>
        <li><strong>Ahmadu Bello University (ABU) Law:</strong> 12–14 points</li>
        <li><strong>University of Ilorin Law:</strong> 12–14 points</li>
        <li><strong>Obafemi Awolowo University (OAU) Law:</strong> 12–14 points</li>
        <li><strong>University of Ibadan Law:</strong> 13–15 points</li>
        <li><strong>University of Jos Law:</strong> 11–13 points</li>
        <li><strong>State Universities (Law):</strong> 9–12 points depending on institution</li>
      </ul>
      <p>Aim for <strong>at least 13 points</strong> if you are serious about gaining Law admission at a federal university. Anything above 13 gives you options across multiple institutions.</p>

      <h2>Federal Universities Accepting IJMB for Law</h2>
      <ul>
        <li>University of Lagos (UNILAG) — Faculty of Law</li>
        <li>Ahmadu Bello University (ABU), Zaria — Faculty of Law</li>
        <li>University of Ilorin (UNILORIN) — Faculty of Law</li>
        <li>Obafemi Awolowo University (OAU), Ile-Ife — Faculty of Law</li>
        <li>University of Ibadan (UI) — Faculty of Law</li>
        <li>University of Nigeria, Nsukka (UNN) — Faculty of Law</li>
        <li>University of Jos (UNIJOS) — Faculty of Law</li>
        <li>University of Benin (UNIBEN) — Faculty of Law</li>
        <li>University of Calabar (UNICAL) — Faculty of Law</li>
        <li>University of Maiduguri — Faculty of Law</li>
      </ul>

      <h2>Private Universities Accepting IJMB for Law</h2>
      <ul>
        <li>Afe Babalola University (ABUAD), Ado-Ekiti</li>
        <li>Babcock University, Ogun State</li>
        <li>Achievers University, Owo</li>
        <li>Elizade University, Ilara-Mokin</li>
        <li>Wesley University, Ondo</li>
      </ul>

      <h2>Nigerian Law School (NLS) and IJMB</h2>
      <p>After graduating from an LLB programme, you must attend the Nigerian Law School to qualify as a Barrister and Solicitor. The NLS accepts graduates from all accredited Nigerian law faculties — meaning an LLB gained through IJMB Direct Entry is fully recognised for NLS enrolment. Your route into law does not disadvantage you at the professional stage.</p>

      <h2>Tips for Law Aspirants</h2>
      <ul>
        <li>Score high in Literature — admissions officers value strong literary skills in Law candidates</li>
        <li>Read widely beyond the syllabus: newspapers, judgements, and legal commentary help sharpen analytical thinking</li>
        <li>Apply to multiple universities — Law is competitive enough that having backup choices is essential</li>
        <li>Some universities conduct Law-specific aptitude tests for DE candidates — prepare for these</li>
      </ul>
    `,
    author: 'Academic Affairs',
    date: '2026-04-09',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
    tags: ['Law', 'LLB', 'Direct Entry', 'IJMB']
  },
  {
    id: '11',
    slug: 'ijmb-in-anambra-state',
    title: 'IJMB in Anambra State 2026 – Centres, Fees & How to Register',
    excerpt: 'Complete guide to IJMB registration in Anambra State. Find accredited IJMB study centres in Awka and Onitsha, registration fees, requirements, and how to apply online.',
    content: `
      <h2>IJMB in Anambra State 2026</h2>
      <p>Anambra State students can now register for the <strong>Interim Joint Matriculation Board (IJMB)</strong> programme through the official Anambra City Centre and gain <strong>direct entry admission into 200 level</strong> without writing UTME. This guide covers everything you need to know about IJMB in Anambra — centres, fees, requirements, and how to register online.</p>

      <h2>IJMB Study Centres in Anambra State</h2>
      <p>The following IJMB accredited study centres are available in Anambra State:</p>
      <ul>
        <li><strong>Anambra City Centre</strong> – Awka (State Capital)</li>
        <li><strong>Onitsha Study Centre</strong> – Onitsha</li>
      </ul>
      <p>These centres are affiliated with Ahmadu Bello University (ABU) Zaria and are fully approved by the Federal Government of Nigeria.</p>

      <h2>IJMB Registration Requirements in Anambra</h2>
      <p>To register for IJMB in Anambra State, you need:</p>
      <ul>
        <li>Minimum of 5 O-Level credits (WAEC, NECO, GCE, or NABTEB) including English Language and Mathematics</li>
        <li>Awaiting O-Level results is also accepted</li>
        <li>Valid passport photograph</li>
        <li>Valid means of identification (birth certificate, national ID, or student ID)</li>
        <li>Form fee payment receipt</li>
      </ul>

      <h2>IJMB Fees in Anambra State 2026</h2>
      <table>
        <thead><tr><th>Fee Type</th><th>Amount</th></tr></thead>
        <tbody>
          <tr><td>Application/Form Fee</td><td>₦10,000</td></tr>
          <tr><td>Tuition Fee (per session)</td><td>₦350,000</td></tr>
          <tr><td>Hostel Accommodation (optional)</td><td>₦150,000</td></tr>
        </tbody>
      </table>
      <p><em>Note: Fees may vary slightly by centre. Contact the Anambra City Centre directly for the most up-to-date fee schedule.</em></p>

      <h2>Popular IJMB Subject Combinations in Anambra</h2>
      <p>Students from Anambra commonly register for the following IJMB subject combinations:</p>
      <ul>
        <li><strong>Medicine &amp; Pharmacy:</strong> Biology, Chemistry, Physics</li>
        <li><strong>Engineering:</strong> Mathematics, Physics, Chemistry</li>
        <li><strong>Law &amp; Social Sciences:</strong> Government, Economics, Literature</li>
        <li><strong>Accounting &amp; Business:</strong> Economics, Accounting, Mathematics</li>
        <li><strong>Education:</strong> Varies by teaching subject</li>
      </ul>

      <h2>How to Register for IJMB in Anambra Online</h2>
      <ol>
        <li>Visit <strong>www.ijmb.info</strong> and click "Register Now"</li>
        <li>Create an account with your email address</li>
        <li>Fill in your personal and academic details</li>
        <li>Select <strong>Anambra City Centre</strong> as your preferred study centre</li>
        <li>Choose your subject combination</li>
        <li>Pay the form fee of <strong>₦10,000</strong> via Paystack (card, bank transfer, or USSD)</li>
        <li>Download and print your registration slip</li>
      </ol>

      <h2>Universities Near Anambra That Accept IJMB</h2>
      <p>Students from Anambra who complete the IJMB programme can gain direct entry into universities nearby, including:</p>
      <ul>
        <li>Nnamdi Azikiwe University (NAU), Awka</li>
        <li>Chukwuemeka Odumegwu Ojukwu University (COOU)</li>
        <li>Paul University, Awka</li>
        <li>Madonna University, Okija</li>
        <li>University of Nigeria, Nsukka (UNN)</li>
        <li>All federal and state universities across Nigeria</li>
      </ul>

      <h2>Frequently Asked Questions – IJMB Anambra</h2>
      <h3>Can I register for IJMB online from Anambra?</h3>
      <p>Yes. Registration is done entirely online at <strong>www.ijmb.info</strong>. You do not need to visit any office to register.</p>

      <h3>Is the Anambra City Centre accredited?</h3>
      <p>Yes. The Anambra City Centre is an officially accredited IJMB study centre affiliated with Ahmadu Bello University Zaria.</p>

      <h3>When does the IJMB programme start in Anambra?</h3>
      <p>The 2026/2027 academic session typically begins between October and December. Register early to secure your spot.</p>
    `,
    author: 'IJMB Admin',
    date: '2026-04-13',
    image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=800',
    tags: ['Anambra', 'IJMB Centres', 'South-East', 'Registration']
  },
  {
    id: '12',
    slug: 'ijmb-grading-system-point-calculation',
    title: 'IJMB Grading System & Point Calculation 2026 – What Score Do You Need?',
    excerpt: 'Understand the IJMB grading system and how ABU Zaria calculates your points. Learn what scores you need for Medicine, Law, Engineering and other courses.',
    content: `
      <h2>IJMB Grading System Explained</h2>
      <p>The IJMB examination is conducted by <strong>Ahmadu Bello University (ABU) Zaria</strong>. Results are graded on a points system similar to the UK A-Level grading format. Understanding this grading system is essential for knowing whether your score qualifies you for your preferred university and course.</p>

      <h2>IJMB Grade Points Table</h2>
      <table>
        <thead><tr><th>Grade</th><th>Points</th><th>Percentage Range</th></tr></thead>
        <tbody>
          <tr><td>A</td><td>5</td><td>70% and above</td></tr>
          <tr><td>B</td><td>4</td><td>60% – 69%</td></tr>
          <tr><td>C</td><td>3</td><td>50% – 59%</td></tr>
          <tr><td>D</td><td>2</td><td>45% – 49%</td></tr>
          <tr><td>E</td><td>1</td><td>40% – 44%</td></tr>
          <tr><td>F</td><td>0</td><td>Below 40%</td></tr>
        </tbody>
      </table>
      <p>Your total IJMB score is the sum of points from your <strong>3 subject examinations</strong>, giving a maximum of <strong>15 points</strong>.</p>

      <h2>Minimum Points Required by Course</h2>
      <table>
        <thead><tr><th>Course</th><th>Minimum Points</th><th>Typical Requirement</th></tr></thead>
        <tbody>
          <tr><td>Medicine &amp; Surgery (MBBS)</td><td>12</td><td>ABB or better</td></tr>
          <tr><td>Pharmacy (B.Pharm)</td><td>10</td><td>BBB or better</td></tr>
          <tr><td>Law (LLB)</td><td>9</td><td>BBC or better</td></tr>
          <tr><td>Engineering (all types)</td><td>9</td><td>BBC or better</td></tr>
          <tr><td>Computer Science</td><td>8</td><td>BCC or better</td></tr>
          <tr><td>Accounting / Business Admin</td><td>7</td><td>BCC or CCC</td></tr>
          <tr><td>Education (various)</td><td>6</td><td>CCC or better</td></tr>
          <tr><td>Arts &amp; Humanities</td><td>6</td><td>CCC or better</td></tr>
          <tr><td>Social Sciences</td><td>6</td><td>CCC or better</td></tr>
        </tbody>
      </table>
      <p><em>Note: Exact requirements vary by university. Always confirm with your target institution's Direct Entry cut-off points.</em></p>

      <h2>How IJMB Points Are Calculated</h2>
      <p>You sit examinations in <strong>3 subjects</strong>. Each subject is graded A–F and assigned points (5–0). Your total is out of 15.</p>
      <p><strong>Example:</strong> A student who scores A in Biology (5), B in Chemistry (4), and C in Physics (3) has a total of <strong>12 points</strong> — qualifying for Medicine at most universities.</p>

      <h2>IJMB Result Checker</h2>
      <p>IJMB results are released by ABU Zaria after the annual examinations. To check your result:</p>
      <ol>
        <li>Visit the official ABU Zaria IJMB results portal</li>
        <li>Enter your examination number and date of birth</li>
        <li>Your result slip will be displayed with individual subject grades and total points</li>
      </ol>
      <p>Results are also sent to your registered email address once released.</p>

      <h2>What Happens if You Fail IJMB?</h2>
      <p>If you do not achieve the minimum points required, you can:</p>
      <ul>
        <li><strong>Re-sit</strong> the IJMB examinations in the next session</li>
        <li>Apply to universities with lower cut-off points</li>
        <li>Consider a different course with lower entry requirements</li>
      </ul>
      <p>There is no limit to how many times you can sit the IJMB examinations.</p>
    `,
    author: 'Academic Affairs',
    date: '2026-04-13',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    tags: ['IJMB Grades', 'Point System', 'Results', 'Direct Entry']
  },
  {
    id: '13',
    slug: 'ijmb-direct-entry-medicine-2026',
    title: 'IJMB for Medicine 2026 – How to Get Into MBBS Through Direct Entry',
    excerpt: 'Can you study Medicine through IJMB direct entry? Yes. Learn the subject combinations, minimum points, and universities accepting IJMB for MBBS in Nigeria.',
    content: `
      <h2>Can You Study Medicine Through IJMB?</h2>
      <p>Yes — IJMB is one of the most reliable routes into <strong>Medicine (MBBS)</strong> in Nigeria through Direct Entry. Many universities accept IJMB candidates for 200-level Medicine, provided you achieve the required points in the right subject combination.</p>

      <h2>IJMB Subject Combination for Medicine</h2>
      <p>For Medicine and Surgery (MBBS), you must take:</p>
      <ul>
        <li><strong>Biology</strong></li>
        <li><strong>Chemistry</strong></li>
        <li><strong>Physics</strong> (some universities accept Mathematics in place of Physics)</li>
      </ul>
      <p>This combination is also required for Pharmacy, Nursing, Veterinary Medicine, and other health sciences.</p>

      <h2>Minimum IJMB Points for Medicine</h2>
      <p>Most universities require a minimum of <strong>12 points</strong> (equivalent to ABB) for Medicine. Some top federal universities require <strong>13–15 points</strong>. The more competitive the university, the higher the cut-off.</p>

      <h2>Universities Accepting IJMB for Medicine in Nigeria</h2>
      <h3>Federal Universities</h3>
      <ul>
        <li>University of Lagos (UNILAG) – Cut-off: 12 points</li>
        <li>University of Ibadan (UI) – Cut-off: 13 points</li>
        <li>Ahmadu Bello University (ABU), Zaria – Cut-off: 12 points</li>
        <li>University of Nigeria, Nsukka (UNN) – Cut-off: 12 points</li>
        <li>Obafemi Awolowo University (OAU), Ile-Ife – Cut-off: 13 points</li>
        <li>University of Benin (UNIBEN) – Cut-off: 12 points</li>
        <li>Nnamdi Azikiwe University (NAU), Awka – Cut-off: 12 points</li>
      </ul>
      <h3>State Universities</h3>
      <ul>
        <li>Lagos State University (LASU)</li>
        <li>Ambrose Alli University (AAU), Ekpoma</li>
        <li>Delta State University (DELSU), Abraka</li>
      </ul>
      <h3>Private Universities</h3>
      <ul>
        <li>Babcock University, Ilishan-Remo</li>
        <li>Afe Babalola University (ABUAD), Ado-Ekiti</li>
        <li>Bingham University, Karu</li>
        <li>Bowen University, Iwo</li>
      </ul>

      <h2>Tips to Score High in IJMB Medicine Subjects</h2>
      <ul>
        <li>Start past question practice early — ABU Zaria past questions are available online</li>
        <li>Focus on understanding concepts, not just memorisation</li>
        <li>Attend all lectures and practical sessions at your study centre</li>
        <li>Form study groups with fellow students in the same combination</li>
        <li>Aim for at least 70% in each subject (grade A = 5 points)</li>
      </ul>

      <h2>How to Register for IJMB Medicine Combination</h2>
      <ol>
        <li>Visit <strong>www.ijmb.info</strong> and create an account</li>
        <li>Select your preferred IJMB study centre</li>
        <li>Choose the <strong>Biology/Chemistry/Physics</strong> subject combination</li>
        <li>Pay the form fee (₦10,000) and tuition fee</li>
        <li>Begin classes at the start of the academic session</li>
      </ol>
    `,
    author: 'Academic Affairs',
    date: '2026-04-13',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=800',
    tags: ['Medicine', 'MBBS', 'Direct Entry', 'IJMB']
  }
];
