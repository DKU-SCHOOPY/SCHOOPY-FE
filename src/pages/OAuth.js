const CLIENT_ID_KAKAO = process.env.REACT_APP_REST_API_KEY_KAKAO;
const REDIRECT_URI_KAKAO = process.env.REACT_APP_REDIRECT_URL_KAKAO;
const REDIRECT_URI_KAKAO_LINK = process.env.REACT_APP_REDIRECT_URL_KAKAO_LINK;

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID_KAKAO}&redirect_uri=${REDIRECT_URI_KAKAO}&response_type=code`;
export const KAKAO_LINK_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID_KAKAO}&redirect_uri=${REDIRECT_URI_KAKAO_LINK}&response_type=code`;


const CLIENT_ID_NAVER = process.env.REACT_APP_REST_API_KEY_NAVER;
const REDIRECT_URI_NAVER = process.env.REACT_APP_REDIRECT_URL_NAVER;
const REDIRECT_URI_NAVER_LINK = process.env.REACT_APP_REDIRECT_URL_NAVER_LINK;
const STATE = "RANDOM_STRING";

export const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID_NAVER}&state=${STATE}&redirect_uri=${REDIRECT_URI_NAVER}`;
export const NAVER_LINK_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID_NAVER}&state=${STATE}&redirect_uri=${REDIRECT_URI_NAVER_LINK}`;