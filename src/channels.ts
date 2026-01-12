export interface Channel {
  id: string;
  name: string;
  logo: string;
  category: 'news' | 'entertainment' | 'music' | 'sports' | 'kids' | 'lifestyle';
  streams: string[];
  description?: string;
}

// Khmer TV Channels - Working streams only (tested)
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
    logo: 'https://cdn.brandfetch.io/idalrk11T-/w/400/h/400/theme/dark/icon.jpeg',
    category: 'news',
    streams: [
      'https://live-evg17.tv360.metfone.com.kh/LiveApp/streams/eacnews.m3u8',
    ],
    description: 'East Asia Channel News'
  },
  {
    id: 'fresh-news',
    name: 'Fresh News',
    logo: 'https://yt3.googleusercontent.com/ytc/AIdro_lXRHXvNvJWJR0iP0TnKm3NxG4xYNrKZl0Bn5Ztd8d9Tw=s176-c-k-c0x00ffffff-no-rj',
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
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Ministry_of_Information_%28Cambodia%29_Logo.png/200px-Ministry_of_Information_%28Cambodia%29_Logo.png',
    category: 'news',
    streams: [
      'http://202.62.56.22:8080/hls/MOITV.m3u8',
    ],
    description: 'Ministry of Information'
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
    name: 'TV5',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/3/34/TV5KhmerLogo.svg',
    category: 'entertainment',
    streams: [
      'http://live.happywatch99.com/livehd14/77bbe9df6a93cf229cd40f1400af00fa.sdp/playlist.m3u8',
    ],
    description: 'TV5 Cambodia'
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
    id: 'ntv',
    name: 'NTV',
    logo: 'https://img-evg4.tv360.metfone.com.kh/vtc-image/2024/11/18/11/1731904849389/c3f83093686f_480_270.jpg',
    category: 'entertainment',
    streams: [
      'http://43.252.18.195:5080/LiveApp/streams/ntvhd.m3u8',
    ],
    description: 'NTV Cambodia'
  },
  {
    id: 'komsan-tv',
    name: 'Komsan TV',
    logo: 'https://img-evg4.tv360.metfone.com.kh/vtc-image/2024/11/18/11/1731904825932/e40e2c1eff16_480_270.jpg',
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
    name: 'Rasmey Hang Meas',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/6/62/RHMHDTV.png',
    category: 'music',
    streams: [
      'http://clive.malisresidences.com:1935/rhm_hdtv/_definst_/smil:RHMHDTV.smil/playlist.m3u8',
    ],
    description: 'Rasmey Hang Meas Music'
  },
  {
    id: 'hm-cine',
    name: 'HM Cine',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/e/e9/HangMeasTV2013.svg',
    category: 'music',
    streams: [
      'http://clive.malisresidences.com:1935/hmcine/_definst_/smil:hmcine.smil/playlist.m3u8',
    ],
    description: 'Hang Meas Cinema'
  },
  {
    id: 'hm-go',
    name: 'HM Go',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/e/e9/HangMeasTV2013.svg',
    category: 'music',
    streams: [
      'http://clive.malisresidences.com:1935/hmgo/_definst_/smil:hmgo.smil/playlist.m3u8',
    ],
    description: 'Hang Meas Go'
  },
  {
    id: 'hm-now',
    name: 'HM Now',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/e/e9/HangMeasTV2013.svg',
    category: 'music',
    streams: [
      'http://clive.malisresidences.com:1935/hmnow/_definst_/smil:hmnow.smil/playlist.m3u8',
    ],
    description: 'Hang Meas Now'
  },
  {
    id: 'hm-play',
    name: 'HM Play',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/e/e9/HangMeasTV2013.svg',
    category: 'music',
    streams: [
      'http://clive.malisresidences.com:1935/hmplay/_definst_/smil:hmplay.smil/playlist.m3u8',
    ],
    description: 'Hang Meas Play'
  },
  {
    id: 'town-tv',
    name: 'Town TV',
    logo: 'https://img-evg4.tv360.metfone.com.kh/vtc-image/2024/11/18/11/1731904787957/c312928b2c77_480_270.jpg',
    category: 'music',
    streams: [
      'http://43.252.18.195:5080/live/streams/Town_khmer_etv.playlist.m3u8',
    ],
    description: 'Town Music & Entertainment'
  },

  // ========== LIFESTYLE ==========
  {
    id: 'wiki-tv',
    name: 'WIKI TV',
    logo: 'https://wikitv.asia/logo/logo_flat.png',
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
