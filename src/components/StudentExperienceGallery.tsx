import Image, { type StaticImageData } from 'next/image';
import outdoorStudy from '@/assets/02-ijmb-outdoor-group-study.png';
import libraryStudy from '@/assets/05-ijmb-library-study.png';
import sciencePractical from '@/assets/06-ijmb-science-practical.png';
import examRevision from '@/assets/07-ijmb-exam-revision.png';
import geographyStudy from '@/assets/10-ijmb-geography-field-study.png';
import studentPortrait from '@/assets/11-ijmb-student-learning-portrait.png';
import eveningStudy from '@/assets/12-ijmb-evening-study-at-home.png';
import computerLearning from '@/assets/13-ijmb-students-computer-learning.png';
import campusAfterRain from '@/assets/14-ijmb-students-after-rain.png';

const moments: Array<{ image: StaticImageData; title: string; featured?: boolean }> = [
  { image: outdoorStudy, title: 'Learning Together Outdoors', featured: true },
  { image: libraryStudy, title: 'Focused Study in the Library' },
  { image: sciencePractical, title: 'Learning Through Science Practicals' },
  { image: examRevision, title: 'Preparing for Exams Together' },
  { image: geographyStudy, title: 'Geography Field Study', featured: true },
  { image: studentPortrait, title: 'A Student Ready to Learn' },
  { image: eveningStudy, title: 'Evening Study at Home' },
  { image: computerLearning, title: 'Computer Learning for Students' },
  { image: campusAfterRain, title: 'Campus Life After the Rain', featured: true },
];

export default function StudentExperienceGallery() {
  return (
    <section className="section-padding relative overflow-hidden bg-[#09271b] text-white" aria-labelledby="student-experience-title">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(245,175,33,0.13),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(44,160,100,0.14),transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-9 max-w-2xl sm:mb-12">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-accent">The learning experience</p>
          <h2 id="student-experience-title" className="font-display text-4xl font-bold leading-tight sm:text-5xl">
            Learning happens everywhere.
          </h2>
          <p className="mt-4 text-base leading-7 text-white/[0.68] sm:text-lg">
            From classroom lessons and practical sessions to group revision and independent study, IJMB students build the knowledge and confidence needed for university.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {moments.map((moment, index) => (
            <figure
              key={moment.title}
              className={`${moment.featured ? 'col-span-2' : 'col-span-1'} group relative min-h-[11rem] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl shadow-black/10 sm:min-h-[14rem] ${index === 0 ? 'md:row-span-2 md:min-h-[29rem]' : ''}`}
            >
              <Image
                src={moment.image}
                alt={moment.title}
                fill
                placeholder="blur"
                sizes={moment.featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                className="object-cover transition duration-700 group-hover:scale-[1.035] motion-reduce:transition-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-3.5 font-heading text-sm font-extrabold leading-snug text-white sm:p-5 sm:text-base">
                {moment.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
