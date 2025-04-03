'use client';

import Link from 'next/link';
import React, { useState, useEffect, useMemo, useCallback } from 'react';

interface MicroSeason {
  name: string;
  tamil: string;
  meaning: string;
  associations: string;
  startDate: string;
  endDate: string;
}

interface Season {
  main: string;
  tamil: string;
  romanized: string;
  meaning: string;
  color: string;
  microSeasons: MicroSeason[];
}

// Constants (do not recreate on each render)
const MONTH_MAP: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
};

const ABBR_MONTH_MAP: Record<string, string> = {
  jan: 'jan', feb: 'feb', mar: 'mar', apr: 'apr', may: 'may', jun: 'jun',
  jul: 'jul', aug: 'aug', sep: 'sep', oct: 'oct', nov: 'nov', dec: 'dec'
};

// Parse a date string ("mon day") into month and day
const parseDateString = (dateStr: string): { month: number; day: number } | null => {
  const parts = dateStr.split(' ');
  if (parts.length !== 2) return null;
  const month = MONTH_MAP[parts[0].toLowerCase()];
  const day = parseInt(parts[1]);
  if (!month || isNaN(day)) {
    console.error(`Invalid date string format: ${dateStr}`);
    return null;
  }
  return { month, day };
};

const TamilSeasons: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    checkMobile();
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 100);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkMobile]);

  // Get current date data once
  const { currentYear, currentMonth, currentDay } = useMemo(() => {
    const now = new Date();
    return {
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1,
      currentDay: now.getDate()
    };
  }, []);

  // Returns the day-of-year (UTC) for the given month and day
  const getDayOfYear = useCallback((month: number, day: number): number => {
    if (month < 1 || month > 12 || day < 1 || day > 31) return 0;
    const date = Date.UTC(currentYear, month - 1, day);
    const startOfYear = Date.UTC(currentYear, 0, 0);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor((date - startOfYear) / oneDay);
  }, [currentYear]);

  const isCurrentDateInRange = useCallback((startDateStr: string, endDateStr: string): boolean => {
    const start = parseDateString(startDateStr);
    const end = parseDateString(endDateStr);
    if (!start || !end) return false;
    const currentDayNum = getDayOfYear(currentMonth, currentDay);
    const startDayNum = getDayOfYear(start.month, start.day);
    const endDayNum = getDayOfYear(end.month, end.day);
    if (currentDayNum === 0 || startDayNum === 0 || endDayNum === 0) return false;
    // Handle year rollover
    return startDayNum > endDayNum
      ? (currentDayNum >= startDayNum || currentDayNum <= endDayNum)
      : (currentDayNum >= startDayNum && currentDayNum <= endDayNum);
  }, [currentMonth, currentDay, getDayOfYear]);

  const formatDateRange = useCallback((start: string, end: string): string => {
    const startParts = start.split(' ');
    const endParts = end.split(' ');
    if (startParts.length !== 2 || endParts.length !== 2) return "Invalid Date";
    const startMonthStr = startParts[0].toLowerCase();
    const endMonthStr = endParts[0].toLowerCase();
    const startDay = startParts[1];
    const endDay = endParts[1];
    const startAbbr = ABBR_MONTH_MAP[startMonthStr] || startMonthStr;
    const endAbbr = ABBR_MONTH_MAP[endMonthStr] || endMonthStr;
    return startMonthStr === endMonthStr
      ? `${startAbbr} ${startDay}-${endDay}`
      : `${startAbbr} ${startDay} - ${endAbbr} ${endDay}`;
  }, []);

  // Season data with Tamil context and colors
  const seasons: Season[] = useMemo(() => [
    {
      main: "spring",
      tamil: "இளவேனில்",
      romanized: "ilavenil",
      meaning: "young summer",
      color: "#388E3C",
      microSeasons: [
        { name: "chithirai", tamil: "சித்திரை", meaning: "spring month", associations: "jasmine blooms everywhere. you can smell it in the evening breeze. mango trees flowering in backyards.", startDate: "apr 14", endDate: "may 14" },
        { name: "vaigasi", tamil: "வைகாசி", meaning: "late spring", associations: "mangoes starting to ripen. first pickings are sour but we eat them anyway with salt and chili.", startDate: "may 15", endDate: "jun 14" }
      ]
    },
    {
      main: "summer",
      tamil: "முதுவேனில்",
      romanized: "mudhuvenil",
      meaning: "full summer",
      color: "#F57C00",
      microSeasons: [
        { name: "aani", tamil: "ஆனி", meaning: "early summer", associations: "so hot you can't step outside at noon. soil cracks in the fields. we sleep on terraces at night.", startDate: "jun 15", endDate: "jul 15" },
        { name: "aadi", tamil: "ஆடி", meaning: "peak summer", associations: "hottest days. old people pray for rain. children still playing cricket, somehow immune to the heat.", startDate: "jul 16", endDate: "aug 16" }
      ]
    },
    {
      main: "rainy",
      tamil: "கார்",
      romanized: "kaar",
      meaning: "monsoon",
      color: "#0277BD",
      microSeasons: [
        { name: "aavani", tamil: "ஆவணி", meaning: "start of monsoon", associations: "finally the rains come. that first rain smell on dry earth makes everyone happy. frogs appear from nowhere.", startDate: "aug 17", endDate: "sep 16" },
        { name: "purattasi", tamil: "புரட்டாசி", meaning: "heavy rains", associations: "rivers fill up. constant drumming of rain on tin roofs. children make paper boats in street puddles.", startDate: "sep 17", endDate: "oct 17" }
      ]
    },
    {
      main: "cool",
      tamil: "குளிர்",
      romanized: "kulir",
      meaning: "cool season",
      color: "#00796B",
      microSeasons: [
        { name: "aippasi", tamil: "ஐப்பசி", meaning: "lessening rains", associations: "rain slows down. morning dew on leaves. farmers happy with full water tanks and wells.", startDate: "oct 18", endDate: "nov 15" },
        { name: "karthigai", tamil: "கார்த்திகை", meaning: "early winter", associations: "perfect weather. not too hot, not too cold. temple festivals with lights and music everywhere.", startDate: "nov 16", endDate: "dec 15" }
      ]
    },
    {
      main: "early winter",
      tamil: "முன்பனி",
      romanized: "munpani",
      meaning: "early dew",
      color: "#512DA8",
      microSeasons: [
        { name: "margazhi", tamil: "மார்கழி", meaning: "winter dew", associations: "misty mornings. old women draw kolam patterns before sunrise. music concerts in sabhas.", startDate: "dec 16", endDate: "jan 13" },
        { name: "thai", tamil: "தை", meaning: "cold winter", associations: "pongal celebrations. sweet jaggery rice cooked in new clay pots. bulls decorated for jallikattu.", startDate: "jan 14", endDate: "feb 12" }
      ]
    },
    {
      main: "late winter",
      tamil: "பின்பனி",
      romanized: "pinpani",
      meaning: "late dew",
      color: "#33691E",
      microSeasons: [
        { name: "maasi", tamil: "மாசி", meaning: "winter ending", associations: "cold slowly leaves. grandmothers stop complaining about joint pains. birds more active at dawn.", startDate: "feb 13", endDate: "mar 14" },
        { name: "panguni", tamil: "பங்குனி", meaning: "spring transition", associations: "trees begin new leaves. weddings everywhere before summer heat comes. nights still pleasantly cool.", startDate: "mar 15", endDate: "apr 13" }
      ]
    }
  ], []);

  const currentSeason = useMemo(() => seasons.find(season =>
    season.microSeasons.some(micro => isCurrentDateInRange(micro.startDate, micro.endDate))
  ), [seasons, isCurrentDateInRange]);

  // Mobile view component
  const MobileSeasonView: React.FC<{ seasons: Season[] }> = React.memo(({ seasons }) => (
    <section className="space-y-12" aria-label="Tamil seasons in mobile view">
      {seasons.map(season => (
        <article key={season.main} className="mb-12">
          <header className="mb-6">
            <h3 className="text-lg font-medium tracking-wide text-gray-800 flex items-center">
              <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: season.color }} aria-hidden="true"></span>
              <span style={{ color: season.color }} aria-label={`${season.main} season`}>{season.main}</span>
            </h3>
            <div className="flex items-baseline mt-1">
              <span className="text-gray-500 text-sm">{season.tamil} · {season.romanized}</span>
              <span className="ml-2 text-xs text-gray-500 italic">({season.meaning})</span>
            </div>
          </header>
          <div className="space-y-6">
            {season.microSeasons.map(micro => {
              const isCurrent = isCurrentDateInRange(micro.startDate, micro.endDate);
              return (
                <article
                  key={micro.name}
                  className={`relative mb-8 ml-2 pl-4 pr-2 py-3 border-l-4 ${isCurrent ? '' : 'border-l-gray-100'}`}
                  style={isCurrent ? { borderLeftColor: season.color } : {}}
                >
                  <header className="flex items-center mb-1">
                    {isCurrent && (
                      <span className="mr-2 inline-block px-2 py-0.5 bg-teal-600 text-white text-xs rounded-full font-medium">now</span>
                    )}
                    <h4 className="text-base font-light text-gray-700">{micro.name}</h4>
                    <span className="ml-2 text-xs text-gray-500">({micro.tamil})</span>
                    <div className="ml-auto text-right">
                      <time dateTime={`${currentYear}-${MONTH_MAP[micro.startDate.split(' ')[0].toLowerCase()]}-${micro.startDate.split(' ')[1].padStart(2, '0')}/${currentYear}-${MONTH_MAP[micro.endDate.split(' ')[0].toLowerCase()]}-${micro.endDate.split(' ')[1].padStart(2, '0')}`} className="text-xs text-gray-400">
                        {formatDateRange(micro.startDate, micro.endDate)}
                      </time>
                    </div>
                  </header>
                  <p className="text-xs text-gray-500 mt-1 italic">{micro.meaning}</p>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed font-light">{micro.associations}</p>
                </article>
              );
            })}
          </div>
        </article>
      ))}
    </section>
  ));
  MobileSeasonView.displayName = 'MobileSeasonView';

  // Desktop view component
  const DesktopSeasonView: React.FC<{ seasons: Season[] }> = React.memo(({ seasons }) => (
    <section className="w-full" aria-label="Tamil seasons in tabular view">
      <div className="flex text-left text-xs text-gray-500 uppercase tracking-wider py-5 border-b border-gray-100" role="row">
        <div className="w-1/4 px-2" role="columnheader">season</div>
        <div className="w-1/5 px-2" role="columnheader">name</div>
        <div className="w-2/5 px-2" role="columnheader">associations</div>
        <div className="w-1/6 px-2 text-right" role="columnheader">date range</div>
      </div>
      <div className="divide-y divide-gray-100" role="rowgroup">
        {seasons.flatMap(season => [
          <div key={season.main} className="flex py-5 items-start" role="row">
            <div className="w-1/4 px-2" role="cell">
              <div className="font-medium text-gray-800 flex items-center">
                <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: season.color }} aria-hidden="true"></span>
                <span style={{ color: season.color }}>{season.main}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">{season.tamil} · {season.romanized}</div>
              <div className="text-xs text-gray-500 italic mt-1">{season.meaning}</div>
            </div>
            <div className="w-1/6 px-2" role="cell"></div>
            <div className="w-2/5 px-2" role="cell"></div>
            <div className="w-1/12 px-2" role="cell"></div>
          </div>,
          ...season.microSeasons.map(micro => {
            const isCurrent = isCurrentDateInRange(micro.startDate, micro.endDate);
            return (
              <div key={`${season.main}-${micro.name}`} className="relative flex py-5 items-center transition-colors duration-150 hover:bg-gray-50" role="row">
                {isCurrent && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-md" style={{ backgroundColor: season.color }}></div>
                )}
                <div className="w-1/4 px-2 pl-4 flex justify-end items-center" role="cell">
                  {isCurrent && (
                    <span className="inline-block px-2 py-0.5 bg-teal-600 text-white text-xs rounded-full font-medium">now</span>
                  )}
                </div>
                <div className="w-1/5 px-2 font-light" role="cell">
                  <div>
                    {micro.name} <span className="text-gray-500 text-sm">({micro.tamil})</span>
                    <div className="text-xs text-gray-500 italic mt-1">{micro.meaning}</div>
                  </div>
                </div>
                <div className="w-2/5 px-2 text-gray-600 text-sm font-light" role="cell">{micro.associations}</div>
                <div className="w-1/6 px-2 text-right text-xs text-gray-500" role="cell">
                  <time dateTime={`${currentYear}-${MONTH_MAP[micro.startDate.split(' ')[0].toLowerCase()]}-${micro.startDate.split(' ')[1].padStart(2, '0')}/${currentYear}-${MONTH_MAP[micro.endDate.split(' ')[0].toLowerCase()]}-${micro.endDate.split(' ')[1].padStart(2, '0')}`}>
                    {formatDateRange(micro.startDate, micro.endDate)}
                  </time>
                </div>
              </div>
            );
          })
        ])}
      </div>
    </section>
  ));
  DesktopSeasonView.displayName = 'DesktopSeasonView';

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
          our ancestors divided the year into &ldquo;perum pozhudhu&rdquo;(பெரும் பொழுது) – six major seasons – and further 
          into smaller periods marked not by dates on a calendar, but by what was happening in 
          nature... when certain birds arrived, when specific flowers bloomed, when the rains came.
        </p>
      </section>
      <section className="mb-16 md:mb-20">
        {isMobile ? <MobileSeasonView seasons={seasons} /> : <DesktopSeasonView seasons={seasons} />}
      </section>
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
          i&apos;d love to develop this idea further. if you have thoughts or suggestions, please leave a note on the <Link href="https://github.com/ganeshkumartk/tamilseasons" className="relative text-green-600 transition-colors duration-300 hover:text-green-800 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-green-600 after:origin-bottom-left after:transition-transform after:duration-300 hover:after:scale-x-100" aria-label="GitHub repository for Tamil Seasons">github repo</Link>.
        </p>
      </footer>
    </main>
  );
};

export default TamilSeasons;