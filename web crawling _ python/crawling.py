import os
import sys
import datetime, time
import urllib.request
import requests
import selenium
import pandas as pd
from bs4 import BeautifulSoup as bs
from multiprocessing import Pool
from time import localtime, strftime
from datetime import timedelta
from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException

#Mail
import smtplib
from smtplib import SMTP as st
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import critical as ct

#terms
date = datetime.date.today()
delta = timedelta(days = 1)
fromtd = date-delta
today = "20"+str(date.strftime("%y/%m/%d"))
yester1 = "20"+str(fromtd.strftime("%y/%m/%d"))
arr = []
for i in range(2):
    fromtd = fromtd-delta
    arr.append("20"+str(fromtd.strftime("%y/%m/%d")))

yester2 = arr[0]
yester3 = arr[1]


class Dictionary :
    def __init__(self):
        self.keyword_list = {}
        self.url_list = {}
        self.user_list = {}

    def setKeyword(self, company, keyword):
        self.keyword_list[company] = keyword

    def setUrl(self, company, keyword):
        self.url_list[company] = keyword

    def setUser(self, user, company):
        self.user_list[user] = company

    def getKeyword(self):
        return self.keyword_list

    def getUrl(self):
        return self.url_list

    def getUser(self):
        return self.user_list

class WebCrawl :
    def __init__(self):
        self.html_txt = ''
    
    def init_driver(self, url):
        options = webdriver.ChromeOptions()
        options.add_argument('headless')
        options.add_argument('lang=ko_KR')
        options.add_argument('window-size=1400,1000')
        driver = webdriver.Chrome('chromedriver', options = options)
        driver.implicitly_wait(5)
        driver.get(url=url)
        return driver

    ###### 국가철도공단 ######
    def crawl_koreaRail(self, driver, key):
        data = []
        options = ['','공고구분','공고번호','공고명','설계금액','공고게시일','진행상태']
        #date 폼 맞추기 
        fromD = yester2.replace('/','-')
        #search key
        searchbox = driver.find_element_by_class_name('search')
        searchbox.clear()
        searchbox.send_keys(key)
           
        #date => clear안됨 수정해야됨
        form = driver.find_element_by_xpath('/html/body/section/section[2]/form/article[1]/ul/li[4]/input[1]')
        form.click()
        form.clear()
        form.send_keys(fromD)

        #search
        posting = WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.CSS_SELECTOR,'.btn_t4')))
        ActionChains(driver).click(posting).perform()

        html = driver.page_source

        start = html.find('<table')
        end = html.find('/table>')

        html = html[start:end]
        if html.find('자료가 없습니다. 다른 검색조건을 선택해주세요') != -1:
            return
        else:
            print('[%s]GET DATA...'%key)
            data.append(self.korea_getData())
            self.createHtml(data, options)
   
    ###### get data(국가철도공단) ######
    def korea_getData(self):
        data = []
        txt = ''
        arr = driver.find_elements_by_css_selector('body > section > section.Center > form > article.List_Area > div.Box > div.Grid > table > tbody > tr')

        for dt in arr:
            text = dt.text
            if text.find('개찰완료') == -1:
                arr = text.split(' ')
                temp = []
                txt = ''
                for i in range(len(arr)):
                    if i<3 or i >= len(arr)-3:
                        temp.append(arr[i])
                    if i>2 and i<len(arr)-3 :
                        txt += arr[i]+' '
                temp.insert(3, txt)
                txt = ''
                for tmp in temp:
                    txt += tmp+'/'
                data.append(txt)
                    
        return data
    
    ###### 나라장터(안산시,부천,서울교통공사) ###### 
    def crawl_by_region(self, driver, key, region):
        data = []

        btn = driver.find_element_by_class_name('btn_mdl')
        if btn.text == '검색화면으로 이동':
            btn.click()
            time.sleep(2)

        #기관명 세팅 : 안산시/부천시/서울교통공사
        if region != 'nara':
            ansan = driver.find_element_by_id('instNm')
            ansan.clear()
            ansan.send_keys(region)

        #키입력
        searchbox = driver.find_element_by_id('bidNm')
        searchbox.clear()
        searchbox.send_keys(key)

        #날짜 입력
        start = driver.find_element_by_id('fromBidDt')
        start.clear()
        start.send_keys(yester1)

        end = driver.find_element_by_id("toBidDt")
        end.clear()
        end.send_keys(today)

        #목록수 100개로 설정
        driver.find_element_by_xpath('//select[@name="recordCountPerPage"]/option[text()="100"]').click()

        #검색
        driver.find_element_by_xpath('//*[@id="buttonwrap"]/div[1]/a[1]').click()

        #데이터 검사
        try:
            isData = driver.find_element_by_xpath('//*[@class="tb_data_none"]/tr[1]/td[1]').text

            if isData.find('없습니다.') != -1 :
                return
        except:
            curUrl = driver.current_url
            self.writeHtml(curUrl)
            print('[%s]GET DATA...'%key)

        data.append(self.getdata(driver.current_url))
        
        options = ['업무','공고번호-차수','분류','공고명','공고기관','수욕기관','계약방법','입력일시','공동수급','투찰']
        self.createCSVFile(data, options, '나라장터('+region+').csv')

    ###### 국방전자조달시스템 ######
    def crawl_defence_organ(self, dirver, key):
        data = []
        time.sleep(2)
        
        #업무구분 모두 체크
        chkArr = ['pgb', 'psb', 'peb', 'pcb']
        for chk in chkArr:
            btn = driver.find_element_by_id(chk)
            bol = btn.is_selected()
            if btn.is_selected() == False:
                btn.click()

        #공고명 입력
        searchbox = driver.find_element_by_id('anmt_name')
        searchbox.clear()
        searchbox.send_keys(key)

        #날짜
        dateF = driver.find_element_by_id('datepicker_from')
        driver.execute_script('arguments[0].removeAttribute("readonly")', dateF)
        dateF.clear()
        dateF.send_keys(yester1)
        
        dateT = driver.find_element_by_id('datepicker_to')
        driver.execute_script('arguments[0].removeAttribute("readonly")', dateT)
        dateT.clear()
        dateT.send_keys(today)

        driver.find_element_by_xpath('//*[@id="pageUnitSelBox"]/option[3]').click()

        driver.find_element_by_id('btn_search').click()
        html = driver.page_source
        start = html.find('<table id="SBHE_DATAGRID_WHOLE_TABLE_datagrid1')
        last = html.find('/table>')+7

        data.append(self.defence_organ())
        print('[%s]GET DATA...'%key)
        
        options = ['순번','업무구분','입찰구분','공고구분', '공고일자','G2B공고번호-차수\n통합참조번호','판단번호','입찰건명','발주기관','생산능력제출 마감일시\n입찰참가등록 마감일시\n입찰서/견적서제출 마감일시','계약방법\n입찰형태','기초예가']
        self.createCSVFile(data, options, '국방전자조달시스템.csv')
        self.createHtml(data, options)

    def createHtml(self, data, options):
        if len(data[0]) <= 0:
            return
        i=0
        src = 'https://ebid.kr.or.kr/open/info/bidDetail.do?icGgBeonho='
        txt = """
            <table><thead><tr>
        """

        for dt in options:
            dt = dt.replace('\n','<br>')
            txt+= '<th>' + dt + '</th>'
        txt+='</tr></thead><tbody>'

        for dt in data:
            if len(dt) > 0:
                for item in dt:
                    its = item.split('/')
                    its.pop()
                    txt+='<tr>'
                    i=0
                    icGgBeonho = ''
                    for it in its:
                        it = it.replace('\n','<br>')
                        if i==2:
                            icGgBeonho = it
                        if i==3:
                            txt += '<td><a href="'+src+ icGgBeonho+'&todoPopup=Y">'+ it + '</a></td>'
                        else:
                            txt += '<td>' + it + '</td>'
                        i+=1
                    txt+='</tr>'

        txt += '</tbody></table>'
        self.html_txt += txt
        
    def defence_organ(self) :
        data = []
        num = 0
        txt = ''
        text = driver.find_elements_by_class_name('sbgrid_datagrid_Output')

        if len(text) > 0:
            for dt in text:
                if num % 12 == 0 and num != 0:
                    data.append(txt)
                    num = 0
                    txt = ''
                txt += dt.text+'/'
                num+=1
            return data
        else:
            return []
            
    ###### get data ######
    def getdata(self, url):
        data = []
        txt = ''
        num = 0
        res = requests.get(url)

        if res.status_code == 200:
            html = res.text
            soup = bs(html, 'html.parser')

            tbody = soup.select_one('tbody')
            tds = tbody.select('td')

            for td in tds:
                if num % 10 == 0 and num != 0:
                    data.append(txt)
                    txt = ''
                    num = 0
                t = td.get_text().replace('/','+')
                txt += t+'/'
                num+=1
        else:
            print("["+res.status_code+"] FAIL")

        return data

    
    ###### check if next page is exist ######
    def check_nextPage(self, path, num):
        try:
            pageNum = int(driver.find_element_by_xpath(path+str(num)+']').text)
            return True
        except:
            return False

    ###### create & write csv file (for accumulating) by organizations ######
    def writeFile(self, _list, data, fileName):
        index = []
        index.append(0)
        try:
            csv = pd.DataFrame(_list, index=index)
            if not os.path.exists(fileName):
                csv.to_csv(fileName, encoding='euc-kr', index=False, mode='w')
                print("[SUCCESS] WRITE FILE!! ("+fileName+")")
            else:
                csv.to_csv(fileName, encoding='euc-kr', index=False, mode='a', header=False)
                print("[SUCCESS] APPEND FILE!! ("+fileName+")")

        except:
            print("[FAIL] FAIL")
            self.finishCrawl(driver)

    def createCSVFile(self, data, options, fileName):
        _list = {}
        
        for dt in data:
            for strs in dt:
                if(strs!=''):
                    s = strs.split('/')
                    s.pop()
                    if '국토' in fileName:
                        url = 'https://ebid.kr.or.kr/open/info/bidDetail.do?icGgBeonho='+s[1]+'&todoPopup=Y'
                        s.append(url)
                    for idx in range(len(options)):
                        if '+' in s[idx]:
                            s[idx] = s[idx].replace('+','/')
                        _list[options[idx]] = s[idx]
                    self.writeFile(_list, data, fileName)

    ###### make html texts to send client ######
    def writeHtml(self, url):
        req = requests.get(url)
        html = req.text

        start = html.find('<table')
        end = html.find('/table>')+7

        html_table = html[start:end]
        self.html_txt += html_table

    ###### dispose driver ######
    def disposeDriver(self,driver):
        driver.quit()

    ###### return html text ######
    def gethtmlText(self):
        return self.html_txt

class Mail:

    def __init__(self):
        self.from_ = ct.get_myAddress()
        self.pwd_ = ct.get_myPwd()

    def sendMail(self, txt):
        html_txt = """<html><head><title></title></head><body>""" + txt + '/body></html>'
        html_txt = self.correctTxt(txt)
        to_ = get_userAddress()
        msg = MIMEMultipart('alternative')
        msg['Subject'] = '나라장터'
        msg['From'] = self.from_
        msg['To'] = to_

        part = MIMEText(html_txt, 'html')

        msg.attach(part)
        mail = smtplib.SMTP('smtp.gmail.com', 587)
        mail.ehlo()
        mail.starttls()
        mail.login(self.from_, self.pwd_)
        mail.sendmail(self.from_, to_, msg.as_string())
        mail.quit()
        print('\n 메일을 보냈습니다.')

    def correctTxt(self, txt):
        txt = txt.replace('<table', '<table style="border-collapse:collapse;width:100%"')
        txt = txt.replace('<th','<th style="background-color:#ccdef6; text-align:center; font-size:11px;"')
        txt = txt.replace('<td','<td style="text-align:center; border:1px solid #bbb; font-size:11px;"')
        
        start = txt.find('<caption')
        to = txt.find('/caption>')+9
        str1 = txt[start:to]
        txt = txt.replace(str1, '')
        return txt
    
def fileOpen(file):
    dic = Dictionary()

    try:
        f=open(file, "r")
    except:
        sys.stderr.write("no file:%s\n"%file)

    while True:
        line = f.readline()
        if not line:
            f.close()
            break

        key = line.split("~")[0]
        val = line.split("~")[1].rstrip('\n')

        if(file.find('keyword')!=-1):
            dic.setKeyword(key, val)
        elif(file.find('user')!=-1):
            dic.setUser(key, val)
        else:
            dic.setUrl(key, val)
        
    return dic

if __name__ == '__main__':
    
    #setdata
    keyword = fileOpen("keyword.txt")
    url = fileOpen("url.txt")
    user = fileOpen("user.txt")

    #crawl
    keyList = keyword.getKeyword()
    urlList = url.getUrl()
    result = ''
    for key,value in keyList.items():
        
        if(key == '서울교통공사'):
            print("\n--------------------------------------------")
            print('\t'+key+"  CRAWLING...")
            crawl = WebCrawl()
            driver = crawl.init_driver(urlList['서울교통공사'])
            x = value.split(',')
            for idx in x:
                crawl.crawl_by_region(driver, idx, '서울교통공사')
            crawl.disposeDriver(driver)
            result += '<br><center><h3>서울교통공사</h3></center><br>'
            result += crawl.gethtmlText()

        
        if(key == '국가철도공단'):
            print("\n--------------------------------------------")
            print('\t'+key+"  CRAWLING...")
            crawl = WebCrawl()
            driver = crawl.init_driver(urlList['국가철도공단'])
            x = value.split(',')
            for idx in x:
                crawl.crawl_koreaRail(driver, idx)
            crawl.disposeDriver(driver)
            result += '<br><center><h3>국가철도공단</h3></center><br>'
            result += crawl.gethtmlText()
        
        if(key == '나라장터(안산시)'):
            print("\n--------------------------------------------")
            print('\t'+key+"  CRAWLING...")
            crawl = WebCrawl()
            driver = crawl.init_driver(urlList['나라장터(안산시)'])
            x = value.split(',')
            for idx in x:
                crawl.crawl_by_region(driver, idx, '안산시')
            crawl.disposeDriver(driver)
            result += '<br><center><h3>안산시</h3></center><br>'
            result += crawl.gethtmlText()

        if(key == '나라장터'):
            print("\n--------------------------------------------")
            print('\t'+key+"  CRAWLING...")
            crawl = WebCrawl()
            driver = crawl.init_driver(urlList['나라장터'])
            x = value.split(',')
            for idx in x:
                crawl.crawl_by_region(driver, idx, 'nara')
            crawl.disposeDriver(driver)
            result += '<br><center><h3>나라장터</h3></center><br>'
            result += crawl.gethtmlText()

        if(key == '부천시청'):
            print("\n--------------------------------------------")
            print('\t'+key+"  CRAWLING...")
            crawl = WebCrawl()
            driver = crawl.init_driver(urlList['부천시청'])
            x = value.split(',')
            for idx in x:
                crawl.crawl_by_region(driver, idx, '부천')
            crawl.disposeDriver(driver)
            result += '<br><center><h3>부천시청</h3></center><br>'
            result += crawl.gethtmlText()
        
        if(key == '국방전자조달시스템'):
            print("\n--------------------------------------------")
            print('\t'+key+"  CRAWLING...")
            crawl = WebCrawl()
            driver = crawl.init_driver(urlList['국방전자조달시스템'])
            x = value.split(',')
            for idx in x:
                crawl.crawl_defence_organ(driver, idx)
            crawl.disposeDriver(driver)
            result += '<br><center><h3>국방전자조달시스템</h3></center><br>'
            result += crawl.gethtmlText()
        
    #메일 보내
    mail = Mail()
    mail.sendMail(result)
    
        
