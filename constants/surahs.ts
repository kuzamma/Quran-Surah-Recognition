export interface Surah {
    id: number;
    nameArabic: string;
    nameEnglish: string;
    transliteration: string;
    meaning: string;
    verses: number;
    audioUrl: string;
  }
  
  const surahs: Surah[] = [
    {
      id: 1,
      nameArabic: 'الفاتحة',
      nameEnglish: 'Al-Fatiha',
      transliteration: 'Al-Fātiḥah',
      meaning: 'The Opening',
      verses: 7,
      audioUrl: 'https://server8.mp3quran.net/afs/001.mp3',
    },
    {
      id: 2,
      nameArabic: 'الناس',
      nameEnglish: 'Al-Nas',
      transliteration: 'An-Nās',
      meaning: 'Mankind',
      verses: 6,
      audioUrl: 'https://server8.mp3quran.net/afs/114.mp3',
    },
    {
      id: 3,
      nameArabic: 'الفلق',
      nameEnglish: 'Al-Falaq',
      transliteration: 'Al-Falaq',
      meaning: 'The Daybreak',
      verses: 5,
      audioUrl: 'https://server8.mp3quran.net/afs/113.mp3',
    },
    {
      id: 4,
      nameArabic: 'الإخلاص',
      nameEnglish: 'Al-Ikhlas',
      transliteration: 'Al-Ikhlāṣ',
      meaning: 'Sincerity',
      verses: 4,
      audioUrl: 'https://server8.mp3quran.net/afs/112.mp3',
    },
    {
      id: 5,
      nameArabic: 'الكوثر',
      nameEnglish: 'Al-Kausar',
      transliteration: 'Al-Kawthar',
      meaning: 'Abundance',
      verses: 3,
      audioUrl: 'https://server8.mp3quran.net/afs/108.mp3',
    },
    {
      id: 6,
      nameArabic: 'العصر',
      nameEnglish: 'Al-As\'r',
      transliteration: 'Al-\'Asr',
      meaning: 'The Time/The Declining Day',
      verses: 3,
      audioUrl: 'https://server8.mp3quran.net/afs/103.mp3',
    },
  ];
  
  export default surahs;