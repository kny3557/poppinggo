/**
 * Popping (팝핑) - app.js
 * 대한민국 팝업스토어 소식 큐레이션 서비스 로직
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. Administrative District Data (Seoul 25 Gu & Gyeonggi Cities/Counties)
     ------------------------------------------------------------------------ */
  const REGION_DATA = {
    seoul: [
      '강남구', '강동구', '강북구', '강서구', '관악구',
      '광진구', '구로구', '금천구', '노원구', '도봉구',
      '동대문구', '동작구', '마포구', '서대문구', '서초구',
      '성동구', '성북구', '송파구', '양천구', '영등포구',
      '용산구', '은평구', '종로구', '중구', '중랑구'
    ],
    gyeonggi: [
      '수원시', '성남시', '고양시', '용인시', '부천시',
      '안산시', '안양시', '남양주시', '화성시', '평택시',
      '의정부시', '시흥시', '파주시', '김포시', '광명시',
      '광주시', '군포시', '이천시', '오산시', '하남시',
      '양주시', '구리시', '안성시', '포천시', '의왕시',
      '여주시', '동두천시', '과천시', '가평군', '양평군', '연천군'
    ]
  };

  /* ------------------------------------------------------------------------
     2. Dynamic Relative Popup Database
        - Ensures relative offsets from current runtime Date so users
          always find relevant popup events regardless of execution month!
     ------------------------------------------------------------------------ */
  const TODAY = new Date();
  TODAY.setHours(0, 0, 0, 0);

  function makeDate(offsetDays) {
    const d = new Date(TODAY);
    d.setDate(d.getDate() + offsetDays);
    return d;
  }

  function formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
  }

  function formatShortDate(d) {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${m}.${day}`;
  }

  // Predefined rich popup events
  const RAW_POPUPS = [
    // --- 뷰티 (Beauty) ---
    {
      id: 1,
      title: '탬버린즈 성수 플래그십 뉴 캔들 팝업',
      category: '뷰티',
      province: 'seoul',
      district: '성동구',
      location: '서울 성동구 성수이로 93 1F',
      startOffset: -12,
      endOffset: 5,
      reserveStatus: '예약 가능',
      reserveTip: '네이버 예약 우선 입장 및 현장 웨이팅 등록 가능',
      desc: '독특한 오브제와 새로운 캔들 컬렉션을 체험할 수 있는 감각적인 뷰티 팝업스토어!',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 2,
      title: '헤라(HERA) 톤업 센슈얼 립글로우 라운지',
      category: '뷰티',
      province: 'seoul',
      district: '강남구',
      location: '서울 강남구 압구정로 12길 22',
      startOffset: -3,
      endOffset: 12,
      reserveStatus: '예약 필수',
      reserveTip: '카카오톡 예약하기를 통한 사전 100% 예약제 (선착순 선물 증정)',
      desc: '나만의 퍼스널 립 컬러를 진단받고 커스텀 립밤을 제작해볼 수 있는 체험형 팝업!',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 3,
      title: '조선미녀 K-비건 스킨케어 도화원',
      category: '뷰티',
      province: 'seoul',
      district: '종로구',
      location: '서울 종로구 북촌로 42',
      startOffset: -20,
      endOffset: 2,
      reserveStatus: '예약 불가능',
      reserveTip: '현장 선착순 무료 입장 (주말 오후 혼잡 시 대기 등록)',
      desc: '해외에서 난리 난 K-비건 선크림과 쌀 세럼을 직접 체험하는 한옥 팝업스토어.',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 4,
      title: '판교 힌스(hince) 글로우 레이어링 쇼룸',
      category: '뷰티',
      province: 'gyeonggi',
      district: '성남시',
      location: '경기 성남시 분당구 판교역로 146번길 20',
      startOffset: 2,
      endOffset: 18,
      reserveStatus: '예약 가능',
      reserveTip: '현장 대기 등록 및 네이버 예약 방문 시 미니어처 쿠션 증정',
      desc: '투명하고 감각적인 빛을 담은 글로우 베이스와 섀도우를 직접 테스팅해보세요.',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80'
    },

    // --- 게임 (Game) ---
    {
      id: 5,
      title: '롤(LoL) 2026 챔피언스 페스타 성수',
      category: '게임',
      province: 'seoul',
      district: '성동구',
      location: '서울 성동구 아차산로 104 바이산',
      startOffset: -8,
      endOffset: 7,
      reserveStatus: '예약 필수',
      reserveTip: '티켓링크 사전 예매 필수 (현장 취소표 극소량 배부)',
      desc: '소환사의 협곡을 현실로 옮겨놓은 초대형 인터랙티브 아케이드 & 한정 굿즈샵!',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 6,
      title: '원신(Genshin Impact) 테이바트 베이커리 팝업',
      category: '게임',
      province: 'seoul',
      district: '마포구',
      location: '서울 마포구 와우산로 29가길 88',
      startOffset: -4,
      endOffset: 15,
      reserveStatus: '예약 가능',
      reserveTip: '캐치테이블 현장 웨이팅 및 사전 예약 타임 분할 운영',
      desc: '슬라임 푸딩, 페이몬 컵케이크와 전용 아크릴 스탠드를 만날 수 있는 달콤한 팝업!',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 7,
      title: '포켓몬스터 스칼렛 바이올렛 빌리지',
      category: '게임',
      province: 'seoul',
      district: '송파구',
      location: '서울 송파구 올림픽로 300 롯데월드몰 아트리움',
      startOffset: -15,
      endOffset: 4,
      reserveStatus: '예약 불가능',
      reserveTip: '자유 현장 입장 및 포토존 무료 촬영 (피카츄 퍼레이드 주말 2시/5시)',
      desc: '초대형 피카츄 풍선과 한정판 오리지널 봉제인형이 가득한 포켓몬 빌리지!',
      image: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 8,
      title: '스타필드 수원 닌텐도 스위치 패밀리 아일랜드',
      category: '게임',
      province: 'gyeonggi',
      district: '수원시',
      location: '경기 수원시 장안구 수성로 175 스타필드 1F 센트럴',
      startOffset: 0,
      endOffset: 25,
      reserveStatus: '예약 가능',
      reserveTip: '현장 키오스크 번호표 발권 후 차례대로 시연존 입장',
      desc: '마리오 카트 월드와 젤다의 전설을 대형 스크린에서 가족과 즐기는 체험전!',
      image: 'https://images.unsplash.com/photo-1578374173705-969cbe6f2d6b?auto=format&fit=crop&w=400&q=80'
    },

    // --- 애니메이션 (Animation) ---
    {
      id: 9,
      title: '주술회전 시부야 사변 리얼 다이닝 & 굿즈 팝업',
      category: '애니메이션',
      province: 'seoul',
      district: '마포구',
      location: '서울 마포구 양화로 188 AK PLAZA 홍대 4F',
      startOffset: -10,
      endOffset: 6,
      reserveStatus: '예약 필수',
      reserveTip: '네이버 예약 사전 티켓 소지자만 입장 가능 (매주 월요일 다음 주 예약 오픈)',
      desc: '고죠 사토루와 영역전개 테마 룸, 애니메이션 작화 원화 전시 및 단독 굿즈 컬렉션.',
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 10,
      title: '스튜디오 지브리 도토리숲 가을 피크닉',
      category: '애니메이션',
      province: 'seoul',
      district: '용산구',
      location: '서울 용산구 한강대로23길 55 아이파크몰 리빙파크 6F',
      startOffset: -25,
      endOffset: 8,
      reserveStatus: '예약 불가능',
      reserveTip: '자유 입장 가능 (대형 토토로 포토존 대기줄 발생 가능)',
      desc: '이웃집 토토로, 센과 치히로의 행방불명 오르골과 따스한 감성 인테리어 소품전.',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 11,
      title: '짱구는 못말려 떡잎마을 방범대 비밀기지',
      category: '애니메이션',
      province: 'gyeonggi',
      district: '고양시',
      location: '경기 고양시 일산동구 호수로 595 스타필드 고양 센트럴',
      startOffset: 3,
      endOffset: 20,
      reserveStatus: '예약 가능',
      reserveTip: '카카오 예약하기 또는 현장 대기 등록 후 짱구 초코비 스티커 받기!',
      desc: '와르르맨션과 짱구 방을 그대로 재현한 포토존 & 초코비 한정 에디션 판매!',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80'
    },

    // --- 패션 (Fashion) ---
    {
      id: 12,
      title: '아더에러(ADER ERROR) 블루 스페이스 팝업',
      category: '패션',
      province: 'seoul',
      district: '성동구',
      location: '서울 성동구 성수이로 82',
      startOffset: -14,
      endOffset: 9,
      reserveStatus: '예약 가능',
      reserveTip: '현장 태블릿 접수 후 카카오톡 알림톡 입장',
      desc: '시그니처 블루와 미래지향적 키네틱 아트 조형물이 어우러진 신규 윈터 컬렉션.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 13,
      title: '마르디 메크르디(Mardi) 플라워 아뜰리에',
      category: '패션',
      province: 'seoul',
      district: '용산구',
      location: '서울 용산구 이태원로 54길 58',
      startOffset: -2,
      endOffset: 16,
      reserveStatus: '예약 불가능',
      reserveTip: '자유 입장 가능 (팝업 한정 에코백 매일 선착순 100명 증정)',
      desc: '활짝 핀 꽃 자수 스웻셔츠와 가을 신상 니트를 만나는 프렌치 무드 팝업.',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 14,
      title: '젠틀몬스터 x 퓨처 비전 콘셉트 스토어',
      category: '패션',
      province: 'seoul',
      district: '강남구',
      location: '서울 강남구 압구정로46길 50 하우스 도산',
      startOffset: -7,
      endOffset: 21,
      reserveStatus: '예약 필수',
      reserveTip: '젠틀몬스터 공식 웹사이트를 통한 타임 세션 사전 예약',
      desc: '초대형 거인 얼굴 조형물과 함께하는 미래지향적 선글라스 컬렉션 쇼룸.',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 15,
      title: '무신사 스탠다드 부천 팝업 쇼룸',
      category: '패션',
      province: 'gyeonggi',
      district: '부천시',
      location: '경기 부천시 원미구 신흥로 223 1F',
      startOffset: 1,
      endOffset: 14,
      reserveStatus: '예약 불가능',
      reserveTip: '자유 입장 (무신사 회원 인증 시 전품목 15% 할인 혜택)',
      desc: '베이직한 슬랙스와 경량 패딩을 현장에서 직접 입어보고 할인 혜택까지 챙기세요!',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80'
    },

    // --- 음식 (Food) ---
    {
      id: 16,
      title: '노티드(Knotted) 베이커리 팝콘 빌리지',
      category: '음식',
      province: 'seoul',
      district: '성동구',
      location: '서울 성동구 연무장길 31',
      startOffset: -5,
      endOffset: 11,
      reserveStatus: '예약 가능',
      reserveTip: '캐치테이블 포장/매장 이용 현장 대기 등록',
      desc: '달콤한 팝콘 크림 도넛과 핑크 팝콘 라떼를 한정 판매하는 스위트 팝업스토어!',
      image: 'https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 17,
      title: '오뚜기 x 카레 하우스 옐로우 스튜디오',
      category: '음식',
      province: 'seoul',
      district: '강남구',
      location: '서울 강남구 봉은사로 18길 34 롤리폴리 꼬또',
      startOffset: -22,
      endOffset: 3,
      reserveStatus: '예약 불가능',
      reserveTip: '현장 방문 순서대로 시식 및 카레 키트 DIY 체험 가능',
      desc: '노란 카레의 추억과 매콤한 스페셜 수제 카레 요리를 맛보는 레트로 미식 공간.',
      image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 18,
      title: '하남 스타필드 성수 베이글 페스타',
      category: '음식',
      province: 'gyeonggi',
      district: '하남시',
      location: '경기 하남시 미사대로 750 스타필드 하남 사우스아트리움',
      startOffset: 0,
      endOffset: 13,
      reserveStatus: '예약 가능',
      reserveTip: '오전 10시 현장 줄서기 순번표 배부 (인당 5개 구매 제한)',
      desc: '유명 베이글 장인들이 한자리에 모인 쫀득한 베이글 & 크림치즈 페스타!',
      image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 19,
      title: '더현대 서울 런던베이글 뮤지엄 가을 팝업',
      category: '음식',
      province: 'seoul',
      district: '영등포구',
      location: '서울 영등포구 여의대로 108 더현대 서울 B1',
      startOffset: -15,
      endOffset: 10,
      reserveStatus: '예약 필수',
      reserveTip: '현대식품관 투홈 앱 사전 웨이팅 등록 필수 (조기 마감 주의)',
      desc: '가을 시즈널 무화과 베이글과 트러플 수프를 맛볼 수 있는 브리티시 감성 팝업.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80'
    },

    // --- 기타 (Etc) ---
    {
      id: 20,
      title: '레고(LEGO) 보태니컬 가든 성수 식물원',
      category: '기타',
      province: 'seoul',
      district: '성동구',
      location: '서울 성동구 서울숲2길 27',
      startOffset: -6,
      endOffset: 8,
      reserveStatus: '예약 가능',
      reserveTip: '네이버 예약 및 현장 등록 가능 (나만의 레고 꽃송이 만들기 체험)',
      desc: '레고 브릭으로 피어난 형형색색의 보태니컬 식물들과 힐링 온실 포토존!',
      image: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 21,
      title: '모나미 153 커스텀 잉크 랩 팝업',
      category: '기타',
      province: 'gyeonggi',
      district: '용인시',
      location: '경기 용인시 수지구 손곡로 17 모나미 콘셉트스토어',
      startOffset: -18,
      endOffset: 14,
      reserveStatus: '예약 필수',
      reserveTip: '네이버 플레이스 사전 예약 100% (원하는 만년필 잉크 조제)',
      desc: '세상에 단 하나뿐인 나만의 퍼스널 잉크 컬러를 직접 스포이드로 배합해보는 클래스!',
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 22,
      title: '플레이모빌 50주년 기념 맨션 팝업',
      category: '기타',
      province: 'seoul',
      district: '강남구',
      location: '서울 강남구 영동대로 513 코엑스몰 라이브플라자',
      startOffset: -3,
      endOffset: 17,
      reserveStatus: '예약 불가능',
      reserveTip: '자유 현장 입장 및 럭키드로우 이벤트 참여 가능',
      desc: '키덜트 심장 저격! 사람 키만 한 대형 피규어들과 빈티지 피규어 전시.',
      image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 23,
      title: '필름로그 감성 아날로그 현상소',
      category: '기타',
      province: 'seoul',
      district: '중구',
      location: '서울 중구 퇴계로 53길 6-17',
      startOffset: 5,
      endOffset: 30,
      reserveStatus: '예약 가능',
      reserveTip: '현장 업사이클 카메라 자판기 이용 및 필름 토크 살롱',
      desc: '일회용 카메라 업사이클링 워크숍과 아날로그 사진의 매력을 만끽해보세요.',
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 24,
      title: '어반 플랜트 보태니컬 커피 하우스',
      category: '음식',
      province: 'seoul',
      district: '마포구',
      location: '서울 마포구 독막로4길 3',
      startOffset: -10,
      endOffset: 19,
      reserveStatus: '예약 불가능',
      reserveTip: '자유 입장 가능 (초록 식물 속 인생샷 명당)',
      desc: '초록빛 숲속에 들어온 듯한 싱그러운 플랜테리어와 스페셜티 커피의 만남.',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 25,
      title: '카카오프렌즈 춘식이의 고구마 방앗간',
      category: '애니메이션',
      province: 'seoul',
      district: '강남구',
      location: '서울 강남구 강남대로 420 카카오프렌즈 3F',
      startOffset: -1,
      endOffset: 22,
      reserveStatus: '예약 가능',
      reserveTip: '카카오톡 예약하기 타임 예약 시 춘식이 고구마 뱃지 증정',
      desc: '고구마에 진심인 춘식이의 따끈따끈 디저트와 단독 잠옷 굿즈 컬렉션!',
      image: 'https://images.unsplash.com/photo-1535572290543-960a8046f5af?auto=format&fit=crop&w=400&q=80'
    }
  ];

  // Build calculated dataset with real absolute dates based on TODAY
  const POPUP_DATABASE = RAW_POPUPS.map(item => {
    const start = makeDate(item.startOffset);
    const end = makeDate(item.endOffset);
    return {
      ...item,
      startDate: start,
      endDate: end,
      startStr: formatDate(start),
      endStr: formatDate(end)
    };
  });

  /* ------------------------------------------------------------------------
     3. State Management
     ------------------------------------------------------------------------ */
  const state = {
    currentScreen: 'screen-intro', // screen-intro | screen-input | screen-result
    selectedProvince: '',
    selectedDistrict: '',
    selectedCategory: '',
    
    // Calendar State (Allowed Range: 1 month ago ~ 2 months ahead)
    calCurrentYearMonth: new Date(TODAY.getFullYear(), TODAY.getMonth(), 1),
    minCalDate: new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, 1),
    maxCalDate: new Date(TODAY.getFullYear(), TODAY.getMonth() + 2, 31),
    
    // Selected 1-Week Range
    selectedWeekStart: null,
    selectedWeekEnd: null,

    // Filtered Results
    filteredPopups: []
  };

  /* ------------------------------------------------------------------------
     4. DOM Elements
     ------------------------------------------------------------------------ */
  const screenIntro = document.getElementById('screen-intro');
  const screenInput = document.getElementById('screen-input');
  const screenResult = document.getElementById('screen-result');

  const btnStart = document.getElementById('btn-start');
  const btnBackToIntro = document.getElementById('btn-back-to-intro');
  const btnSearch = document.getElementById('btn-search');
  const btnBackToInput = document.getElementById('btn-back-to-input');
  const btnHeaderReset = document.getElementById('btn-header-reset');
  const btnRetry = document.getElementById('btn-retry');

  const selectProvince = document.getElementById('select-province');
  const selectDistrict = document.getElementById('select-district');
  const selectCategory = document.getElementById('select-category');
  const catPills = document.querySelectorAll('.cat-pill');

  // Calendar DOM
  const calMonthLabel = document.getElementById('cal-month-label');
  const calPrevBtn = document.getElementById('cal-prev');
  const calNextBtn = document.getElementById('cal-next');
  const calGrid = document.getElementById('cal-grid');
  const calSelectedText = document.getElementById('cal-selected-text');
  const quickWeekButtons = document.querySelectorAll('.quick-week-chip');

  // Result DOM
  const resultSummaryTags = document.getElementById('result-summary-tags');
  const resultCount = document.getElementById('result-count');
  const popupList = document.getElementById('popup-list');

  // Toast & Modal DOM
  const toastAlert = document.getElementById('toast-alert');
  const toastMsg = document.getElementById('toast-msg');
  const popupModal = document.getElementById('popup-modal');
  const btnModalClose = document.getElementById('btn-modal-close');

  /* ------------------------------------------------------------------------
     5. Screen Navigation
     ------------------------------------------------------------------------ */
  function showScreen(screenId) {
    [screenIntro, screenInput, screenResult].forEach(screen => {
      if (screen && screen.id === screenId) {
        screen.classList.add('active');
        screen.scrollTop = 0;
      } else if (screen) {
        screen.classList.remove('active');
      }
    });
    state.currentScreen = screenId;
  }

  /* ------------------------------------------------------------------------
     6. Friendly Toast Feedback (다정한 말투 알림)
     ------------------------------------------------------------------------ */
  let toastTimer = null;
  function showToast(message) {
    if (!toastAlert || !toastMsg) return;
    toastMsg.textContent = message;
    toastAlert.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastAlert.classList.remove('show');
    }, 3200);
  }

  function highlightErrorField(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.classList.remove('shake-error');
    void el.offsetWidth; // Force reflow
    el.classList.add('shake-error');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ------------------------------------------------------------------------
     7. Province & District Dropdowns
     ------------------------------------------------------------------------ */
  if (selectProvince) {
    selectProvince.addEventListener('change', (e) => {
      const prov = e.target.value;
      state.selectedProvince = prov;
      selectDistrict.innerHTML = '<option value="" disabled selected>구/시·군 선택</option>';

      if (REGION_DATA[prov]) {
        selectDistrict.disabled = false;
        REGION_DATA[prov].forEach(dist => {
          const opt = document.createElement('option');
          opt.value = dist;
          opt.textContent = dist;
          selectDistrict.appendChild(opt);
        });
      } else {
        selectDistrict.disabled = true;
      }
    });
  }

  if (selectDistrict) {
    selectDistrict.addEventListener('change', (e) => {
      state.selectedDistrict = e.target.value;
    });
  }

  /* ------------------------------------------------------------------------
     8. Category Dropdown & Visual Chips Synchronization
     ------------------------------------------------------------------------ */
  if (selectCategory) {
    selectCategory.addEventListener('change', (e) => {
      const cat = e.target.value;
      state.selectedCategory = cat;
      catPills.forEach(pill => {
        if (pill.dataset.cat === cat) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      });
    });
  }

  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.dataset.cat;
      state.selectedCategory = cat;
      if (selectCategory) selectCategory.value = cat;
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  /* ------------------------------------------------------------------------
     9. Calendar Logic: 1-Week Range Selection & Highlighting
        Requirements:
        - Minimum: 1 month before current date
        - Maximum: 2 months after current date
        - Choose in 1-week increments
        - Active selected range clearly highlighted
     ------------------------------------------------------------------------ */
  function renderCalendar() {
    if (!calMonthLabel || !calGrid) return;
    const cur = state.calCurrentYearMonth;
    const year = cur.getFullYear();
    const month = cur.getMonth();

    calMonthLabel.textContent = `${year}년 ${month + 1}월`;

    // Check Prev/Next limit buttons (1 month before ~ 2 months ahead)
    const prevMonthDate = new Date(year, month - 1, 1);
    const nextMonthDate = new Date(year, month + 1, 1);

    if (calPrevBtn) {
      calPrevBtn.disabled = prevMonthDate < new Date(state.minCalDate.getFullYear(), state.minCalDate.getMonth(), 1);
    }
    if (calNextBtn) {
      calNextBtn.disabled = nextMonthDate > new Date(state.maxCalDate.getFullYear(), state.maxCalDate.getMonth(), 1);
    }

    calGrid.innerHTML = '';

    // First day of this month & total days
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();

    // 1. Prev month filler days
    for (let x = firstDayIndex; x > 0; x--) {
      const dayCell = document.createElement('div');
      dayCell.className = 'cal-day-cell other-month';
      dayCell.innerHTML = `<span class="day-number">${prevLastDate - x + 1}</span>`;
      calGrid.appendChild(dayCell);
    }

    // 2. Current month days
    for (let d = 1; d <= lastDate; d++) {
      const dateObj = new Date(year, month, d);
      dateObj.setHours(0, 0, 0, 0);

      const dayCell = document.createElement('div');
      dayCell.className = 'cal-day-cell';
      dayCell.dataset.date = dateObj.toISOString();

      // Check if disabled by 1 month ago ~ 2 months ahead restriction
      if (dateObj < state.minCalDate || dateObj > state.maxCalDate) {
        dayCell.classList.add('disabled-range');
      }

      // Check if today
      if (dateObj.getTime() === TODAY.getTime()) {
        dayCell.classList.add('today');
      }

      // Check if in selected 1-week range
      if (state.selectedWeekStart && state.selectedWeekEnd) {
        const time = dateObj.getTime();
        const startT = state.selectedWeekStart.getTime();
        const endT = state.selectedWeekEnd.getTime();

        if (time >= startT && time <= endT) {
          dayCell.classList.add('in-week-range');
          if (time === startT) dayCell.classList.add('week-start');
          if (time === endT) dayCell.classList.add('week-end');
        }
      }

      dayCell.innerHTML = `<span class="day-number">${d}</span>`;

      // Click handler to select 1-week span starting from clicked date (Sun-Sat week)
      dayCell.addEventListener('click', () => {
        selectOneWeekFromDate(dateObj);
      });

      calGrid.appendChild(dayCell);
    }

    // 3. Next month filler days to complete rows (7 columns)
    const totalRendered = firstDayIndex + lastDate;
    const remainder = (7 - (totalRendered % 7)) % 7;
    for (let j = 1; j <= remainder; j++) {
      const dayCell = document.createElement('div');
      dayCell.className = 'cal-day-cell other-month';
      dayCell.innerHTML = `<span class="day-number">${j}</span>`;
      calGrid.appendChild(dayCell);
    }

    updateSelectedRangeText();
  }

  // Select 1 week (7 days: Sunday to Saturday)
  function selectOneWeekFromDate(targetDate) {
    const dayOfWeek = targetDate.getDay(); // 0 is Sunday
    const weekStart = new Date(targetDate);
    weekStart.setDate(targetDate.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    state.selectedWeekStart = weekStart;
    state.selectedWeekEnd = weekEnd;

    quickWeekButtons.forEach(btn => btn.classList.remove('active'));
    renderCalendar();
  }

  function updateSelectedRangeText() {
    if (!calSelectedText) return;
    if (state.selectedWeekStart && state.selectedWeekEnd) {
      const startStr = formatDate(state.selectedWeekStart);
      const endStr = formatDate(state.selectedWeekEnd);
      calSelectedText.textContent = `${startStr} ~ ${endStr} (1주간)`;
    } else {
      calSelectedText.textContent = '날짜를 클릭해 1주를 선택해줘!';
    }
  }

  if (calPrevBtn) {
    calPrevBtn.addEventListener('click', () => {
      state.calCurrentYearMonth = new Date(
        state.calCurrentYearMonth.getFullYear(),
        state.calCurrentYearMonth.getMonth() - 1,
        1
      );
      renderCalendar();
    });
  }

  if (calNextBtn) {
    calNextBtn.addEventListener('click', () => {
      state.calCurrentYearMonth = new Date(
        state.calCurrentYearMonth.getFullYear(),
        state.calCurrentYearMonth.getMonth() + 1,
        1
      );
      renderCalendar();
    });
  }

  // Quick Week Presets
  quickWeekButtons.forEach(button => {
    button.addEventListener('click', () => {
      const offsetDays = parseInt(button.dataset.offset, 10);
      const baseDate = new Date(TODAY);
      baseDate.setDate(baseDate.getDate() + offsetDays);

      selectOneWeekFromDate(baseDate);

      quickWeekButtons.forEach(b => b.classList.remove('active'));
      button.classList.add('active');

      state.calCurrentYearMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
      renderCalendar();
    });
  });

  /* ------------------------------------------------------------------------
     10. Search Validation & Filtering Logic (UX Requirements)
     ------------------------------------------------------------------------ */
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      showScreen('screen-input');
    });
  }

  if (btnBackToIntro) {
    btnBackToIntro.addEventListener('click', () => {
      showScreen('screen-intro');
    });
  }

  if (btnBackToInput) {
    btnBackToInput.addEventListener('click', () => {
      showScreen('screen-input');
    });
  }

  if (btnHeaderReset) {
    btnHeaderReset.addEventListener('click', () => {
      showScreen('screen-input');
    });
  }

  if (btnRetry) {
    btnRetry.addEventListener('click', () => {
      showScreen('screen-input');
    });
  }

  if (btnSearch) {
    btnSearch.addEventListener('click', () => {
      // Validate 1: Region
      if (!state.selectedProvince || !state.selectedDistrict) {
        showToast('앗! 가고 싶은 지역을 선택해줘 🍿');
        highlightErrorField('group-region');
        return;
      }

      // Validate 2: Date Range
      if (!state.selectedWeekStart || !state.selectedWeekEnd) {
        showToast('앗! 팝업 열리는 날짜 범위를 달력에서 골라줘 🗓️');
        highlightErrorField('group-date');
        return;
      }

      // Validate 3: Category
      if (!state.selectedCategory) {
        showToast('앗! 어떤 카테고리의 팝업이 궁금한지 알려줘 💄🎮');
        highlightErrorField('group-category');
        return;
      }

      // All Validated! Perform Search
      performSearch();
    });
  }

  function performSearch() {
    const { selectedProvince, selectedDistrict, selectedCategory, selectedWeekStart, selectedWeekEnd } = state;
    const selStart = selectedWeekStart.getTime();
    const selEnd = selectedWeekEnd.getTime();

    // 1. Matches province & district
    // 2. Matches category
    // 3. Dates overlap: (popup.startDate <= selEnd) && (popup.endDate >= selStart)
    let exactMatches = POPUP_DATABASE.filter(popup => {
      const matchesRegion = (popup.province === selectedProvince) && (popup.district === selectedDistrict);
      const matchesCategory = (popup.category === selectedCategory);
      const overlapsDate = (popup.startDate.getTime() <= selEnd) && (popup.endDate.getTime() >= selStart);
      return matchesRegion && matchesCategory && overlapsDate;
    });

    let isFallback = false;
    let results = [];

    if (exactMatches.length > 0) {
      results = exactMatches;
    } else {
      // Smart Fallback Recommendation
      const broadened = POPUP_DATABASE.filter(popup => {
        const sameProvAndCat = (popup.province === selectedProvince) && (popup.category === selectedCategory);
        const sameDist = (popup.province === selectedProvince) && (popup.district === selectedDistrict);
        return sameProvAndCat || sameDist;
      });
      results = broadened;
      isFallback = true;
    }

    // Requirement: "가장 최근에 마감되는 팝업 목록" -> Sort ascending by endDate
    results.sort((a, b) => a.endDate.getTime() - b.endDate.getTime());

    state.filteredPopups = results;
    renderResults(isFallback);
    showScreen('screen-result');
  }

  /* ------------------------------------------------------------------------
     11. Result List Rendering
         Requirements:
         - Sort: 가장 최근에 마감되는 팝업 목록 (종료일 오름차순)
         - Right: 팝업 기간 (작게) & 분류 카테고리 칩
         - Left: 팝업 이미지 썸네일
         - Reservation badge: 예약 가능/불가능/필수 여부 표시
     ------------------------------------------------------------------------ */
  function renderResults(isFallback) {
    if (!resultSummaryTags || !resultCount || !popupList) return;

    const provName = state.selectedProvince === 'seoul' ? '서울' : '경기';
    resultSummaryTags.innerHTML = `
      <span class="summary-tag">📍 ${provName} ${state.selectedDistrict}</span>
      <span class="summary-tag">🗓️ ${formatShortDate(state.selectedWeekStart)}~${formatShortDate(state.selectedWeekEnd)}</span>
      <span class="summary-tag">🏷️ ${state.selectedCategory}</span>
    `;

    resultCount.textContent = state.filteredPopups.length;
    popupList.innerHTML = '';

    if (state.filteredPopups.length === 0) {
      popupList.innerHTML = `
        <div class="empty-state">
          <svg class="empty-icon" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" fill="#F7EF99" fill-opacity="0.5"/>
            <path d="M30 65 Q50 45 70 65" stroke="#F78E69" stroke-width="4" stroke-linecap="round"/>
            <circle cx="38" cy="40" r="4" fill="#2D3142"/>
            <circle cx="62" cy="40" r="4" fill="#2D3142"/>
          </svg>
          <h3 class="empty-title">선택한 조건의 팝업이 아직 오픈 전이에요!</h3>
          <p class="empty-desc">
            다른 날짜나 가까운 다른 자치구로 찾아보면<br>
            팝핑이가 또 다른 핫한 팝업을 찾아줄 수 있어요 🍿
          </p>
          <button type="button" class="btn btn-sm btn-main-color" id="btn-empty-retry">
            조건 다시 바꾸기
          </button>
        </div>
      `;
      const btnEmptyRetry = document.getElementById('btn-empty-retry');
      if (btnEmptyRetry) {
        btnEmptyRetry.addEventListener('click', () => showScreen('screen-input'));
      }
      return;
    }

    if (isFallback) {
      const noticeCard = document.createElement('div');
      noticeCard.style.cssText = 'background:#FFF8E8; border:1.5px solid var(--sub-dark); border-radius:14px; padding:10px 14px; font-size:0.8rem; color:#6B5A00; line-height:1.4;';
      noticeCard.innerHTML = `
        💡 <b>팝핑이의 꿀팁!</b> 선택하신 조건과 딱 맞는 팝업 외에도,<br>
        함께 가기 좋은 인근 지역의 <b>${state.selectedCategory}</b> 팝업을 마감 임박순으로 함께 모았어요!
      `;
      popupList.appendChild(noticeCard);
    }

    state.filteredPopups.forEach(popup => {
      const diffDays = Math.ceil((popup.endDate.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
      let dDayText = diffDays >= 0 ? `D-${diffDays}` : '종료임박';
      if (diffDays === 0) dDayText = 'D-DAY';

      let catClass = 'chip-category';
      if (popup.category === '뷰티') catClass = 'chip-beauty';
      else if (popup.category === '게임') catClass = 'chip-game';
      else if (popup.category === '애니메이션') catClass = 'chip-anime';
      else if (popup.category === '패션') catClass = 'chip-fashion';
      else if (popup.category === '음식') catClass = 'chip-food';
      else if (popup.category === '기타') catClass = 'chip-etc';

      let reserveClass = 'badge-reserve-available';
      if (popup.reserveStatus === '예약 필수') reserveClass = 'badge-reserve-required';
      else if (popup.reserveStatus === '예약 불가능') reserveClass = 'badge-reserve-none';

      const card = document.createElement('div');
      card.className = 'popup-card';
      card.innerHTML = `
        <!-- Left Thumbnail -->
        <div class="popup-thumb-wrapper">
          <img src="${popup.image}" alt="${popup.title}" class="popup-thumb-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80'" />
          <span class="d-day-badge ${diffDays <= 7 ? 'd-day-urgent' : ''}">${dDayText}</span>
        </div>

        <!-- Right Content -->
        <div class="popup-info">
          <div>
            <div class="popup-header-row">
              <h4 class="popup-title">${popup.title}</h4>
              <div class="popup-date-range">
                ${formatShortDate(popup.startDate)}~${formatShortDate(popup.endDate)}
              </div>
            </div>
            <div class="popup-location-row">
              <span>📍</span>
              <span>${popup.location}</span>
            </div>
          </div>

          <!-- Chips Row -->
          <div class="popup-chips-row">
            <span class="chip ${catClass}">${popup.category}</span>
            <span class="chip ${reserveClass}">
              ${popup.reserveStatus === '예약 필수' ? '🚨 ' : popup.reserveStatus === '예약 가능' ? '✅ ' : '🚶 '}
              ${popup.reserveStatus}
            </span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        openDetailModal(popup, catClass, reserveClass);
      });

      popupList.appendChild(card);
    });
  }

  /* ------------------------------------------------------------------------
     12. Detail Modal
     ------------------------------------------------------------------------ */
  function openDetailModal(popup, catClass, reserveClass) {
    if (!popupModal) return;
    document.getElementById('modal-img').src = popup.image;
    document.getElementById('modal-title').textContent = popup.title;
    document.getElementById('modal-desc').textContent = popup.desc;
    document.getElementById('modal-location').textContent = popup.location;
    document.getElementById('modal-period').textContent = `${popup.startStr} ~ ${popup.endStr}`;
    document.getElementById('modal-tip').textContent = popup.reserveTip;

    const catChip = document.getElementById('modal-cat-chip');
    if (catChip) {
      catChip.className = `chip ${catClass}`;
      catChip.textContent = popup.category;
    }

    const resBadge = document.getElementById('modal-reserve-badge');
    if (resBadge) {
      resBadge.className = `chip ${reserveClass}`;
      resBadge.textContent = popup.reserveStatus;
    }

    popupModal.classList.add('show');
  }

  if (btnModalClose) {
    btnModalClose.addEventListener('click', () => {
      popupModal.classList.remove('show');
    });
  }

  if (popupModal) {
    popupModal.addEventListener('click', (e) => {
      if (e.target === popupModal) {
        popupModal.classList.remove('show');
      }
    });
  }

  /* ------------------------------------------------------------------------
     13. Initial Setup
     ------------------------------------------------------------------------ */
  const initialSun = new Date(TODAY);
  initialSun.setDate(TODAY.getDate() - TODAY.getDay());
  selectOneWeekFromDate(initialSun);

  renderCalendar();
});
