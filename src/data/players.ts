export type Player = {
  id: number;
  name: string;
  position: string;
  birthYear: number;
  jerseyNumber: number;
  /** Bazı isimler mevcut kulüp kayıtlarında henüz güncellenmemiş yer tutuculardır. */
  isPlaceholder?: boolean;
};

export const players: Player[] = [
  { id: 1, name: "Ahmet Tuna Barış", position: "Orta Sağ", birthYear: 2012, jerseyNumber: 9 },
  { id: 2, name: "Adnan Ege Gül", position: "Stoper", birthYear: 2015, jerseyNumber: 8 },
  { id: 3, name: "Akın Alkan", position: "Defans", birthYear: 2016, jerseyNumber: 3 },
  { id: 4, name: "Ali Kaan Sömek", position: "Sol Açık", birthYear: 2014, jerseyNumber: 3 },
  { id: 5, name: "Ali Osman Değirmenci", position: "Stoper", birthYear: 2014, jerseyNumber: 3 },
  { id: 6, name: "Ara Can Akkuş", position: "Stoper", birthYear: 2015, jerseyNumber: 3 },
  { id: 7, name: "Arda Başer", position: "Orta Sağ", birthYear: 2014, jerseyNumber: 3 },
  { id: 8, name: "Ata Yıldırım", position: "Stoper", birthYear: 2014, jerseyNumber: 3 },
  { id: 9, name: "Barış Aydın", position: "Sağ Bek", birthYear: 2012, jerseyNumber: 9 },
  { id: 10, name: "Bayram Ak", position: "Orta Sağ", birthYear: 2012, jerseyNumber: 9 },
  { id: 11, name: "Birdal Bozoğlu", position: "Kaleci", birthYear: 2013, jerseyNumber: 9 },
  { id: 12, name: "Çağlar Aras Uygun", position: "Sağ Açık", birthYear: 2015, jerseyNumber: 9 },
  { id: 13, name: "Burak Dizdar", position: "Forvet", birthYear: 2013, jerseyNumber: 9 },
  { id: 14, name: "Cem Usar Şevik", position: "Kaleci", birthYear: 2012, jerseyNumber: 9 },
  { id: 15, name: "Çınar Uysal", position: "Forvet", birthYear: 2013, jerseyNumber: 9 },
  { id: 16, name: "Doruk Ege Doylan", position: "Sol Bek", birthYear: 2013, jerseyNumber: 9 },
  { id: 17, name: "Emir Taha Ejder", position: "Sağ Bek", birthYear: 2012, jerseyNumber: 9 },
  { id: 18, name: "Oyuncu-1", position: "Sağ Bek", birthYear: 2012, jerseyNumber: 9, isPlaceholder: true },
  { id: 19, name: "Oyuncu-2", position: "Sağ Bek", birthYear: 2012, jerseyNumber: 9, isPlaceholder: true },
  { id: 20, name: "Oyuncu-3", position: "Sağ Bek", birthYear: 2012, jerseyNumber: 9, isPlaceholder: true },
  { id: 21, name: "Oyuncu-4", position: "Sağ Bek", birthYear: 2012, jerseyNumber: 9, isPlaceholder: true },
  { id: 22, name: "Oyuncu-5", position: "Sağ Bek", birthYear: 2012, jerseyNumber: 9, isPlaceholder: true },
  { id: 23, name: "Oyuncu-6", position: "Sağ Bek", birthYear: 2012, jerseyNumber: 9, isPlaceholder: true },
  { id: 24, name: "Oyuncu-7", position: "Sağ Bek", birthYear: 2012, jerseyNumber: 9, isPlaceholder: true },
  { id: 25, name: "Oyuncu-8", position: "Sağ Bek", birthYear: 2012, jerseyNumber: 9, isPlaceholder: true },
  { id: 26, name: "Oyuncu-9", position: "Sağ Bek", birthYear: 2012, jerseyNumber: 9, isPlaceholder: true },
  { id: 27, name: "Oyuncu-10", position: "Sağ Bek", birthYear: 2012, jerseyNumber: 9, isPlaceholder: true },
  { id: 28, name: "Oyuncu-11", position: "Sağ Bek", birthYear: 2012, jerseyNumber: 9, isPlaceholder: true },
  { id: 29, name: "Oyuncu-12", position: "Sağ Bek", birthYear: 2012, jerseyNumber: 9, isPlaceholder: true },
  { id: 30, name: "Oyuncu-13", position: "Sağ Bek", birthYear: 2012, jerseyNumber: 9, isPlaceholder: true },
  { id: 31, name: "Kuzey Kaan Arslan", position: "Kaleci", birthYear: 2013, jerseyNumber: 9 },
  { id: 32, name: "Oyuncu 14", position: "Kaleci", birthYear: 2013, jerseyNumber: 9, isPlaceholder: true },
  { id: 33, name: "Oyuncu 15", position: "Kaleci", birthYear: 2013, jerseyNumber: 9, isPlaceholder: true },
  { id: 34, name: "Mehmet Eymen Kalender", position: "Stoper", birthYear: 2012, jerseyNumber: 9 },
  { id: 35, name: "Mehmet Miraç Şimşek", position: "Stoper", birthYear: 2015, jerseyNumber: 9 },
  { id: 36, name: "Mehmet Zeki Demir", position: "Stoper", birthYear: 2014, jerseyNumber: 9 },
  { id: 37, name: "Mert Turgut", position: "Stoper", birthYear: 2015, jerseyNumber: 9 },
  { id: 38, name: "Muhammet Ali Zeren", position: "Stoper", birthYear: 2014, jerseyNumber: 9 },
  { id: 39, name: "Mustafa Karaboğa", position: "Kaleci", birthYear: 2015, jerseyNumber: 9 },
  { id: 40, name: "Onur Orhan", position: "Orta Sağ", birthYear: 2014, jerseyNumber: 9 },
  { id: 41, name: "Özcan Emir Karadağ", position: "Orta Sağ", birthYear: 2015, jerseyNumber: 9 },
  { id: 42, name: "Poyraz Çetin (Sincap)", position: "Orta Sağ", birthYear: 2013, jerseyNumber: 9 },
  { id: 43, name: "Poyraz Emir Aydın", position: "Sol Açık", birthYear: 2013, jerseyNumber: 9 },
  { id: 44, name: "Ramazan Efe Kaya", position: "Forvet", birthYear: 2013, jerseyNumber: 9 },
  { id: 45, name: "Turgut Efe Örnek", position: "Orta Sağ", birthYear: 2013, jerseyNumber: 9 },
  { id: 46, name: "Yusuf Aras Demir", position: "Sol Açık", birthYear: 2013, jerseyNumber: 9 },
  { id: 47, name: "Uras Yaman", position: "Forvet", birthYear: 2013, jerseyNumber: 9 },
];
