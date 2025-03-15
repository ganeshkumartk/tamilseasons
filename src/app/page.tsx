'use client';

import Link from 'next/link';
import React, { useState, useEffect, useMemo, useCallback } from 'react';

interface MicroSeason {
  name: string;
  tamil: string;
  meaning: string;
  associations: string;
  approxDate: string;
}

interface Season {
  main: string;
  tamil: string;
  romanized: string;
  meaning: string;
  color: string; // Added color property
  microSeasons: MicroSeason[];
}

const TamilSeasons: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  // Optimize resize handler with useCallback
  const checkMobile = useCallback((): void => {
    setIsMobile(window.innerWidth < 768);
  }, []);
  
  useEffect(() => {
    checkMobile();
    
    // Throttled resize event handler
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkMobile]);

  // Get current date using useMemo to prevent recalculations
  const { month, day } = useMemo(() => {
    const now = new Date();
    return { 
      month: now.getMonth() + 1, 
      day: now.getDate() 
    };
  }, []);
  
  // Function to check if a date is current (approximately)
  const isCurrentDate = useCallback((dateStr: string): boolean => {
    const monthMap: Record<string, number> = {
      'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
      'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
    };
    
    const [monthStr, dayStr] = dateStr.split(' ');
    const approxMonth = monthMap[monthStr.toLowerCase()];
    const approxDay = parseInt(dayStr);
    
    if (approxMonth === month) {
      return Math.abs(approxDay - day) <= 3;
    }
    
    return false;
  }, [month, day]);

  // Season data with Tamil context and colors
  const seasons: Season[] = useMemo(() => [
    {
      main: "spring",
      tamil: "இளவேனில்",
      romanized: "ilavenil",
      meaning: "young summer",
      color: "#388E3C", // Updated for accessibility contrast
      microSeasons: [
        {
          name: "chithirai",
          tamil: "சித்திரை",
          meaning: "spring month",
          associations: "jasmine blooms everywhere. you can smell it in the evening breeze. mango trees flowering in backyards.",
          approxDate: "apr 15"
        },
        {
          name: "vaigasi",
          tamil: "வைகாசி",
          meaning: "late spring",
          associations: "mangoes starting to ripen. first pickings are sour but we eat them anyway with salt and chili.",
          approxDate: "may 15"
        }
      ]
    },
    {
      main: "summer",
      tamil: "முதுவேனில்",
      romanized: "mudhuvenil",
      meaning: "full summer",
      color: "#F57C00", // Updated for accessibility contrast
      microSeasons: [
        {
          name: "aani",
          tamil: "ஆனி",
          meaning: "early summer",
          associations: "so hot you can't step outside at noon. soil cracks in the fields. we sleep on terraces at night.",
          approxDate: "jun 16"
        },
        {
          name: "aadi",
          tamil: "ஆடி",
          meaning: "peak summer",
          associations: "hottest days. old people pray for rain. children still playing cricket, somehow immune to the heat.",
          approxDate: "jul 17"
        }
      ]
    },
    {
      main: "rainy",
      tamil: "கார்",
      romanized: "kaar",
      meaning: "monsoon",
      color: "#0277BD", // Updated for accessibility contrast
      microSeasons: [
        {
          name: "aavani",
          tamil: "ஆவணி",
          meaning: "start of monsoon",
          associations: "finally the rains come. that first rain smell on dry earth makes everyone happy. frogs appear from nowhere.",
          approxDate: "aug 18"
        },
        {
          name: "purattasi",
          tamil: "புரட்டாசி",
          meaning: "heavy rains",
          associations: "rivers fill up. constant drumming of rain on tin roofs. children make paper boats in street puddles.",
          approxDate: "sep 18"
        }
      ]
    },
    {
      main: "cool",
      tamil: "குளிர்",
      romanized: "kulir",
      meaning: "cool season",
      color: "#00796B", // Updated for accessibility contrast
      microSeasons: [
        {
          name: "aippasi",
          tamil: "ஐப்பசி",
          meaning: "lessening rains",
          associations: "rain slows down. morning dew on leaves. farmers happy with full water tanks and wells.",
          approxDate: "oct 18"
        },
        {
          name: "karthigai",
          tamil: "கார்த்திகை",
          meaning: "early winter",
          associations: "perfect weather. not too hot, not too cold. temple festivals with lights and music everywhere.",
          approxDate: "nov 17"
        }
      ]
    },
    {
      main: "early winter",
      tamil: "முன்பனி",
      romanized: "munpani",
      meaning: "early dew",
      color: "#512DA8", // Updated for accessibility contrast
      microSeasons: [
        {
          name: "margazhi",
          tamil: "மார்கழி",
          meaning: "winter dew",
          associations: "misty mornings. old women draw kolam patterns before sunrise. music concerts in sabhas.",
          approxDate: "dec 16"
        },
        {
          name: "thai",
          tamil: "தை",
          meaning: "cold winter",
          associations: "pongal celebrations. sweet jaggery rice cooked in new clay pots. bulls decorated for jallikattu.",
          approxDate: "jan 15"
        }
      ]
    },
    {
      main: "late winter",
      tamil: "பின்பனி",
      romanized: "pinpani",
      meaning: "late dew",
      color: "#33691E", // Updated for accessibility contrast
      microSeasons: [
        {
          name: "maasi",
          tamil: "மாசி",
          meaning: "winter ending",
          associations: "cold slowly leaves. grandmothers stop complaining about joint pains. birds more active at dawn.",
          approxDate: "feb 13"
        },
        {
          name: "panguni",
          tamil: "பங்குனி",
          meaning: "spring transition",
          associations: "trees begin new leaves. weddings everywhere before summer heat comes. nights still pleasantly cool.",
          approxDate: "mar 14"
        }
      ]
    }
  ], []);

  // Extract current season for quick reference
  const currentSeason = useMemo(() => {
    return seasons.find(season => 
      season.microSeasons.some(micro => isCurrentDate(micro.approxDate))
    );
  }, [seasons, isCurrentDate]);

  // Mobile view component with improved semantics
  const MobileSeasonView: React.FC = () => (
    <section className="space-y-12" aria-label="Tamil seasons in mobile view">
      {seasons.map((season, idx) => (
        <article key={idx} className="mb-12">
          <header className="mb-6">
            <h3 className="text-lg font-medium tracking-wide text-gray-800 flex items-center">
              <span 
                className="inline-block w-3 h-3 mr-2 rounded-full" 
                style={{ backgroundColor: season.color }}
                aria-hidden="true"
              ></span>
              <span style={{ color: season.color }} aria-label={`${season.main} season`}>{season.main}</span>
            </h3>
            <div className="flex items-baseline mt-1">
              <span className="text-gray-500 text-sm">{season.tamil} · {season.romanized}</span>
              <span className="ml-2 text-xs text-gray-500 italic">({season.meaning})</span>
            </div>
          </header>
          
          <div className="space-y-6">
            {season.microSeasons.map((micro, midx) => (
              <article key={midx} className="mb-8 ml-2 pl-3 border-l border-gray-100">
                <header className="flex items-baseline">
                  <h4 className="text-base font-light text-gray-700">
                    {micro.name}
                  </h4>
                  <span className="ml-2 text-xs text-gray-500">({micro.tamil})</span>
                  <div className="ml-auto text-right relative">
                    <time dateTime={`2023-${micro.approxDate.split(' ')[0]}-${micro.approxDate.split(' ')[1]}`} className="text-xs text-gray-500">
                      {micro.approxDate}
                    </time>
                    {isCurrentDate(micro.approxDate) && 
                      <span className="ml-2 inline-block px-2 py-0.5 bg-teal-600 text-white text-xs rounded-full">now</span>
                    }
                  </div>
                </header>
                <p className="text-xs text-gray-500 mt-1 italic">{micro.meaning}</p>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed font-light">{micro.associations}</p>
              </article>
            ))}
          </div>
        </article>
      ))}
    </section>
  );

  // Desktop view with improved semantics and accessibility
  const DesktopSeasonView: React.FC = () => (
    <section className="w-full" aria-label="Tamil seasons in tabular view">
      <div className="flex text-left text-xs text-gray-500 uppercase tracking-wider py-5 border-b border-gray-100" role="row">
        <div className="w-1/4 px-2" role="columnheader">season</div>
        <div className="w-1/6 px-2" role="columnheader">name</div>
        <div className="w-2/4 px-2" role="columnheader">associations</div>
        <div className="w-1/12 px-2 text-right" role="columnheader">date</div>
      </div>
      
      <div className="divide-y divide-gray-50" role="rowgroup">
        {seasons.flatMap((season, sIdx) => [
          // Season row
          <div key={`season-${sIdx}`} className="flex py-5 items-start" role="row">
            <div className="w-1/4 px-2" role="cell">
              <div className="font-medium text-gray-800 flex items-center">
                <span 
                  className="inline-block w-3 h-3 mr-2 rounded-full" 
                  style={{ backgroundColor: season.color }}
                  aria-hidden="true"
                ></span>
                <span style={{ color: season.color }}>{season.main}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">{season.tamil} · {season.romanized}</div>
              <div className="text-xs text-gray-500 italic mt-1">{season.meaning}</div>
            </div>
            <div className="w-1/6 px-2" role="cell"></div>
            <div className="w-2/4 px-2" role="cell"></div>
            <div className="w-1/12 px-2" role="cell"></div>
          </div>,
          
          // Micro-season rows
          ...season.microSeasons.map((micro, mIdx) => (
            <div key={`micro-${sIdx}-${mIdx}`} className="flex py-5 items-start hover:bg-gray-50 transition-colors duration-150" role="row">
              <div className="w-1/4 px-2" role="cell"></div>
              <div className="w-1/6 px-2 font-light" role="cell">
                {micro.name} <span className="text-gray-500 text-sm">({micro.tamil})</span>
                <div className="text-xs text-gray-500 italic mt-1">{micro.meaning}</div>
              </div>
              <div className="w-2/4 px-2 text-gray-600 text-sm font-light" role="cell">{micro.associations}</div>
              <div className="w-1/12 px-2 text-right text-sm text-gray-500 relative" role="cell">
                <time dateTime={`2023-${micro.approxDate.split(' ')[0]}-${micro.approxDate.split(' ')[1]}`}>
                  {micro.approxDate}
                </time>
                {isCurrentDate(micro.approxDate) && 
                  <span className="ml-2 inline-block px-2 py-0.5 bg-teal-600 text-white text-xs rounded-full">now</span>
                }
              </div>
            </div>
          ))
        ])}
      </div>
    </section>
  );

  return (
    <main className="max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-20 font-sans bg-white">
      <header className="mb-16 md:mb-20 text-center">
        <h1 className="text-xl md:text-2xl font-light tracking-wide mb-1 text-gray-800">a guide to understanding</h1>
        <h2 className="text-lg md:text-xl text-red-600 font-light tracking-wide">tamil seasons</h2>
        {currentSeason && (
          <p className="mt-3 text-sm text-gray-600">
            Currently in <span style={{ color: currentSeason.color }}>{currentSeason.main}</span> season ({currentSeason.tamil})
          </p>
        )}
      </header>

      <section className="mb-14 md:mb-16 text-gray-700 max-w-2xl mx-auto">
        <p className="mb-6 leading-relaxed text-sm md:text-base font-light">
          back in the old days, tamil people paid close attention to seasons. not like today&apos;s four 
          seasons, but six distinct periods that told farmers exactly when to plant and harvest. 
          it was life or death to know these rhythms.
        </p>
        <p className="mb-6 leading-relaxed text-sm md:text-base font-light">
          our ancestors divided the year into &ldquo;perum pozhudhu&rdquo; – six major seasons – and further 
          into smaller periods marked not by dates on a calendar, but by what was happening in 
          nature: when certain birds arrived, when specific flowers bloomed, when the rains came.
        </p>
      </section>

      <div className="mb-16 md:mb-20">
        {isMobile ? <MobileSeasonView /> : <DesktopSeasonView />}
      </div>

      <section className="mb-14 md:mb-16 text-gray-700 max-w-2xl mx-auto">
        <p className="mb-6 leading-relaxed text-sm md:text-base font-light">
          living in cities now, most of us don&apos;t need to know when the first rains will fall or 
          when to plant the rice seedlings. our food comes from shops, not fields we tend ourselves.
        </p>
        <p className="mb-6 leading-relaxed text-sm md:text-base font-light">
          but there&apos;s something beautiful about this old way of seeing time. instead of big chunks 
          like winter or summer, these small seasonal markers connect us to subtle changes happening 
          all around. the way a grandparent can tell you &ldquo;it&apos;s aadi now, the jackfruit will be sweet&rdquo; 
          or &ldquo;panguni has come, watch for the flame of the forest trees to bloom.&rdquo;
        </p>
      </section>

      <section className="mb-14 md:mb-16 text-gray-700 max-w-2xl mx-auto">
        <p className="leading-relaxed text-sm md:text-base font-light">
          follow these season changes now. notice the small shifts in light, temperature, 
          plants, and animals. reconnect with this ancient wisdom that our ancestors lived by.
        </p>
      </section>

      <footer className="pt-8 mt-16 border-t border-gray-100 text-center text-xs text-gray-400">
        <p className="max-w-xl mx-auto">
          i&apos;d love to develop this idea further. if you have thoughts or suggestions, 
          please leave a note on the <Link href="https://github.com/ganeshkumartk/tamilseasons" 
          className="relative text-green-600 transition-colors duration-300 hover:text-green-800 
          after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 
          after:left-0 after:bg-green-600 after:origin-bottom-left after:transition-transform 
          after:duration-300 hover:after:scale-x-100" aria-label="GitHub repository for Tamil Seasons">github repo</Link>.
        </p>
      </footer>
    </main>
  );
};

export default React.memo(TamilSeasons);