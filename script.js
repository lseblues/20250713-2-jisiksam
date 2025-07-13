// WeatherAPI 설정
const API_KEY = 'd8097e9035644b97a1e21026251307';
const BASE_URL = 'https://api.weatherapi.com/v1';

// DOM 요소들
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherContainer = document.getElementById('weatherContainer');
const loading = document.getElementById('loading');
const error = document.getElementById('error');

// 날씨 정보를 표시할 요소들
const cityName = document.getElementById('cityName');
const dateTime = document.getElementById('dateTime');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weatherIcon');
const weatherDescription = document.getElementById('weatherDescription');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const visibility = document.getElementById('visibility');
const errorMessage = document.getElementById('errorMessage');

// 이벤트 리스너 등록
searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

// 페이지 로드 시 현재 시간 업데이트
updateDateTime();
setInterval(updateDateTime, 1000);

// 날씨 정보 가져오기
async function getWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('도시명을 입력해주세요.');
        return;
    }

    showLoading();
    hideError();
    hideWeather();

    try {
        const response = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        displayWeather(data);
        
    } catch (err) {
        console.error('날씨 정보를 가져오는 중 오류 발생:', err);
        showError(err.message || '날씨 정보를 가져올 수 없습니다.');
    }
}

// 날씨 정보 표시
function displayWeather(data) {
    const current = data.current;
    const location = data.location;

    // 도시명과 시간
    cityName.textContent = `${location.name}, ${location.country}`;
    updateDateTime();

    // 온도
    temperature.textContent = Math.round(current.temp_c);

    // 날씨 아이콘
    weatherIcon.src = current.condition.icon;
    weatherIcon.alt = current.condition.text;

    // 날씨 설명
    weatherDescription.textContent = current.condition.text;

    // 상세 정보
    feelsLike.textContent = `${Math.round(current.feelslike_c)}°C`;
    humidity.textContent = `${current.humidity}%`;
    windSpeed.textContent = `${current.wind_kph} km/h`;
    visibility.textContent = `${current.vis_km} km`;

    hideLoading();
    showWeather();
}

// 현재 시간 업데이트
function updateDateTime() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    dateTime.textContent = now.toLocaleDateString('ko-KR', options);
}

// UI 상태 관리 함수들
function showLoading() {
    loading.classList.add('show');
}

function hideLoading() {
    loading.classList.remove('show');
}

function showWeather() {
    weatherContainer.classList.add('show');
}

function hideWeather() {
    weatherContainer.classList.remove('show');
}

function showError(message) {
    errorMessage.textContent = message;
    error.classList.add('show');
    hideLoading();
}

function hideError() {
    error.classList.remove('show');
}

// 날씨 상태에 따른 배경 그라데이션 변경
function updateBackground(weatherCode) {
    const body = document.body;
    
    // 날씨 코드에 따른 배경 변경
    const backgrounds = {
        // 맑음
        1000: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
        // 흐림
        1003: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        1006: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        1009: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        // 비
        1063: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        1066: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        1069: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        1087: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        // 눈
        1114: 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)',
        1117: 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)',
        // 안개
        1030: 'linear-gradient(135deg, #d3cce3 0%, #e9e4f0 100%)',
        1135: 'linear-gradient(135deg, #d3cce3 0%, #e9e4f0 100%)',
        1147: 'linear-gradient(135deg, #d3cce3 0%, #e9e4f0 100%)'
    };

    const background = backgrounds[weatherCode] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    body.style.background = background;
}

// 날씨 정보 표시 함수 수정
function displayWeather(data) {
    const current = data.current;
    const location = data.location;

    // 도시명과 시간
    cityName.textContent = `${location.name}, ${location.country}`;
    updateDateTime();

    // 온도
    temperature.textContent = Math.round(current.temp_c);

    // 날씨 아이콘
    weatherIcon.src = current.condition.icon;
    weatherIcon.alt = current.condition.text;

    // 날씨 설명
    weatherDescription.textContent = current.condition.text;

    // 상세 정보
    feelsLike.textContent = `${Math.round(current.feelslike_c)}°C`;
    humidity.textContent = `${current.humidity}%`;
    windSpeed.textContent = `${current.wind_kph} km/h`;
    visibility.textContent = `${current.vis_km} km`;

    // 배경 변경
    updateBackground(current.condition.code);

    hideLoading();
    showWeather();
}

// 초기 로딩 시 기본 배경 설정
document.addEventListener('DOMContentLoaded', () => {
    updateBackground(1000); // 기본값: 맑음
});
