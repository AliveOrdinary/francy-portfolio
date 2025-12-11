import Image from 'next/image';
import { getAboutPageData } from '../../lib/markdown';

export default function About() {
  const aboutData = getAboutPageData();
  
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 mb-16">
          <div className="md:w-3/5 space-y-12">
            <div>
              <p className="text-xl md:text-2xl leading-relaxed font-sans">
                {aboutData.bio}
              </p>
            </div>
            
            {aboutData.whatIDo && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-500">What I Do</h2>
                <p className="text-lg leading-relaxed">
                  {aboutData.whatIDo}
                </p>
              </div>
            )}
            
            {aboutData.experience && aboutData.experience.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-500">Where I&apos;ve Been</h2>
                <ul className="space-y-4">
                  {aboutData.experience.map((item, index) => (
                    <li key={index} className="text-lg border-l-2 border-primary pl-4">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {aboutData.achievements && aboutData.achievements.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest mb-6 text-gray-500">Achievements</h2>
                <div className="space-y-6">
                  {aboutData.achievements.map((achievement, index) => (
                    <div key={index} className="flex gap-8">
                      <div className="text-gray-500 font-mono">
                        {achievement.year}
                      </div>
                      <div className="text-lg font-medium">
                        {achievement.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="md:w-2/5">
            <div className="sticky top-24">
              {aboutData.profileImage && (
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gray-100">
                  <Image
                    src={aboutData.profileImage}
                    alt="Eldhose Kuriyan"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 