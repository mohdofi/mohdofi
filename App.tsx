import React, { useState, useEffect, useCallback } from 'react';
import Clock from './components/Clock';
import AlarmForm from './components/AlarmForm';
import AlarmAlert from './components/AlarmAlert';
import DarkModeToggle from './components/DarkModeToggle';
import { useAudio } from './hooks/useAudio';
import { RINGTONES } from './constants';

const App: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState<string | null>(null);
  const [alarmDate, setAlarmDate] = useState<string | null>(null);
  const [alarmMessage, setAlarmMessage] = useState('');
  const [ringtoneUrl, setRingtoneUrl] = useState(RINGTONES[0].url);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem('isDarkMode');
      // Check for 'dark' mode preference from OS
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return stored ? JSON.parse(stored) : prefersDark;
    }
    return false;
  });

  const { play, stop } = useAudio(ringtoneUrl);
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (!isAlarmActive || !alarmTime || !alarmDate || isRinging) return;
    
    const formatToYyyyMmDd = (date: Date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    const formattedCurrentDate = formatToYyyyMmDd(currentTime);
    const formattedCurrentTime = currentTime.toTimeString().slice(0, 5); // HH:mm

    if (formattedCurrentDate === alarmDate && formattedCurrentTime === alarmTime) {
      setIsRinging(true);
      play();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime, alarmTime, alarmDate, isAlarmActive, isRinging, play]);

  const handleSetAlarm = useCallback((date: string, time: string, message: string, newRingtoneUrl: string) => {
    setAlarmDate(date);
    setAlarmTime(time);
    setAlarmMessage(message);
    setRingtoneUrl(newRingtoneUrl);
    setIsAlarmActive(true);
  }, []);

  const handleClearAlarm = useCallback(() => {
    stop();
    setIsRinging(false);
    setIsAlarmActive(false);
    setAlarmTime(null);
    setAlarmDate(null);
    setAlarmMessage('');
  }, [stop]);
  
  const handleDismiss = useCallback(() => {
    handleClearAlarm();
  }, [handleClearAlarm]);
  
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans antialiased">
      <main className="w-full max-w-md mx-auto bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border border-stone-200 dark:border-slate-700 relative">
        <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
        <Clock date={currentTime} />
        <div className="border-t border-stone-200 dark:border-slate-600 my-8"></div>
        <AlarmForm
          onSet={handleSetAlarm}
          onClear={handleClearAlarm}
          isAlarmActive={isAlarmActive}
          activeAlarmTime={alarmTime}
          activeAlarmDate={alarmDate}
        />
      </main>
      {isRinging && <AlarmAlert message={alarmMessage} onDismiss={handleDismiss} />}
    </div>
  );
};

export default App;