import React from 'react';
import styles from './OperatingHours.module.css';

interface OperatingHoursProps {
  hours: string; 
}

// 曜日配列とマッピング
const daysOfWeek = ['月', '火', '水', '木', '金', '土', '日'];

// ヘルパー関数: 曜日範囲を解釈
const parseDays = (dayStr: string): string[] => {
  const result: string[] = [];
  const parts = dayStr.split('、').map(part => part.trim());

  parts.forEach(part => {
    if (part.includes('～')) {
      const [start, end] = part.split('～');
      const startIndex = daysOfWeek.indexOf(start);
      const endIndex = daysOfWeek.indexOf(end);
      if (startIndex !== -1 && endIndex !== -1) {
        for (let i = startIndex; i <= endIndex; i++) {
          result.push(daysOfWeek[i]);
        }
      }
    } else if (daysOfWeek.includes(part)) {
      result.push(part);
    }
  });

  return result;
};

const OperatingHours: React.FC<OperatingHoursProps> = ({ hours }) => {
  // If hours is not provided, return an empty table or a fallback message
  if (!hours) {
    return <div>営業時間情報がありません。</div>;
  }

  const today = daysOfWeek[new Date().getDay() - 1]; // 今日の曜日
  const hoursArray = hours.split('）').map(hour => hour.trim() + '）').filter(hour => hour.length > 1);

  // 営業時間を曜日ごとにマッピング
  const operatingHours = daysOfWeek.map((day) => {
    let time = '';

    hoursArray.forEach(hour => {
      const [dayPart, timePart] = hour.split(': ');
      const applicableDays = parseDays(dayPart);
      if (applicableDays.includes(day)) {
        time = timePart?.split('（')[0] || ''; 
      }
    });

    return { day, isOpen: !!time, time };
  });

  return (
    <div>
    <p>営業時間:</p>
    <div className={styles.operatingHours}>
      <table className={styles.table}>
        <thead>
          <tr>
            {daysOfWeek.map(day => (
              <th key={day} className={styles.tableHeader}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {operatingHours.map(({ day, isOpen, time }, index) => (
              <td
                key={index}
                className={`${styles.cell} ${day === today ? styles.today : ''}`}
              >
                {isOpen ? (
                  <div className={styles.openStatus} />
                ) : (
                    <div className={styles.timeText}>{isOpen ? `${time}` : '/'}</div>
                )}
                <div className={styles.timeText}>{isOpen ? `${time}` : ''}</div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default OperatingHours;
