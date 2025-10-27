import React, { useState } from 'react';
import { RINGTONES } from '../constants';
import type { Ringtone } from '../types';

interface AlarmFormProps {
  onSet: (date: string, time: string, message: string, ringtoneUrl: string) => void;
  onClear: () => void;
  isAlarmActive: boolean;
  activeAlarmTime: string | null;
  activeAlarmDate: string | null;
}

const formatToYyyyMmDd = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const AlarmForm: React.FC<AlarmFormProps> = ({ onSet, onClear, isAlarmActive, activeAlarmTime, activeAlarmDate }) => {
  const [date, setDate] = useState(() => formatToYyyyMmDd(new Date()));
  const [time, setTime] = useState('07:00');
  const [message, setMessage] = useState('');
  const [ringtoneUrl, setRingtoneUrl] = useState(RINGTONES[0].url);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    onSet(date, time, message, ringtoneUrl);
  };

  const displayDate = activeAlarmDate
    ? new Date(`${activeAlarmDate}T00:00:00`).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'long',
        day: 'numeric',
      })
    : '';

  if (isAlarmActive) {
    return (
      <div className="mt-8 text-center p-6 bg-amber-100/50 dark:bg-slate-800 rounded-lg border border-amber-200 dark:border-slate-700">
        <div className="flex items-center justify-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-700 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl text-amber-800 dark:text-amber-300">
            Alarm set for <span className="font-bold">{activeAlarmTime}</span> on <span className="font-bold">{displayDate}</span>
          </p>
        </div>
        <button
          onClick={onClear}
          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
        >
          Clear Alarm
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
       <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="date" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Alarm Date</label>
          <input
            type="date"
            id="date"
            value={date}
            min={formatToYyyyMmDd(new Date())}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-stone-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm dark:text-white"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="time" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Alarm Time</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-stone-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm dark:text-white"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Message (optional)</label>
        <textarea
          id="message"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Time to seize the day!"
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-stone-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm dark:text-white dark:placeholder-slate-400"
        />
      </div>
      <div>
        <label htmlFor="ringtone" className="block text-sm font-medium text-stone-700 dark:text-stone-300">Ringtone</label>
        <select
          id="ringtone"
          value={ringtoneUrl}
          onChange={(e) => setRingtoneUrl(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-slate-700 border-stone-300 dark:border-slate-600 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md dark:text-white"
        >
          {RINGTONES.map((ringtone: Ringtone) => (
            <option key={ringtone.name} value={ringtone.url}>{ringtone.name}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
      >
        Set Alarm
      </button>
    </form>
  );
};

export default AlarmForm;