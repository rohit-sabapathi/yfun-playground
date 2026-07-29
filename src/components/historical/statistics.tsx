import { useMemo } from 'react';

const StatBox = ({ label, value, compare }: { label: string, value: string, compare?: string }) => (
  <div className="bg-card border border-white/5 p-4 rounded-xl flex flex-col justify-between">
    <div className="text-sm text-muted-foreground mb-1">{label}</div>
    <div className="text-xl font-semibold tracking-tight">{value}</div>
    {compare && <div className="text-xs text-muted-foreground mt-2 border-t border-white/5 pt-2">S&P 500: {compare}</div>}
  </div>
);

interface StatsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  benchmarkData?: any[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function calcReturns(data: any[], periodLength: number) {
  if (data.length <= periodLength) return null;
  const start = data[0].close;
  const end = data[periodLength].close;
  return ((end - start) / start) * 100;
}

export function HistoricalStatistics({ data, benchmarkData }: StatsProps) {
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;
    
    let highest = data[0].high;
    let lowest = data[0].low;
    let sum = 0;

    for (const d of data) {
      if (d.high > highest) highest = d.high;
      if (d.low < lowest) lowest = d.low;
      sum += d.close;
    }

    const average = sum / data.length;
    
    const sortedCloses = [...data].sort((a, b) => a.close - b.close);
    const mid = Math.floor(sortedCloses.length / 2);
    const median = sortedCloses.length % 2 !== 0 ? sortedCloses[mid].close : (sortedCloses[mid - 1].close + sortedCloses[mid].close) / 2;

    const variance = data.reduce((acc, d) => acc + Math.pow(d.close - average, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);

    const dailyReturn = calcReturns(data, 1);
    const monthlyReturn = calcReturns(data, 21); // approx 21 trading days
    const yearlyReturn = calcReturns(data, 252); // approx 252 trading days
    const benchmarkYearlyReturn = benchmarkData ? calcReturns(benchmarkData, 252) : null;

    return { highest, lowest, average, median, stdDev, dailyReturn, monthlyReturn, yearlyReturn, benchmarkYearlyReturn };
  }, [data, benchmarkData]);

  if (!stats) return null;

  const formatPercent = (val: number | null) => {
    if (val === null) return "N/A";
    return (val >= 0 ? "+" : "") + val.toFixed(2) + "%";
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      <StatBox label="Highest" value={`$${stats.highest.toFixed(2)}`} />
      <StatBox label="Lowest" value={`$${stats.lowest.toFixed(2)}`} />
      <StatBox label="Average" value={`$${stats.average.toFixed(2)}`} />
      <StatBox label="Median" value={`$${stats.median.toFixed(2)}`} />
      <StatBox label="Std Dev" value={`$${stats.stdDev.toFixed(2)}`} />
      <StatBox label="Daily Ret" value={formatPercent(stats.dailyReturn)} />
      <StatBox label="Monthly Ret" value={formatPercent(stats.monthlyReturn)} />
      <StatBox label="Yearly Ret" 
               value={formatPercent(stats.yearlyReturn)} 
               compare={stats.benchmarkYearlyReturn ? formatPercent(stats.benchmarkYearlyReturn) : undefined} />
    </div>
  );
}
