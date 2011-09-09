import httplib,urllib

def youtube(videoID,eurl=None):
	'''
	Return direct URL to video and dictionary containing additional info
	>> url,info = GetYoutubeVideoInfo("tmFbteHdiSw")
	>>
	'''
	if not eurl:
		params = urllib.urlencode({'video_id':videoID})
	else :
		params = urllib.urlencode({'video_id':videoID, 'eurl':eurl})
	conn = httplib.HTTPConnection("www.youtube.com")
	conn.request("GET","/get_video_info?&%s"%params)
	response = conn.getresponse()
	data = response.read()
	video_info = dict((k,urllib.unquote_plus(v)) for k,v in
                               (nvp.split('=') for nvp in data.split('&')))
	conn.request('GET','/get_video?video_id=%s&t=%s' %
                         ( video_info['video_id'],video_info['token']))
	response = conn.getresponse()
	direct_url = response.getheader('location')
	return direct_url,video_info

