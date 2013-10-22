import os
import sys
import traceback

import platform
import shutil
import subprocess

import libl10n

'''
buildl10n.py all
buildl10n.py lang (lang is ar, de, ...)

'''

rootDir = os.path.normpath (os.path.join (os.getcwd(), ".."))
buildDir = os.path.normpath (os.path.join (rootDir, "..", "tmp"))



def doBuild (lg, srcRoot, buildDir):
   op = os.path

   print "srcRoot: ", srcRoot
   print "buildDir: ", buildDir

   dstRoot = op.join (buildDir, lg)
   print "mkdir ", dstRoot
   os.makedirs(dstRoot)

   for f in os.listdir (srcRoot):
      srcfp = op.join (srcRoot, f)
      if op.isfile (srcfp):
         dstfp = op.join (dstRoot, f)
         print "copy {0} -> {1}".format (srcfp, dstfp)
         shutil.copy(srcfp, dstfp)

   #copy locales
   srcfp = op.join (srcRoot, "locales.other", "{0}.yml".format (lg))
   dstd = op.join (dstRoot, "locales")
   dstfp = op.join (dstd, "{0}.yml".format (lg))
   os.makedirs(dstd)
   print "copy {0} -> {1}".format (srcfp, dstfp)
   shutil.copyfile(srcfp, dstfp)

   #copy source
   srcd = op.join (srcRoot, "source.other/{0}".format (lg))
   dstd = op.join (dstRoot, "source")
   print "copy {0} -> {1}".format (srcd, dstd)
   shutil.copytree(srcd, dstd)

   #copy source/layouts
   srcd = op.join (srcRoot, "source/layouts")
   dstd = op.join (dstRoot, "source/layouts")
   print "copy {0} -> {1}".format (srcd, dstd)
   shutil.copytree(srcd, dstd)

   #copy source/localizable/_partial
   srcd = op.join (srcRoot, "source/localizable/_partial")
   dstd = op.join (dstRoot, "source/localizable/_partial")
   print "copy {0} -> {1}".format (srcd, dstd)
   shutil.copytree(srcd, dstd)

   #build
   os.chdir (dstRoot)
   print "cd ", os.getcwd()
   bundle = "bundle.bat" if platform.system() == "Windows" else "bundle" 
   print subprocess.check_call([bundle, "exec", "middleman", "build"])

   #copy result
   srcd = op.join (dstRoot, "build", lg)
   dstd = op.join (srcRoot, "build", lg)
   if os.path.exists (dstd):
      print "rm ", dstd
      shutil.rmtree(dstd)

   print "copy {0} -> {1}".format (srcd, dstd)
   shutil.copytree(srcd, dstd)

def main():
   print "rootDir: ", rootDir
   print "buildDir: ", buildDir

   lgL = []
   v = sys.argv[1]
   if  v == "all":
      lgL = libl10n.langs
   elif v in libl10n.langs:
      lgL = [v]
   else:
      print "invalide lang ", v
      return

   if os.path.exists (buildDir):
      shutil.rmtree(buildDir)
   os.makedirs(buildDir)

   print "build ", lgL
   for lg in lgL:
      try:
         doBuild (lg, rootDir, buildDir)

      except:
         print traceback.format_exc()

main()
