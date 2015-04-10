# ArcGIS for Doc Website

This readme covers install and set-up of the repo. If you want information on the site itself--who works on it, how it is managed, release plans, and so on, see the [Wiki](https://github.com/ArcGIS/arcgis-doc-website/wiki).

This website is based off of [Middleman](http://middlemanapp.com/) + [ArcGIS CSS Framework](http://https://github.com/ArcGIS/arcgis-for-developers-css).

### Testing Server Locations
 * Development - http://docdev.arcgis.com/
 * Staging - http://docstg.arcgis.com/
 * Production - http://doc.arcgis.com/

### Features

### Installation Instructions

Follow the [installation instructions](https://github.com/ArcGIS/arcgis-solutions-website/wiki/Setting-up-your-local-machine) on the Solutions wiki. If applicable, fork the Doc WebSite repo, not the Solution Website repo.


### Working with Bundler and MiddleMan
 * Run `bundle exec middleman server` to run the middleman server locally.
 * Run `bundle exec middleman build` to have middleman build the files into static HTML.

### Requirements
 * Ruby - http://rubyinstaller.org/ is a great way to go. You need Ruby 1.9.3.
 * Ruby Development Kit. `DevKit-tdm-32-x.x.x` A walkthrough is available [here](https://github.com/oneclick/rubyinstaller/wiki/development-kit)
 * [ArcGIS CSS Framework](https://github.com/ArcGIS/arcgis-for-developers-css)

## Working with branches
* Working on a new branch for the first time:
	* `git fetch ArcGIS`
	* `git checkout -b branch-name ArcGIS/branch-name`


* Day to day sync with ArcGIS main repo:
	* `git checkout branch-name` (if you are on any other branch)
	* `git fetch ArcGIS`
	* `git merge ArcGIS/branch-name`


* Pushing changes to your Fork:
`git push origin branch-name` (or click on sync link on Github client if you are not pushing the changes for the first 
time)

* Making pull request:
	* Go to you fork and select the relevant branch
	* Click on green pull request button and follow the instructions. Please make sure that pull request destination is 
correct.

 
## Admin

### Sync

Assuming /Users/thom4729/a/projects/websites/PRD/arcgis-doc-website

```

rsync -Chvur  --dry-run build/ /Volumes/Doc/


```
