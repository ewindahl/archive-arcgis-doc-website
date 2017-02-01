require "middleman-core"



module Download
  class << self

    # Called when trial extension activated
    def registered(app, options={})

      # Setup extension-specific config
      app.set :config_variable, false


	  app.helpers do


	  	def getAttrData(product,dataAttr)

	  		if data.downloads[current_language]
				prodObj = data.downloads[current_language]
			else
				prodObj = data.downloads['en']
			end

			explodedStr = product.split("~")

			if explodedStr.length > 0
				explodedStr.each{|k,v|
					prodObj = prodObj.send(k.to_sym) ? prodObj.send(k.to_sym) : false
					if not prodObj
						break
					end
				}
			end


			retValue = (prodObj and prodObj.send(dataAttr.to_sym)) ? prodObj.send(dataAttr.to_sym) : ""
			#retValue = prodObj.send(dataAttr.to_sym) ? prodObj.send(product.to_sym).send(dataAttr.to_sym) : ""

			return retValue
		end

		def isMultiVersions (prodObj)
			return (prodObj.send("versions".to_sym) and prodObj.send("versions".to_sym).count() > 1) ? true : false
		end

    def generateDownloadsJson (prodName)
      require 'json'
      require 'yaml'
      input_file = File.open('data/downloads.yml', 'r')
      input_yml = input_file.read
      input_file.close
      yaml_data = YAML::load(input_yml)
      if yaml_data['en'][prodName]
        output_json = JSON.dump(yaml_data['en'][prodName])
      else
        output_json = "{}"
      end
      return output_json
    end

    def generateVersionButtons(dataPath)
      if data.downloads[current_language]
				prodObj = data.downloads[current_language]
			else
				prodObj = data.downloads['en']
			end

      explodedStr = dataPath.split("~")
			appDownloadType = explodedStr[3]

			if explodedStr.length > 0
				explodedStr.each{|k,v|
					prodObj = prodObj.send(k.to_sym) ? prodObj.send(k.to_sym) : false
					if not prodObj
						break
					end
				}
			end

      retValue = ""

      deviceNames = {'windows64' => 'Windows x64', 'windows86' => 'Windows x86', 'mac' => 'macOS', 'linux' => 'Linux'}

      deviceName = deviceNames[explodedStr[2].to_s].to_s

      if isMultiVersions(prodObj)
        firstVersion = true
        prodObj.send("versions".to_sym).each {|k,v|
          retValue = retValue + '<div class="js-download '
          if firstVersion
            firstVersion = false
          else
            retValue = retValue + 'hide '
          end
					fileSize = v['filesize'] ? v['filesize'] : "&nbsp;"
          retValue = retValue + 'clearfix" data-sdk="' + explodedStr[0] + '-' + explodedStr[1] + '-' + k.to_s + '">
            <div class="column-5 first-column">
              <a href="#" class="btn btn-fill icon-ui-download download-link" style="margin:.375rem 0" data-filename="' + v['filename'] + '" data-folder="' + v['foldername'] + '">' + deviceName + '</a>
            </div>
            <div class="column-6 text-gray font-size--3 last-column">
              <p class="trailer-0 leader-half"><b>Size:</b> <span>' + fileSize + '</span></p>
            </div>
          </div>'
				}
      else
        fileSize = prodObj['filesize'] ? prodObj['filesize'] : "&nbsp;"
        retValue = retValue + '<div class="js-download clearfix" data-sdk="' + explodedStr[0] + '-' + explodedStr[1] + '">
          <div class="column-5 first-column">
            <a href="' + prodObj['url'] + '" class="btn btn-fill icon-ui-download download-link" style="margin:.375rem 0">' + deviceName + '</a>
          </div>
          <div class="column-6 text-gray font-size--3 last-column">
            <p class="trailer-0 leader-half"><b>Size:</b> <span>' + fileSize + '</span></p>
          </div>
        </div>'
      end
      return retValue
    end

		def generateDevVersionDropDown (dataPath)
			if data.downloads[current_language]
				prodObj = data.downloads[current_language]
			else
				prodObj = data.downloads['en']
			end

			explodedStr = dataPath.split("~")
			appDownloadType = explodedStr[3]

			if explodedStr.length > 0
				explodedStr.each{|k,v|
					prodObj = prodObj.send(k.to_sym) ? prodObj.send(k.to_sym) : false
					if not prodObj
						break
					end
				}
			end

			retValue = ""
			if isMultiVersions(prodObj)
        retValue = '<a href="#" class="js-dropdown-toggle btn btn-clear btn-small dropdown-btn" aria-expanded="false">Version '
        firstVersion = true
				prodObj.send("versions".to_sym).each {|k,v|
					fileSize = v['filesize'] ? v['filesize'] : "&nbsp;"
          if firstVersion
              retValue = retValue + k.to_s + '</a>
              <nav class="dropdown-menu dropdown-right">
              <a href="#" class="dropdown-link js-version icon-ui-check-mark version-is-active"  data-sdk="' + explodedStr[0] + '-' + explodedStr[1] + '-' + k.to_s + '">' + k.to_s + '</a>'
              firstVersion = false
          else
            retValue = retValue + '<a href="#" class="dropdown-link js-version icon-ui-check-mark"  data-sdk="' + explodedStr[0] + '-' + explodedStr[1] + '-' + k.to_s + '">' + k.to_s + '</a>'
          end
				}
				retValue = retValue + "</nav>"
			end
			return retValue
		end

    def generateVersionDropDown (dataPath)
      if data.downloads[current_language]
        prodObj = data.downloads[current_language]
      else
        prodObj = data.downloads['en']
      end

      explodedStr = dataPath.split("~")
      appDownloadType = explodedStr[3]

      if explodedStr.length > 0
        explodedStr.each{|k,v|
          prodObj = prodObj.send(k.to_sym) ? prodObj.send(k.to_sym) : false
          if not prodObj
            break
          end
        }
      end

      retValue = ""
      if isMultiVersions(prodObj)
        retValue = "<div class='dropdown-wrapper dropdown js-dropdown'>
                          <button class='btn btn-transparent dropdown-btn js-dropdown-toggle' tabindex='0' aria-haspopup='true' aria-expanded='false'>Version <span class='dropdown dropdown-selected' filename='' foldername='' href='#'></span></button>
                          <div class='dropdown-content'>
                            <nav class='dropdown-menu modifier-class' role='menu'>"
        #if isMultiVersions(prodObj) == true
        prodObj.send("versions".to_sym).each {|k,v|
          fileSize = v['filesize'] ? v['filesize'] : "&nbsp;"
          retValue = retValue + '<a href="#" class="dropdown-link" role="menu-item" data-file-size="' + fileSize + '" data-app-folder="' + v['foldername'] + '" data-app-file="' + v['filename'] + '">' + k.to_s + '</a>'
        }
        retValue = retValue + "</nav>
        </div></div>
        <br /><a class='btn download-link' data-folder='' data-filename=''>Download</a>"
      else
        prodObj.send("versions".to_sym).each {|k,v|
          fileSize = v['filesize'] ? v['filesize'] : "&nbsp;"
          retValue = retValue + '
          Version <span class="dropdown dropdown-selected" filename="" foldername="" href="#">' + k.to_s + '</span><br/>
          <a href="#" class="btn download-link" data-file-size="' + fileSize + '" data-folder="' + v['foldername'] + '" data-filename="' + v['filename'] + '">Download</a>'
        }
      end



      return retValue
    end

		def getExtensionNames (extensions,type)
			names = ""

			extensions.each {|k,v|
				names = names + ',' + k + '-' + v[type]
			}
			return names

		end

	  end

    end
    alias :included :registered
  end
end

# Register extensions which can be activated
# Make sure we have the version of Middleman we expect
::Middleman::Extensions.register(:download) do

   # Return the extension module
   ::Download

end
