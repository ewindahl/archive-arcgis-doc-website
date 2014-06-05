import os
import sys
import traceback



rootDir = os.path.normpath (os.path.join (os.getcwd(), ".."))


def flistHeader ():
   return u'''
      <html>
      <head>
         <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
         <meta name="ROBOTS" content="NOINDEX,FOLLOW" >
      </head>
      <body bgcolor="white">
'''

def flistFooter ():
   return u'''
      </body>
      </html>
'''

def generateL10nFlist():
   print "rootDir: ", rootDir
   
   os.chdir (rootDir+"/build")
   print "cd ", os.getcwd()
   flistContent = flistHeader()
   for path,dirs,files in os.walk('.'):
      if '.\en' not in path:
         for fn in files:
            if ".html" in fn.lower():
               fileFullPath = os.path.join(path,fn)
               fileFullPath = fileFullPath.replace("\\","/")
               fileFullPath = fileFullPath.replace(".","",1)
               #print os.path.join(path,fn)
               flistContent = flistContent + '<a href="' + fileFullPath + '">' + fileFullPath + '</a><br/>'
   
   flistContent += flistFooter()
   
   if not os.path.exists("flist"):
      try:
         os.makedirs("flist")
      except:
         print traceback.format_exc()
         
   try:
      flistFile = open('flist/l10n.html', 'w')
      flistFile.write(flistContent)
      print "Flist for l10 content has been generated!"
   except:
      print traceback.format_exc()