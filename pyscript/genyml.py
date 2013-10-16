import os
import sys

import shutil

import libl10n

def main():

   srcdir = "../locales.other"
   srcfp = os.path.join (srcdir, "en.yml")
   dstdir = "../locales.other"
   for lg in libl10n.langs:
      dstfp = os.path.join (dstdir, "{0}.yml".format (lg))
      print "{0} -> {1}".format (srcfp, dstfp)
      shutil.copyfile (srcfp, dstfp)

main()
