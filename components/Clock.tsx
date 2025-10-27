import React from 'react';

interface ClockProps {
  date: Date;
}

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const Clock: React.FC<ClockProps> = ({ date }) => {
  return (
    <div className="text-center text-stone-800 dark:text-stone-100">
      <h1 className="text-6xl md:text-8xl font-bold tracking-wider">
        {timeFormatter.format(date)}
      </h1>
      <p className="text-lg md:text-2xl text-stone-600 dark:text-stone-400 mt-2">
        {dateFormatter.format(date)}
      </p>
    </div>
  );
};

export default Clock;