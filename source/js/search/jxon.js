/*
#3 algo from https://developer.mozilla.org/en/Parsing_and_serializing_XML
*/

function buildValue(sValue) {
    if (/^\s*$/.test(sValue)) { return null; }
    return sValue;
}

function getXMLData(oXMLParent) {

    var vResult = /* put here the default value for empty nodes! */true, nLength = 0, sCollectedTxt = "";

    /* replace hasAttributes() with attributes property*/
    if (oXMLParent.attributes && oXMLParent.attributes.length > 0) {
        vResult = {};
        var attrs = oXMLParent.attributes;
        for (var alen = attrs.length ; nLength < alen; nLength++) {
            oItAttr = attrs.item(nLength);
            vResult["@" + oItAttr.nodeName.toLowerCase()] = buildValue(oItAttr.nodeValue.replace(/^\s+|\s+$/g, ""));
        }
    }
    if (oXMLParent.hasChildNodes()) {
        var cNodeL = oXMLParent.childNodes;
        for (var oItChild, sItKey, sItVal, nChildId = 0, clen = cNodeL.length; 
            nChildId < clen; nChildId++) {
            
            oItChild = cNodeL.item(nChildId);
            if (oItChild.nodeType === 1 && !oItChild.prefix) { /* nodeType is "Element" (1) */
                if (nLength === 0) { vResult = {}; }
                sItKey = oItChild.nodeName.toLowerCase();
                sItVal = getXMLData(oItChild);
                if (vResult.hasOwnProperty(sItKey)) {
                    if (vResult[sItKey].constructor !== Array) { vResult[sItKey] = [vResult[sItKey]]; }
                    vResult[sItKey].push(sItVal);
                } else { vResult[sItKey] = sItVal; nLength++; }
            }
            else if (oItChild.nodeType === 3) { sCollectedTxt += oItChild.nodeValue.replace(/^\s+|\s+$/g, ""); } /* nodeType is "Text" (3) */
            else if (oItChild.nodeType === 4) { sCollectedTxt += oItChild.nodeValue; } /* nodeType is "CDATASection" (4) */
        }
    }
    if (sCollectedTxt) { nLength > 0 ? vResult.keyValue = buildValue(sCollectedTxt) : vResult = buildValue(sCollectedTxt); }
    return vResult;
}