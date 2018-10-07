import cv2
import sys
import re
import os
import traceback

try:
	
	vidcap = cv2.VideoCapture(sys.argv[1])

	vidcap.set(cv2.CAP_PROP_POS_AVI_RATIO, 1)

	vid_length = (vidcap.get(cv2.CAP_PROP_POS_MSEC) / 1000) * 24

	vidcap.set(cv2.CAP_PROP_POS_AVI_RATIO, 0)

	success, image = vidcap.read()

	name = re.sub(r'\..*', '', sys.argv[1])

	if not os.path.exists(name):
		os.makedirs(name)
		
	count = 0

	while success:
		image_name = "%s/%s_frame_%d.jpg" % (name, name, count) 
		
		print('Read a new frame: ', success, ' ', vid_length, ' / ', image_name)
		
		cv2.imwrite(image_name, image)     # save frame as JPEG file      
		
		success,image = vidcap.read()
		
		
		count += 1

except:
	print("Unexpected error:", sys.exc_info()[0])
	traceback.print_stack()
