$(document).ready(function () {

    const bgm = document.getElementById('bgm-audio');
    const toggleBtn = $('#bgm-toggle');
    const iconOn = toggleBtn.find('svg:first');
    const iconOff = toggleBtn.find('svg:last');

    // BGM 설정
    if (bgm) bgm.volume = 0.4;

    toggleBtn.on('click', function () {
        if (!bgm) return;
        if (bgm.paused) {
            bgm.play();
            updateBgmIcon(true);
        } else {
            bgm.pause();
            updateBgmIcon(false);
        }
    });

    function updateBgmIcon(isPlaying) {
        if (isPlaying) {
            iconOn.removeClass('hidden');
            iconOff.addClass('hidden');
        } else {
            iconOn.addClass('hidden');
            iconOff.removeClass('hidden');
        }
    }


    // =========================================
    // [순서 제어] 영상 -> 대문 -> 지도
    // =========================================
    const introOverlay = $('#intro-overlay'); // 영상 (1단계)
    const gateScreen = $('#gate-screen');     // 대문 (2단계)
    const introVideo = document.getElementById('intro-video');
    const startScreen = $('#start-screen');
    const startBtn = $('#start-btn');
    const skipBtn = $('#skip-intro');

    // 1. [입장하기] 클릭 -> 영상/BGM 재생
    startBtn.on('click', function () {
        startScreen.fadeOut(300);
        skipBtn.removeClass('hidden');

        if (introVideo) introVideo.play();
        if (bgm) {
            bgm.play().then(() => updateBgmIcon(true))
                .catch(() => updateBgmIcon(false));
        }
    });

    // 2. 영상 종료(혹은 스킵) -> 대문(Gate) 보여주기
    function finishIntro() {
        // 영상을 서서히 투명하게 만듦
        introOverlay.fadeOut(1000, function () {
            $(this).remove(); // 영상 레이어 삭제
        });
    }

    if (introVideo) {
        introVideo.onended = function () { finishIntro(); };
    }
    skipBtn.on('click', function () { finishIntro(); });


    // 3. 대문 클릭 -> 지도(Main) 보여주기
    gateScreen.on('click', function () {
        $(this).fadeOut(500, function () {
            $(this).remove(); // 대문 레이어 삭제 -> 맨 아래 있던 지도가 드러남
        });
    });


    // =========================================
    // [지도] 핀 & 모달 로직
    // =========================================
    const locationData = [
        { id: 0, img: "0.png", desc: "천하를 호령하는 중심지입니다. 이곳에는 고대 드래곤의 전설이 깃들어 있으며, 무림 맹주가 거주하는 곳으로 알려져 있습니다." },
        { id: 1, img: "1.png", desc: "서역의 험준한 산맥에 위치한 문파입니다. 일년 내내 눈이 녹지 않는 설산에서 독자적인 검법을 수련합니다." },
        { id: 2, img: "2.png", desc: "황실의 힘이 미치는 제국의 수도입니다. 금의위와 동창이 감시하고 있어 무림인들의 활동이 제약되는 구역입니다." },
        { id: 3, img: "3.png", desc: "동북방의 끝자락, 영험한 기운이 서린 곳입니다. 산삼과 약초가 풍부하며 신비로운 의술이 전해집니다." },
        { id: 4, img: "4.png", desc: "창술과 권법으로 유명한 가문이 지배하는 지역입니다. 호쾌한 기상의 협객들이 많이 배출됩니다." },
        { id: 5, img: "5.png", desc: "천하무공의 원류라 불리는 곳입니다. 숭산 깊은 곳에 위치하며 불법과 무공을 함께 닦습니다." },
        { id: 6, img: "6.png", desc: "검을 숭상하는 명문 세가입니다. 창해검법을 위시한 강력한 검기와 막대한 재력을 보유하고 있습니다." },
        { id: 7, img: "7.png", desc: "거지들의 집단이나 정보력만큼은 천하제일인 곳입니다. 중원 구석구석 그들의 눈이 닿지 않는 곳이 없습니다." },
        { id: 8, img: "8.png", desc: "여승들로 이루어진 문파입니다. 부드러움 속에 날카로움을 숨긴 검법과 장법을 구사합니다." },
        { id: 9, img: "9.png", desc: "도가의 이치를 무공으로 승화시킨 문파입니다. 태극의 이치를 깨달아 부드러움으로 강함을 제압합니다." },
        { id: 10, img: "10.png", desc: "서장 깊은 곳에 위치한 라마교의 성지입니다. 중원과는 다른 기이하고 강력한 무공을 사용한다고 전해집니다." },
        { id: 11, img: "11.png", desc: "맹수를 부리고 독을 다루는 남쪽의 세력입니다. 숲이 우거져 지형을 모르면 살아나오기 힘듭니다." },
        { id: 12, img: "12.png", desc: "남서쪽의 왕족 가문입니다. 일양지라 불리는 절세의 지법을 가전 무공으로 전승하고 있습니다." },
        { id: 13, img: "13.png", desc: "남서쪽의 왕족 가문입니다. 일양지라 불리는 절세의 지법을 가전 무공으로 전승하고 있습니다." }
    ];

    $('.map-pin').on('click', function () {
        const id = $(this).data('id');
        const data = locationData.find(item => item.id == id);

        if (data) {
            $('#modal-img').attr('src', data.img);
            $('#modal-desc').text(data.desc);

            $('#modal').removeClass('hidden').css('opacity', 0).stop().animate({ opacity: 1 }, 300);
            $('body').css('overflow', 'hidden');
        }
    });

    function closeModal() {
        $('#modal').stop().animate({ opacity: 0 }, 300, function () {
            $(this).addClass('hidden');
        });
        $('body').css('overflow', 'auto');
    }

    $('#close-btn').on('click', closeModal);
    $('#modal').on('click', function (e) {
        if (e.target === this) closeModal();
    });
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
    });
});