const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const qs = require("querystring");

const router = express.Router();

router.get("/", (req,res) => {
    //오늘 날짜
    let day = new Date();
    let month = day.getMonth() + 1;  // 월(month) 보정
    let today = day.getFullYear() + '.' + month + '.' + day.getDate();

    //지역에 따른 날씨
    area ="성북구";
    if(req.query.area == "강남구") area = "강남구";
    else if (req.query.area == "강동구") area = "강동구"; 
    else if (req.query.area == "강서구") area = "강서구";
    else if (req.query.area == "강북구") area = "강북구"; 
    else if (req.query.area == "관악구") area = "관악구"; 
    else if (req.query.area == "광진구") area = "광진구"; 
    else if (req.query.area == "구로구") area = "구로구"; 
    else if (req.query.area == "금천구") area = "금천구"; 
    else if (req.query.area == "노원구") area = "노원구"; 
    else if (req.query.area == "도봉구") area = "도봉구"; 
    else if (req.query.area == "동대문구") area = "동대문구"; 
    else if (req.query.area == "동작구") area = "동작구"; 
    else if (req.query.area == "마포구") area = "마포구"; 
    else if (req.query.area == "서대문구") area = "서대문구"; 
    else if (req.query.area == "서초구") area = "서초구"; 
    else if (req.query.area == "성동구") area = "성동구"; 
    else if (req.query.area == "성북구") area = "성북구"; 
    else if (req.query.area == "송파구") area = "송파구"; 
    else if (req.query.area == "양천구") area = "양천구"; 
    else if (req.query.area == "영등포구") area = "영등포구"; 
    else if (req.query.area == "용산구") area = "용산구"; 
    else if (req.query.area == "은평구") area = "은평구"; 
    else if (req.query.area == "종로구") area = "종로구"; 
    else if (req.query.area == "중랑구") area = "중랑구"; 
    else if (req.query.area == "중구") area = "중구";
    let url = `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=" + ${qs.escape(area)} + "+%EB%82%A0%EC%94%A8`; 

    const getHtml = async () => {
        // axios.get 함수를 이용하여 비동기로 html 파일을 가져온다    
        try {    
        return await axios
        .get(url); 
        } catch (error) {
        console.error(error);
        }
    };

    //네이버 날씨 검색 결과 크롤링
    getHtml()
    .then(html => {
        let ulList = [];
        const $ = cheerio.load(html.data);
        const $nowTemp = $("div.temperature_text").find('strong').text();
        const $maxTemp = $("div.cell_temperature span.temperature_inner").find('span.highest').text();
        const $minTemp = $("div.cell_temperature span.temperature_inner").find('span.lowest').text();
        const $sky = $("div.temperature_info").find('span.weather.before_slash').text();
        const $now = $("div.relate_info._related_info dl.info").find('dd').text();
        
        //문자열 추출
        let nowTemp = $nowTemp.substring(5, 10);
        let maxTemp = $maxTemp.substring(4, 7);
        let minTemp = $minTemp.substring(4, 7);
        let now = $now.substring(12, 17);
  
        //Test
        console.log(nowTemp);
        console.log(maxTemp);
        console.log(minTemp);
        console.log($sky);
        console.log(now);
        console.log(url);

        res.render("weather", {title: "현재날씨 - sns",
        nowTemp: nowTemp, maxTemp: maxTemp, minTemp: minTemp,
        today: today, now: now, sky: $sky, area: area});
    });
})

module.exports = router;