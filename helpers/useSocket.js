import Vue from 'vue'
import socket from "../helpers/socket.js"; //引入socket.js 重要
import store from '../store'
import apirequest from '../helpers/apiconfig.js'

let IM_AUTOTIP_ENABLE = 0;

var _x62010=['\x24\x53\x6f\x63\x6b\x65\x74','\x24\x53\x6f\x63\x6b\x65\x74','\x77\x73\x73\x3a\x2f\x2f\x69\x6d\x2e\x73\x75\x74\x65\x73\x68\x6f\x70\x2e\x63\x6f\x6d\x3a\x39\x35\x30\x31\x3f\x75\x69\x64\x3d\x38\x34\x33\x38\x31\x37\x31\x39\x26\x70\x75\x69\x64\x3d\x31\x30\x31\x37\x2d\x31\x30\x30\x30\x32\x26\x73\x75\x69\x64\x3d\x31\x30\x31\x37\x26\x74\x6f\x6b\x65\x6e\x3d\x31\x36\x35\x64\x34\x34\x38\x63\x33\x32\x33\x37\x34\x34\x36\x61\x61\x63\x33\x35\x66\x36\x39\x36\x65\x33\x61\x66\x64\x65\x66\x33','\x6c\x6f\x67','\u8fde\u63a5\u6210\u529f','\x6c\x6f\x67','\u5173\u95ed\u4e86\u8fde\u63a5','\x6c\x6f\x67','\u91cd\u8f7d\uff1a','\x6c\x6f\x67','\u6b21\u91cd\u8fde\u5df2\u5b8c\u6210','\x69\x6e\x66\x6f','\x6f\x6e\x4d\x65\x73\x73\x61\x67\x65','\x70\x75\x69\x64','\x69\x6d','\x75\x73\x65\x72\x49\x6e\x66\x6f','\x73\x74\x61\x74\x65','\x70\x61\x72\x73\x65','\x64\x61\x74\x61','\x69\x6e\x66\x6f','\x69\x6d\x5f\x64\x65\x63\x6f\x64\x65\x5f\x6d\x73\x67','\x74\x79\x70\x65','\x69\x6e\x69\x74','\x74\x68\x65\x6e','\x72\x65\x67\x69\x73\x74\x43\x6c\x69\x65\x6e\x74\x69\x64\x5f\x66','\x63\x6c\x69\x65\x6e\x74\x5f\x69\x64','\x63\x6f\x64\x65','\x64\x61\x74\x61','\x73\x68\x6f\x77\x54\x6f\x61\x73\x74','\x6e\x6f\x6e\x65','\x6d\x73\x67','\x64\x61\x74\x61','\x66\x72\x69\x65\x6e\x64','\x63\x6f\x6d\x6d\x69\x74','\x73\x65\x74\x43\x75\x72\x72\x65\x6e\x74\x4d\x73\x67','\x69\x6e\x66\x6f','\x2d\x2d\x2d\x2d\x2d\x2d\x2d\x2d\x2d\x2d\x2d\x2d\x2d\x2d\x2d\x2d\x2d\x2d\x2d\x2d\x2d','\x69\x6e\x66\x6f','\x69\x64','\x63\x75\x72\x72\x65\x6e\x74\x43\x68\x61\x74\x50\x75\x69\x64','\x73\x74\x61\x74\x65','\x72\x74\x63','\x6d\x73\x67\x5f\x74\x79\x70\x65','\x73\x68\x6f\x77\x4d\x6f\x64\x61\x6c','\x75\x73\x65\x72\x6e\x61\x6d\x65','\u662f\u5426\u63a5\u5165\u97f3\u89c6\u9891\u804a\u5929\uff1f','\x63\x6f\x6e\x66\x69\x72\x6d','','\x2f\x72\x74\x63\x2f\x72\x6f\x6f\x6d\x2f\x31\x76\x31\x77\x78\x3f\x74\x6f\x5f\x75\x73\x65\x72\x5f\x69\x64\x3d','\x75\x73\x65\x72\x5f\x69\x64','\x6e\x61\x76\x69\x67\x61\x74\x65\x54\x6f','\x2f\x72\x74\x63\x2f\x72\x6f\x6f\x6d\x2f\x31\x76\x31\x3f\x74\x6f\x5f\x75\x73\x65\x72\x5f\x69\x64\x3d','\x75\x73\x65\x72\x5f\x69\x64','\x6e\x61\x76\x69\x67\x61\x74\x65\x54\x6f','\x63\x61\x6e\x63\x65\x6c','\x6c\x6f\x67','\u7528\u6237\u70b9\u51fb\u53d6\u6d88','\x73\x68\x6f\x77\x4d\x6f\x64\x61\x6c','\x75\x73\x65\x72\x6e\x61\x6d\x65','\u53d1\u6765\u6d88\u606f\uff0c\x20\u662f\u5426\u63a5\u5165\u804a\u5929\uff1f','\x63\x6f\x6e\x66\x69\x72\x6d','\x6e\x61\x76\x69\x67\x61\x74\x65\x54\x6f','\x2f\x69\x6d\x2f\x63\x68\x61\x74\x2f\x63\x68\x61\x74\x3f\x75\x69\x64\x3d','\x75\x73\x65\x72\x5f\x69\x64','\x26\x6e\x61\x6d\x65\x3d','\x75\x73\x65\x72\x6e\x61\x6d\x65','\x26\x74\x79\x70\x65\x3d','\x26\x70\x75\x69\x64\x3d','\x69\x64','\x63\x61\x6e\x63\x65\x6c','\x6c\x6f\x67','\u7528\u6237\u70b9\u51fb\u53d6\u6d88','\x69\x64','\x63\x6f\x6d\x6d\x69\x74','\x75\x70\x64\x61\x74\x65\x43\x68\x61\x74\x65\x72\x41\x74\x74\x72','\x75\x73\x65\x72','\x69\x64','\x6c\x61\x73\x74\x6d\x73\x67','\x63\x6f\x6e\x74\x65\x6e\x74','\x6d\x73\x67\x2e\x6d\x73\x67\x2e\x74\x69\x6d\x65','\x63\x6f\x6e\x74\x65\x6e\x74','\x69\x64','\x61\x76\x61\x74\x61\x72','\x75\x73\x65\x72\x5f\x69\x64','\x75\x73\x65\x72\x6e\x61\x6d\x65','\x74\x79\x70\x65','\x63\x61\x63\x68\x65\x4d\x65\x73\x73\x61\x67\x65','\x75\x73\x65\x72','\x69\x64','\x67\x72\x6f\x75\x70','\x63\x6f\x6d\x6d\x69\x74','\x73\x65\x74\x43\x75\x72\x72\x65\x6e\x74\x4d\x73\x67','\x73\x65\x6e\x64\x6d\x65\x74\x68\x6f\x64','\x67\x72\x6f\x75\x70','\x74\x6f\x69\x64','\x66\x72\x6f\x6d\x69\x64','\x63\x6f\x6d\x6d\x69\x74','\x75\x70\x64\x61\x74\x65\x43\x68\x61\x74\x65\x72\x41\x74\x74\x72','\x73\x65\x6e\x64\x6d\x65\x74\x68\x6f\x64','\x6c\x61\x73\x74\x6d\x73\x67','\x63\x6f\x6e\x74\x65\x6e\x74','\x67\x6d\x73\x67\x2e\x6d\x73\x67\x2e\x74\x69\x6d\x65','\x63\x6f\x6e\x74\x65\x6e\x74','\x69\x64','\x61\x76\x61\x74\x61\x72','\x75\x73\x65\x72\x5f\x69\x64','\x75\x73\x65\x72\x6e\x61\x6d\x65','\x74\x79\x70\x65','\x63\x61\x63\x68\x65\x4d\x65\x73\x73\x61\x67\x65','\x73\x65\x6e\x64\x6d\x65\x74\x68\x6f\x64','\x73\x65\x74\x66\x72\x69\x65\x6e\x64\x73\x74\x75\x65','\x63\x6f\x6d\x6d\x69\x74','\x73\x65\x74\x46\x72\x69\x65\x6e\x64\x73\x74\x75\x65','\x74\x6f\x69\x64','\x73\x74\x61\x74\x65','\x63\x68\x61\x72\x61\x63\x74\x65\x72','\x6d\x73\x67\x62\x6f\x78\x75\x73\x65\x72','\x63\x6f\x6d\x6d\x69\x74','\x73\x65\x74\x6d\x73\x67\x62\x6f\x78\x75\x73\x65\x72','\x6d\x73\x67\x62\x6f\x78\x67\x72\x6f\x75\x70','\x63\x6f\x6d\x6d\x69\x74','\x73\x65\x74\x6d\x73\x67\x62\x6f\x78\x67\x72\x6f\x75\x70','\x61\x64\x64\x67\x72\x6f\x75\x70','\x63\x6f\x6d\x6d\x69\x74','\x75\x70\x64\x61\x74\x65\x47\x72\x6f\x75\x70\x6c\x69\x73\x74','\x61\x64\x64\x66\x72\x69\x65\x6e\x64','\x63\x6f\x6d\x6d\x69\x74','\x75\x70\x64\x61\x74\x65\x46\x72\x69\x65\x6e\x64\x6c\x69\x73\x74'];if(!global[_x62010[0]]){global[_x62010[1]]=new socket({url:_x62010[2],maxInterValCount:5,interValTime:2000,onOpen(res){console[_x62010[3]](_x62010[4]);},onClose(err){console[_x62010[5]](_x62010[6]);},onReload(res){console[_x62010[7]](_x62010[8]+res);},onRdFinsh(count){console[_x62010[9]](count+_x62010[10]);},onMsg(res){console[_x62010[11]](_x62010[12]);let usign=store[_x62010[16]][_x62010[15]][_x62010[14]][_x62010[13]];let that=this;let temdata=JSON[_x62010[17]](res[_x62010[18]]);console[_x62010[19]](temdata);temdata=apirequest[_x62010[20]](temdata);switch(temdata[_x62010[21]]){case _x62010[22]:apirequest[_x62010[24]]({data:{'cid':temdata[_x62010[25]],'usign':usign}})[_x62010[23]](res=>{if(res[_x62010[27]][_x62010[26]]!=1){uni[_x62010[28]]({icon:_x62010[29],title:res[_x62010[31]][_x62010[30]]});}});break;case _x62010[32]:let msg=temdata;let tempv_fid=0;store[_x62010[33]](_x62010[34],msg);console[_x62010[35]](_x62010[36]);console[_x62010[37]](msg);if(msg[_x62010[38]]!=store[_x62010[40]][_x62010[39]]){if(_x62010[41]==msg[_x62010[42]]){uni[_x62010[43]]({title:msg[_x62010[44]],content:_x62010[45],success:function(res){if(res[_x62010[46]]){let url=_x62010[47];url=_x62010[48]+msg[_x62010[49]];uni[_x62010[50]]({url:url});url=_x62010[51]+msg[_x62010[52]];uni[_x62010[53]]({url:url});}else if(res[_x62010[54]]){console[_x62010[55]](_x62010[56]);}}});}else{if(IM_AUTOTIP_ENABLE){uni[_x62010[57]]({title:msg[_x62010[58]],content:_x62010[59],success:function(res){if(res[_x62010[60]]){uni[_x62010[61]]({url:_x62010[62]+msg[_x62010[63]]+_x62010[64]+msg[_x62010[65]]+_x62010[66]+0+_x62010[67]+msg[_x62010[68]]});}else if(res[_x62010[69]]){console[_x62010[70]](_x62010[71]);}}});}}}tempv_fid=msg[_x62010[72]];store[_x62010[73]](_x62010[74],{type:_x62010[75],val:msg[_x62010[76]],attr:_x62010[77],data:msg[_x62010[78]],time:_x62010[79],addinfo:{weidu:0,lastmsg:msg[_x62010[80]],id:msg[_x62010[81]],avatar:msg[_x62010[82]],user_id:msg[_x62010[83]],username:msg[_x62010[84]],logtype:msg[_x62010[85]]}});let tempmy_id={id:usign};apirequest[_x62010[86]](msg,_x62010[87],msg[_x62010[88]],tempmy_id);break;case _x62010[89]:let gmsg=temdata;let tempv=0;store[_x62010[90]](_x62010[91],gmsg);if(gmsg[_x62010[92]]==_x62010[93]){tempv=gmsg[_x62010[94]];}else{tempv=gmsg[_x62010[95]];}store[_x62010[96]](_x62010[97],{type:gmsg[_x62010[98]],val:tempv,attr:_x62010[99],data:gmsg[_x62010[100]],time:_x62010[101],addinfo:{weidu:0,lastmsg:gmsg[_x62010[102]],id:gmsg[_x62010[103]],avatar:gmsg[_x62010[104]],user_id:gmsg[_x62010[105]],username:gmsg[_x62010[106]],logtype:gmsg[_x62010[107]]}});let tempmy={id:usign};apirequest[_x62010[108]](gmsg,gmsg[_x62010[109]],tempv,tempmy);break;case _x62010[110]:let msg2=temdata;store[_x62010[111]](_x62010[112],{val:msg2[_x62010[113]],data:msg2[_x62010[114]],character:msg2[_x62010[115]]});break;case _x62010[116]:store[_x62010[117]](_x62010[118],temdata);break;case _x62010[119]:store[_x62010[120]](_x62010[121],temdata);break;case _x62010[122]:store[_x62010[123]](_x62010[124],temdata);break;case _x62010[125]:store[_x62010[126]](_x62010[127],temdata);break;}}});}

export default global.$Socket;

