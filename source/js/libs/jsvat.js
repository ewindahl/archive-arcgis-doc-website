/*==================================================================================================

Application:   Utility Function
Author:        John Gardner

Version:       V1.0
Date:          30th July 2005
Description:   Used to check the validity of an EU country VAT number

Version:       V1.1
Date:          3rd August 2005
Description:   Lithunian legal entities & Maltese check digit checks added.

Version:       V1.2
Date:          20th October 2005
Description:   Italian checks refined (thanks Matteo Mike Peluso).

Version:       V1.3
Date:          16th November 2005
Description:   Error in GB numbers ending in 00 fixed (thanks Guy Dawson).

Version:       V1.4
Date:          28th September 2006
Description:   EU-type numbers added.

Version:       V1.5
Date:          1st January 2007
Description:   Romanian and Bulgarian numbers added.

Version:       V1.6
Date:          7th January 2007
Description:   Error with Slovenian numbers (thanks to Ales Hotko).

Version:       V1.7
Date:          10th February 2007
Description:   Romanian check digits added. Thanks to Dragu Costel for test suite.

Version:       V1.8
Date:          3rd August 2007
Description:   IE code modified to allow + and * in old format numbers. Thanks to Antonin Moy of 
               Spehere Solutions for pointing out the error.

Version:       V1.9
Date:          6th August 2007
Description:   BE code modified to make a specific check that the leading character of 10 digit 
               numbers is 0 (belts and braces).

Version:       V1.10
Date:          10th August 2007
Description:   Cypriot check digit support added.
               Check digit validation support for non-standard UK numbers

Version:       V1.11
Date:          25th September 2007
Description:   Spain check digit support for personal numbers.
               Author: David Perez Carmona

Version:       V1.12
Date:          23rd November 2009
Description:   GB code modified to take into account new style check digits.
               Thanks to Guy Dawson of Crossflight Ltd for pointing out the necessity.

Version:       V1.13
Date:          7th July 2012
Description:   EL, GB, SE and BE formats updated - thanks to Joost Van Biervliet

Version:       V.14
Date:          8th April 2013
Description:   BE Pattern match refined
               BG Add check digit checks for all four types of VAT number
               CY Pattern match improved
               CZ Personal pattern match checking improved
               CZ Personal check digits incorporated
               EE improved pattern match
               ES Physical person number checking refined
               GB Check digit support provided for 12 digit VAT codes and range checks included
               IT Bug removed to allow 999 and 888 issuing office codes
               LT temporarily registered taxpayers check digit support added
               LV Natural persons checks added
               RO improved pattern match
               SK improved pattern match and added check digit support
               
               Thanks to Theo Vroom for his help in this latest release.
               
Version:      V1.15
Date:         15th April 
              Swedish algorithm re-implemented.
  
Parameters:    toCheck - VAT number be checked. 

This function checks the value of the parameter for a valid European VAT number. 

If the number is found to be invalid format, the function returns a value of false. Otherwise it 
returns the VAT number re-formatted.
  
Example call:
  
  if (checkVATNumber (myVATNumber)) 
      alert ("VAT number has a valid format")
  else 
      alert ("VAT number has invalid format");
                    
---------------------------------------------------------------------------------------------------*/
function checkVATNumber(e){var t=new Array,n="GB";t.push(/^(AT)U(\d{8})$/),t.push(/^(BE)(0?\d{9})$/),t.push(/^(BG)(\d{9,10})$/),t.push(/^(CY)([0-5|9]\d{7}[A-Z])$/),t.push(/^(CZ)(\d{8,10})(\d{3})?$/),t.push(/^(DE)([1-9]\d{8})$/),t.push(/^(DK)((\d{8}))$/),t.push(/^(EE)(10\d{7})$/),t.push(/^(EL)(\d{9})$/),t.push(/^(ES)([A-Z]\d{8})$/),t.push(/^(ES)([A-H|N-S|W]\d{7}[A-J])$/),t.push(/^(ES)([0-9|Y|Z]\d{7}[A-Z])$/),t.push(/^(ES)([K|L|M|X]\d{7}[A-Z])$/),t.push(/^(EU)(\d{9})$/),t.push(/^(FI)(\d{8})$/),t.push(/^(FR)(\d{11})$/),t.push(/^(FR)[(A-H)|(J-N)|(P-Z)]\d{10}$/),t.push(/^(FR)\d[(A-H)|(J-N)|(P-Z)]\d{9}$/),t.push(/^(FR)[(A-H)|(J-N)|(P-Z)]{2}\d{9}$/),t.push(/^(GB)?(\d{9})$/),t.push(/^(GB)?(\d{12})$/),t.push(/^(GB)?(GD\d{3})$/),t.push(/^(GB)?(HA\d{3})$/),t.push(/^(GR)(\d{8,9})$/),t.push(/^(HU)(\d{8})$/),t.push(/^(IE)(\d{7}[A-W])$/),t.push(/^(IE)([7-9][A-Z\*\+)]\d{5}[A-W])$/),t.push(/^(IT)(\d{11})$/),t.push(/^(LV)(\d{11})$/),t.push(/^(LT)(\d{9}|\d{12})$/),t.push(/^(LU)(\d{8})$/),t.push(/^(MT)([1-9]\d{7})$/),t.push(/^(NL)(\d{9})B\d{2}$/),t.push(/^(PL)(\d{10})$/),t.push(/^(PT)(\d{9})$/),t.push(/^(RO)([1-9]\d{1,9})$/),t.push(/^(SI)([1-9]\d{7})$/),t.push(/^(SK)([1-9]\d[(2-4)|(6-9)]\d{7})$/),t.push(/^(SE)(\d{10}01)$/);var r=e.toUpperCase(),i=[" ","-",",","."];for(var s=0;s<i.length;s++)while(r.indexOf(i[s])!=-1)r=r.slice(0,r.indexOf(i[s]))+r.slice(r.indexOf(i[s])+1);var o=!1;for(s=0;s<t.length;s++)if(t[s].test(r)){var u=RegExp.$1,a=RegExp.$2;u.length==0&&(u=n);switch(u){case"AT":o=ATVATCheckDigit(a);break;case"BE":o=BEVATCheckDigit(a);break;case"BG":o=BGVATCheckDigit(a);break;case"CY":o=CYVATCheckDigit(a);break;case"CZ":o=CZVATCheckDigit(a);break;case"DE":o=DEVATCheckDigit(a);break;case"DK":o=DKVATCheckDigit(a);break;case"EE":o=EEVATCheckDigit(a);break;case"EL":o=ELVATCheckDigit(a);break;case"ES":o=ESVATCheckDigit(a);break;case"EU":o=EUVATCheckDigit(a);break;case"FI":o=FIVATCheckDigit(a);break;case"FR":o=FRVATCheckDigit(a);break;case"GB":o=UKVATCheckDigit(a);break;case"GR":o=ELVATCheckDigit(a);break;case"HU":o=HUVATCheckDigit(a);break;case"IE":o=IEVATCheckDigit(a);break;case"IT":o=ITVATCheckDigit(a);break;case"LT":o=LTVATCheckDigit(a);break;case"LU":o=LUVATCheckDigit(a);break;case"LV":o=LVVATCheckDigit(a);break;case"MT":o=MTVATCheckDigit(a);break;case"NL":o=NLVATCheckDigit(a);break;case"PL":o=PLVATCheckDigit(a);break;case"PT":o=PTVATCheckDigit(a);break;case"RO":o=ROVATCheckDigit(a);break;case"SE":o=SEVATCheckDigit(a);break;case"SI":o=SIVATCheckDigit(a);break;case"SK":o=SKVATCheckDigit(a);break;default:o=!0}o&&(o=r);break}return o}function ATVATCheckDigit(e){var t=0,n=[1,2,1,2,1,2,1],r=0;for(var i=0;i<7;i++)r=Number(e.charAt(i))*n[i],r>9?t=t+Math.floor(r/10)+r%10:t+=r;return t=10-(t+4)%10,t==10&&(t=0),t==e.slice(7,8)?!0:!1}function BEVATCheckDigit(e){return e.length==9&&(e="0"+e),e.slice(1,2)==0?!1:97-e.slice(0,8)%97==e.slice(8,10)?!0:!1}function BGVATCheckDigit(e){if(e.length==9){var t=0,n=0;for(var r=0;r<8;r++)n+=Number(e.charAt(r))*(r+1);t=n%11;if(t!=10)return t==e.slice(8)?!0:!1;var n=0;for(var r=0;r<8;r++)n+=Number(e.charAt(r))*(r+3);return t=n%11,t==10&&(t=0),t==e.slice(8)?!0:!1}if(/^\d\d[0-5]\d[0-3]\d\d{4}$/.test(e)){var i=Number(e.slice(2,4));if(i>0&&i<13||i>20&i<33){var s=[2,4,8,5,10,9,7,3,6],t=0;for(var r=0;r<9;r++)t+=Number(e.charAt(r))*s[r];t%=11,t==10&&(t=0);if(t==e.substr(9,1))return!0}}var s=[21,19,17,13,11,9,7,3,1],t=0;for(var r=0;r<9;r++)t+=Number(e.charAt(r))*s[r];if(t%10==e.substr(9,1))return!0;var s=[4,3,2,7,6,5,4,3,2],t=0;for(var r=0;r<9;r++)t+=Number(e.charAt(r))*s[r];return t=11-t%11,t==10?!1:(t==11&&(t=0),t==e.substr(9,1)?!0:!1)}function CYVATCheckDigit(e){if(Number(e.slice(0,2)==12))return!1;var t=0;for(var n=0;n<8;n++){var r=Number(e.charAt(n));if(n%2==0)switch(r){case 0:r=1;break;case 1:r=0;break;case 2:r=5;break;case 3:r=7;break;case 4:r=9;break;default:r=r*2+3}t+=r}return t%=26,t=String.fromCharCode(t+65),t==e.substr(8,1)?!0:!1}function CZVATCheckDigit(e){var t=0,n=[8,7,6,5,4,3,2],r=new Array;r[0]=/^\d{8}$/,r[1]=/^[0-5][0-9][0|1|5|6]\d[0-3]\d\d{3}$/,r[2]=/^6\d{8}$/,r[3]=/^\d{2}[0-3|5-8]\d[0-3]\d\d{4}$/;var i=0;if(r[0].test(e)){for(var i=0;i<7;i++)t+=Number(e.charAt(i))*n[i];return t=11-t%11,t==10&&(t=0),t==11&&(t=1),t==e.slice(7,8)?!0:!1}if(r[1].test(e))return(o=Number(e.slice(0,2))>53)?!1:!0;if(r[2].test(e)){for(var i=0;i<7;i++)t+=Number(e.charAt(i+1))*n[i];t=11-t%11,t==10&&(t=0),t==11&&(t=1);var s=[8,7,6,5,4,3,2,1,0,9,10];return s[t-1]==e.slice(8,9)?!0:!1}if(r[3].test(e)){var o=Number(e.slice(0,2))+Number(e.slice(2,4))+Number(e.slice(4,6))+Number(e.slice(6,8))+Number(e.slice(8));return o%11==0&&Number(e)%11==0?!0:!1}return!1}function DEVATCheckDigit(e){var t=10,n=0,r=0;for(var i=0;i<8;i++)n=(Number(e.charAt(i))+t)%10,n==0&&(n=10),t=2*n%11;return 11-t==10?r=0:r=11-t,r==e.slice(8,9)?!0:!1}function DKVATCheckDigit(e){var t=0,n=[2,7,6,5,4,3,2,1];for(var r=0;r<8;r++)t+=Number(e.charAt(r))*n[r];return t%=11,t==0?!0:!1}function EEVATCheckDigit(e){var t=0,n=[3,7,1,3,7,1,3,7];for(var r=0;r<8;r++)t+=Number(e.charAt(r))*n[r];return t=10-t%10,t==10&&(t=0),t==e.slice(8,9)?!0:!1}function ELVATCheckDigit(e){var t=0,n=[256,128,64,32,16,8,4,2];e.length==8&&(e="0"+e);for(var r=0;r<8;r++)t+=Number(e.charAt(r))*n[r];return t%=11,t>9&&(t=0),t==e.slice(8,9)?!0:!1}function ESVATCheckDigit(e){var t=0,n=0,r=[2,1,2,1,2,1,2],i=new Array;i[0]=/^[A-H|J|U|V]\d{8}$/,i[1]=/^[A-H|N-S|W]\d{7}[A-J]$/,i[2]=/^[0-9|Y|Z]\d{7}[A-Z]$/,i[3]=/^[K|L|M|X]\d{7}[A-Z]$/;var s=0;if(i[0].test(e)){for(s=0;s<7;s++)n=Number(e.charAt(s+1))*r[s],n>9?t=t+Math.floor(n/10)+n%10:t+=n;return t=10-t%10,t==10&&(t=0),t==e.slice(8,9)?!0:!1}if(i[1].test(e)){for(s=0;s<7;s++)n=Number(e.charAt(s+1))*r[s],n>9?t=t+Math.floor(n/10)+n%10:t+=n;return t=10-t%10,t=String.fromCharCode(t+64),t==e.slice(8,9)?!0:!1}if(i[2].test(e)){var o=e;return o.substring(0,1)=="Y"&&(o=o.replace(/Y/,"1")),o.substring(0,1)=="Z"&&(o=o.replace(/Z/,"2")),o.charAt(8)=="TRWAGMYFPDXBNJZSQVHLCKE".charAt(Number(o.substring(0,8))%23)}return i[3].test(e)?e.charAt(8)=="TRWAGMYFPDXBNJZSQVHLCKE".charAt(Number(e.substring(1,8))%23):!1}function EUVATCheckDigit(e){return!0}function FIVATCheckDigit(e){var t=0,n=[7,9,10,5,8,4,2];for(var r=0;r<7;r++)t+=Number(e.charAt(r))*n[r];return t=11-t%11,t>9&&(t=0),t==e.slice(7,8)?!0:!1}function FRVATCheckDigit(e){if(!/^\d{11}$/.test(e))return!0;var t=e.substring(2);return t=(t*100+12)%97,t==e.slice(0,2)?!0:!1}function HUVATCheckDigit(e){var t=0,n=[9,7,3,1,9,7,3];for(var r=0;r<7;r++)t+=Number(e.charAt(r))*n[r];return t=10-t%10,t==10&&(t=0),t==e.slice(7,8)?!0:!1}function IEVATCheckDigit(e){var t=0,n=[8,7,6,5,4,3,2];/^\d[A-Z\*\+]/.test(e)&&(e="0"+e.substring(2,7)+e.substring(0,1)+e.substring(7,8));for(var r=0;r<7;r++)t+=Number(e.charAt(r))*n[r];return t%=23,t==0?t="W":t=String.fromCharCode(t+64),t==e.slice(7,8)?!0:!1}function ITVATCheckDigit(e){var t=0,n=[1,2,1,2,1,2,1,2,1,2],r;if(Number(e.slice(0,7))==0)return!1;r=Number(e.slice(7,10));if(r<1||r>201&&r!=999&&r!=888)return!1;for(var i=0;i<10;i++)r=Number(e.charAt(i))*n[i],r>9?t=t+Math.floor(r/10)+r%10:t+=r;return t=10-t%10,t>9&&(t=0),t==e.slice(10,11)?!0:!1}function LTVATCheckDigit(e){if(e.length==9){if(!/^\d{7}1/.test(e))return!1;var t=0;for(var n=0;n<8;n++)t+=Number(e.charAt(n))*(n+1);if(t%11==10){var r=[3,4,5,6,7,8,9,1];t=0;for(n=0;n<8;n++)t+=Number(e.charAt(n))*r[n]}return t%=11,t==10&&(t=0),t==e.slice(8,9)?!0:!1}if(!/^\d{10}1/.test(e))return!1;var t=0,r=[1,2,3,4,5,6,7,8,9,1,2];for(var n=0;n<11;n++)t+=Number(e.charAt(n))*r[n];if(t%11==10){var r=[3,4,5,6,7,8,9,1,2,3,4];t=0;for(n=0;n<11;n++)t+=Number(e.charAt(n))*r[n]}return t%=11,t==10&&(t=0),t==e.slice(11,12)?!0:!1}function LUVATCheckDigit(e){return e.slice(0,6)%89==e.slice(6,8)?!0:!1}function LVVATCheckDigit(e){if(/^[0-3]/.test(e))return/^[0-3][0-9][0-1][0-9]/.test(e)?!0:!1;var t=0,n=[9,1,4,8,3,10,2,5,7,6];for(var r=0;r<10;r++)t+=Number(e.charAt(r))*n[r];return t%11==4&&e[0]==9&&(t-=45),t%11==4?t=4-t%11:t%11>4?t=14-t%11:t%11<4&&(t=3-t%11),t==e.slice(10,11)?!0:!1}function MTVATCheckDigit(e){var t=0,n=[3,4,6,7,8,9];for(var r=0;r<6;r++)t+=Number(e.charAt(r))*n[r];return t=37-t%37,t==e.slice(6,8)*1?!0:!1}function NLVATCheckDigit(e){var t=0,n=[9,8,7,6,5,4,3,2];for(var r=0;r<8;r++)t+=Number(e.charAt(r))*n[r];return t%=11,t>9&&(t=0),t==e.slice(8,9)?!0:!1}function PLVATCheckDigit(e){var t=0,n=[6,5,7,2,3,4,5,6,7];for(var r=0;r<9;r++)t+=Number(e.charAt(r))*n[r];return t%=11,t>9&&(t=0),t==e.slice(9,10)?!0:!1}function PTVATCheckDigit(e){var t=0,n=[9,8,7,6,5,4,3,2];for(var r=0;r<8;r++)t+=Number(e.charAt(r))*n[r];return t=11-t%11,t>9&&(t=0),t==e.slice(8,9)?!0:!1}function ROVATCheckDigit(e){var t=[7,5,3,2,1,7,5,3,2],n=e.length;t=t.slice(10-n);var r=0;for(var i=0;i<e.length-1;i++)r+=Number(e.charAt(i))*t[i];return r=10*r%11,r==10&&(r=0),r==e.slice(e.length-1,e.length)?!0:!1}function SEVATCheckDigit(e){var t=0,n;for(var r=0;r<9;r+=2)n=Number(e.charAt(r)),t=t+Math.floor(n/5)+n*2%10;var i=0;for(var r=1;r<9;r+=2)i+=Number(e.charAt(r));var s=(10-(t+i)%10)%10;return s==e.slice(9,10)?!0:!1}function SIVATCheckDigit(e){var t=0,n=[8,7,6,5,4,3,2];for(var r=0;r<7;r++)t+=Number(e.charAt(r))*n[r];return t=11-t%11,t==10&&(t=0),t!=11&&t==e.slice(7,8)?!0:!1}function SKVATCheckDigit(e){return Number(e%11)==0?!0:!1}function UKVATCheckDigit(e){var t=[8,7,6,5,4,3,2];if(e.substr(0,2)=="GD")return e.substr(2,3)<500?!0:!1;if(e.substr(0,2)=="HA")return e.substr(2,3)>499?!0:!1;var n=0;if(Number(e.slice(0))==0)return!1;var r=Number(e.slice(0,7));for(var i=0;i<7;i++)n+=Number(e.charAt(i))*t[i];var s=n;while(s>0)s-=97;return s=Math.abs(s),s==e.slice(7,9)&&r<9990001&&(r<1e5||r>999999)&&(r<9490001||r>97e5)?!0:(s>=55?s-=55:s+=42,s==e.slice(7,9)&&r>1e6?!0:!1)};