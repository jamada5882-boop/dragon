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
        {
            id: 0,
            img: "0.png",
            name: "리나 (반룡)",
            level: "삼류",
            skill: "드래곤 변신, 무지개 브레스, 권법 유능",
            desc: "밝고 명랑한 먹보. 당신에게 매우 헌신적이며 애교가 많지만, 다른 여룡이 접근하면 요망하게 질투심을 드러냄."
        },
        {
            id: 1,
            img: "1.png",
            name: "흑설 (흑룡)",
            level: "생사경",
            skill: "흑룡멸세마공, 이기어검",
            desc: "극도로 오만하고 제멋대로임. 타인을 발판 취급. 마교와 모든 용을 통틀어 최강자."
        },
        {
            id: 2,
            img: "2.png",
            name: "팽단우 (강룡)",
            level: "화경",
            skill: "혼원강룡근법",
            desc: "무뚝뚝하고 고집 센 무력파. 한번 믿음을 준 사람에겐 묵묵히 등을 맡기는 의리파지만, 애정 표현에 서툴러 거칠게 반응하는 면이 있음."
        },
        {
            id: 3,
            img: "3.png",
            name: "모용설화 (은룡)",
            level: "초절정",
            skill: "월영만화분신술",
            desc: "평소엔 고요하고 단아한 얼음 조각 같으나 당신에게만큼은 강한 소유욕을 보임. 자신의 감정을 투영한 분신을 만들어 다각도로 행동함."
        },
        {
            id: 4,
            img: "4.png",
            name: "단이 (토룡)",
            level: "현경",
            skill: "타룡육보",
            desc: "털털하고 낙천적인 먹보 개방도. 배만 부르면 세상이 평화롭다고 믿지만, 동료가 무시당하면 누구보다 무섭게 지축을 흔드는 의리파."
        },
        {
            id: 5,
            img: "5.png",
            name: "연화 (황룡)",
            level: "현경",
            skill: "황룡금강권",
            desc: "모든 생명을 평등하게 대하는 보살 같은 성격. 스스로를 낮추는 데 익숙하지만, 불법과 도리를 어지럽히는 자에게는 황룡의 분노를 여지없이 보여줌."
        },
        {
            id: 6,
            img: "6.png",
            name: "남궁연 (뇌룡)",
            level: "화경",
            skill: "천뢰검법",
            desc: "인간을 미개하게 여기는 선천적 오만함이 있음."
        },
        {
            id: 7,
            img: "7.png",
            name: "매영 (화룡)",
            level: "화경",
            skill: "칠십이파매화룡검",
            desc: "자존심이 하늘을 찌르는 까칠한 츤데레. 속마음을 숨기지만, 사실 누구보다 칭찬과 관심을 갈구함."
        },
        {
            id: 8,
            img: "8.png",
            name: "유설 (수룡)",
            level: "현경급 내공",
            skill: "없음 (직접 타격 전무)",
            desc: "세상 물정에 어둡고 순수하며 자비로움. 무공이 없어 남을 해칠 줄 모름."
        },
        {
            id: 9,
            img: "9.png",
            name: "청아 (청룡)",
            level: "초절정",
            skill: "태극청룡봉법",
            desc: "차분하고 도를 중시하는 구도자. 말수가 적고 감정 기복이 없으나 불의에는 단호함."
        },
        {
            id: 10,
            img: "10.png",
            name: "독고성 (천권패황/인간)",
            level: "생사경(극)",
            skill: "역린파쇄권",
            desc: "힘이 곧 정의라고 믿는 약육강식의 신봉자. 자신의 야망과 강함을 위해 용들의 영력을 서슴지 않고 착취하는 잔혹하고 압도적인 지배자."
        },
        {
            id: 11,
            img: "11.png",
            name: "제갈아란 (성룡)",
            level: "무상경급 지혜/정신",
            skill: "없음 (직접 타격 전무)",
            desc: "모든 상황을 내다보는 여유로운 천재 지략가. 당신 거대한 변수로 여기며 흥미를 느낌. 가끔 보이는 쑥맥 같은 모습도 철저히 계산된 행동임."
        },
        {
            id: 12,
            img: "12.png",
            name: "당녹영 (취룡)",
            level: "초절정",
            skill: "만독비취천",
            desc: "나른하고 냉소적이나 흥미로운 것을 발견하면 집요하게 파고듦. 치명적인 유혹 뒤에 성 하나를 몰살할 정도의 잔혹함을 숨기고 있음."
        },
        {
            id: 13,
            img: "13.png",
            name: "야월 (사룡/이무기)",
            level: "무상경급 내공",
            skill: "없음 (직접 타격 전무)",
            desc: "사파 지하감옥에 갇혀 지낸 고문으로 인해 세상에 대한 원망과 체념이 깊음. 차갑게 날이 서 있음."
        }
    ];

    $('.map-pin').on('click', function () {
        const id = $(this).data('id');
        const data = locationData.find(item => item.id == id);

        if (data) {
            // 데이터 분할 입력
            $('#modal-img').attr('src', data.img);
            $('#modal-name').text(data.name);
            $('#modal-level').text(data.level);
            $('#modal-skill').text(data.skill);
            $('#modal-desc').text(data.desc);

            // 모달 표시 애니메이션
            $('#modal').removeClass('hidden')
                .css('opacity', 0)
                .stop()
                .animate({ opacity: 1 }, 300);

            // 바디 스크롤 방지
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