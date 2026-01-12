export interface Channel {
  id: string;
  name: string;
  logo: string;
  category: 'news' | 'entertainment' | 'music' | 'sports' | 'kids' | 'lifestyle';
  streams: string[];
  description?: string;
}

// Khmer TV Channels - Optimized for Cambodia
// Logos from Logopedia (logos.fandom.com)
export const channels: Channel[] = [
  // ========== NEWS ==========
  {
    id: 'tvk',
    name: 'TVK',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/f/f4/TVK.gif',
    category: 'news',
    streams: [
      'https://live.kh.malimarcdn.com/live/tvk.stream/playlist.m3u8',
    ],
    description: 'National Television of Kampuchea'
  },
  {
    id: 'eac-news',
    name: 'EAC News',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/b/bd/BTV_News.svg',
    category: 'news',
    streams: [
      'https://live-evg17.tv360.metfone.com.kh/LiveApp/streams/eacnews.m3u8',
    ],
    description: 'East Asia Channel News'
  },
  {
    id: 'pnn-tv',
    name: 'PNN',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/3/3c/People_Nation_Network.png',
    category: 'news',
    streams: [
      'https://live.kh.malimarcdn.com/live/pnntvhd.stream/playlist.m3u8',
      'https://live-evg13.tv360.metfone.com.kh/live/pnn.m3u8',
    ],
    description: 'People Nation Network'
  },
  {
    id: 'fresh-news',
    name: 'Fresh News',
    logo: 'https://play-lh.googleusercontent.com/fife/ALs6j_HIbNRcCmV4Ac1B-3Ty_SgPw4-2EAu1k3H2DDL7FbQ7Y9gLEKXV-2_IQHP6TaAqIGJQfwYKSp2VaGQ4GHh-A_R_-Xvbh7pL0K4qwKYjVX4HdVHQsM4Hqv8nM8MnY6pXQlKH7XYeE8K5XuYw3qxs_7TPX9W7w=s96-c',
    category: 'news',
    streams: [
      'http://streaming-android.freshnewsasia.tv:1935/live/ngrp:myStream_all/playlist.m3u8',
      'https://streaming.freshnewsasia.com/live/ngrp:myStream_all/playlist.m3u8',
    ],
    description: 'Fresh News Media'
  },
  {
    id: 'moi-tv',
    name: 'MOI TV',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Ministry_of_Information_%28Cambodia%29_Logo.png',
    category: 'news',
    streams: [
      'http://202.62.56.22:8080/hls/MOITV.m3u8',
    ],
    description: 'Ministry of Information'
  },
  {
    id: 'btv-news',
    name: 'BTV News',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/b/bd/BTV_News.svg',
    category: 'news',
    streams: [
      'https://live-evg2.tv360.metfone.com.kh/livetest/bayontest.stream/playlist.m3u8',
    ],
    description: 'Bayon TV News'
  },
  {
    id: 'msj-tv',
    name: 'MSJ TV',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/6/67/CNC_Cambodia.svg',
    category: 'news',
    streams: [
      'https://live-ali7.tv360.metfone.com.kh/live/myStream/playlist.m3u8',
      'http://124.248.165.18:1935/live/myStream.smil/playlist.m3u8',
    ],
    description: 'MSJ News Channel'
  },
  {
    id: 'cnc',
    name: 'CNC',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/6/67/CNC_Cambodia.svg',
    category: 'news',
    streams: [
      'http://43.252.18.195:5080/live/streams/cnctv.m3u8',
    ],
    description: 'Cambodia News Channel'
  },

  // ========== ENTERTAINMENT ==========
  {
    id: 'tvk2',
    name: 'TVK 2',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/f/f4/TVK.gif',
    category: 'entertainment',
    streams: [
      'https://live.kh.malimarcdn.com/live/tvk2.stream/playlist.m3u8',
    ],
    description: 'TVK Second Channel'
  },
  {
    id: 'bayon-tv',
    name: 'Bayon TV',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/8/84/Bayon_tv.png',
    category: 'entertainment',
    streams: [
      'https://live.kh.malimarcdn.com/live/bayonhd.stream/playlist.m3u8',
      'https://live-evg2.tv360.metfone.com.kh/livebayontv/bayontvhd.stream/playlist.m3u8',
    ],
    description: 'Bayon Television'
  },
  {
    id: 'sea-tv',
    name: 'SEA TV',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/f/f9/SEATV.png',
    category: 'entertainment',
    streams: [
      'https://seatv.netlinkbroadcaster.com/hls/test.m3u8',
    ],
    description: 'South East Asia TV'
  },
  {
    id: 'tv5',
    name: 'TV5 Cambodia',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/3/34/TV5KhmerLogo.svg',
    category: 'entertainment',
    streams: [
      'https://es1-p1-netcdn.metfone.com.kh/netcdn-live-36/36/output/playlist.m3u8',
      'http://live.happywatch99.com/livehd14/77bbe9df6a93cf229cd40f1400af00fa.sdp/playlist.m3u8',
    ],
    description: 'TV5 Entertainment'
  },
  {
    id: 'tv3',
    name: 'TV 3',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/0/0b/Tv3cambodia2004.png',
    category: 'entertainment',
    streams: [
      'https://edge6a.v2h-cdn.com/tv3cam/tv3cam.stream/playlist.m3u8',
    ],
    description: 'TV3 Cambodia'
  },
  {
    id: 'apsara-tv',
    name: 'Apsara TV',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/e/ef/Apsaratvfirstlogo.png',
    category: 'entertainment',
    streams: [
      'https://live.ams.com.kh/app/stream/playlist.m3u8',
      'https://live-evg5.tv360.metfone.com.kh/app/stream/playlist.m3u8',
    ],
    description: 'Apsara Media Services'
  },
  {
    id: 'ctn',
    name: 'CTN',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/d/df/CTN_2003.png',
    category: 'entertainment',
    streams: [
      'http://43.252.18.195:5080/live/streams/ctntv.m3u8',
    ],
    description: 'Cambodian Television Network'
  },
  {
    id: 'ctv8',
    name: 'CTV8 HD',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/5/53/CTV8HD.png',
    category: 'entertainment',
    streams: [
      'http://43.252.18.195:5080/live/streams/ctv8.m3u8',
    ],
    description: 'CTV8 High Definition'
  },
  {
    id: 'ctv9',
    name: 'CTV 9',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/d/dc/Tv9cambodia.png',
    category: 'entertainment',
    streams: [
      'https://live.kh.malimarcdn.com/live/tv9.stream/playlist.m3u8',
    ],
    description: 'CTV9 Entertainment'
  },
  {
    id: 'ntv',
    name: 'NTV',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/b/b1/ETV_cambodia.png',
    category: 'entertainment',
    streams: [
      'http://43.252.18.195:5080/LiveApp/streams/ntvhd.m3u8',
    ],
    description: 'NTV Cambodia'
  },
  {
    id: 'mytv',
    name: 'My TV',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/b/b1/MYTV_2008.png',
    category: 'entertainment',
    streams: [
      'http://43.252.18.195:5080/live/streams/mytv.m3u8',
    ],
    description: 'My TV Entertainment'
  },
  {
    id: 'itv',
    name: 'iTV HD',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/b/b1/ETV_cambodia.png',
    category: 'entertainment',
    streams: [
      'http://43.252.18.195:5080/live/streams/itv.khmeretv.m3u8',
    ],
    description: 'iTV High Definition'
  },
  {
    id: 'komsan-tv',
    name: 'Komsan TV',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/b/b1/MYTV_2008.png',
    category: 'entertainment',
    streams: [
      'http://tv.cootel.com.kh:8077/streams/d/Komsan/playlist.m3u8',
    ],
    description: 'Komsan Entertainment'
  },

  // ========== MUSIC ==========
  {
    id: 'hang-meas-hdtv',
    name: 'Hang Meas HDTV',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/e/e9/HangMeasTV2013.svg',
    category: 'music',
    streams: [
      'http://clive.malisresidences.com:1935/hm_hdtv/_definst_/smil:hmhdt12356.smil/playlist.m3u8',
    ],
    description: 'Hang Meas Movies & Entertainment'
  },
  {
    id: 'rhm-hdtv',
    name: 'Rasmey Hang Meas HDTV',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/6/62/RHMHDTV.png',
    category: 'music',
    streams: [
      'http://clive.malisresidences.com:1935/rhm_hdtv/_definst_/smil:RHMHDTV.smil/playlist.m3u8',
    ],
    description: 'Rasmey Hang Meas Music'
  },
  {
    id: 'town-tv',
    name: 'Town TV',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/b/b1/MYTV_2008.png',
    category: 'music',
    streams: [
      'https://live.kh.malimarcdn.com/live/towntv.stream/playlist.m3u8',
      'http://43.252.18.195:5080/live/streams/Town_khmer_etv.playlist.m3u8',
    ],
    description: 'Town Music & Entertainment'
  },

  // ========== LIFESTYLE ==========
  {
    id: 'wiki-tv',
    name: 'WIKI TV',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/6/67/CNC_Cambodia.svg',
    category: 'lifestyle',
    streams: [
      'https://stream.wikitv.asia/live/ngrp:myStream_all/playlist.m3u8',
      'http://wikitv-streaming.poscarasia.com:1935/live/ngrp:myStream_all/playlist.m3u8',
    ],
    description: 'WIKI Lifestyle & Knowledge'
  },
  {
    id: 'khmer-tv',
    name: 'Khmer TV',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/f/f4/TVK.gif',
    category: 'lifestyle',
    streams: [
      'https://livefta.malimarcdn.com/ftaedge00/khmertv2020.stream/playlist.m3u8',
    ],
    description: 'Khmer TV International'
  },
];

export const categories = [
  { id: 'all', name: 'All Channels' },
  { id: 'news', name: 'News' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'music', name: 'Music' },
  { id: 'lifestyle', name: 'Lifestyle' },
];
