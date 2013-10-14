import os
import sys

import shutil

import libl10n

def main():
   srcdir = "../source/localizable/maps-for-office"
   for lg in libl10n.langs:
      dstdir = os.path.join ("..", "source.{0}".format (lg), "localizable/maps-for-office")
      print "create {0} -> {1}".format (srcdir, dstdir)
      shutil.copytree (srcdir, dstdir)

      srcfp = "../tmp/{0}/index.html.erb".format (lg)
      dstfp = os.path.join (dstdir, "index.html.erb")
      print "copy {0} -> {1}".format (srcfp, dstfp)
      shutil.copyfile (srcfp, dstfp)
main()
